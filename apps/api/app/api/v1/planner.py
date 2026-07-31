"""CEO Planner Router for executing commands and streaming agent progress."""

from __future__ import annotations

import asyncio
import json
import logging
import uuid
from collections.abc import AsyncGenerator

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

from app.schemas.planner import (
    ExecutionStatusResponse,
    PlannerExecuteRequest,
    PlannerExecutionResponse,
    PlannerStreamRequest,
)
from app.schemas.response import APIResponse
from app.services.planner_service import PlannerService

logger = logging.getLogger("founderhq.api.planner")

router = APIRouter(prefix="/planner", tags=["Planner"])
planner_service = PlannerService()


@router.post(
    "/execute", response_model=APIResponse[PlannerExecutionResponse], status_code=status.HTTP_200_OK
)
async def execute_planner_command(payload: PlannerExecuteRequest):
    """Execute a founder command through the CEO Planner agent system."""
    execution = planner_service.execute_command(payload)
    return APIResponse(
        success=True,
        data=execution,
        message="CEO Planner command executed successfully",
    )


@router.post("/stream", summary="Stream CEO Planner AI Execution (SSE)")
async def post_stream_planner_execution(payload: PlannerStreamRequest):
    """POST /api/v1/planner/stream — Real-time multi-agent execution stream."""
    from main import _planner_event_stream

    session_id = f"{payload.workspace_id}::{uuid.uuid4().hex[:8]}"
    return EventSourceResponse(
        content=_planner_event_stream(
            prompt=payload.prompt,
            workspace_id=payload.workspace_id,
            session_id=session_id,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "X-Session-ID": session_id,
            "X-Workspace-ID": payload.workspace_id,
        },
    )


@router.get("/executions/{id}", response_model=APIResponse[ExecutionStatusResponse])
async def get_execution_status(id: str):
    """Retrieve status and steps for a specific execution ID."""
    execution = planner_service.get_execution(id)
    if not execution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Planner execution with ID '{id}' not found",
        )
    status_response = ExecutionStatusResponse(
        executionId=id,
        status=execution.status,
        progressPercent=100,
        currentStep="Execution completed",
        result=execution,
    )
    return APIResponse(
        success=True,
        data=status_response,
        message="Execution status retrieved",
    )


@router.get("/stream")
async def get_stream_planner_execution(
    prompt: str = "Analyze runway and growth plan", startupId: str = "startup-001"
):
    """GET /api/v1/planner/stream — SSE streaming endpoint."""

    async def event_generator() -> AsyncGenerator[str, None]:
        steps = [
            ("Connecting to CEO Planner", 10),
            ("Reading Startup Memory", 25),
            ("Searching RAG Knowledge Base", 45),
            ("Consulting Finance & Growth Agents", 70),
            ("Formulating Strategic Action Plan", 90),
            ("Execution Complete", 100),
        ]

        for step_text, progress in steps:
            event_data = {
                "step": step_text,
                "progress": progress,
                "timestamp": asyncio.get_event_loop().time(),
                "prompt": prompt,
                "startupId": startupId,
            }
            yield f"data: {json.dumps(event_data)}\n\n"
            await asyncio.sleep(0.3)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
