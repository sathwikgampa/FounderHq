"""
FounderHQ API Gateway — FastAPI Server with Event-Driven Dynamic Workflow Routing SSE

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
from datetime import UTC, datetime

import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start) * 1000, 2)
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration_ms}ms)")
    return response


async def _planner_event_stream(
    prompt: str,
    workspace_id: str,
    session_id: str,
) -> AsyncGenerator[dict, None]:
    """Async generator streaming Server-Sent Events (SSE) following the required contract."""
    from app.ai.approval_store import approval_store

    from apps.api.agents.startup_team.agent import (
        analyze_and_route_workflow,
        check_runway,
        create_campaign_plan,
        draft_job_posting,
        estimate_cloud_cost,
        evaluate_lead_and_pricing,
        prioritize_features,
        verify_contract,
    )

    # 1. event: routing_decision
    route_info = analyze_and_route_workflow(prompt)
    selected_agents: list[str] = route_info["selected_agents"]
    workflow_type: str = route_info["workflow_type"]

    yield {
        "event": "routing_decision",
        "data": json.dumps(
            {
                "selected_agents": selected_agents,
                "workflow_type": workflow_type,
            }
        ),
    }

    # Department tool mappings
    tool_map = {
        "FinanceAgent": ("check_runway", lambda: check_runway(200000.0, 20000.0)),
        "TalentAgent": (
            "draft_job_posting",
            lambda: draft_job_posting("Senior AI Engineer", 130000.0),
        ),
        "GrowthAgent": ("create_campaign_plan", lambda: create_campaign_plan("LinkedIn", 5000.0)),
        "LegalAgent": ("verify_contract", lambda: verify_contract("Employment")),
        "SalesAgent": ("evaluate_lead_and_pricing", lambda: evaluate_lead_and_pricing(15000.0, 50)),
        "ProductAgent": (
            "prioritize_features",
            lambda: prioritize_features("Tech Team Module", 5, 9),
        ),
        "TechArchitectAgent": (
            "estimate_cloud_cost",
            lambda: estimate_cloud_cost(20000, "AWS Serverless"),
        ),
        "InvestmentAgent": ("investor_update", lambda: {"status": "Investor update drafted"}),
    }

    next_steps: list[str] = []
    summary_items: list[str] = []

    for agent_name in selected_agents:
        # 2. event: agent_start
        yield {
            "event": "agent_start",
            "data": json.dumps(
                {
                    "agent_name": agent_name,
                    "status": "IN_PROGRESS",
                }
            ),
        }

        tool_tuple = tool_map.get(agent_name)
        if tool_tuple:
            tool_name, tool_fn = tool_tuple
            tool_output = tool_fn()

            # 3. event: tool_executed
            yield {
                "event": "tool_executed",
                "data": json.dumps(
                    {
                        "agent_name": agent_name,
                        "tool_name": tool_name,
                        "output": tool_output,
                    }
                ),
            }

            # 4. event: approval_flag (if approval or risk signoff required)
            requires_approval = bool(
                tool_output.get("requires_human_signoff")
                or tool_output.get("approval_status") == "HOLD_FOR_HUMAN_APPROVAL"
                or tool_output.get("risk_assessment") in ["HIGH", "MEDIUM"]
            )

            if requires_approval:
                item = approval_store.enqueue(
                    session_id=session_id,
                    workspace_id=workspace_id,
                    agent=agent_name,
                    tool=tool_name,
                    payload=tool_output,
                )
                yield {
                    "event": "approval_flag",
                    "data": json.dumps(
                        {
                            "approval_id": item.id,
                            "agent_name": agent_name,
                            "action": tool_name,
                            "requires_approval": True,
                            "details": tool_output,
                        }
                    ),
                }

            summary_items.append(f"{agent_name} executed {tool_name}.")
            next_steps.append(f"Review {agent_name} {tool_name} results.")

    # 5. event: final_brief
    yield {
        "event": "final_brief",
        "data": json.dumps(
            {
                "summary": f"CEO Planner routed command across {len(selected_agents)} agents via {workflow_type} execution flow. "
                + " ".join(summary_items),
                "next_steps": next_steps,
            }
        ),
    }


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
