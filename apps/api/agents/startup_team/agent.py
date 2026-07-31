"""
FounderHQ - Production-Grade 9-Agent AI Startup OS Architecture
Built with Google ADK (Agent Development Kit)

Agents:
    CEOAgent (root_agent)   - Root Orchestrator          (gemini-2.5-pro)
    FinanceAgent            - CFO Sub-Agent              (gemini-2.5-flash)
    TalentAgent             - Head of HR Sub-Agent       (gemini-2.5-flash)
    GrowthAgent             - Head of Marketing Sub-Agent(gemini-2.5-flash)
    LegalAgent              - General Counsel Sub-Agent  (gemini-2.5-flash)
    SalesAgent              - Head of Sales Sub-Agent    (gemini-2.5-flash)
    ProductAgent            - Head of Product Sub-Agent  (gemini-2.5-flash)
    TechArchitectAgent      - CTO Sub-Agent              (gemini-2.5-flash)
    InvestmentAgent         - Head of IR Sub-Agent       (gemini-2.5-flash)
"""

from __future__ import annotations

import math
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm
from google.adk.runners import InMemoryRunner

# Load .env configuration
_here = Path(__file__).resolve().parent
load_dotenv(_here / ".env")
load_dotenv(dotenv_path=None)

_FEATHERLESS_API_KEY = os.environ.get("FEATHERLESS_API_KEY", "")
_FEATHERLESS_BASE_URL = os.environ.get("FEATHERLESS_BASE_URL", "https://api.featherless.ai/v1")

_CEO_MODEL_ID = os.environ.get("CEO_MODEL", "gemini-2.5-pro")
_SUB_AGENT_MODEL_ID = os.environ.get("SUB_AGENT_MODEL", "gemini-2.5-flash")


def _resolve_model(model_id: str) -> Any:
    """Resolve model string or LiteLlm wrapper based on provider settings."""
    if _FEATHERLESS_API_KEY and "Qwen" in model_id:
        return LiteLlm(
            model=f"openai/{model_id}",
            api_base=_FEATHERLESS_BASE_URL,
            api_key=_FEATHERLESS_API_KEY,
        )
    return model_id


def analyze_and_route_workflow(prompt: str) -> dict[str, Any]:  # noqa: C901
    """Analyze founder command to determine dynamic multi-agent execution topology and dependency order."""
    lower_p = prompt.lower()
    selected_agents: list[str] = []

    # Map prompt intents to sub-agents
    if any(k in lower_p for k in ["runway", "balance", "burn", "afford", "finance", "budget"]):
        selected_agents.append("FinanceAgent")

    if any(
        k in lower_p
        for k in [
            "hire",
            "hiring",
            "salary",
            "job",
            "role",
            "developer",
            "engineer",
            "team",
            "post",
        ]
    ):
        selected_agents.append("TalentAgent")

    if any(k in lower_p for k in ["campaign", "growth", "marketing", "ads", "linkedin"]):
        selected_agents.append("GrowthAgent")

    if any(k in lower_p for k in ["contract", "legal", "nda", "safe", "equity", "employment"]):
        selected_agents.append("LegalAgent")

    if any(k in lower_p for k in ["sales", "deal", "seat", "enterprise", "pricing"]):
        selected_agents.append("SalesAgent")

    if any(k in lower_p for k in ["feature", "prd", "rice", "prioritize", "product"]):
        selected_agents.append("ProductAgent")

    if any(k in lower_p for k in ["cloud", "aws", "infrastructure", "mau", "users", "cto", "tech"]):
        selected_agents.append("TechArchitectAgent")

    if any(k in lower_p for k in ["investor", "pitch", "cap table", "deck", "fundraising"]):
        selected_agents.append("InvestmentAgent")

    if not selected_agents:
        selected_agents = ["FinanceAgent", "TalentAgent"]

    # Deduplicate while preserving order
    seen = set()
    deduped = []
    for a in selected_agents:
        if a not in seen:
            seen.add(a)
            deduped.append(a)
    selected_agents = deduped

    # Dependency Analysis:
    # 1) If Finance & Talent are both present, Finance MUST execute first to validate runway
    has_finance = "FinanceAgent" in selected_agents
    has_talent = "TalentAgent" in selected_agents

    if has_finance and has_talent:
        if selected_agents.index("FinanceAgent") > selected_agents.index("TalentAgent"):
            selected_agents.remove("FinanceAgent")
            selected_agents.insert(0, "FinanceAgent")
        workflow_type = "SEQUENTIAL"
    elif len(selected_agents) > 1:
        workflow_type = (
            "SEQUENTIAL"
            if any(k in lower_p for k in ["then", "after", "first", "before"])
            else "PARALLEL"
        )
    else:
        workflow_type = "PARALLEL"

    return {
        "selected_agents": selected_agents,
        "workflow_type": workflow_type,
        "step_count": len(selected_agents),
    }


