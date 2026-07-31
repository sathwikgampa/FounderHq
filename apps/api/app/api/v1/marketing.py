"""
Marketing / Growth Module Router
----------------------------------
SCALABILITY: Isolated module. Future additions (A/B test management,
UTM link builder, social analytics) extend only this file.

SECURITY:
- Landing page URLs are validated as real HTTP/HTTPS URLs by Pydantic's
  AnyHttpUrl type, blocking javascript: and data: URI injections.
- Campaign names are sanitised with bleach before being stored or returned.
- Budget values have hard upper bounds in the schema to prevent integer overflow.
- Rate limited to 20 campaigns/minute to prevent automated spam.
"""

from __future__ import annotations

import uuid
from typing import Any

import bleach

from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.audit import audit
from app.middleware.rbac import require_role
from app.schemas.common import APIResponseEnvelope
from app.schemas.marketing import (
    CampaignCreateRequest,
    CampaignResponse,
    LeadScoringRequest,
)

router = APIRouter(prefix="/marketing", tags=["Marketing & Growth"])
limiter = Limiter(key_func=get_remote_address)


@router.post(
    "/campaigns",
    response_model=APIResponseEnvelope[CampaignResponse],
    summary="Create a marketing campaign",
    status_code=201,
)
@limiter.limit("20/minute")
async def create_campaign(
    request: Request,
    payload: CampaignCreateRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN"])),
) -> APIResponseEnvelope[CampaignResponse]:
    """POST /api/v1/marketing/campaigns — OWNER/ADMIN only."""
    safe_name = bleach.clean(payload.name, tags=[], strip=True)
    campaign_id = f"cmp-{uuid.uuid4().hex[:8]}"

    audit(
        "MARKETING_CAMPAIGN_CREATED",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={
            "campaign_id": campaign_id,
            "channel": payload.channel,
            "budget": str(payload.budget),
        },
    )

    return APIResponseEnvelope(
        data=CampaignResponse(
            campaign_id=campaign_id,
            name=safe_name,
            channel=payload.channel,
            budget=payload.budget,
            status="DRAFT",
            estimated_reach=None,  # Populated by AI analysis step
        ),
        message="Campaign created successfully.",
    )


@router.get(
    "/campaigns",
    response_model=APIResponseEnvelope[list[dict[str, Any]]],
    summary="List all campaigns",
)
async def list_campaigns(
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN", "MEMBER"])),
) -> APIResponseEnvelope[list[dict[str, Any]]]:
    """GET /api/v1/marketing/campaigns"""
    # Placeholder — real implementation queries database filtered by workspace_id
    return APIResponseEnvelope(data=[], message="0 campaigns found.")


@router.post(
    "/leads/score",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Score a lead",
    description="Run AI-powered lead scoring to prioritise outreach.",
)
@limiter.limit("30/minute")
async def score_lead(
    request: Request,
    payload: LeadScoringRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN", "MEMBER"])),
) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/marketing/leads/score"""
    safe_industry = bleach.clean(payload.industry, tags=[], strip=True)

    return APIResponseEnvelope(
        data={
            "score_id": f"scr-{uuid.uuid4().hex[:8]}",
            "industry": safe_industry,
            "lead_score": min(100, payload.engagement_score + 20),  # Placeholder
            "tier": "A" if payload.engagement_score >= 70 else "B",
            "recommended_action": "Schedule discovery call within 48 hours.",
        },
        message="Lead scored successfully.",
    )
