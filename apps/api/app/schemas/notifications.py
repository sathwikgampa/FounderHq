"""Schemas for System Notifications."""

from __future__ import annotations

from datetime import UTC, datetime
from pydantic import BaseModel, Field


class NotificationResponse(BaseModel):
    id: str
    startupId: str
    title: str
    message: str
    severity: str = Field(default="INFO", description="Severity: INFO, WARNING, CRITICAL, SUCCESS")
    isRead: bool = False
    actionUrl: str | None = None
    createdAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