# ==============================================================================
# SECTION 1 – DETERMINISTIC TOOL FUNCTIONS (7 TOOLS)
# ==============================================================================


def check_runway(budget: float, monthly_burn: float) -> dict[str, Any]:
    """Calculate runway in months and assign a financial health score.

    Args:
        budget: Total available cash balance in USD.
        monthly_burn: Current monthly operating burn rate in USD.
    """
    if monthly_burn <= 0:
        runway_months = math.inf
        health_score = "HEALTHY"
    else:
        runway_months = round(budget / monthly_burn, 2)
        if runway_months >= 12:
            health_score = "HEALTHY"
        elif runway_months >= 6:
            health_score = "ADEQUATE"
        else:
            health_score = "CRITICAL_RUNWAY_WARNING"

    display_runway = "∞" if runway_months == math.inf else f"{runway_months} months"

    recommendation = {
        "HEALTHY": "Capital runway is strong. Proceed with planned hiring and growth spend.",
        "ADEQUATE": "Runway is adequate but requires monitoring. Defer non-critical discretionary expenses.",
        "CRITICAL_RUNWAY_WARNING": "URGENT: Less than 6 months runway detected. Review non-essential burn immediately.",
    }[health_score]

    return {
        "tool": "check_runway",
        "budget_usd": budget,
        "monthly_burn_usd": monthly_burn,
        "months_of_runway": display_runway,
        "health_score": health_score,
        "cfo_recommendation": recommendation,
    }


def draft_job_posting(role_title: str, salary: float) -> dict[str, Any]:
    """Draft a structured job posting and compute monthly salary burn impact.

    Args:
        role_title: Title of open role (e.g. 'Senior Developer').
        salary: Annual base salary in USD.
    """
    monthly_impact = round(salary / 12, 2)
    return {
        "tool": "draft_job_posting",
        "role_title": role_title,
        "annual_salary_usd": salary,
        "monthly_burn_impact_usd": monthly_impact,
        "approval_status": "HOLD_FOR_HUMAN_APPROVAL",
        "requires_human_signoff": True,
        "hr_note": f"New headcount for '{role_title}' adds ${monthly_impact:,.2f}/month to burn rate.",
    }


def create_campaign_plan(channel: str, budget: float) -> dict[str, Any]:
    """Design a GTM marketing campaign plan with projected reach and lead metrics.

    Args:
        channel: Target marketing channel (e.g. 'LinkedIn', 'Google Ads').
        budget: Total campaign budget in USD.
    """
    cpc = 6.50
    lead_conversion_rate = 0.04
    estimated_clicks = round(budget / cpc)
    estimated_leads = round(estimated_clicks * lead_conversion_rate)
    cost_per_lead = round(budget / estimated_leads, 2) if estimated_leads > 0 else 0
    approval_status = "HOLD_FOR_HUMAN_APPROVAL" if budget >= 5000 else "AUTO_APPROVED"

    return {
        "tool": "create_campaign_plan",
        "channel": channel,
        "budget_usd": budget,
        "projected_metrics": {
            "estimated_clicks": estimated_clicks,
            "estimated_leads": estimated_leads,
            "cpc_usd": cpc,
            "cost_per_lead_usd": cost_per_lead,
        },
        "approval_status": approval_status,
        "requires_human_signoff": budget >= 5000,
    }


def verify_contract(contract_type: str) -> dict[str, Any]:
    """Inspect a contract type and assess legal compliance, risk level, and required clauses.

    Args:
        contract_type: Type of contract (Employment, Vendor, NDA, Equity/SAFE).
    """
    normalized = contract_type.lower().strip()
    risk = "MEDIUM"
    if "nda" in normalized:
        risk = "LOW"
    elif "equity" in normalized or "safe" in normalized:
        risk = "HIGH"
    elif "employment" in normalized or "vendor" in normalized:
        risk = "MEDIUM"

    return {
        "tool": "verify_contract",
        "contract_type": contract_type,
        "risk_assessment": risk,
        "compliance_status": "READY_FOR_REVIEW" if risk != "HIGH" else "BLOCKED_PENDING_COUNSEL",
    }


