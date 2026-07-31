"""Service layer for Document Storage and RAG Metadata."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from app.schemas.documents import DocumentResponse, DocumentUploadRequest, DocumentUploadResponse

_DOCUMENTS_STORE: dict[str, DocumentResponse] = {}

class DocumentService:
    def upload_document(self, payload: DocumentUploadRequest, file_size: int = 1048576) -> DocumentUploadResponse:
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"
        storage_path = f"storage/ws-default/{payload.startupId}/documents/{payload.filename}"
        now = datetime.now(UTC).isoformat()

        doc = DocumentResponse(
            id=doc_id,
            startupId=payload.startupId,
            filename=payload.filename,
            category=payload.category,
            storagePath=storage_path,
            fileSizeBytes=file_size,
            indexingStatus="COMPLETED",
            chunkCount=16,
            createdAt=now,
        )
        _DOCUMENTS_STORE[doc_id] = doc

        return DocumentUploadResponse(
            id=doc.id,
            startupId=doc.startupId,
            filename=doc.filename,
            category=doc.category,
            storagePath=doc.storagePath,
            fileSizeBytes=doc.fileSizeBytes,
            indexingStatus=doc.indexingStatus,
            chunkCount=doc.chunkCount,
            createdAt=doc.createdAt,
        )

    def get_document(self, doc_id: str) -> DocumentResponse | None:
        return _DOCUMENTS_STORE.get(doc_id)

    def list_documents(self, startup_id: str) -> list[DocumentResponse]:
        return [doc for doc in _DOCUMENTS_STORE.values() if doc.startupId == startup_id]

    def delete_document(self, doc_id: str) -> bool:
        if doc_id in _DOCUMENTS_STORE:
            del _DOCUMENTS_STORE[doc_id]
            return True
        return False
