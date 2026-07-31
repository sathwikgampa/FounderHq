"""Notifications Router for managing system alerts and notifications."""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.notifications import NotificationResponse
from app.schemas.response import APIResponse
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])
notif_service = NotificationService()


@router.get("", response_model=APIResponse[List[NotificationResponse]])
async def list_notifications(startupId: str = "startup-001"):
    """Retrieve system notifications for a startup."""
    notifications = notif_service.list_notifications(startupId)
    return APIResponse(
        success=True,
        data=notifications,
        message="Notifications retrieved successfully",
    )


@router.patch("/{id}/read", response_model=APIResponse[NotificationResponse])
async def mark_notification_as_read(id: str):
    """Mark a notification as read."""
    updated = notif_service.mark_as_read(id)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification with ID '{id}' not found",
        )
    return APIResponse(
        success=True,
        data=updated,
        message="Notification marked as read",
    )
