"""
Reports Module Router
----------------------
SCALABILITY: Isolated module. New report types (Sales, Operations, HR)
are added by extending the Literal in ReportGenerateRequest and adding
a generation handler here — no changes elsewhere.

SECURITY:
- Date range input is validated server-side with a 2-year cap to prevent
  resource-exhaustion queries against the database.
- Report format is an enum — no path-traversal possible via format field.
- PDF generation requires OWNER or ADMIN because reports may contain
  sensitive financial or legal data.
- All report generation events are audited with user ID and report type.
"""

from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.audit import audit
from app.middleware.rbac import require_role
from app.schemas.common import APIResponseEnvelope
from app.schemas.reports import ReportGenerateRequest, ReportResponse

router = APIRouter(prefix="/reports", tags=["Reports"])
limiter = Limiter(key_func=get_remote_address)


@router.post(
    "/generate",
    response_model=APIResponseEnvelope[ReportResponse],
    summary="Generate a report",
    description=(
        "Queue a report generation job. Returns a report_id that can be polled "
        "via GET /api/v1/reports/{report_id} to check status and retrieve download URL."
    ),
    status_code=202,
)
@limiter.limit("10/minute")
async def generate_report(
    request: Request,
    payload: ReportGenerateRequest,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN"])),
) -> APIResponseEnvelope[ReportResponse]:
    """POST /api/v1/reports/generate — OWNER/ADMIN only."""
    report_id = f"rpt-{uuid.uuid4().hex[:8]}"

    audit(
        "REPORT_GENERATION_QUEUED",
        ip=request.client.host if request.client else "unknown",
        user_id=user.get("uid"),
        details={
            "report_id": report_id,
            "report_type": payload.report_type,
            "format": payload.format,
            "date_from": str(payload.date_from),
            "date_to": str(payload.date_to),
        },
    )

    return APIResponseEnvelope(
        data=ReportResponse(
            report_id=report_id,
            report_type=payload.report_type,
            date_from=payload.date_from,
            date_to=payload.date_to,
            format=payload.format,
            status="QUEUED",
            download_url=None,
        ),
        message=f"Report {report_id} queued for generation.",
    )


@router.get(
    "/{report_id}",
    response_model=APIResponseEnvelope[ReportResponse],
    summary="Get report status",
)
async def get_report_status(
    report_id: str,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN", "MEMBER"])),
) -> APIResponseEnvelope[dict[str, Any]]:
    """GET /api/v1/reports/{report_id}"""
    # Placeholder — real implementation queries a job queue (Celery / Cloud Tasks)
    return APIResponseEnvelope(
        data={"report_id": report_id, "status": "QUEUED"},
        message="Report status retrieved.",
    )
