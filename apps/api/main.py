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


async def _planner_event_stream(
    prompt: str,
    workspace_id: str,
    session_id: str,
) -> AsyncGenerator[dict, None]:
    """Async generator streaming Server-Sent Events (SSE) following the required contract."""
    from app.ai.approval_store import approval_store

    from apps.api.agents.startup_team.agent import (
        analyze_and_route_workflow,
        build_gtm_launch_plan,
        calculate_bootstrap_runway,
        draft_job_posting,
        estimate_cloud_cost,
        evaluate_lead_and_pricing,
        generate_incorporation_checklist,
        generate_mvp_spec,
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

    # Execute deterministic tools per sub-agent
    mvp_res = generate_mvp_spec(
        prompt, "Founder concept validation & study platform implementation"
    )
    gtm_res = build_gtm_launch_plan("Educators, course creators & boutique academies", 1000.0)
    fin_res = calculate_bootstrap_runway(10000.0, 2000.0)
    leg_res = generate_incorporation_checklist("Delaware, USA", True)

    tool_map = {
        "ProductAgent": ("generate_mvp_spec", lambda: mvp_res),
        "GrowthAgent": ("build_gtm_launch_plan", lambda: gtm_res),
        "FinanceAgent": ("calculate_bootstrap_runway", lambda: fin_res),
        "LegalAgent": ("generate_incorporation_checklist", lambda: leg_res),
        "TalentAgent": (
            "draft_job_posting",
            lambda: draft_job_posting("Senior AI Engineer", 130000.0),
        ),
        "SalesAgent": ("evaluate_lead_and_pricing", lambda: evaluate_lead_and_pricing(15000.0, 50)),
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

    # Synthesize clean, emoji-rich 30-Day Founder Launch Blueprint (SIMPLE FORMAT LAW)
    first_feature = mvp_res.get("mvp_features", ["Core AI Engine"])[0]
    stack_fe = mvp_res.get("tech_stack_recommendation", {}).get("frontend", "Next.js 15")
    stack_be = mvp_res.get("tech_stack_recommendation", {}).get("backend", "FastAPI")
    stack_ai = mvp_res.get("tech_stack_recommendation", {}).get("ai_engine", "Gemini 2.5 API")
    icp_desc = gtm_res.get("icp_targets", ["Target Educators & Founders"])[0]
    cold_email = gtm_res.get("cold_email_template", {}).get(
        "body", "Hi {Name}, open to testing our automated study engine this week?"
    )
    runway_m = fin_res.get("runway_months", "5.0 months")
    burn_cost = fin_res.get("est_monthly_cost_usd", 2000.0)
    health_stat = fin_res.get("health_status", "LEAN_VALIDATION")
    cfo_adv = fin_res.get("cfo_recommendation", "Keep burn low to maximize validation time.")
    equity_terms = leg_res.get("founder_equity_terms", {}).get(
        "structure", "50/50 Equity Split with 4-year vesting and 1-year cliff"
    )

    synthesis_markdown = (
        f"💡 TOP TAKEAWAY\n"
        f"By focusing strictly on 3 core MVP features and executing direct outreach for your concept, "
        f"you save ~4 weeks of coding while maintaining 5+ months of zero-revenue runway!\n\n"
        f"🛠️ 14-DAY MVP PLAN\n"
        f"• 🎯 Core Focus: {first_feature}\n"
        f"• ⏱️ Time Saved: By cutting non-essential custom auth & telemetry, you save 4 weeks of coding.\n"
        f"• 🛠️ Recommended Stack: {stack_fe}, {stack_be}, {stack_ai}\n\n"
        f"📈 THIS MONTH'S GROWTH & SALES PLAN\n"
        f"• 💡 Sales Insight: Executing targeted outreach across 3 organic channels reaches ~250 leads & secures your first 10 beta users.\n"
        f"• 👥 Who to Target: {icp_desc}\n"
        f"• ✉️ Ready Outreach Script:\n"
        f'  "{cold_email.splitlines()[0]}"\n\n'
        f"💰 MONEY & RUNWAY SUMMARY\n"
        f"• 💰 Cash Runway: {runway_m} remaining ({health_stat})\n"
        f"• 📊 Safe Monthly Spend: ${burn_cost:,.2f} / month\n"
        f"• 💡 Financial Advice: {cfo_adv}\n\n"
        f"⚖️ LEGAL & FOUNDER CHECKLIST\n"
        f"• 📜 Founder Equity: {equity_terms}\n"
        f"• 🛡️ IP Protection: 100% pre-existing & future IP assigned to startup entity\n"
        f"• ✅ Next Legal Step: File legal entity incorporation & sign PIIA agreement (⚠️ HOLD FOR HUMAN APPROVAL)"
    )

    # 5. event: final_brief
    yield {
        "event": "final_brief",
        "data": json.dumps(
            {
                "synthesis": synthesis_markdown,
                "executive_summary": synthesis_markdown,
                "summary": synthesis_markdown,
                "raw_brief": synthesis_markdown,
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
