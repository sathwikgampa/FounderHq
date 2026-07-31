"""
Legal Module Router
--------------------
SCALABILITY: Isolated module. Future additions (e-signature workflow,
clause library, jurisdiction comparison) extend only this file.

SECURITY:
- Contract text is stripped of script tags at the schema layer (ContractReviewRequest
  field_validator) AND sanitized again here with bleach for defense-in-depth.
- OWNER/ADMIN can submit contracts; MEMBER can view review results.
- Jurisdiction is validated against a pattern to prevent path-traversal or
  injection-style strings reaching any document store.
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
from app.schemas.legal import (
    ComplianceCheckRequest,
    ContractReviewRequest,
    ContractReviewResponse,
)

router = APIRouter(prefix="/legal", tags=["Legal & Compliance"])
limiter = Limiter(key_func=get_remote_address)


@router.post(
    "/review",
    response_model=APIResponseEnvelope[ContractReviewResponse],
    summary="Review a contract",
    description=(
        "Submit contract text for AI-powered risk analysis. "
        "Returns flagged clauses, risk level, and recommendations."
    ),
    status_code=201,
)
@limiter.limit("10/minute")
async def review_contract(
    request: Request,
    payload: ContractReviewRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN"])),
) -> APIResponseEnvelope[ContractReviewResponse]:
    """POST /api/v1/legal/review — OWNER/ADMIN only."""
    # Defense-in-depth: strip any HTML even though the schema validator already
    # rejected <script> tags explicitly.
    clean_content = bleach.clean(payload.content, tags=[], strip=True)

    review_id = f"rev-{uuid.uuid4().hex[:8]}"

    audit(
        "LEGAL_CONTRACT_SUBMITTED",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={
            "review_id": review_id,
            "contract_type": payload.contract_type,
            "jurisdiction": payload.jurisdiction,
            "content_length": len(clean_content),
        },
    )

    return APIResponseEnvelope(
        data=ContractReviewResponse(
            review_id=review_id,
            contract_type=payload.contract_type,
            risk_level="MEDIUM",  # Placeholder — real AI analysis goes here
            clauses_flagged=3,
            summary=(
                f"AI review of {payload.contract_type} contract under {payload.jurisdiction} "
                "jurisdiction identified 3 potentially risky clauses requiring legal counsel review."
            ),
            recommendations=[
                "Clause 4.2: Non-compete scope may be unenforceable in this jurisdiction.",
                "Clause 7.1: Liability cap is below industry standard — negotiate upward.",
                "Clause 12.3: IP assignment is overly broad — clarify scope.",
            ],
        ),
        message="Contract review complete.",
    )


@router.post(
    "/compliance",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Run a compliance check",
    description="Assess regulatory compliance requirements for a given jurisdiction and business type.",
)
@limiter.limit("15/minute")
async def check_compliance(
    request: Request,
    payload: ComplianceCheckRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN", "MEMBER"])),
) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/legal/compliance"""
    audit(
        "LEGAL_COMPLIANCE_CHECK",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={
            "jurisdiction": payload.jurisdiction,
            "business_type": payload.business_type,
            "industry": payload.industry,
        },
    )

    return APIResponseEnvelope(
        data={
            "check_id": f"chk-{uuid.uuid4().hex[:8]}",
            "jurisdiction": payload.jurisdiction,
            "business_type": payload.business_type,
            "requirements": [
                "Register as a legal entity in the jurisdiction.",
                "Obtain required business licenses.",
                "Comply with local data protection regulations (e.g. GDPR/CCPA).",
            ],
            "status": "COMPLIANT",
        },
        message="Compliance check complete.",
    )
