"""Approvals Router for founder sign-off on executive agent actions."""

from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from app.schemas.approvals import ApprovalActionRequest, ApprovalResponse
from app.schemas.response import APIResponse
from app.services.approval_service import ApprovalService

router = APIRouter(prefix="/approvals", tags=["Approvals"])
approval_service = ApprovalService()


@router.get("", response_model=APIResponse[List[ApprovalResponse]])
async def list_approvals(startupId: str = "startup-001", status_filter: Optional[str] = None):
    """List pending or past executive action approvals."""
    approvals = approval_service.list_approvals(startupId, status_filter)
    return APIResponse(
        success=True,
        data=approvals,
        message="Approvals listed successfully",
    )


@router.get("/{id}", response_model=APIResponse[ApprovalResponse])
async def get_approval_by_id(id: str):
    """Retrieve detailed approval request by ID."""
    approval = approval_service.get_approval(id)
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Approval request with ID '{id}' not found",
        )
    return APIResponse(
        success=True,
        data=approval,
        message="Approval request details retrieved",
    )


@router.post("/{id}/approve", response_model=APIResponse[ApprovalResponse])
async def approve_action(id: str, payload: Optional[ApprovalActionRequest] = None):
    """Approve an executive agent action."""
    reason = payload.reason if payload else None
    approved = approval_service.approve_action(id, reason)
    if not approved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Approval request with ID '{id}' not found",
        )
    return APIResponse(
        success=True,
        data=approved,
        message="Action approved successfully",
    )


@router.post("/{id}/reject", response_model=APIResponse[ApprovalResponse])
async def reject_action(id: str, payload: Optional[ApprovalActionRequest] = None):
    """Reject an executive agent action."""
    reason = payload.reason if payload else None
    rejected = approval_service.reject_action(id, reason)
    if not rejected:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Approval request with ID '{id}' not found",
        )
    return APIResponse(
        success=True,
        data=rejected,
        message="Action rejected successfully",
    )
