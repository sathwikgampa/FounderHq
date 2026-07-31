"""Schemas for Startup Entities and Requests."""

from __future__ import annotations

from datetime import UTC, datetime

from pydantic import BaseModel, Field


class StartupCreate(BaseModel):
    name: str = Field(..., description="Name of the startup company", json_schema_extra={"example": "Acme AI"})
    industry: str = Field(..., description="Industry or sector", json_schema_extra={"example": "AI & SaaS"})
    stage: str = Field(default="Seed", description="Funding stage", json_schema_extra={"example": "Seed"})
    mrr: float = Field(default=0.0, description="Monthly Recurring Revenue ($)", json_schema_extra={"example": 15000.0})
    burnRate: float = Field(default=0.0, description="Monthly Burn Rate ($)", json_schema_extra={"example": 20000.0})
    runwayMonths: float = Field(default=12.0, description="Estimated Runway in Months", json_schema_extra={"example": 18.0})
    cashBalance: float = Field(default=0.0, description="Current Cash Balance ($)", json_schema_extra={"example": 250000.0})
    teamSize: int = Field(default=1, description="Number of team members", json_schema_extra={"example": 5})


class StartupUpdate(BaseModel):
    name: str | None = None
    industry: str | None = None
    stage: str | None = None
    mrr: float | None = None
    burnRate: float | None = None
    runwayMonths: float | None = None
    cashBalance: float | None = None
    teamSize: int | None = None


class StartupResponse(BaseModel):
    id: str
    workspaceId: str
    name: str
    industry: str
    stage: str
    mrr: float
    burnRate: float
    runwayMonths: float
    cashBalance: float
    teamSize: int
    createdAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
    createdBy: str = Field(default="user-owner")
