"""
Hiring / Talent Module — Request & Response Schemas
----------------------------------------------------
Salary and compensation fields are bounded to prevent logic errors and
injection of sentinel values. Title and description fields have max_length
limits to prevent oversized payloads from being stored or echoed to clients.
"""

from __future__ import annotations

from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator


_ALLOWED_EMPLOYMENT_TYPES = {"FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"}
_ALLOWED_EXPERIENCE_LEVELS = {"JUNIOR", "MID", "SENIOR", "STAFF", "PRINCIPAL", "EXECUTIVE"}


class JobPostingRequest(BaseModel):
    """Request body for POST /api/v1/hiring/job-posting."""

    title: str = Field(
        ...,
        min_length=3,
        max_length=150,
        description="Job title.",
        examples=["Senior AI Engineer"],
    )
    department: str = Field(..., min_length=2, max_length=100)
    employment_type: Literal["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] = "FULL_TIME"
    experience_level: Literal["JUNIOR", "MID", "SENIOR", "STAFF", "PRINCIPAL", "EXECUTIVE"] = "SENIOR"
    salary_min: Decimal = Field(
        ...,
        ge=0,
        le=Decimal("2_000_000"),
        description="Minimum annual salary in USD.",
    )
    salary_max: Decimal = Field(
        ...,
        ge=0,
        le=Decimal("2_000_000"),
        description="Maximum annual salary in USD.",
    )
    description: str = Field(
        default="",
        max_length=5_000,
        description="Job description (plain text, HTML will be stripped server-side).",
    )
    remote: bool = Field(default=False)

    @field_validator("salary_max")
    @classmethod
    def max_gte_min(cls, v: Decimal, info: object) -> Decimal:
        data = getattr(info, "data", {})
        salary_min = data.get("salary_min")
        if salary_min is not None and v < salary_min:
            raise ValueError("salary_max must be >= salary_min.")
        return v

    @field_validator("title", "department", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()


class CandidateEvaluationRequest(BaseModel):
    """Request body for POST /api/v1/hiring/evaluate."""

    candidate_name: str = Field(..., min_length=2, max_length=200)
    role_title: str = Field(..., min_length=3, max_length=150)
    years_experience: int = Field(..., ge=0, le=60)
    skills: list[str] = Field(..., min_length=1, max_length=30)
    asking_salary: Decimal = Field(..., ge=0, le=Decimal("2_000_000"))

    @field_validator("skills", mode="before")
    @classmethod
    def validate_skills(cls, v: list[str]) -> list[str]:
        cleaned = [s.strip() for s in v if isinstance(s, str) and s.strip()]
        if not cleaned:
            raise ValueError("skills must contain at least one non-empty entry.")
        if any(len(s) > 100 for s in cleaned):
            raise ValueError("Each skill entry must be 100 characters or fewer.")
        return cleaned[:30]  # hard cap at 30 items


class JobPostingResponse(BaseModel):
    job_id: str
    title: str
    department: str
    salary_range: str
    employment_type: str
    status: Literal["DRAFT", "PUBLISHED", "CLOSED"]
