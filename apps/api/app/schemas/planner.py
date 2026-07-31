from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class PlannerStreamRequest(BaseModel):
    """Payload for the CEO Planner SSE streaming endpoint."""

    prompt: str = Field(
        ...,
        min_length=5,
        description="High-level founder prompt to route through the multi-agent suite.",
        examples=[
            "We have $150,000 balance and $20,000 monthly burn. "
            "We want to hire a Senior AI Engineer at $120,000/yr and "
            "run a $5,000 LinkedIn growth campaign. Run all checks."
        ],
    )
    workspace_id: str = Field(
        default="ws-default",
        description="Multi-tenant workspace identifier.",
        examples=["ws-founder-001"],
    )


class ApprovalDecisionRequest(BaseModel):
    """Payload for approving or rejecting a human approval queue item."""

    decision: Literal["APPROVE", "REJECT"] = Field(
        ...,
        description="Decision for the pending approval item.",
        examples=["APPROVE"],
    )


class ApprovalItemResponse(BaseModel):
    """Serialized schema for a human approval item."""

    id: str
    session_id: str
    workspace_id: str
    agent: str
    tool: str
    payload: dict[str, Any]
    status: Literal["PENDING", "APPROVED", "REJECTED"]
    created_at: datetime
    decided_at: datetime | None = None
