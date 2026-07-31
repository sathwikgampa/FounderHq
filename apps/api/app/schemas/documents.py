"""Schemas for Document Uploads and RAG Metadata."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, List, Optional
from pydantic import BaseModel, Field


class DocumentUploadRequest(BaseModel):
    filename: str = Field(..., description="Original name of the uploaded document", json_schema_extra={"example": "pitch_deck_2026.pdf"})
    category: str = Field(default="general", description="Document category (pitch, financial, legal, technical)", json_schema_extra={"example": "pitch"})
    startupId: str = Field(..., description="Target startup ID")
    visibility: str = Field(default="GLOBAL", description="GLOBAL, TEAM, PRIVATE, SYSTEM")
    department: Optional[str] = Field(default=None, description="Department permissions")


class DocumentUploadResponse(BaseModel):
    id: str
    startupId: str
    filename: str
    category: str
    storagePath: str
    fileSizeBytes: int
    indexingStatus: str = Field(default="COMPLETED", description="RAG indexing status (PENDING, INDEXING, COMPLETED, FAILED)")
    chunkCount: int = Field(default=12, description="Number of vector chunks generated")
    createdAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())


class DocumentResponse(BaseModel):
    id: str
    startupId: str
    filename: str
    category: str
    storagePath: str
    fileSizeBytes: int
    indexingStatus: str
    chunkCount: int
    createdAt: str


class RAGQueryRequest(BaseModel):
    prompt: str = Field(..., description="User question or query")
    userId: str = Field(default="siddharth", description="User ID for permission scoping")
    workspaceId: str = Field(default="acme-inc", description="Workspace ID for multi-tenancy")
    departments: List[str] = Field(default_factory=lambda: ["ENGINEERING", "GLOBAL"], description="User departments")


class CitationItem(BaseModel):
    file_name: str
    chunk_number: int
    page_number: int
    visibility: str


class RAGQueryResponse(BaseModel):
    query: str
    rewritten_query: str
    intent: str
    compressed_context: str
    citations: List[CitationItem]
    retrieved_chunk_count: int
