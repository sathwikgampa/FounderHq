"""Service layer for In-App Notifications."""

from __future__ import annotations

from datetime import UTC, datetime

from app.schemas.notifications import NotificationResponse

_NOTIFICATIONS_STORE: dict[str, NotificationResponse] = {}


def _seed_notifications():
    if not _NOTIFICATIONS_STORE:
        n1 = NotificationResponse(
            id="notif-001",
            startupId="startup-001",
            title="Monthly Runway Milestone",
            message="Startup cash balance supports 16.5 months of runway. Runway status is healthy.",
            severity="SUCCESS",
            isRead=False,
            createdAt=datetime.now(UTC).isoformat(),
        )
        n2 = NotificationResponse(
            id="notif-002",
            startupId="startup-001",
            title="Pending Approval Required",
            message="CEO Planner requested approval for Senior AI Engineer position budget.",
            severity="WARNING",
            isRead=False,
            actionUrl="/approvals",
            createdAt=datetime.now(UTC).isoformat(),
        )
        _NOTIFICATIONS_STORE[n1.id] = n1
        _NOTIFICATIONS_STORE[n2.id] = n2


_seed_notifications()


class NotificationService:
    def list_notifications(self, startup_id: str) -> list[NotificationResponse]:
        return [
            n for n in _NOTIFICATIONS_STORE.values() if n.startupId in (startup_id, "startup-001")
        ]

    def mark_as_read(self, notification_id: str) -> NotificationResponse | None:
        notif = _NOTIFICATIONS_STORE.get(notification_id)
        if not notif:
            return None

        data = notif.model_dump()
        data["isRead"] = True
        updated = NotificationResponse(**data)
        _NOTIFICATIONS_STORE[notification_id] = updated
        return updated
