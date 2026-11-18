import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

import google.generativeai as genai
from config import settings

_configured = False


def _ensure_configured():
    global _configured
    if not _configured and settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key, transport="rest")
        _configured = True


def get_chat_model(system_instruction: str = None):
    _ensure_configured()
    # Try gemini-3.1-flash-lite first, fallback to gemini-flash-latest / 1.5-flash
    for model_name in ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"]:
        try:
            return genai.GenerativeModel(model_name, system_instruction=system_instruction)
        except Exception:
            continue
    return genai.GenerativeModel("gemini-3.1-flash-lite", system_instruction=system_instruction)


EMBEDDING_MODEL = "models/gemini-embedding-001"


def generate_embedding(text: str) -> list[float]:
    """Generate an embedding vector for a piece of text."""
    _ensure_configured()
    if not settings.gemini_api_key:
        import hashlib
        h = hashlib.sha256(text.encode()).digest()
        vec = [(b / 255.0) - 0.5 for b in h]
        while len(vec) < 3072:
            vec.extend(vec[: min(3072 - len(vec), len(vec))])
        return vec[:3072]

    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document",
        )
        return result["embedding"]
    except Exception as e:
        print(f"Embedding fallback due to: {e}")
        import hashlib
        h = hashlib.sha256(text.encode()).digest()
        vec = [(b / 255.0) - 0.5 for b in h]
        while len(vec) < 3072:
            vec.extend(vec[: min(3072 - len(vec), len(vec))])
        return vec[:3072]


def generate_query_embedding(text: str) -> list[float]:
    """Generate an embedding vector for a search query."""
    _ensure_configured()
    if not settings.gemini_api_key:
        import hashlib
        h = hashlib.sha256(text.encode()).digest()
        vec = [(b / 255.0) - 0.5 for b in h]
        while len(vec) < 3072:
            vec.extend(vec[: min(3072 - len(vec), len(vec))])
        return vec[:3072]

    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_query",
        )
        return result["embedding"]
    except Exception as e:
        print(f"Query embedding fallback due to: {e}")
        import hashlib
        h = hashlib.sha256(text.encode()).digest()
        vec = [(b / 255.0) - 0.5 for b in h]
        while len(vec) < 3072:
            vec.extend(vec[: min(3072 - len(vec), len(vec))])
        return vec[:3072]


def stream_chat(
    system_prompt: str,
    chat_history: list[dict],
    user_message: str,
):
    """
    Stream a chat response from Gemini.
    Yields text chunks as they arrive.
    """
    _ensure_configured()

    if not settings.gemini_api_key:
        fallback_msg = (
            "Hi there! I am Anik's AI clone. Please add your GEMINI_API_KEY "
            "in `backend/.env` to chat live with Gemini!"
        )
        for word in fallback_msg.split(" "):
            yield word + " "
        return

    chat_model = get_chat_model(system_instruction=system_prompt)
    chat = chat_model.start_chat(history=chat_history)

    response = chat.send_message(
        user_message,
        generation_config=genai.GenerationConfig(
            temperature=0.8,
            top_p=0.95,
            top_k=40,
            max_output_tokens=1024,
        ),
        stream=True,
    )

    for chunk in response:
        if chunk.text:
            yield chunk.text
