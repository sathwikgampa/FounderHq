"""
FounderHQ API Gateway — FastAPI Production Server with SSE Streaming

Endpoints:
    POST  /api/v1/planner/stream  — CEO Planner Agent SSE execution stream
    GET   /api/v1/healthz         — Liveness probe
    GET   /                        — Root ping
"""

from __future__ import annotations

import json
import logging
import os
import sys
import time
import uuid
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from datetime import UTC

import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

# ──────────────────────────────────────────────────────────────────────────────
# Logging Setup
# ──────────────────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("founderhq.api")


# ──────────────────────────────────────────────────────────────────────────────
# Lazy ADK Agent Import (avoids startup cost if ADK not needed)
# ──────────────────────────────────────────────────────────────────────────────

_runner = None


def _get_runner():
    """Lazily initialize the LocalRunner on first request."""
    global _runner
    if _runner is None:
        try:
            import os
            import sys

            # Ensure project root is on path
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
            if project_root not in sys.path:
                sys.path.insert(0, project_root)

            from apps.api.agents.startup_team.agent import LocalRunner

            _runner = LocalRunner()
            logger.info("✅ ADK LocalRunner initialized: CEOAgent ready.")
        except Exception as e:
            logger.warning(f"⚠️  ADK runner not available: {e}")
            _runner = None
    return _runner


# ──────────────────────────────────────────────────────────────────────────────
# Pydantic Request / Response Schemas
# ──────────────────────────────────────────────────────────────────────────────


class PlannerStreamRequest(BaseModel):
    """Payload for the CEO Planner streaming endpoint."""

    prompt: str = Field(
        ...,
        min_length=5,
        description="High-level founder command to route through the executive agent suite.",
        examples=[
            "We have $150,000 balance and $20,000 monthly burn. "
            "We want to hire a Senior AI Engineer at $120,000/yr and "
            "run a $5,000 LinkedIn growth campaign. Run all checks."
        ],
    )
    workspace_id: str = Field(
        default="ws-default",
        description="Multi-tenant workspace identifier for session isolation.",
        examples=["ws-founder-001"],
    )


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    timestamp: str


# ──────────────────────────────────────────────────────────────────────────────
# Application Lifespan
# ──────────────────────────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 FounderHQ API starting up...")
    yield
    logger.info("🛑 FounderHQ API shutting down.")


# ──────────────────────────────────────────────────────────────────────────────
# FastAPI Application
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="FounderHQ AI Operating System API",
    description=(
        "Production-grade FastAPI gateway for the FounderHQ multi-agent executive suite. "
        "Routes founder commands through CEO Planner → Finance, Talent, Growth & Legal sub-agents."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS Middleware ────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from app.api import api_v1_router
    app.include_router(api_v1_router, prefix="/api")
except Exception as e:
    logger.warning(f"⚠️ Could not mount modular api_v1_router: {e}")



# ── Request Timing Middleware ──────────────────────────────────────────────────


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start) * 1000, 2)
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration_ms}ms)")
    return response


# ──────────────────────────────────────────────────────────────────────────────
# SSE STREAMING GENERATOR
# ──────────────────────────────────────────────────────────────────────────────


