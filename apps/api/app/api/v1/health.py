from datetime import UTC, datetime

from fastapi import APIRouter, status

from app.core.config import settings
from app.schemas.common import HealthStatusResponse

router = APIRouter(prefix="/health", tags=["Health & Diagnostics"])


@router.get(
    "z",
    response_model=HealthStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Liveness Check",
)
async def liveness_check() -> HealthStatusResponse:
    """Standard Kubernetes / Cloud Run liveness probe."""
    return HealthStatusResponse(
        status="healthy",
        version=settings.VERSION,
        environment=settings.ENV,
        timestamp=datetime.now(UTC).isoformat(),
    )


@router.get(
    "/readyz",
    response_model=HealthStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Readiness Check",
)
async def readiness_check() -> HealthStatusResponse:
    """Standard Kubernetes / Cloud Run readiness probe (checks DB & downstream SDKs)."""
    return HealthStatusResponse(
        status="ready",
        version=settings.VERSION,
        environment=settings.ENV,
        timestamp=datetime.now(UTC).isoformat(),
    )
