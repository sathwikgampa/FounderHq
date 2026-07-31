import uuid
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any, Literal


@dataclass
class ApprovalItem:
    id: str
    session_id: str
    workspace_id: str
    agent: str
    tool: str
    payload: dict[str, Any]
    status: Literal["PENDING", "APPROVED", "REJECTED"] = "PENDING"
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    decided_at: datetime | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "session_id": self.session_id,
            "workspace_id": self.workspace_id,
            "agent": self.agent,
            "tool": self.tool,
            "payload": self.payload,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "decided_at": self.decided_at.isoformat() if self.decided_at else None,
        }


class ApprovalStore:
    """In-memory thread-safe human approval queue store."""

    def __init__(self) -> None:
        self._items: dict[str, ApprovalItem] = {}

    def enqueue(
        self,
        session_id: str,
        workspace_id: str,
        agent: str,
        tool: str,
        payload: dict[str, Any],
    ) -> ApprovalItem:
        """Enqueue a new high-risk item requiring human signoff."""
        item_id = f"appr-{uuid.uuid4().hex[:8]}"
        item = ApprovalItem(
            id=item_id,
            session_id=session_id,
            workspace_id=workspace_id,
            agent=agent,
            tool=tool,
            payload=payload,
        )
        self._items[item_id] = item
        return item

    def list_items(
        self,
        workspace_id: str | None = None,
        status_filter: str | None = None,
    ) -> list[ApprovalItem]:
        """List items filtered by workspace_id and/or status."""
        result = list(self._items.values())
        if workspace_id:
            result = [i for i in result if i.workspace_id == workspace_id]
        if status_filter:
            result = [i for i in result if i.status == status_filter.upper()]
        return sorted(result, key=lambda x: x.created_at, reverse=True)

    def get_item(self, item_id: str) -> ApprovalItem | None:
        """Retrieve an approval item by ID."""
        return self._items.get(item_id)

    def decide(
        self,
        item_id: str,
        decision: Literal["APPROVE", "REJECT"],
    ) -> ApprovalItem | None:
        """Approve or reject a pending item."""
        item = self._items.get(item_id)
        if not item:
            return None
        item.status = "APPROVED" if decision == "APPROVE" else "REJECTED"
        item.decided_at = datetime.now(UTC)
        return item


# Global approval store instance
approval_store = ApprovalStore()
