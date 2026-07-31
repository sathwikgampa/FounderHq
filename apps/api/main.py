"""
FounderHQ API Gateway — FastAPI Server with Event-Driven Dynamic Workflow Routing SSE

Endpoints:
    POST  /api/v1/planner/stream  — CEO Planner Agent SSE execution stream
    GET   /api/v1/healthz         — Liveness probe
    GET   /                        — Root ping
"""

from __future__ import annotations

import logging
import os
import sys
import time
import uuid
from contextlib import asynccontextmanager
from datetime import UTC, datetime

import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

from app.services.planner_service import _planner_event_stream

# Logging Setup
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("founderhq.api")

# Lazy imports helper
_runner = None


def _get_runner():
    """Lazily initialize the LocalRunner on first request."""
    global _runner
    if _runner is None:
        try:
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
            if project_root not in sys.path:
                sys.path.insert(0, project_root)

            from apps.api.agents.startup_team.agent import LocalRunner

            _runner = LocalRunner()
            logger.info("✅ ADK LocalRunner initialized: Dynamic CEO Routing Engine ready.")
        except Exception as e:
            logger.warning(f"⚠️  ADK runner not available: {e}")
            _runner = None
    return _runner


class PlannerStreamRequest(BaseModel):
    """Payload for the CEO Planner streaming endpoint."""

    prompt: str = Field(
        ...,
        min_length=5,
        description="High-level founder command to route through the dynamic multi-agent workflow engine.",
        examples=[
            "We want to expand our tech team. Check if we can afford a $130k Senior AI Engineer, "
            "draft the job post, estimate the AWS cloud cost for 20k users, and review the employment contract risks."
        ],
    )
    workspace_id: str = Field(
        default="ws-default",
        description="Multi-tenant workspace identifier for session isolation.",
    )


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    timestamp: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 FounderHQ Dynamic Workflow Routing API starting up...")
    yield
    logger.info("🛑 FounderHQ API shutting down.")


app = FastAPI(
    title="FounderHQ Dynamic CEO Workflow Routing API",
    description=(
        "Production-grade FastAPI gateway powering event-driven command pipelines "
        "across CEOAgent → 8 specialized sub-agents with SSE stream contracts."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from app.api import api_v1_router

    app.include_router(api_v1_router, prefix="/api")
except Exception as e:
    logger.warning(f"⚠️ Could not mount modular api_v1_router: {e}")


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start) * 1000, 2)
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration_ms}ms)")
    return response


@app.post(
    "/api/v1/planner/stream",
    summary="Stream CEO Planner Agent Execution (SSE)",
    description="Accepts a founder prompt and streams live routing & sub-agent execution events via SSE.",
    tags=["CEO Planner"],
)
async def stream_planner_execution(payload: PlannerStreamRequest):
    session_id = f"{payload.workspace_id}::{uuid.uuid4().hex[:8]}"
    logger.info(
        f"🤖 Workflow routing stream | workspace={payload.workspace_id} | "
        f"session={session_id} | prompt={payload.prompt[:80]}..."
    )

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


@app.get(
    "/api/v1/healthz",
    response_model=HealthResponse,
    summary="Liveness Probe",
    tags=["Health"],
    status_code=status.HTTP_200_OK,
)
async def liveness_check():
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        environment="development",
        timestamp=datetime.now(UTC).isoformat(),
    )


@app.get("/", include_in_schema=False)
async def root_ping():
    return JSONResponse(
        content={
            "name": "FounderHQ Dynamic CEO Workflow Routing API",
            "version": "1.0.0",
            "status": "ONLINE",
            "docs": "/docs",
            "planner_stream": "POST /api/v1/planner/stream",
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )
