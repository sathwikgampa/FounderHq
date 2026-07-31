"""Startups Router for startup entity CRUD operations."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.schemas.response import APIResponse
from app.schemas.startups import StartupCreate, StartupResponse, StartupUpdate
from app.services.startup_service import StartupService

router = APIRouter(prefix="/startups", tags=["Startups"])
startup_service = StartupService()


@router.post("", response_model=APIResponse[StartupResponse], status_code=status.HTTP_201_CREATED)
async def create_startup(payload: StartupCreate):
    """Create a new startup profile."""
    startup = startup_service.create_startup(payload)
    return APIResponse(
        success=True,
        data=startup,
        message="Startup profile created successfully",
    )


@router.get("", response_model=APIResponse[list[StartupResponse]])
async def list_startups():
    """List all startups for current workspace."""
    startups = startup_service.list_startups()
    return APIResponse(
        success=True,
        data=startups,
        message="Startups retrieved successfully",
    )


@router.get("/{id}", response_model=APIResponse[StartupResponse])
async def get_startup_by_id(id: str):
    """Retrieve startup profile details by ID."""
    startup = startup_service.get_startup(id)
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Startup with ID '{id}' not found",
        )
    return APIResponse(
        success=True,
        data=startup,
        message="Startup details retrieved",
    )


@router.patch("/{id}", response_model=APIResponse[StartupResponse])
async def update_startup(id: str, payload: StartupUpdate):
    """Update startup profile parameters (financials, team, stage)."""
    updated = startup_service.update_startup(id, payload)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Startup with ID '{id}' not found",
        )
    return APIResponse(
        success=True,
        data=updated,
        message="Startup profile updated successfully",
    )
