"""Schemas for Workspace and User Settings."""

from __future__ import annotations

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
    workspaceName: str | None = None
    aiModelPreference: str | None = None
    autoApproveMinorActions: bool | None = None
    emailAlertsEnabled: bool | None = None
    slackIntegrationActive: bool | None = None
    currency: str | None = None