def evaluate_lead_and_pricing(deal_size: float, seat_count: int) -> dict[str, Any]:
    """Score B2B lead priority and calculate tiered seat discounts.

    Args:
        deal_size: Proposed annual deal size in USD.
        seat_count: Total seat licenses requested.
    """
    priority = "Tier 1 Lead" if (deal_size >= 10000 or seat_count >= 50) else "Standard Lead"
    discount_pct = 0.15 if seat_count >= 50 else (0.10 if seat_count >= 20 else 0.0)
    effective_contract_value = round(deal_size * (1 - discount_pct), 2)
    approval_status = "HOLD_FOR_HUMAN_APPROVAL" if deal_size >= 10000 else "AUTO_APPROVED"

    return {
        "tool": "evaluate_lead_and_pricing",
        "deal_size_usd": deal_size,
        "seat_count": seat_count,
        "lead_priority": priority,
        "seat_discount_applied": f"{int(discount_pct * 100)}%",
        "effective_contract_value_usd": effective_contract_value,
        "approval_status": approval_status,
        "requires_human_signoff": deal_size >= 10000,
    }


def prioritize_features(
    feature_name: str, dev_effort_days: int, impact_score: int
) -> dict[str, Any]:
    """Calculate RICE score impact and generate user story templates for developers.

    Args:
        feature_name: Name of requested feature.
        dev_effort_days: Estimated engineering effort in days.
        impact_score: Estimated business impact score (1-10).
    """
    effort = max(dev_effort_days, 1)
    rice_score = round((impact_score * 100) / effort, 2)
    priority_tier = (
        "P0 (Critical)"
        if rice_score >= 50
        else ("P1 (High)" if rice_score >= 20 else "P2 (Medium)")
    )

    return {
        "tool": "prioritize_features",
        "feature_name": feature_name,
        "dev_effort_days": dev_effort_days,
        "impact_score": impact_score,
        "rice_score": rice_score,
        "priority_tier": priority_tier,
        "user_story": f"As a founder, I want {feature_name} so that our team can operate efficiently.",
    }


def estimate_cloud_cost(monthly_active_users: int, infrastructure_type: str) -> dict[str, Any]:
    """Project serverless, database, and LLM API cost tiers as developer traffic scales.

    Args:
        monthly_active_users: Projected MAU.
        infrastructure_type: Architecture type (e.g. 'Serverless', 'Kubernetes').
    """
    base_compute = round(monthly_active_users * 0.002, 2)
    database_cost = round(50.0 + (monthly_active_users * 0.001), 2)
    llm_api_cost = round(monthly_active_users * 0.005, 2)
    total_monthly_est = round(base_compute + database_cost + llm_api_cost, 2)

    return {
        "tool": "estimate_cloud_cost",
        "monthly_active_users": monthly_active_users,
        "infrastructure_type": infrastructure_type,
        "cost_breakdown_usd": {
            "serverless_compute": base_compute,
            "database_cluster": database_cost,
            "llm_api_tokens": llm_api_cost,
            "total_monthly_estimate": total_monthly_est,
        },
        "cto_recommendation": f"For {monthly_active_users:,} MAU on {infrastructure_type}, budget ${total_monthly_est:,.2f}/mo.",
    }


# ==============================================================================
# SECTION 2 – 8 SPECIALIZED SUB-AGENTS (Model: gemini-2.5-flash)
# ==============================================================================

FinanceAgent = Agent(
    name="FinanceAgent",
    model=_resolve_model(_SUB_AGENT_MODEL_ID),
    description="CFO Sub-Agent. Evaluates capital runway, monthly burn rate, and financial health.",
    instruction=(
        "You are FinanceAgent — CFO of FounderHQ.\n"
        "Use the `check_runway` tool to analyze budget and monthly burn rate. "
        "Report runway months, health score, and CFO recommendations."
    ),
    tools=[check_runway],
)

TalentAgent = Agent(
    name="TalentAgent",
    model=_resolve_model(_SUB_AGENT_MODEL_ID),
    description="Head of HR Sub-Agent. Drafts job postings and calculates salary burn impacts.",
    instruction=(
        "You are TalentAgent — Head of HR at FounderHQ.\n"
        "Use the `draft_job_posting` tool for headcount requests. "
        "Always flag job postings with 'HOLD_FOR_HUMAN_APPROVAL' and report monthly burn impact."
    ),
    tools=[draft_job_posting],
)

GrowthAgent = Agent(
    name="GrowthAgent",
    model=_resolve_model(_SUB_AGENT_MODEL_ID),
    description="Head of Marketing Sub-Agent. Designs GTM campaigns and lead target projections.",
    instruction=(
        "You are GrowthAgent — Head of Marketing at FounderHQ.\n"
        "Use the `create_campaign_plan` tool to project impressions, CPC, and CPL. "
        "Flag campaigns >= $5,000 for human approval."
    ),
    tools=[create_campaign_plan],
)

LegalAgent = Agent(
    name="LegalAgent",
    model=_resolve_model(_SUB_AGENT_MODEL_ID),
    description="General Counsel Sub-Agent. Audits contract risks and compliance.",
    instruction=(
        "You are LegalAgent — General Counsel at FounderHQ.\n"
        "Use the `verify_contract` tool to inspect contracts and assess legal risk tiers (LOW, MEDIUM, HIGH)."
    ),
    tools=[verify_contract],
)

