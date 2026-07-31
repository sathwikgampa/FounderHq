"""
Marketing / Growth Module — Request & Response Schemas
-------------------------------------------------------
Budget values are strictly positive and bounded. Channel enumeration prevents
injection of arbitrary strings that could be misinterpreted downstream.
"""

from __future__ import annotations

from decimal import Decimal
from typing import Literal

from pydantic import AnyHttpUrl, BaseModel, Field, field_validator


class CampaignCreateRequest(BaseModel):
    """Request body for POST /api/v1/marketing/campaigns."""

    name: str = Field(..., min_length=3, max_length=200)
    channel: Literal[
        "LINKEDIN", "GOOGLE_ADS", "FACEBOOK", "INSTAGRAM",
        "EMAIL", "SEO", "CONTENT", "INFLUENCER", "OTHER"
    ]
    budget: Decimal = Field(
        ...,
        gt=0,
        le=Decimal("10_000_000"),
        description="Total campaign budget in USD.",
    )
    target_audience: str = Field(..., min_length=5, max_length=500)
    goal: Literal["AWARENESS", "LEAD_GENERATION", "CONVERSION", "RETENTION"] = "LEAD_GENERATION"
    landing_page_url: AnyHttpUrl | None = Field(
        default=None,
        description="Validated URL — rejects javascript: or data: URIs.",
    )

    @field_validator("name", mode="before")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()


class LeadScoringRequest(BaseModel):
    """Request body for POST /api/v1/marketing/leads/score."""

    company_size: int = Field(..., ge=1, le=1_000_000)
    annual_revenue: Decimal = Field(..., ge=0, le=Decimal("1_000_000_000_000"))
    industry: str = Field(..., min_length=2, max_length=100)
    engagement_score: int = Field(..., ge=0, le=100, description="0–100 engagement score.")
    deal_value: Decimal = Field(..., ge=0, le=Decimal("100_000_000"))


class CampaignResponse(BaseModel):
    campaign_id: str
    name: str
    channel: str
    budget: Decimal
    status: Literal["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]
    estimated_reach: int | None = None
