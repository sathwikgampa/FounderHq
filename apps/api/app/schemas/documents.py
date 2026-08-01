"""Schemas for Document Uploads and RAG Metadata."""

from __future__ import annotations

from datetime import UTC, datetime

from pydantic import BaseModel, Field


class DocumentUploadRequest(BaseModel):
    filename: str = Field(
        ...,
        description="Original name of the uploaded document",
        json_schema_extra={"example": "pitch_deck_2026.pdf"},
    )
    category: str = Field(
        default="general",
        description="Document category (pitch, financial, legal, technical)",
        json_schema_extra={"example": "pitch"},
    )
    startupId: str = Field(..., description="Target startup ID")
    visibility: str = Field(default="GLOBAL", description="GLOBAL, TEAM, PRIVATE, SYSTEM")
    department: str | None = Field(default=None, description="Department permissions")
    ownerId: str = Field(default="siddharth", description="Owner ID for private-document isolation")
    content: str | None = Field(
        default=None, description="Optional extracted document text for indexing"
    )


class DocumentUploadResponse(BaseModel):
    id: str
    startupId: str
    filename: str
    category: str
    storagePath: str
    fileSizeBytes: int
    indexingStatus: str = Field(
        default="COMPLETED",
        description="RAG indexing status (PENDING, INDEXING, COMPLETED, FAILED)",
    )
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
    departments: list[str] = Field(
        default_factory=lambda: ["ENGINEERING", "GLOBAL"], description="User departments"
    )


class CitationItem(BaseModel):
    file_name: str
    chunk_number: int = 1
    page_number: int = 1
    visibility: str = "GLOBAL"
    department: str | None = None
    header_context: str | None = None
    relevance_score: float | None = None


class RAGQueryResponse(BaseModel):
    query: str
    rewritten_query: str
    intent: str
    compressed_context: str
    citations: list[CitationItem]
    retrieved_chunk_count: int
    generated_answer: str = Field(
        default="",
        description="LLM-synthesized answer grounded strictly in retrieved context",
    )
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
