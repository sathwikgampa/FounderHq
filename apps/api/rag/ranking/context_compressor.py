"""
Context Compressor Module — Deduplication, Token Budgeting, & Citation Extraction

Implements:
1. Context Deduplication & Trimming
2. Character/Token Budgeting
3. Citation Metadata Builder
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any

from rag.retriever.hybrid_retriever import CandidateChunk

logger = logging.getLogger("founderhq.rag.ranking.context_compressor")


@dataclass
class CompressedContextResult:
    compressed_text: str
    citations: list[dict[str, Any]]
    chunk_count: int
    char_count: int


class ContextCompressor:
    """Compresses re-ranked chunks into token-budgeted context strings with citations."""

    def __init__(self, max_chars: int = 4000) -> None:
        self.max_chars = max_chars

    def compress(self, ranked_chunks: list[CandidateChunk]) -> CompressedContextResult:
        if not ranked_chunks:
            return CompressedContextResult(
                compressed_text="",
                citations=[],
                chunk_count=0,
                char_count=0,
            )

        seen_texts: set[str] = set()
        compressed_blocks: list[str] = []
        citations: list[dict[str, Any]] = []
        current_chars = 0

        for chunk in ranked_chunks:
            rec = chunk.record

            # Deduplication: Hash normalized snippet
            snippet_key = rec.text[:100].strip().lower()
            if snippet_key in seen_texts:
                continue
            seen_texts.add(snippet_key)

            block = f"[📄 {rec.file_name} | Page {rec.page_number} | {rec.header_context}]\n{rec.text.strip()}"
            block_len = len(block)

            if current_chars + block_len > self.max_chars and compressed_blocks:
                logger.info(
                    f"ContextCompressor capped at {current_chars} characters ({len(compressed_blocks)} chunks)."
                )
                break

            compressed_blocks.append(block)
            current_chars += block_len

            citations.append(
                {
                    "file_name": rec.file_name,
                    "chunk_number": 1,
                    "page_number": rec.page_number,
                    "header_context": rec.header_context,
                    "visibility": rec.visibility,
                    "department": rec.department,
                    "relevance_score": chunk.hybrid_score,
                }
            )

        compressed_text = "\n\n---\n\n".join(compressed_blocks)

        return CompressedContextResult(
            compressed_text=compressed_text,
            citations=citations,
            chunk_count=len(compressed_blocks),
            char_count=len(compressed_text),
        )