async def _planner_event_stream(
    prompt: str,
    workspace_id: str,
    session_id: str,
) -> AsyncGenerator[dict, None]:
    """
    Async generator that streams CEO Planner Agent execution via SSE.

    Yields structured SSE events:
        - session_start   : Execution metadata
        - agent_chunk     : Live streamed text chunk from sub-agents
        - tool_result     : Tool execution data snapshot
        - complete        : Final stream termination signal
        - error           : Error payload if execution fails
    """
    runner = _get_runner()

    # ── Session Start Event ──────────────────────────────────────────────────
    yield {
        "event": "session_start",
        "data": json.dumps(
            {
                "session_id": session_id,
                "workspace_id": workspace_id,
                "agent": "CEOAgent",
                "provider": "featherless.ai",
                "ceo_model": os.environ.get("CEO_MODEL", "Qwen/Qwen3-235B-A22B"),
                "sub_agent_model": os.environ.get("SUB_AGENT_MODEL", "Qwen/Qwen3-32B"),
                "sub_agents": ["FinanceAgent", "TalentAgent", "GrowthAgent", "LegalAgent"],
                "status": "EXECUTION_STARTED",
                "timestamp": time.time(),
            }
        ),
    }

    if runner is None:
        # ── Fallback: ADK not available, return mock stream ──────────────────
        logger.warning("ADK runner unavailable — serving mock stream.")
        yield {
            "event": "agent_chunk",
            "data": json.dumps(
                {
                    "author": "CEOAgent",
                    "text": (
                        "⚠️ ADK Runtime not configured (GEMINI_API_KEY missing or ADK not installed). "
                        "Set GEMINI_API_KEY in your .env file to enable live agent execution."
                    ),
                }
            ),
        }
        yield {
            "event": "complete",
            "data": json.dumps({"status": "MOCK_COMPLETE", "session_id": session_id}),
        }
        return

    # ── Live ADK Streaming ───────────────────────────────────────────────────
    try:
        from google.genai import types as genai_types

        # Enable auto-session creation for InMemoryRunner
        runner._runner.auto_create_session = True

        message = genai_types.Content(
            role="user",
            parts=[genai_types.Part(text=prompt)],
        )

        async for event in runner._runner.run_async(
            user_id=workspace_id,
            session_id=session_id,
            new_message=message,
        ):
            content = event.content
            author = getattr(event, "author", "CEOAgent")

            if content and content.parts:
                for part in content.parts:
                    # Text chunk from agent response
                    text = getattr(part, "text", None)
                    if text and text.strip():
                        yield {
                            "event": "agent_chunk",
                            "data": json.dumps(
                                {
                                    "author": author,
                                    "text": text,
                                }
                            ),
                        }

                    # Tool execution result
                    func_response = getattr(part, "function_response", None)
                    if func_response:
                        yield {
                            "event": "tool_result",
                            "data": json.dumps(
                                {
                                    "tool_name": getattr(func_response, "name", "unknown"),
                                    "author": author,
                                    "result": str(getattr(func_response, "response", {})),
                                }
                            ),
                        }

            # Turn complete signal
            if getattr(event, "turn_complete", False):
                yield {
                    "event": "complete",
                    "data": json.dumps(
                        {
                            "status": "STREAM_COMPLETE",
                            "session_id": session_id,
                            "workspace_id": workspace_id,
                        }
                    ),
                }
                return

    except Exception as exc:
        logger.error(f"Agent stream error: {exc}", exc_info=True)
        yield {
            "event": "error",
            "data": json.dumps(
                {
                    "error": str(exc),
                    "session_id": session_id,
                }
            ),
        }


# ──────────────────────────────────────────────────────────────────────────────
# API ENDPOINTS
# ──────────────────────────────────────────────────────────────────────────────


@app.post(
    "/api/v1/planner/stream",
    summary="Stream CEO Planner Agent Execution (SSE)",
    description=(
        "Accepts a high-level founder command and streams live CEO Planner Agent execution "
        "via Server-Sent Events (SSE). Sub-agents (Finance, Talent, Growth, Legal) are invoked "
        "as needed and their outputs are streamed in real-time."
    ),
    tags=["CEO Planner"],
)
async def stream_planner_execution(payload: PlannerStreamRequest):
    """POST /api/v1/planner/stream — SSE streaming CEO Planner execution."""
    session_id = f"{payload.workspace_id}::{uuid.uuid4().hex[:8]}"
    logger.info(
        f"🤖 Planner stream | workspace={payload.workspace_id} | "
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
    """GET /api/v1/healthz — Kubernetes / Cloud Run liveness probe."""
    from datetime import datetime

    return HealthResponse(
        status="healthy",
        version="1.0.0",
        environment="development",
        timestamp=datetime.now(UTC).isoformat(),
    )


@app.get("/", include_in_schema=False)
async def root_ping():
    """Root ping endpoint."""
    return JSONResponse(
        content={
            "name": "FounderHQ AI Operating System API",
            "version": "1.0.0",
            "status": "ONLINE",
            "docs": "/docs",
            "planner_stream": "POST /api/v1/planner/stream",
        }
    )


# ──────────────────────────────────────────────────────────────────────────────
# Entry Point
# ──────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run(
        "apps.api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
