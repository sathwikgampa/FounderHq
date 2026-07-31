"""
Legal Module — Request & Response Schemas
------------------------------------------
Contract types are enumerated to prevent open-ended string injection.
Document content is capped to prevent excessively large payloads from
exhausting memory during AI analysis.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator


_ALLOWED_CONTRACT_TYPES = {
    "EMPLOYMENT", "NDA", "SAAS", "PARTNERSHIP", "CONTRACTOR",
    "LEASE", "LOAN", "INTELLECTUAL_PROPERTY", "TERMS_OF_SERVICE",
}


class ContractReviewRequest(BaseModel):
    """Request body for POST /api/v1/legal/review."""

    contract_type: Literal[
        "EMPLOYMENT", "NDA", "SAAS", "PARTNERSHIP", "CONTRACTOR",
        "LEASE", "LOAN", "INTELLECTUAL_PROPERTY", "TERMS_OF_SERVICE"
    ]
    content: str = Field(
        ...,
        min_length=50,
        max_length=100_000,   # ~80 pages of text — generous but bounded
        description="Raw contract text for AI analysis. Do not include file paths.",
    )
    jurisdiction: str = Field(
        default="US",
        max_length=50,
        pattern=r"^[A-Za-z\s\-]{2,50}$",
        description="Legal jurisdiction, e.g. 'US', 'UK', 'Delaware'.",
    )

    @field_validator("content", mode="before")
    @classmethod
    def reject_script_tags(cls, v: str) -> str:
        """Rudimentary server-side XSS gate — full sanitization in the service layer."""
        lowered = v.lower()
        if "<script" in lowered or "javascript:" in lowered:
            raise ValueError("Contract content must not contain script tags or javascript: URIs.")
        return v


class ComplianceCheckRequest(BaseModel):
    """Request body for POST /api/v1/legal/compliance."""

    jurisdiction: str = Field(..., min_length=2, max_length=50, pattern=r"^[A-Za-z\s\-]{2,50}$")
    business_type: str = Field(..., min_length=2, max_length=100)
    industry: str = Field(..., min_length=2, max_length=100)


class ContractReviewResponse(BaseModel):
    review_id: str
    contract_type: str
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    clauses_flagged: int
    summary: str
    recommendations: list[str]
