"""
Vector Database Indexing Module — Vector Database & Pre-Retrieval Security Filtering

Implements:
1. In-Memory / Persistent Vector Index
2. Dense Vector Cosine Similarity Search
3. Pre-Retrieval Metadata Security Permission Resolver (GLOBAL, TEAM, PRIVATE, SYSTEM)
4. CRUD (Add, Delete, Search, List) Operations
"""

from __future__ import annotations

import json
import logging
from dataclasses import asdict, dataclass
from pathlib import Path

from rag.chunking.smart_chunker import Chunk
from rag.embeddings.generator import cosine_similarity

logger = logging.getLogger("founderhq.rag.indexing.vector_db")


@dataclass
class VectorRecord:
    chunk_id: str
    text: str
    vector: list[float]
    page_number: int
    header_context: str
    document_id: str
    workspace_id: str
    owner_id: str
    visibility: str  # GLOBAL, TEAM, PRIVATE, SYSTEM
    department: str | None
    file_name: str
    created_at: str


class VectorDatabase:
    """Manages vector embeddings storage, metadata index, and pre-retrieval security resolution."""

    def __init__(self, storage_path: Path | None = None) -> None:
        self.records: list[VectorRecord] = []
        self.storage_path = storage_path

    def add_chunks(self, chunks: list[Chunk], vectors: list[list[float]], document_id: str) -> int:
        """Stores vector embeddings along with security metadata."""
        if len(chunks) != len(vectors):
            raise ValueError("Chunks and vectors length mismatch")

        added_count = 0
        for chunk, vec in zip(chunks, vectors, strict=False):

            record = VectorRecord(
                chunk_id=chunk.chunk_id,
                text=chunk.text,
                vector=vec,
                page_number=chunk.page_number,
                header_context=chunk.header_context,
                document_id=document_id,
                workspace_id=chunk.metadata.workspace_id,
                owner_id=chunk.metadata.owner_id,
                visibility=chunk.metadata.visibility,
                department=chunk.metadata.department,
                file_name=chunk.metadata.filename,
                created_at=chunk.metadata.created_at,
            )
            self.records.append(record)
            added_count += 1

        logger.info(
            f"VectorDatabase indexed {added_count} vector records for document {document_id}"
        )
        self._persist_if_needed()
        return added_count

    def filter_by_permissions(
        self,
        user_id: str,
        workspace_id: str,
        user_departments: list[str],
    ) -> list[VectorRecord]:
        """Pre-retrieval Security Metadata Permission Resolver."""
        allowed: list[VectorRecord] = []
        depts_upper = [d.upper() for d in user_departments]

        for record in self.records:
            # 1. System documents are readable across workspaces
            if record.visibility == "SYSTEM":
                allowed.append(record)
                continue

            # 2. Workspace isolation check
            if record.workspace_id != workspace_id:
                continue

            # 3. Global workspace visibility
            if record.visibility == "GLOBAL":
                allowed.append(record)
                continue

            # 4. Private user visibility
            if record.visibility == "PRIVATE" and record.owner_id == user_id:
                allowed.append(record)
                continue

            # 5. Team department visibility
            if (
                record.visibility == "TEAM"
                and record.department
                and record.department.upper() in depts_upper
            ):
                allowed.append(record)
                continue

        return allowed

    def search_vector(
        self,
        query_vector: list[float],
        user_id: str,
        workspace_id: str,
        user_departments: list[str],
        top_k: int = 10,
    ) -> list[tuple[VectorRecord, float]]:
        """Executes cosine similarity search over permission-scoped vector records."""
        accessible_records = self.filter_by_permissions(
            user_id=user_id,
            workspace_id=workspace_id,
            user_departments=user_departments,
        )

        scored: list[tuple[VectorRecord, float]] = []
        for record in accessible_records:
            sim = cosine_similarity(query_vector, record.vector)
            scored.append((record, sim))

        scored.sort(key=lambda item: item[1], reverse=True)
        return scored[:top_k]

    def delete_document(self, document_id: str) -> int:
        """Deletes all vector records associated with a document ID."""
        initial_count = len(self.records)
        self.records = [r for r in self.records if r.document_id != document_id]
        deleted_count = initial_count - len(self.records)
        logger.info(f"Deleted {deleted_count} vector records for document '{document_id}'")
        self._persist_if_needed()
        return deleted_count

    def list_documents(self, workspace_id: str) -> list[dict[str, str]]:
        """Lists distinct indexed documents for a workspace."""
        docs: dict[str, dict[str, str]] = {}
        for r in self.records:
            if r.workspace_id == workspace_id or r.visibility == "SYSTEM":
                if r.document_id not in docs:
                    docs[r.document_id] = {
                        "id": r.document_id,
                        "filename": r.file_name,
                        "department": r.department or "GLOBAL",
                        "visibility": r.visibility,
                        "created_at": r.created_at,
                    }
        return list(docs.values())

    def _persist_if_needed(self) -> None:
        if not self.storage_path:
            return
        try:
            self.storage_path.parent.mkdir(parents=True, exist_ok=True)
            data = [asdict(r) for r in self.records]
            self.storage_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
        except Exception as exc:
            logger.warning(f"Failed to persist vector index to disk: {exc}")
