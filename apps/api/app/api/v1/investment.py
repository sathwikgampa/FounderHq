"""
Investment Module Router
-------------------------
SCALABILITY: Isolated module. Future additions (SAFE note calculator,
409A valuation, investor portal) extend only this file.

SECURITY:
- All monetary and equity inputs are bounded in schemas to prevent
  arithmetic overflow or nonsensical valuations from reaching AI models.
- equity_offered cross-validates against raise_amount / valuation at
  the schema level so inconsistent data is rejected before processing.
- OWNER-only for cap table mutations (highest privilege) — financial data
  is the most sensitive asset in the system.
"""

from __future__ import annotations

import uuid
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.audit import audit
from app.middleware.rbac import require_role
from app.schemas.common import APIResponseEnvelope
from app.schemas.investment import (
    CapTableEntryRequest,
    FundingRoundRequest,
    FundingRoundResponse,
    InvestorUpdateRequest,
)

router = APIRouter(prefix="/investment", tags=["Investment & Cap Table"])
limiter = Limiter(key_func=get_remote_address)


@router.post(
    "/funding-round",
    response_model=APIResponseEnvelope[FundingRoundResponse],
    summary="Model a funding round",
    status_code=201,
)
@limiter.limit("20/minute")
async def model_funding_round(
    request: Request,
    payload: FundingRoundRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER"])),
) -> APIResponseEnvelope[FundingRoundResponse]:
    """POST /api/v1/investment/funding-round — OWNER only."""
    round_id = f"rnd-{uuid.uuid4().hex[:8]}"
    post_money = payload.pre_money_valuation + payload.raise_amount
    dilution = (payload.raise_amount / post_money) * 100

    audit(
        "INVESTMENT_FUNDING_ROUND_MODELLED",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={
            "round_id": round_id,
            "round_type": payload.round_type,
            "raise_amount": str(payload.raise_amount),
        },
    )

    return APIResponseEnvelope(
        data=FundingRoundResponse(
            round_id=round_id,
            round_type=payload.round_type,
            raise_amount=payload.raise_amount,
            post_money_valuation=post_money,
            equity_dilution=round(dilution, 4),
            status="MODELLED",
        ),
        message="Funding round modelled successfully.",
    )


@router.post(
    "/cap-table",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Add a cap table entry",
    status_code=201,
)
@limiter.limit("20/minute")
async def add_cap_table_entry(
    request: Request,
    payload: CapTableEntryRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER"])),
) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/investment/cap-table — OWNER only."""
    entry_id = f"cap-{uuid.uuid4().hex[:8]}"

    audit(
        "INVESTMENT_CAP_TABLE_ENTRY_ADDED",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={
            "entry_id": entry_id,
            "stakeholder_type": payload.stakeholder_type,
            "shares": payload.shares,
        },
    )

    return APIResponseEnvelope(
        data={
            "entry_id": entry_id,
            "stakeholder_name": payload.stakeholder_name,
            "stakeholder_type": payload.stakeholder_type,
            "shares": payload.shares,
            "share_class": payload.share_class,
        },
        message="Cap table entry added.",
    )


@router.post(
    "/investor-update",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Draft an investor update",
)
@limiter.limit("10/minute")
async def draft_investor_update(
    request: Request,
    payload: InvestorUpdateRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN"])),
) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/investment/investor-update"""
    update_id = f"upd-{uuid.uuid4().hex[:8]}"

    audit(
        "INVESTMENT_INVESTOR_UPDATE_DRAFTED",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={"update_id": update_id, "period": payload.period},
    )

    return APIResponseEnvelope(
        data={
            "update_id": update_id,
            "period": payload.period,
            "mrr": str(payload.mrr),
            "cash_balance": str(payload.cash_balance),
            "highlights": payload.highlights,
            "draft_status": "DRAFT",
        },
        message="Investor update drafted successfully.",
    )
