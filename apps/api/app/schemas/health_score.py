"""Schemas for Startup Overall Health Score."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import List
from pydantic import BaseModel, Field


class CategoryHealthBreakdown(BaseModel):
    category: str
    score: int = Field(..., ge=0, le=100)
    status: str = Field(..., description="EXCELLENT, GOOD, FAIR, POOR")
    insight: str


class HealthScoreResponse(BaseModel):
    startupId: str
    overallScore: int = Field(..., ge=0, le=100, description="Overall health score (0 to 100)")
    grade: str = Field(default="A", description="Letter grade: A+, A, B, C, D, F")
    runwayMonths: float
    categories: List[CategoryHealthBreakdown]
    keyRisk: str
    keyOpportunity: str
    calculatedAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
