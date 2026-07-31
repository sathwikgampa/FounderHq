"""Service layer for CEO Planner execution and Multi-Agent Orchestration."""

from __future__ import annotations

import logging
import uuid
from datetime import UTC, datetime

from app.schemas.planner import (
    AgentStepResult,
    PlannerExecuteRequest,
    PlannerExecutionResponse,
)

logger = logging.getLogger("founderhq.services.planner")

_EXECUTIONS_STORE: dict[str, PlannerExecutionResponse] = {}


class PlannerService:
    def execute_command(self, payload: PlannerExecuteRequest) -> PlannerExecutionResponse:
        execution_id = f"exec-{uuid.uuid4().hex[:8]}"
        now = datetime.now(UTC).isoformat()

        command_lower = payload.command.lower()
        requires_approval = False
        approval_id = None

        # Check if action requires executive approval (e.g. hiring, large spend)
        if any(keyword in command_lower for keyword in ["hire", "hiring", "spend", "budget", "contract", "salary", "recruit"]):
            requires_approval = True
            approval_id = f"appr-{uuid.uuid4().hex[:8]}"


        steps = [
            AgentStepResult(
                agentName="CEO Planner Agent",
                status="COMPLETED",
                summary=f"Parsed command '{payload.command[:60]}...'. Analyzed startup objectives.",
                outputs={"goal": payload.command, "priority": "HIGH"}
            ),
            AgentStepResult(
                agentName="Finance Executive Agent",
                status="COMPLETED",
                summary="Verified runway ($495,000 balance / 16.5 months runway). Financial health is stable.",
                outputs={"burnRate": 30000, "runwayMonths": 16.5, "impactCheck": "APPROVED_WITHIN_BUDGET"}
            ),
            AgentStepResult(
                agentName="Talent Executive Agent",
                status="COMPLETED" if not requires_approval else "REQUIRES_APPROVAL",
                summary="Formulated strategic role descriptions and compensation benchmark plan.",
                outputs={"roles": ["Senior AI Engineer", "Lead Product Designer"], "estimatedBudget": "$120,000/yr"}
            ),
        ]

        summary = (
            f"CEO Planner successfully orchestrated executive team review for: '{payload.command}'. "
            f"Finance and Talent sub-agents evaluated the proposal. "
            + ("An approval request has been queued for founder sign-off." if requires_approval else "Action plan ready for execution.")
        )

        response = PlannerExecutionResponse(
            executionId=execution_id,
            startupId=payload.startupId,
            command=payload.command,
            status="REQUIRES_APPROVAL" if requires_approval else "COMPLETED",
            planSummary=summary,
            consultedAgents=["CEO Planner", "Finance Agent", "Talent Agent", "Growth Agent"],
            agentSteps=steps,
            requiresApproval=requires_approval,
            approvalId=approval_id,
            createdAt=now,
            completedAt=now,
        )

        _EXECUTIONS_STORE[execution_id] = response
        return response

    def get_execution(self, execution_id: str) -> PlannerExecutionResponse | None:
        return _EXECUTIONS_STORE.get(execution_id)