SalesAgent = Agent(
    name="SalesAgent",
    model=_resolve_model(_SUB_AGENT_MODEL_ID),
    description="Head of Sales Sub-Agent. Scores B2B leads, pipeline tracking, and pricing approvals.",
    instruction=(
        "You are SalesAgent — Head of Sales at FounderHQ.\n"
        "Use the `evaluate_lead_and_pricing` tool for B2B deal scoring and discount calculations. "
        "Flag enterprise deals >= $10,000 for human approval."
    ),
    tools=[evaluate_lead_and_pricing],
)

ProductAgent = Agent(
    name="ProductAgent",
    model=_resolve_model(_SUB_AGENT_MODEL_ID),
    description="Head of Product Sub-Agent. Prioritizes roadmap features into developer PRD specs.",
    instruction=(
        "You are ProductAgent — Head of Product at FounderHQ.\n"
        "Use the `prioritize_features` tool to calculate RICE scores and prioritize backlog features."
    ),
    tools=[prioritize_features],
)

TechArchitectAgent = Agent(
    name="TechArchitectAgent",
    model=_resolve_model(_SUB_AGENT_MODEL_ID),
    description="CTO Sub-Agent. Projects cloud infrastructure costs and scaling recommendations.",
    instruction=(
        "You are TechArchitectAgent — CTO of FounderHQ.\n"
        "Use the `estimate_cloud_cost` tool to project compute, DB, and LLM API cost scaling for active user traffic."
    ),
    tools=[estimate_cloud_cost],
)

InvestmentAgent = Agent(
    name="InvestmentAgent",
    model=_resolve_model(_SUB_AGENT_MODEL_ID),
    description="Head of Investor Relations Sub-Agent. Drafts pitch deck frameworks and cap table summaries.",
    instruction=(
        "You are InvestmentAgent — Head of Investor Relations at FounderHQ.\n"
        "Formulate investor update emails, cap table summaries, and fundraising pitch deck frameworks."
    ),
    tools=[],
)


# ==============================================================================
# SECTION 3 – ROOT ORCHESTRATOR AGENT (Model: gemini-2.5-pro)
# ==============================================================================

CEOAgent = Agent(
    name="CEOAgent",
    model=_resolve_model(_CEO_MODEL_ID),
    description="Root Orchestrator & CEO of FounderHQ. Single point of contact for executive requests.",
    instruction=(
        "You are CEOAgent — CEO and Root Orchestrator of FounderHQ AI Startup OS.\n\n"
        "Your responsibilities:\n"
        "1. Receive the founder's prompt and delegate domain sub-tasks to your specialized sub-agents:\n"
        "   - FinanceAgent (CFO)\n"
        "   - TalentAgent (Head of HR)\n"
        "   - GrowthAgent (Head of Marketing)\n"
        "   - LegalAgent (General Counsel)\n"
        "   - SalesAgent (Head of Sales)\n"
        "   - ProductAgent (Head of Product)\n"
        "   - TechArchitectAgent (CTO)\n"
        "   - InvestmentAgent (Head of Investor Relations)\n"
        "2. Synthesize all departmental results into a structured Executive Summary with 4 sections:\n"
        "   - Executive Brief\n"
        "   - Departmental Breakthroughs\n"
        "   - Human Approval Queue Warnings\n"
        "   - Operational Action Plan\n"
    ),
    sub_agents=[
        FinanceAgent,
        TalentAgent,
        GrowthAgent,
        LegalAgent,
        SalesAgent,
        ProductAgent,
        TechArchitectAgent,
        InvestmentAgent,
    ],
)

# Standard ADK root_agent reference
root_agent = CEOAgent


# ==============================================================================
# SECTION 4 – ADK LOCAL RUNNER
# ==============================================================================


class LocalRunner:
    """Production runner wrapping Google ADK InMemoryRunner."""

    def __init__(self) -> None:
        self._runner = InMemoryRunner(agent=root_agent)

    async def run_prompt_async(
        self, prompt: str, user_id: str = "ws-default", session_id: str = "sess-default"
    ) -> str:
        """Run a single prompt asynchronously through the root CEOAgent."""
        from google.genai import types as genai_types

        self._runner.auto_create_session = True
        message = genai_types.Content(
            role="user",
            parts=[genai_types.Part(text=prompt)],
        )

        outputs: list[str] = []
        async for event in self._runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=message,
        ):
            content = event.content
            if content and content.parts:
                for part in content.parts:
                    text = getattr(part, "text", None)
                    if text:
                        outputs.append(text)

        return "".join(outputs)
