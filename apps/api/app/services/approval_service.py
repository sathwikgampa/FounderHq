"""Service layer for Executive Approvals."""

from __future__ import annotations

from datetime import UTC, datetime

from app.schemas.approvals import ApprovalResponse

_APPROVALS_STORE: dict[str, ApprovalResponse] = {}

def _seed_approvals():
    if not _APPROVALS_STORE:
        appr1 = ApprovalResponse(
            id="appr-001",
            startupId="startup-001",
            executionId="exec-001",
            actionType="HIRE_TALENT",
            title="Approve Hiring: Senior AI Engineer ($120,000/yr)",
            description="Talent Agent recommended hiring 1 Senior AI Engineer to accelerate agent framework development.",
            requestedByAgent="Talent Executive Agent",
            impactSummary="Will reduce runway by 0.8 months but accelerate product velocity by 35%.",
            status="PENDING",
            details={"salary": 120000, "role": "Senior AI Engineer", "department": "Engineering"},
            createdAt=datetime.now(UTC).isoformat(),
        )
        _APPROVALS_STORE[appr1.id] = appr1

_seed_approvals()


class ApprovalService:
    def list_approvals(self, startup_id: str, status_filter: str | None = None) -> list[ApprovalResponse]:
        results = [a for a in _APPROVALS_STORE.values() if a.startupId in (startup_id, "startup-001")]
        if status_filter:
            results = [a for a in results if a.status.upper() == status_filter.upper()]
        return results

    def get_approval(self, approval_id: str) -> ApprovalResponse | None:
        return _APPROVALS_STORE.get(approval_id)

    def approve_action(self, approval_id: str, reason: str | None = None) -> ApprovalResponse | None:
        approval = self.get_approval(approval_id)
        if not approval:
            return None

        data = approval.model_dump()
        data["status"] = "APPROVED"
        data["resolvedAt"] = datetime.now(UTC).isoformat()
        if reason:
            data["description"] += f" [Founder Note: {reason}]"

        updated = ApprovalResponse(**data)
        _APPROVALS_STORE[approval_id] = updated
        return updated

    def reject_action(self, approval_id: str, reason: str | None = None) -> ApprovalResponse | None:
        approval = self.get_approval(approval_id)
        if not approval:
            return None

        data = approval.model_dump()
        data["status"] = "REJECTED"
        data["resolvedAt"] = datetime.now(UTC).isoformat()
        if reason:
            data["description"] += f" [Rejection Rationale: {reason}]"

        updated = ApprovalResponse(**data)
        _APPROVALS_STORE[approval_id] = updated
        return updated
