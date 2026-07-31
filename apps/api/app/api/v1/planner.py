import asyncio
from typing import AsyncGenerator
from fastapi import APIRouter
from starlette.responses import StreamingResponse

router = APIRouter(prefix="/planner", tags=["CEO Planner (Public Interface)"])


async def mock_event_stream() -> AsyncGenerator[str, None]:
    """Server-Sent Events (SSE) streaming generator placeholder for CEO Planner AI responses."""
    yield "data: {\"event\": \"start\", \"message\": \"CEO Planner session initialized.\"}\n\n"
    await asyncio.sleep(0.1)
    yield "data: {\"event\": \"chunk\", \"text\": \"FounderHQ Foundation active. Awaiting strategy commands.\"}\n\n"
    await asyncio.sleep(0.1)
    yield "data: {\"event\": \"complete\", \"status\": \"SUCCESS\"}\n\n"


@router.post("/stream", summary="Stream CEO Planner AI Execution")
async def stream_planner_execution() -> StreamingResponse:
    """Public streaming entrypoint for CEO Planner AI interactions."""
    return StreamingResponse(
        mock_event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
