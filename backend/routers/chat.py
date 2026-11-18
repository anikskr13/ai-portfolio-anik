import json
import asyncio
from queue import Queue, Empty
from fastapi import APIRouter, Request
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from services.rag import build_context
from services.persona import get_system_prompt
from services.gemini import stream_chat
from services.supabase_client import log_message, upsert_visitor


router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    session_id: str


@router.post("/api/chat")
async def chat(request: ChatRequest, req: Request):
    """
    Main chat endpoint. Accepts conversation history,
    runs RAG, and streams the LLM response via SSE.
    """
    if not request.messages:
        return {"error": "No messages provided"}

    user_message = request.messages[-1].content

    # Log visitor + message (async, non-blocking)
    user_agent = req.headers.get("user-agent", "unknown")
    await upsert_visitor(request.session_id, user_agent)
    await log_message(request.session_id, "user", user_message)

    # Build RAG context from resume data
    context = build_context(user_message)

    # Build system prompt with context injected
    system_prompt = get_system_prompt(context)

    # Convert chat history to Gemini format (exclude last user message)
    chat_history = []
    for msg in request.messages[:-1]:
        gemini_role = "model" if msg.role == "assistant" else "user"
        chat_history.append({
            "role": gemini_role,
            "parts": [msg.content],
        })

    async def event_generator():
        full_response = ""
        try:
            async for chunk_text in _async_stream(system_prompt, chat_history, user_message):
                full_response += chunk_text
                yield {"data": json.dumps({"text": chunk_text})}

            # Log the complete assistant response
            await log_message(request.session_id, "assistant", full_response)
            yield {"data": "[DONE]"}

        except Exception as e:
            print(f"Stream error: {e}")
            yield {"data": json.dumps({"text": "Sorry, I'm having a bit of trouble right now. Could you try again?"})}
            yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())


async def _async_stream(system_prompt: str, chat_history: list, user_message: str):
    """
    True real-time async generator for streaming chunks via a queue.
    """
    q: Queue = Queue()
    SENTINEL = object()

    def worker():
        try:
            for text in stream_chat(system_prompt, chat_history, user_message):
                q.put(text)
        except Exception as e:
            q.put(e)
        finally:
            q.put(SENTINEL)

    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, worker)

    while True:
        # Check queue in executor so it doesn't block async event loop
        def get_item():
            try:
                return q.get(timeout=30)
            except Empty:
                return SENTINEL

        item = await loop.run_in_executor(None, get_item)
        if item is SENTINEL:
            break
        if isinstance(item, Exception):
            raise item
        yield item
