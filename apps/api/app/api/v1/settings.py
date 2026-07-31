"""Settings Router for workspace configuration management."""

from __future__ import annotations

from fastapi import APIRouter

from app.schemas.response import APIResponse
from app.schemas.settings import SettingsResponse, SettingsUpdate

router = APIRouter(prefix="/settings", tags=["Settings"])

_SETTINGS_STORE: dict[str, SettingsResponse] = {}

def _get_settings() -> SettingsResponse:
    if "default" not in _SETTINGS_STORE:
        _SETTINGS_STORE["default"] = SettingsResponse()
    return _SETTINGS_STORE["default"]


@router.get("", response_model=APIResponse[SettingsResponse])
async def get_settings():
    """Retrieve workspace settings and AI model preferences."""
    settings_data = _get_settings()
    return APIResponse(
        success=True,
        data=settings_data,
        message="Settings retrieved successfully",
    )


@router.patch("", response_model=APIResponse[SettingsResponse])
async def update_settings(payload: SettingsUpdate):
    """Update workspace settings and AI model preferences."""
    current = _get_settings()
    data = current.model_dump()
    update_data = payload.model_dump(exclude_unset=True)
    data.update(update_data)

    updated = SettingsResponse(**data)
    _SETTINGS_STORE["default"] = updated

    return APIResponse(
        success=True,
        data=updated,
        message="Settings updated successfully",
    )
