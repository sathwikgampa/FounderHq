"""Service layer for Startup Entities & Financial Context."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import Dict, List, Optional

from app.schemas.startups import StartupCreate, StartupResponse, StartupUpdate

# In-memory store for demonstration & fallback when Firestore is offline
_STARTUP_STORE: Dict[str, StartupResponse] = {}

# Seed default initial startup if empty
def _seed_default_startup() -> StartupResponse:
    default_id = "startup-001"
    if default_id not in _STARTUP_STORE:
        startup = StartupResponse(
            id=default_id,
            workspaceId="ws-default",
            name="Acme AI Technologies",
            industry="AI SaaS & Enterprise",
            stage="Seed",
            mrr=25000.0,
            burnRate=30000.0,
            runwayMonths=16.5,
            cashBalance=495000.0,
            teamSize=6,
            createdAt=datetime.now(UTC).isoformat(),
            updatedAt=datetime.now(UTC).isoformat(),
            createdBy="user-founder-001",
        )
        _STARTUP_STORE[default_id] = startup
    return _STARTUP_STORE[default_id]

_seed_default_startup()


class StartupService:
    def create_startup(self, payload: StartupCreate, workspace_id: str = "ws-default", user_id: str = "user-founder-001") -> StartupResponse:
        startup_id = f"startup-{uuid.uuid4().hex[:8]}"
        now = datetime.now(UTC).isoformat()
        
        # Calculate runway if cashBalance and burnRate are provided
        runway = payload.runwayMonths
        if payload.burnRate > 0 and payload.cashBalance > 0:
            runway = round(payload.cashBalance / payload.burnRate, 1)

        startup = StartupResponse(
            id=startup_id,
            workspaceId=workspace_id,
            name=payload.name,
            industry=payload.industry,
            stage=payload.stage,
            mrr=payload.mrr,
            burnRate=payload.burnRate,
            runwayMonths=runway,
            cashBalance=payload.cashBalance,
            teamSize=payload.teamSize,
            createdAt=now,
            updatedAt=now,
            createdBy=user_id,
        )
        _STARTUP_STORE[startup_id] = startup
        return startup

    def get_startup(self, startup_id: str) -> Optional[StartupResponse]:
        if startup_id in _STARTUP_STORE:
            return _STARTUP_STORE[startup_id]
        # Fallback to default startup if requested ID is default
        if startup_id in ("default", "demo", "startup-001"):
            return _seed_default_startup()
        return None

    def update_startup(self, startup_id: str, payload: StartupUpdate) -> Optional[StartupResponse]:
        existing = self.get_startup(startup_id)
        if not existing:
            return None

        data = existing.model_dump()
        update_data = payload.model_dump(exclude_unset=True)
        data.update(update_data)
        data["updatedAt"] = datetime.now(UTC).isoformat()

        # Recalculate runway if burn or cash changed
        if data["burnRate"] > 0:
            data["runwayMonths"] = round(data["cashBalance"] / data["burnRate"], 1)

        updated_startup = StartupResponse(**data)
        _STARTUP_STORE[updated_startup.id] = updated_startup
        return updated_startup

    def list_startups(self, workspace_id: str = "ws-default") -> List[StartupResponse]:
        return [s for s in _STARTUP_STORE.values() if s.workspaceId == workspace_id] or [_seed_default_startup()]
