"""
Hiring / Talent Module Router
------------------------------
SCALABILITY: Completely isolated from other modules. Adding interview
scheduling, ATS integration, or offer-letter generation requires only
extending this file and its schema — no cross-module changes.

SECURITY:
- Job descriptions accepted from users are sanitised with bleach before
  storage or AI processing to prevent stored XSS.
- OWNER and ADMIN can create/manage postings; MEMBER can view pipeline.
- Input schemas enforce salary bounds, title length, and skills list size.
"""

from __future__ import annotations

import uuid
from typing import Any

import bleach

from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.audit import audit
from app.middleware.jwt_auth import jwt_auth
from app.middleware.rbac import require_role
from app.schemas.common import APIResponseEnvelope
from app.schemas.hiring import (
    CandidateEvaluationRequest,
    JobPostingRequest,
    JobPostingResponse,
)

router = APIRouter(prefix="/hiring", tags=["Hiring & Talent"])
limiter = Limiter(key_func=get_remote_address)

# Allowlist for bleach — no HTML allowed in job descriptions stored via API
_ALLOWED_TAGS: list[str] = []
_ALLOWED_ATTRS: dict = {}


def _sanitize_text(value: str) -> str:
    """
    Strip ALL HTML/JS from user-provided text.
    WHY: Job descriptions submitted via API could contain <script> or event
    handlers that would be stored and later rendered in the frontend (stored XSS).
    bleach.clean() with no allowed tags guarantees plain text output.
    """
    return bleach.clean(value, tags=_ALLOWED_TAGS, attributes=_ALLOWED_ATTRS, strip=True)


@router.post(
    "/job-posting",
    response_model=APIResponseEnvelope[JobPostingResponse],
    summary="Create a job posting",
    status_code=201,
)
@limiter.limit("20/minute")
async def create_job_posting(
    request: Request,
    payload: JobPostingRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN"])),
) -> APIResponseEnvelope[JobPostingResponse]:
    """POST /api/v1/hiring/job-posting — OWNER/ADMIN only."""
    # Sanitize free-text field before it reaches any downstream store or AI model
    sanitized_description = _sanitize_text(payload.description)

    job_id = f"job-{uuid.uuid4().hex[:8]}"

    audit(
        "HIRING_JOB_POSTING_CREATED",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={
            "job_id": job_id,
            "title": payload.title,
            "department": payload.department,
        },
    )

    return APIResponseEnvelope(
        data=JobPostingResponse(
            job_id=job_id,
            title=payload.title,
            department=payload.department,
            salary_range=f"${payload.salary_min:,.0f} – ${payload.salary_max:,.0f}",
            employment_type=payload.employment_type,
            status="DRAFT",
        ),
        message="Job posting created successfully.",
    )


@router.post(
    "/evaluate",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Evaluate a candidate",
    description="Score a candidate against role requirements using AI analysis.",
)
@limiter.limit("30/minute")
async def evaluate_candidate(
    request: Request,
    payload: CandidateEvaluationRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN", "MEMBER"])),
) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/hiring/evaluate"""
    # Sanitize freeform name field
    safe_name = _sanitize_text(payload.candidate_name)

    audit(
        "HIRING_CANDIDATE_EVALUATED",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={"role": payload.role_title, "experience_years": payload.years_experience},
    )

    return APIResponseEnvelope(
        data={
            "evaluation_id": f"eval-{uuid.uuid4().hex[:8]}",
            "candidate": safe_name,
            "role": payload.role_title,
            "match_score": 85,  # Placeholder — real AI scoring goes here
            "recommendation": "STRONG_CONSIDER",
            "skills_gap": [],
        },
        message="Candidate evaluation complete.",
    )
