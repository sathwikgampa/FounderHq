"""
Embedding Generator Module — Dense Vector Embedding Generation

Implements:
1. Google Gemini Embedding API (`models/text-embedding-004`)
2. LiteLLM / SentenceTransformers support
3. Zero-dependency 384-dimensional L2-normalized hashing vector fallback
4. Cosine similarity calculation helper
"""

from __future__ import annotations

import hashlib
import logging
import math
import os
import re
from collections.abc import Sequence

logger = logging.getLogger("founderhq.rag.embeddings.generator")


def cosine_similarity(v1: Sequence[float], v2: Sequence[float]) -> float:
    """Calculates cosine similarity score between two float vectors."""
    if len(v1) != len(v2) or not v1 or not v2:
        return 0.0

    dot_product = sum(a * b for a, b in zip(v1, v2, strict=False))
    norm_v1 = math.sqrt(sum(a * a for a in v1))
    norm_v2 = math.sqrt(sum(b * b for b in v2))

    if norm_v1 == 0.0 or norm_v2 == 0.0:
        return 0.0

    return dot_product / (norm_v1 * norm_v2)


class EmbeddingGenerator:
    """Generates dense vector embeddings for text chunks and queries."""

    def __init__(self, dimension: int = 384) -> None:
        self.dimension = dimension
        self.api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

    def generate_embedding(self, text: str) -> list[float]:
        """Generates dense embedding vector for given input text."""
        if not text.strip():
            return [0.0] * self.dimension

        # Strategy 1: Google GenAI Client Embeddings API
        if self.api_key:
            try:
                from google import genai  # type: ignore[import]

                client = genai.Client(api_key=self.api_key)
                result = client.models.embed_content(
                    model="text-embedding-004",
                    contents=text,
                )
                if result and hasattr(result, "embedding") and result.embedding:
                    vec = result.embedding.values
                    return self._normalize_vector(vec)
            except Exception as exc:
                logger.debug(f"Gemini embed_content API failed or not configured: {exc}")

        # Strategy 2: Sentence Transformers if installed
        try:
            from sentence_transformers import SentenceTransformer  # type: ignore[import]

            model = SentenceTransformer("all-MiniLM-L6-v2")
            vec = model.encode(text).tolist()
            return self._normalize_vector(vec)
        except Exception:
            pass

        # Strategy 3: Deterministic L2-Normalized Hashing & Term-Frequency Vectorizer
        return self._generate_fallback_embedding(text)

    def generate_batch_embeddings(self, texts: list[str]) -> list[list[float]]:
        """Generates embedding vectors for a batch of text chunks."""
        return [self.generate_embedding(t) for t in texts]

    def _generate_fallback_embedding(self, text: str) -> list[float]:
        """Generates a 384-dimensional L2-normalized feature vector using MD5/SHA-256 hashing."""
        vector = [0.0] * self.dimension
        tokens = re.findall(r"\w+", text.lower())

        if not tokens:
            return vector

        # Compute term frequency feature projections into vector space
        for token in tokens:

            # Positional weight & character ngram hashing
            token_hash = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16)
            dim_idx = token_hash % self.dimension
            # Term weight boosted by length & domain significance
            weight = 1.0 + (0.5 if len(token) > 5 else 0.0)
            vector[dim_idx] += weight

        # Add n-gram sequence features for phrase context awareness
        for i in range(len(tokens) - 1):
            bigram = f"{tokens[i]}_{tokens[i+1]}"
            bigram_hash = int(hashlib.sha256(bigram.encode("utf-8")).hexdigest(), 16)
            dim_idx = bigram_hash % self.dimension
            vector[dim_idx] += 1.5

        return self._normalize_vector(vector)

    @staticmethod
    def _normalize_vector(vec: Sequence[float]) -> list[float]:
        """L2-normalizes vector to unit length for fast cosine similarity dot products."""
        norm = math.sqrt(sum(x * x for x in vec))
        if norm == 0.0:
            return list(vec)
        return [round(x / norm, 6) for x in vec]
