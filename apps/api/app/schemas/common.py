from datetime import UTC, datetime
from typing import TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponseEnvelope[T](BaseModel):
    success: bool = True
    message: str | None = None
    data: T
    timestamp: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())


class HealthStatusResponse(BaseModel):
    status: str
    version: str
    environment: str
    timestamp: str
