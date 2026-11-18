import json
import numpy as np
from pathlib import Path
from services.gemini import generate_embedding, generate_query_embedding
from services.resume_loader import chunk_resume, ResumeChunk


CACHE_PATH = Path(__file__).parent.parent / "data" / "embeddings_cache.json"


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    if len(a) != len(b):
        min_len = min(len(a), len(b))
        a = a[:min_len]
        b = b[:min_len]
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def load_embedded_chunks() -> list[ResumeChunk]:
    """Load chunks with pre-computed embeddings from cache or generate if missing."""
    if not CACHE_PATH.exists():
        return generate_and_cache_embeddings()

    with open(CACHE_PATH, "r", encoding="utf-8") as f:
        cached = json.load(f)

    return [
        ResumeChunk(
            id=item["id"],
            category=item["category"],
            content=item["content"],
            embedding=item["embedding"],
        )
        for item in cached
    ]


def generate_and_cache_embeddings() -> list[ResumeChunk]:
    """Generate embeddings for all resume chunks and save to disk."""
    chunks = chunk_resume()
    embedded: list[dict] = []

    for chunk in chunks:
        print(f"  Embedding: [{chunk.category}] {chunk.id}")
        embedding = generate_embedding(chunk.content)
        chunk.embedding = embedding
        embedded.append({
            "id": chunk.id,
            "category": chunk.category,
            "content": chunk.content,
            "embedding": embedding,
        })

    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(embedded, f, indent=2)

    print(f"\nCached {len(embedded)} embeddings to {CACHE_PATH}")
    return chunks


def search_resume(query: str, top_k: int = 4) -> list[ResumeChunk]:
    """
    Find the top-K most relevant resume chunks for a given query.
    Uses cosine similarity between query embedding and cached chunk embeddings.
    """
    chunks = load_embedded_chunks()
    query_embedding = np.array(generate_query_embedding(query))

    scored = []
    for chunk in chunks:
        if chunk.embedding is None:
            continue
        chunk_embedding = np.array(chunk.embedding)
        score = cosine_similarity(query_embedding, chunk_embedding)
        scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [chunk for _, chunk in scored[:top_k]]
