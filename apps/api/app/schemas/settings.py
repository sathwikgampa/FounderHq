"""Schemas for Workspace and User Settings."""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


class SettingsResponse(BaseModel):
    workspaceId: str = Field(default="ws-default")
    workspaceName: str = Field(default="FounderHQ Primary Workspace")
    aiModelPreference: str = Field(default="gemini-1.5-pro", description="Preferred AI engine")
    autoApproveMinorActions: bool = Field(default=False)
    emailAlertsEnabled: bool = Field(default=True)
    slackIntegrationActive: bool = Field(default=False)
    currency: str = Field(default="USD")


class SettingsUpdate(BaseModel):
    workspaceName: Optional[str] = None
    aiModelPreference: Optional[str] = None
    autoApproveMinorActions: Optional[bool] = None
    emailAlertsEnabled: Optional[bool] = None
    slackIntegrationActive: Optional[bool] = None
    currency: Optional[str] = None
