from datetime import datetime, timezone
from typing import Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponseEnvelope(BaseModel, Generic[T]):
    success: bool = True
    message: Optional[str] = None
    data: T
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class HealthStatusResponse(BaseModel):
    status: str
    version: str
    environment: str
    timestamp: str
