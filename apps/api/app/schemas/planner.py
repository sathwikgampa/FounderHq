"""Schemas for CEO Planner Executions and Stream Events."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, List, Optional
from pydantic import BaseModel, Field


class PlannerExecuteRequest(BaseModel):
    startupId: str = Field(..., description="Startup context ID", json_schema_extra={"example": "startup-001"})
    command: str = Field(..., description="High-level founder command", json_schema_extra={"example": "Analyze runway and prepare hiring plan for 2 senior AI engineers"})
    workspaceId: Optional[str] = Field(default="ws-default", description="Workspace tenant ID")


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
