"""Schemas for Executive Action Approvals."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


class ApprovalResponse(BaseModel):
    id: str
    startupId: str
    executionId: str
    actionType: str = Field(..., description="Action category (e.g. HIRE_TALENT, SPEND_CAPITAL, CONTRACT_SIGNING)")
    title: str
    description: str
    requestedByAgent: str = Field(default="CEO Planner")
    impactSummary: str
    status: str = Field(default="PENDING", description="Status: PENDING, APPROVED, REJECTED")
    details: Optional[dict[str, Any]] = None
    createdAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
    resolvedAt: Optional[str] = None


class ApprovalActionRequest(BaseModel):
    reason: Optional[str] = Field(default=None, description="Optional founder rationale for approval or rejection")
