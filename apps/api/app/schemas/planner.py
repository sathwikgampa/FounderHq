"""Schemas for CEO Planner Executions, Approvals, and Stream Events."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, List, Literal, Optional
from pydantic import BaseModel, Field


class PlannerExecuteRequest(BaseModel):
    startupId: str = Field(..., description="Startup context ID", json_schema_extra={"example": "startup-001"})
    command: str = Field(..., description="High-level founder command", json_schema_extra={"example": "Analyze runway and prepare hiring plan for 2 senior AI engineers"})
    workspaceId: Optional[str] = Field(default="ws-default", description="Workspace tenant ID")


class PlannerStreamRequest(BaseModel):
    """Payload for the CEO Planner SSE streaming endpoint."""

    prompt: str = Field(
        ...,
        min_length=5,
        description="High-level founder prompt to route through the multi-agent suite.",
        json_schema_extra={
            "example": "We have $150,000 balance and $20,000 monthly burn. We want to hire a Senior AI Engineer."
        },
    )
    workspace_id: str = Field(
        default="ws-default",
        description="Multi-tenant workspace identifier.",
        json_schema_extra={"example": "ws-founder-001"},
    )


class AgentStepResult(BaseModel):
    agentName: str
    status: str = Field(default="COMPLETED")
    summary: str
    outputs: Optional[dict[str, Any]] = None


class PlannerExecutionResponse(BaseModel):
    executionId: str
    startupId: str
    command: str
    status: str = Field(default="COMPLETED", description="Execution status: IN_PROGRESS, COMPLETED, REQUIRES_APPROVAL, FAILED")
    planSummary: str
    consultedAgents: List[str] = Field(default_factory=list)
    agentSteps: List[AgentStepResult] = Field(default_factory=list)
    requiresApproval: bool = False
    approvalId: Optional[str] = None
    createdAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
    completedAt: Optional[str] = Field(default_factory=lambda: datetime.now(UTC).isoformat())


class ExecutionStatusResponse(BaseModel):
    executionId: str
    status: str
    progressPercent: int = 100
    currentStep: str = "Execution completed"
    result: Optional[PlannerExecutionResponse] = None


class ApprovalDecisionRequest(BaseModel):
    """Payload for approving or rejecting a human approval queue item."""

    decision: Literal["APPROVE", "REJECT"] = Field(
        ...,
        description="Decision for the pending approval item.",
        json_schema_extra={"example": "APPROVE"},
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
