from typing import Any

from fastapi import APIRouter, HTTPException, Query, status

from app.ai.approval_store import approval_store
from app.schemas.common import APIResponseEnvelope
from app.schemas.planner import ApprovalDecisionRequest

router = APIRouter(prefix="/approvals", tags=["Human Approval Queue"])


@router.get(
    "",
    response_model=APIResponseEnvelope[list[dict[str, Any]]],
    summary="List Human Approval Queue Items",
    description="Retrieves pending high-risk recommendations (headcount offers, ad campaigns, contracts) requiring executive sign-off.",
)
async def list_approval_items(
    workspace_id: str | None = Query(None, description="Filter items by workspace ID"),
    status: str | None = Query(
        "PENDING", description="Filter by status (PENDING, APPROVED, REJECTED)"
    ),
) -> APIResponseEnvelope[list[dict[str, Any]]]:
    """GET /api/v1/approvals — List approval items."""
    items = approval_store.list_items(workspace_id=workspace_id, status_filter=status)
    return APIResponseEnvelope(
        data=[item.to_dict() for item in items],
        message=f"Retrieved {len(items)} approval item(s).",
    )


@router.get(
    "/{item_id}",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Get Approval Item Details",
)
async def get_approval_item(item_id: str) -> APIResponseEnvelope[dict[str, Any]]:
    """GET /api/v1/approvals/{item_id} — Retrieve approval item details."""
    item = approval_store.get_item(item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Approval item '{item_id}' not found.",
        )
    return APIResponseEnvelope(
        data=item.to_dict(),
        message="Approval item retrieved.",
    )


@router.post(
    "/{item_id}/decision",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Submit Human Approval Decision",
    description="Accepts 'APPROVE' or 'REJECT' decision to finalize agent recommendations.",
)
async def submit_approval_decision(
    item_id: str,
    payload: ApprovalDecisionRequest,
) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/approvals/{item_id}/decision — Finalize approval decision."""
    item = approval_store.decide(item_id, payload.decision)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Approval item '{item_id}' not found.",
        )
    return APIResponseEnvelope(
        data=item.to_dict(),
        message=f"Approval item '{item_id}' marked as {item.status}.",
    )


@router.post(
    "/{item_id}/approve",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Approve Item Alias",
)
async def approve_item_alias(item_id: str) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/approvals/{item_id}/approve — Approve item directly."""
    item = approval_store.decide(item_id, "APPROVE")
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Approval item '{item_id}' not found.",
        )
    return APIResponseEnvelope(
        data=item.to_dict(),
        message=f"Approval item '{item_id}' marked as APPROVED.",
    )


@router.post(
    "/{item_id}/reject",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Reject Item Alias",
)
async def reject_item_alias(item_id: str) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/approvals/{item_id}/reject — Reject item directly."""
    item = approval_store.decide(item_id, "REJECT")
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Approval item '{item_id}' not found.",
        )
    return APIResponseEnvelope(
        data=item.to_dict(),
        message=f"Approval item '{item_id}' marked as REJECTED.",
    )
