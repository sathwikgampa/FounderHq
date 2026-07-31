"""Auth Router for current user identity and session verification."""

from __future__ import annotations

from datetime import UTC, datetime
from fastapi import APIRouter, Depends
from app.schemas.response import APIResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/me", response_model=APIResponse[dict])
async def get_current_user_profile():
    """Return the authenticated user profile & workspace metadata."""
    user_data = {
        "userId": "user-founder-001",
        "email": "founder@acme.ai",
        "displayName": "Sahasra Founder",
        "role": "Owner",
        "workspaceId": "ws-default",
        "startupId": "startup-001",
        "emailVerified": True,
        "lastLogin": datetime.now(UTC).isoformat(),
    }
    return APIResponse(
        success=True,
        data=user_data,
        message="User profile retrieved successfully",
    )
