"""Documents Router for storage metadata and vector indexing."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.schemas.documents import DocumentResponse, DocumentUploadRequest, DocumentUploadResponse
from app.schemas.response import APIResponse
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])
doc_service = DocumentService()


@router.post("/upload", response_model=APIResponse[DocumentUploadResponse], status_code=status.HTTP_201_CREATED)
async def upload_document_metadata(payload: DocumentUploadRequest):
    """Register uploaded document metadata and trigger vector indexing."""
    result = doc_service.upload_document(payload)
    return APIResponse(
        success=True,
        data=result,
        message="Document uploaded and indexed into Startup RAG memory",
    )


@router.get("", response_model=APIResponse[list[DocumentResponse]])
async def list_documents(startupId: str = "startup-001"):
    """List documents uploaded for a specific startup."""
    docs = doc_service.list_documents(startupId)
    return APIResponse(
        success=True,
        data=docs,
        message="Documents listed successfully",
    )


@router.get("/{id}", response_model=APIResponse[DocumentResponse])
async def get_document(id: str):
    """Get document details by ID."""
    doc = doc_service.get_document(id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{id}' not found",
        )
    return APIResponse(
        success=True,
        data=doc,
        message="Document retrieved",
    )


@router.delete("/{id}", response_model=APIResponse[dict])
async def delete_document(id: str):
    """Delete a document from vector memory and storage."""
    deleted = doc_service.delete_document(id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{id}' not found",
        )
    return APIResponse(
        success=True,
        data={"id": id, "deleted": True},
        message="Document deleted successfully",
    )
