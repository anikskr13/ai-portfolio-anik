"""
Pre-generate embeddings for all resume chunks.

Usage:
    cd backend
    python scripts/generate_embeddings.py
"""
import sys
from pathlib import Path

# Add parent directory to path so we can import our modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()

from services.embeddings import generate_and_cache_embeddings


def main():
    print("=" * 50)
    print("Generating embeddings for resume chunks...")
    print("=" * 50)

    chunks = generate_and_cache_embeddings()

    print(f"\n✅ Done! Generated {len(chunks)} embeddings.")
    print("The cache is saved at: data/embeddings_cache.json")
    print("You can now start the server with: uvicorn main:app --reload")


if __name__ == "__main__":
    main()
