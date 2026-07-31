"""
Reports Module — Request & Response Schemas
--------------------------------------------
Date range inputs are validated so start < end and spans don't exceed two
years (prevents resource-exhaustion queries against large data sets).
"""

from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class ReportGenerateRequest(BaseModel):
    """Request body for POST /api/v1/reports/generate."""

    report_type: Literal[
        "FINANCIAL_SUMMARY", "HIRING_PIPELINE", "LEGAL_COMPLIANCE",
        "MARKETING_ROI", "INVESTMENT_OVERVIEW", "EXECUTIVE_BRIEF"
    ]
    date_from: date = Field(..., description="Inclusive start date (ISO 8601).")
    date_to: date = Field(..., description="Inclusive end date (ISO 8601).")
    format: Literal["JSON", "PDF", "CSV"] = "JSON"
    include_charts: bool = False

    @model_validator(mode="after")
    def validate_date_range(self) -> "ReportGenerateRequest":
        if self.date_to <= self.date_from:
            raise ValueError("date_to must be after date_from.")
        delta_days = (self.date_to - self.date_from).days
        if delta_days > 730:  # 2 years
            raise ValueError("Date range cannot exceed 2 years (730 days).")
        return self

    @model_validator(mode="after")
    def pdf_requires_no_charts_flag(self) -> "ReportGenerateRequest":
        # PDF generation handles charts natively — flag is a no-op for PDF
        return self


class ReportResponse(BaseModel):
    report_id: str
    report_type: str
    date_from: date
    date_to: date
    format: str
    status: Literal["QUEUED", "PROCESSING", "READY", "FAILED"]
    download_url: str | None = None
