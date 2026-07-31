import logging
import uuid

from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse

from app.ai.engine import get_engine
from app.schemas.planner import PlannerStreamRequest

logger = logging.getLogger("founderhq.api.planner")

router = APIRouter(prefix="/planner", tags=["CEO Planner (Public Interface)"])


@router.post(
    "/stream",
    summary="Stream CEO Planner AI Execution (SSE)",
    description=(
        "Accepts a high-level founder command and streams live CEO Planner Agent execution "
        "via Server-Sent Events (SSE). Emits real-time events: agent_started, tool_executed, "
        "approval_required, and final_brief."
    ),
)
async def stream_planner_execution(payload: PlannerStreamRequest):
    """POST /api/v1/planner/stream — Real-time multi-agent execution stream."""
    session_id = f"{payload.workspace_id}::{uuid.uuid4().hex[:8]}"
    logger.info(
        f"🤖 Planner stream request | workspace={payload.workspace_id} | "
        f"session={session_id} | prompt={payload.prompt[:80]}..."
    )

    engine = get_engine()

    return EventSourceResponse(
        content=engine.stream_execution(
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
