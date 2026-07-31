from typing import Any

from fastapi import APIRouter, Depends, Request

from app.middleware.rbac import require_role
from app.schemas.common import APIResponseEnvelope

router = APIRouter(prefix="/workspace", tags=["Multi-Tenant Workspace"])


@router.get("/context", response_model=APIResponseEnvelope[dict[str, Any]])
async def get_workspace_context(
    request: Request,
    user: dict[str, Any] = Depends(require_role(["OWNER", "ADMIN", "MEMBER"])),
) -> APIResponseEnvelope[dict[str, Any]]:
    """Retrieve isolated multi-tenant workspace context."""
    workspace_id = getattr(request.state, "workspace_id", "ws-default-dev")
    return APIResponseEnvelope(
        data={
            "workspace_id": workspace_id,
            "user": user,
            "status": "ACTIVE",
        },
        message="Workspace context resolved successfully.",
    )
