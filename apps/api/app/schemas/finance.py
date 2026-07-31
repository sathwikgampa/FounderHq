"""
Finance Module — Request & Response Schemas
--------------------------------------------
All monetary values are validated as positive decimals.
Pydantic v2 field validators reject out-of-range or malformed inputs before
they ever reach service or database layers, preventing injection-style abuse
(e.g. negative balances, astronomically large numbers that overflow storage).
"""

from __future__ import annotations

from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class RunwayAnalysisRequest(BaseModel):
    """Request body for POST /api/v1/finance/runway."""

    balance: Decimal = Field(
        ...,
        gt=0,
        le=Decimal("1_000_000_000"),
        description="Current cash balance in USD.",
        examples=[200_000],
    )
    monthly_burn: Decimal = Field(
        ...,
        gt=0,
        le=Decimal("100_000_000"),
        description="Average monthly cash burn in USD.",
        examples=[20_000],
    )
    currency: str = Field(default="USD", max_length=3, pattern=r"^[A-Z]{3}$")

    @field_validator("monthly_burn")
    @classmethod
    def burn_less_than_balance(cls, v: Decimal, info: object) -> Decimal:
        # Access other fields via info.data in Pydantic v2
        data = getattr(info, "data", {})
        balance = data.get("balance")
        if balance is not None and v > balance * 12:
            raise ValueError(
                "monthly_burn cannot exceed balance × 12. Check your inputs."
            )
        return v


class BudgetForecastRequest(BaseModel):
    """Request body for POST /api/v1/finance/forecast."""

    months: int = Field(..., ge=1, le=60, description="Forecast horizon in months.")
    revenue_growth_rate: Decimal = Field(
        ...,
        ge=Decimal("-1"),
        le=Decimal("10"),
        description="Expected monthly revenue growth rate (e.g. 0.05 = 5%).",
    )
    starting_revenue: Decimal = Field(
        ..., ge=0, le=Decimal("1_000_000_000"), description="Current monthly revenue in USD."
    )
    starting_expenses: Decimal = Field(
        ..., ge=0, le=Decimal("1_000_000_000"), description="Current monthly expenses in USD."
    )


class FinanceSummaryResponse(BaseModel):
    runway_months: float
    burn_rate: Decimal
    balance: Decimal
    recommendation: str
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
