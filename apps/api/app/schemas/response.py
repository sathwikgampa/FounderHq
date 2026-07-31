"""Standardized API response and error envelope schemas."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import Any, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class APIErrorDetails(BaseModel):
    code: str = Field(..., description="Error code identifier, e.g., VALIDATION_ERROR")
    message: str = Field(..., description="Human readable error message")
    details: Any | None = Field(default=None, description="Optional granular error details")


class APIResponse[T](BaseModel):
    success: bool = True
    data: T | None = None
    message: str = "Operation completed successfully"
    requestId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())


class APIErrorResponse(BaseModel):
    success: bool = False
    error: APIErrorDetails
    requestId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
