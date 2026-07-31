"""
Investment Module — Request & Response Schemas
-----------------------------------------------
Equity percentages are validated as 0–100 range. Round sizes are bounded to
realistic maximums to prevent integer overflow in downstream calculations.
"""

from __future__ import annotations

from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class FundingRoundRequest(BaseModel):
    """Request body for POST /api/v1/investment/funding-round."""

    round_type: Literal["PRE_SEED", "SEED", "SERIES_A", "SERIES_B", "SERIES_C", "GROWTH", "IPO"]
    raise_amount: Decimal = Field(
        ...,
        gt=0,
        le=Decimal("10_000_000_000"),
        description="Amount to raise in USD.",
    )
    pre_money_valuation: Decimal = Field(
        ...,
        gt=0,
        le=Decimal("1_000_000_000_000"),
        description="Pre-money company valuation in USD.",
    )
    investor_name: str = Field(default="", max_length=200)
    equity_offered: Decimal = Field(
        ...,
        ge=Decimal("0.01"),
        le=Decimal("100"),
        description="Equity offered as a percentage (1–100).",
    )

    @field_validator("equity_offered")
    @classmethod
    def equity_consistent_with_valuation(cls, v: Decimal, info: object) -> Decimal:
        data = getattr(info, "data", {})
        raise_amount = data.get("raise_amount")
        pre_money = data.get("pre_money_valuation")
        if raise_amount is not None and pre_money is not None:
            implied_equity = (raise_amount / (pre_money + raise_amount)) * 100
            # Allow ±5% tolerance for rounding
            if abs(float(v) - float(implied_equity)) > 5:
                raise ValueError(
                    f"equity_offered ({v}%) is inconsistent with raise_amount / "
                    f"(pre_money_valuation + raise_amount) = {implied_equity:.2f}%. "
                    "Check your numbers."
                )
        return v


class CapTableEntryRequest(BaseModel):
    """Request body for POST /api/v1/investment/cap-table."""

    stakeholder_name: str = Field(..., min_length=2, max_length=200)
    stakeholder_type: Literal["FOUNDER", "INVESTOR", "EMPLOYEE", "ADVISOR", "ESOP"]
    shares: int = Field(..., ge=1, le=10_000_000_000)
    share_class: Literal["COMMON", "PREFERRED_A", "PREFERRED_B", "OPTIONS"] = "COMMON"


class InvestorUpdateRequest(BaseModel):
    """Request body for POST /api/v1/investment/investor-update."""

    period: str = Field(
        ...,
        pattern=r"^\d{4}-(Q[1-4]|H[12]|[A-Za-z]{3})$",
        description="Reporting period, e.g. '2025-Q3', '2025-H1', '2025-Jan'.",
    )
    highlights: list[str] = Field(..., min_length=1, max_length=10)
    mrr: Decimal = Field(..., ge=0, le=Decimal("1_000_000_000"))
    cash_balance: Decimal = Field(..., ge=0, le=Decimal("10_000_000_000"))

    @field_validator("highlights")
    @classmethod
    def validate_highlights(cls, v: list[str]) -> list[str]:
        cleaned = [h.strip() for h in v if isinstance(h, str) and h.strip()]
        if not cleaned:
            raise ValueError("highlights must contain at least one entry.")
        if any(len(h) > 500 for h in cleaned):
            raise ValueError("Each highlight must be 500 characters or fewer.")
        return cleaned


class FundingRoundResponse(BaseModel):
    round_id: str
    round_type: str
    raise_amount: Decimal
    post_money_valuation: Decimal
    equity_dilution: Decimal
    status: Literal["MODELLED", "TERM_SHEET", "CLOSED"]
