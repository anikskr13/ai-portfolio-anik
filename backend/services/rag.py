import json
from pathlib import Path
from services.embeddings import search_resume


DATA_DIR = Path(__file__).parent.parent / "data"


def _load_overrides() -> list[dict]:
    """Load Q&A overrides from disk."""
    path = DATA_DIR / "qa_overrides.json"
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _find_override(query: str) -> str | None:
    """Check if the query matches any hardcoded Q&A override."""
    normalized = query.lower().strip()
    overrides = _load_overrides()

    for override in overrides:
        for trigger in override.get("triggers", []):
            if trigger.lower() in normalized:
                return override["answer"]
    return None


def build_context(query: str) -> str:
    """
    Build the context string for the LLM.

    1. Check for a Q&A override match.
    2. Run RAG vector search for top-K relevant resume chunks.
    3. Combine both into a single context block.
    """
    override = _find_override(query)
    relevant_chunks = search_resume(query, top_k=4)

    context_parts: list[str] = []

    if override:
        context_parts.append(
            "[PREFERRED ANSWER — use this as the basis for your response, "
            "but deliver it naturally in your own conversational style. "
            "Do not copy it word-for-word.]\n"
            f"{override}"
        )

    context_parts.append("\n[RELEVANT RESUME INFORMATION]")
    for i, chunk in enumerate(relevant_chunks, 1):
        context_parts.append(
            f"\n--- Chunk {i} ({chunk.category}) ---\n{chunk.content}"
        )

    return "\n".join(context_parts)
