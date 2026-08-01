"""
Smart Chunking Module — Structure-Aware & Semantic Chunking with Window Overlap

Implements:
1. Header-aware section extraction (#, ##, ###, UPPERCASE headings)
2. Semantic paragraph chunking with sliding token overlap
3. Metadata & Section Context Propagation
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field

from rag.parsers.doc_processor import DocumentMetadata, ProcessedDocument

logger = logging.getLogger("founderhq.rag.chunking.smart_chunker")


@dataclass
class Chunk:
    chunk_id: str
    text: str
    page_number: int
    header_context: str
    metadata: DocumentMetadata
    char_count: int = 0
    token_estimate: int = 0
    tags: list[str] = field(default_factory=list)


class SmartChunker:
    """Performs smart header-aware and semantic chunking over processed document text."""

    def __init__(self, target_chunk_size: int = 800, overlap_size: int = 150) -> None:
        self.target_chunk_size = target_chunk_size
        self.overlap_size = overlap_size

    def chunk_document(self, doc: ProcessedDocument, document_id: str) -> list[Chunk]:
        chunks: list[Chunk] = []
        global_chunk_idx = 0

        for page_data in doc.cleaned_pages:
            page_num = page_data["page_number"]
            page_text = page_data["cleaned_text"]

            if not page_text.strip():
                continue

            # Step 1: Divide page into structural sections by headings
            sections = self._split_by_headers(page_text)

            for header_context, section_text in sections:
                # Step 2: Perform sliding window semantic chunking within section
                section_chunks = self._sliding_window_chunk(
                    text=section_text,
                    target_size=self.target_chunk_size,
                    overlap=self.overlap_size,
                )

                for chunk_text in section_chunks:
                    c_id = f"{document_id}_p{page_num}_c{global_chunk_idx}"
                    full_chunk_text = (
                        f"[{header_context}] {chunk_text}"
                        if header_context != "General Context"
                        else chunk_text
                    )

                    chunk = Chunk(
                        chunk_id=c_id,
                        text=full_chunk_text,
                        page_number=page_num,
                        header_context=header_context,
                        metadata=doc.metadata,
                        char_count=len(full_chunk_text),
                        token_estimate=len(full_chunk_text.split()),
                        tags=doc.metadata.extracted_tags,
                    )
                    chunks.append(chunk)
                    global_chunk_idx += 1

        logger.info(
            f"SmartChunker created {len(chunks)} chunks for document '{doc.metadata.filename}'"
        )
        return chunks

    def _split_by_headers(self, text: str) -> list[tuple[str, str]]:
        """Identifies markdown headers (#, ##, ###) or ALL-CAPS titles and groups section content."""
        lines = text.split("\n")
        sections: list[tuple[str, str]] = []

        current_header = "General Context"
        current_lines: list[str] = []

        header_pattern = re.compile(r"^(#{1,4}\s+|[A-Z0-9\s]{4,40}:?$)")

        for line in lines:
            stripped = line.strip()
            if header_pattern.match(stripped) and len(stripped) < 60:
                # Save previous section
                if current_lines:
                    sec_text = "\n".join(current_lines).strip()
                    if sec_text:
                        sections.append((current_header, sec_text))
                    current_lines = []

                current_header = re.sub(r"^#{1,4}\s*", "", stripped)
            else:
                current_lines.append(line)

        if current_lines:
            sec_text = "\n".join(current_lines).strip()
            if sec_text:
                sections.append((current_header, sec_text))

        return sections if sections else [("General Context", text)]

    def _sliding_window_chunk(self, text: str, target_size: int, overlap: int) -> list[str]:
        """Splits text into chunks of roughly `target_size` characters with sliding `overlap`."""
        if len(text) <= target_size:
            return [text]

        # Break text into paragraphs or sentences first
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [text]

        chunks: list[str] = []
        current_chunk: list[str] = []
        current_len = 0

        for p in paragraphs:
            p_len = len(p)
            if current_len + p_len > target_size and current_chunk:
                # Store completed chunk
                chunk_str = "\n\n".join(current_chunk)
                chunks.append(chunk_str)

                # Compute overlap for sliding window
                overlap_text = chunk_str[-overlap:] if len(chunk_str) > overlap else chunk_str
                current_chunk = [overlap_text, p]
                current_len = len(overlap_text) + p_len
            else:
                current_chunk.append(p)
                current_len += p_len + 2

        if current_chunk:
            chunks.append("\n\n".join(current_chunk))

        return chunks
