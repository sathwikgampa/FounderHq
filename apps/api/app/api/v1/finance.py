"""
Finance Module Router
----------------------
SCALABILITY: This router is entirely self-contained. Adding new finance
endpoints (e.g. expense tracking, payroll) requires only adding methods here
and in the finance service — no other module is touched.

SECURITY:
- All endpoints require an authenticated user (jwt_auth.verify_token).
- OWNER and ADMIN roles can write; MEMBER role is read-only.
- Strict-limit rate limiter (30/minute) prevents automated scraping of
  financial data.
- All request bodies are validated by FinanceSchema Pydantic models before
  any business logic executes.
"""

from __future__ import annotations

import uuid
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.audit import audit
from app.middleware.jwt_auth import jwt_auth
from app.middleware.rbac import require_role
from app.schemas.common import APIResponseEnvelope
from app.schemas.finance import (
    BudgetForecastRequest,
    FinanceSummaryResponse,
    RunwayAnalysisRequest,
)

router = APIRouter(prefix="/finance", tags=["Finance"])
limiter = Limiter(key_func=get_remote_address)


@router.post(
    "/runway",
    response_model=APIResponseEnvelope[FinanceSummaryResponse],
    summary="Analyse cash runway",
    description=(
        "Calculate how many months of runway remain given current balance and "
        "monthly burn rate, and return an AI-powered risk assessment."
    ),
)
@limiter.limit("30/minute")
async def analyse_runway(
    request: Request,
    payload: RunwayAnalysisRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN", "MEMBER"])),
) -> APIResponseEnvelope[FinanceSummaryResponse]:
    """POST /api/v1/finance/runway"""
    # Runway calculation (deterministic — no AI call needed for the core math)
    runway_months = float(payload.balance / payload.monthly_burn)

    if runway_months >= 18:
        risk = "LOW"
        recommendation = "Healthy runway. Consider accelerating growth investments."
    elif runway_months >= 12:
        risk = "MEDIUM"
        recommendation = "12–18 months of runway. Monitor burn and plan next raise."
    elif runway_months >= 6:
        risk = "HIGH"
        recommendation = "Under 12 months. Begin fundraising or cut costs now."
    else:
        risk = "CRITICAL"
        recommendation = "URGENT: Less than 6 months of runway. Immediate action required."

    audit(
        "FINANCE_RUNWAY_QUERY",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={"runway_months": round(runway_months, 2), "risk": risk},
    )

    return APIResponseEnvelope(
        data=FinanceSummaryResponse(
            runway_months=round(runway_months, 2),
            burn_rate=payload.monthly_burn,
            balance=payload.balance,
            recommendation=recommendation,
            risk_level=risk,
        ),
        message="Runway analysis complete.",
    )


@router.post(
    "/forecast",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Generate budget forecast",
    description="Project revenue and expense trajectory across a configurable number of months.",
)
@limiter.limit("20/minute")
async def generate_forecast(
    request: Request,
    payload: BudgetForecastRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN"])),
) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/finance/forecast — OWNER/ADMIN only."""
    projections = []
    revenue = float(payload.starting_revenue)
    expenses = float(payload.starting_expenses)
    rate = float(payload.revenue_growth_rate)

    for month in range(1, payload.months + 1):
        revenue = revenue * (1 + rate)
        projections.append(
            {
                "month": month,
                "revenue": round(revenue, 2),
                "expenses": round(expenses, 2),
                "net": round(revenue - expenses, 2),
            }
        )

    audit(
        "FINANCE_FORECAST_GENERATED",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={"months": payload.months},
    )

    return APIResponseEnvelope(
        data={
            "forecast_id": f"fct-{uuid.uuid4().hex[:8]}",
            "months": payload.months,
            "projections": projections,
        },
        message=f"{payload.months}-month budget forecast generated.",
    )
