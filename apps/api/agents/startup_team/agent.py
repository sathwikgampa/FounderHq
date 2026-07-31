"""
FounderHQ - Hierarchical Multi-Agent Architecture
Built with Google ADK (Agent Development Kit) + Featherless AI

Provider: Featherless AI (OpenAI-compatible serverless inference)
Base URL: https://api.featherless.ai/v1

Agents:
    CEOAgent (root_agent)  - Root orchestrator  (Qwen/Qwen3-235B-A22B via Featherless)
    FinanceAgent           - CFO sub-agent       (Qwen/Qwen3-32B via Featherless)
    TalentAgent            - Head of HR          (Qwen/Qwen3-32B via Featherless)
    GrowthAgent            - Head of Marketing   (Qwen/Qwen3-32B via Featherless)
    LegalAgent             - General Counsel     (Qwen/Qwen3-32B via Featherless)
"""

from __future__ import annotations

import asyncio
import math
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm
from google.adk.runners import InMemoryRunner

# Load .env from this directory first, then from FounderHq root
_here = Path(__file__).resolve().parent
load_dotenv(_here / ".env")  # apps/api/agents/startup_team/.env
load_dotenv(dotenv_path=None)  # FounderHq root .env (if exists)

# ──────────────────────────────────────────────────────────────────────────────
# Featherless Provider Configuration
# ──────────────────────────────────────────────────────────────────────────────

_FEATHERLESS_API_KEY = os.environ.get("FEATHERLESS_API_KEY", "")
_FEATHERLESS_BASE_URL = os.environ.get("FEATHERLESS_BASE_URL", "https://api.featherless.ai/v1")

# Model IDs — Qwen3 has native tool-calling support on Featherless
_CEO_MODEL_ID = os.environ.get("CEO_MODEL", "Qwen/Qwen3-235B-A22B")
_SUB_AGENT_MODEL_ID = os.environ.get("SUB_AGENT_MODEL", "Qwen/Qwen3-32B")


def _featherless_model(model_id: str) -> LiteLlm:
    """Create a LiteLlm instance pointing at Featherless AI."""
    return LiteLlm(
        model=f"openai/{model_id}",  # LiteLlm uses openai/ prefix for OpenAI-compat providers
        api_base=_FEATHERLESS_BASE_URL,
        api_key=_FEATHERLESS_API_KEY,
    )


# ==============================================================================
# SECTION 1 – DETERMINISTIC TOOL FUNCTIONS
# ==============================================================================


def check_runway(budget: float, monthly_burn: float) -> dict[str, Any]:
    """Calculate runway in months and assign a financial health score.

    Args:
        budget: Total available cash balance in USD.
        monthly_burn: Current monthly operating burn rate in USD.

    Returns:
        Structured financial runway report including months_of_runway,
        health_score, and actionable CFO recommendation.
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
        "HEALTHY": (
            "Capital runway is strong. Proceed with planned hiring and growth spend. "
            "Continue monthly burn-rate reviews."
        ),
        "ADEQUATE": (
            "Runway is adequate but requires careful monitoring. Defer non-critical "
            "discretionary expenses. Accelerate fundraising pipeline."
        ),
        "CRITICAL_RUNWAY_WARNING": (
            "URGENT: Less than 6 months runway detected. Immediately review and cut "
            "non-essential burn. Launch emergency fundraising bridge round."
        ),
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
        role_title: Title of the open role (e.g., 'Senior AI Engineer').
        salary: Annual base salary in USD.

    Returns:
        Structured job posting with salary breakdown, responsibilities, technical
        requirements, and a mandatory human-approval flag for headcount changes.
    """
    monthly_impact = round(salary / 12, 2)

    return {
        "tool": "draft_job_posting",
        "role_title": role_title,
        "annual_salary_usd": salary,
        "monthly_burn_impact_usd": monthly_impact,
        "job_posting": {
            "headline": f"🚀 Now Hiring: {role_title} @ FounderHQ",
            "summary": (
                f"FounderHQ is seeking a world-class {role_title} to join our executive "
                "engineering team and build the AI Operating System for startup founders."
            ),
            "core_responsibilities": [
                f"Lead end-to-end design and delivery of key systems for the {role_title} domain.",
                "Define and own technical architecture decisions with executive alignment.",
                "Partner with the CEO Planner Agent and executive sub-systems on AI-driven workflows.",
                "Drive code quality, engineering excellence, and mentoring across the team.",
                "Contribute to quarterly OKR planning and cross-departmental strategy execution.",
            ],
            "technical_requirements": [
                "5+ years of hands-on engineering experience in a high-growth startup environment.",
                "Proficiency in Python (FastAPI), TypeScript (Next.js 15), and cloud-native infrastructure.",
                "Experience building and deploying LLM / AI agent systems (Google ADK, LangChain, or similar).",
                "Strong knowledge of Firebase, Firestore, GCP Cloud Run, and CI/CD pipelines.",
                "Excellent communication skills and ability to operate autonomously.",
            ],
        },
        "approval_status": "HOLD_FOR_HUMAN_APPROVAL",
        "requires_human_signoff": True,
        "hr_note": (
            f"New headcount for '{role_title}' adds ${monthly_impact:,.2f}/month to burn rate. "
            "Executive sign-off required before sending offer."
        ),
    }


def create_campaign_plan(channel: str, budget: float) -> dict[str, Any]:
    """Design a GTM marketing campaign plan with projected reach and lead metrics.

    Args:
        channel: Target marketing channel (e.g., 'LinkedIn', 'Google Ads').
        budget: Total campaign budget in USD.

    Returns:
        Structured campaign plan with projected impressions, CPC, estimated leads,
        and approval status based on budget threshold ($5,000).
    """
    cpc = 6.50
    lead_conversion_rate = 0.04

    estimated_clicks = round(budget / cpc)
    estimated_leads = round(estimated_clicks * lead_conversion_rate)
    cost_per_lead = round(budget / estimated_leads, 2) if estimated_leads > 0 else 0
    estimated_impressions = estimated_clicks * 12  # avg 12x click-to-impression ratio

    approval_status = "HOLD_FOR_HUMAN_APPROVAL" if budget >= 5000 else "AUTO_APPROVED"

    return {
        "tool": "create_campaign_plan",
        "channel": channel,
        "budget_usd": budget,
        "projected_metrics": {
            "estimated_impressions": estimated_impressions,
            "estimated_clicks": estimated_clicks,
            "cpc_usd": cpc,
            "lead_conversion_rate": f"{lead_conversion_rate * 100:.0f}%",
            "estimated_leads": estimated_leads,
            "cost_per_lead_usd": cost_per_lead,
        },
        "campaign_strategy": (
            f"Deploy a targeted {channel} campaign at ${budget:,.2f} budget. "
            f"Projected to generate ~{estimated_leads} qualified leads at "
            f"${cost_per_lead:,.2f} CPL via {estimated_impressions:,} total impressions."
        ),
        "approval_status": approval_status,
        "requires_human_signoff": budget >= 5000,
        "marketing_note": (
            "Budget ≥ $5,000: Requires executive approval before campaign launch."
            if budget >= 5000
            else "Budget < $5,000: Auto-approved for immediate launch."
        ),
    }


def verify_contract(contract_type: str) -> dict[str, Any]:
    """Inspect a contract type and assess legal compliance, risk, and required clauses.

    Args:
        contract_type: Type of contract (e.g., 'Employment', 'NDA', 'Vendor', 'Equity/SAFE').

    Returns:
        Legal compliance report with risk assessment, clause verification status,
        and General Counsel recommendations.
    """
    contract_profiles: dict[str, dict[str, Any]] = {
        "employment": {
            "risk_assessment": "MEDIUM",
            "ip_assignment_clause": True,
            "confidentiality_clause": True,
            "additional_clauses": ["Non-Compete (jurisdiction-dependent)", "Arbitration Agreement"],
            "counsel_note": (
                "Employment agreements carry medium legal risk due to IP assignment complexity "
                "and jurisdiction-specific non-compete enforceability. Recommend legal review."
            ),
        },
        "nda": {
            "risk_assessment": "LOW",
            "ip_assignment_clause": False,
            "confidentiality_clause": True,
            "additional_clauses": [
                "Mutual/Unilateral Confidentiality Terms",
                "Exclusion Carve-outs",
            ],
            "counsel_note": (
                "Standard NDAs carry low legal risk if mutual confidentiality and exclusion "
                "carve-outs are clearly defined. Validated for execution."
            ),
        },
        "vendor": {
            "risk_assessment": "MEDIUM",
            "ip_assignment_clause": True,
            "confidentiality_clause": True,
            "additional_clauses": ["SLA & Uptime Commitments", "Liability Cap", "Indemnification"],
            "counsel_note": (
                "Vendor contracts require strict SLA definitions and liability caps. "
                "Review indemnification scope and IP work-for-hire clauses before signing."
            ),
        },
        "equity/safe": {
            "risk_assessment": "HIGH",
            "ip_assignment_clause": False,
            "confidentiality_clause": False,
            "additional_clauses": [
                "Valuation Cap",
                "Discount Rate",
                "Pro-Rata Rights",
                "MFN Clause",
            ],
            "counsel_note": (
                "SAFE / Equity agreements carry HIGH legal and financial risk. "
                "Mandatory review by securities counsel before execution. Cap table impact "
                "must be modeled prior to signing."
            ),
        },
    }

    normalized = contract_type.lower().strip()
    profile = contract_profiles.get(
        normalized,
        {
            "risk_assessment": "MEDIUM",
            "ip_assignment_clause": True,
            "confidentiality_clause": True,
            "additional_clauses": ["Custom review required"],
            "counsel_note": (
                f"Contract type '{contract_type}' is non-standard. "
                "Full legal review by General Counsel is mandatory."
            ),
        },
    )

    return {
        "tool": "verify_contract",
        "contract_type": contract_type,
        "risk_assessment": profile["risk_assessment"],
        "clause_verification": {
            "ip_assignment_clause_present": profile["ip_assignment_clause"],
            "confidentiality_clause_present": profile["confidentiality_clause"],
            "additional_required_clauses": profile["additional_clauses"],
        },
        "compliance_status": (
            "READY_FOR_REVIEW"
            if profile["risk_assessment"] != "HIGH"
            else "BLOCKED_PENDING_COUNSEL"
        ),
        "general_counsel_recommendation": profile["counsel_note"],
    }


# ==============================================================================
# SECTION 2 - SPECIALIZED SUB-AGENTS (Qwen3-32B via Featherless AI)
# ==============================================================================

FinanceAgent = Agent(
    name="FinanceAgent",
    model=_featherless_model(_SUB_AGENT_MODEL_ID),
    description=(
        "CFO Sub-Agent. Evaluates startup capital liquidity, calculates monthly "
        "burn rate, projects runway in months, and assigns a financial health score."
    ),
    instruction=(
        "You are the FinanceAgent — the Chief Financial Officer of FounderHQ.\n\n"
        "Your responsibilities:\n"
        "1. Use the `check_runway` tool to evaluate the startup's available budget against the monthly burn rate.\n"
        "2. Calculate and clearly state the runway in months.\n"
        "3. Assign an appropriate health score: HEALTHY (≥12m), ADEQUATE (6-11m), or CRITICAL_RUNWAY_WARNING (<6m).\n"
        "4. Provide specific, actionable CFO recommendations based on the runway health.\n"
        "5. Flag any budget changes resulting from hiring or campaigns passed down by the CEO.\n\n"
        "Always be precise, data-driven, and provide specific numbers. Never speculate — only report tool output."
    ),
    tools=[check_runway],
)

TalentAgent = Agent(
    name="TalentAgent",
    model=_featherless_model(_SUB_AGENT_MODEL_ID),
    description=(
        "Head of HR Sub-Agent. Drafts structured job postings, calculates monthly "
        "salary burn impact, and flags headcount changes for mandatory human approval."
    ),
    instruction=(
        "You are the TalentAgent — the Head of Human Resources at FounderHQ.\n\n"
        "Your responsibilities:\n"
        "1. Use the `draft_job_posting` tool when a new hire is requested.\n"
        "2. Generate a complete, structured job posting with role summary, core responsibilities, "
        "   and technical requirements.\n"
        "3. Calculate the monthly salary burn impact (annual salary / 12).\n"
        "4. Always flag the posting with 'HOLD_FOR_HUMAN_APPROVAL' and set requires_human_signoff=True.\n"
        "5. Clearly communicate the additional monthly burn this headcount adds to the founder.\n\n"
        "Never approve a job posting or an offer autonomously. Always defer to human executive sign-off."
    ),
    tools=[draft_job_posting],
)

GrowthAgent = Agent(
    name="GrowthAgent",
    model=_featherless_model(_SUB_AGENT_MODEL_ID),
    description=(
        "Head of Marketing & Sales Sub-Agent. Designs GTM campaigns, projects "
        "reach/lead acquisition metrics, and flags high-budget campaigns for human approval."
    ),
    instruction=(
        "You are the GrowthAgent — the Head of Marketing & Sales at FounderHQ.\n\n"
        "Your responsibilities:\n"
        "1. Use the `create_campaign_plan` tool when a marketing or growth campaign is requested.\n"
        "2. Project CPC ($6.50), lead conversion (4%), estimated impressions, and cost per lead.\n"
        "3. If campaign budget ≥ $5,000: set approval_status='HOLD_FOR_HUMAN_APPROVAL'.\n"
        "4. If campaign budget < $5,000: set approval_status='AUTO_APPROVED'.\n"
        "5. Provide a clear, actionable GTM strategy summary.\n\n"
        "Be data-driven. Always surface the projected ROI and lead acquisition metrics."
    ),
    tools=[create_campaign_plan],
)

LegalAgent = Agent(
    name="LegalAgent",
    model=_featherless_model(_SUB_AGENT_MODEL_ID),
    description=(
        "General Counsel Sub-Agent. Inspects contracts for legal compliance, "
        "risk level, IP assignment, and confidentiality clause coverage."
    ),
    instruction=(
        "You are the LegalAgent — the General Counsel of FounderHQ.\n\n"
        "Your responsibilities:\n"
        "1. Use the `verify_contract` tool to inspect any contract or legal document type.\n"
        "2. Assign a risk assessment: LOW (NDA), MEDIUM (Employment/Vendor), HIGH (Equity/SAFE).\n"
        "3. Verify presence of critical clauses: IP assignment and confidentiality.\n"
        "4. Set compliance_status='BLOCKED_PENDING_COUNSEL' for HIGH-risk contracts.\n"
        "5. Always provide a specific General Counsel recommendation.\n\n"
        "Never approve HIGH-risk documents without explicit executive and legal counsel sign-off."
    ),
    tools=[verify_contract],
)


# ==============================================================================
# SECTION 3 - ROOT ORCHESTRATOR AGENT (Qwen3-235B-A22B via Featherless AI)
# ==============================================================================

CEOAgent = Agent(
    name="CEOAgent",
    model=_featherless_model(_CEO_MODEL_ID),
    description=(
        "Root Orchestrator — CEO of FounderHQ. Serves as the sole public AI interface. "
        "Parses founder inputs, delegates sub-tasks across executive sub-agents, and "
        "synthesizes outputs into a structured Executive Brief."
    ),
    instruction=(
        "You are the CEOAgent — the Chief Executive Officer and Root Orchestrator of FounderHQ AI OS.\n\n"
        "═══════════════════════════════════════════\n"
        "ROLE & AUTHORITY\n"
        "═══════════════════════════════════════════\n"
        "You are the single public point of contact for all founder inputs.\n"
        "Founders communicate ONLY with you. You delegate ALL domain-specific analysis\n"
        "to your executive sub-agents, never performing domain logic yourself.\n\n"
        "YOUR EXECUTIVE TEAM:\n"
        "- FinanceAgent (CFO): Financial runway, burn rate, cash health.\n"
        "- TalentAgent (Head of HR): Hiring, job postings, headcount approvals.\n"
        "- GrowthAgent (Head of Marketing & Sales): GTM campaigns, lead projections.\n"
        "- LegalAgent (General Counsel): Contracts, risk assessment, compliance.\n\n"
        "═══════════════════════════════════════════\n"
        "EXECUTION PROTOCOL\n"
        "═══════════════════════════════════════════\n"
        "Step 1: Parse and decompose the founder's input into domain-specific tasks.\n"
        "Step 2: Delegate each task to the appropriate sub-agent.\n"
        "Step 3: Collect all sub-agent findings.\n"
        "Step 4: Synthesize results into a structured Executive Brief.\n\n"
        "═══════════════════════════════════════════\n"
        "OUTPUT FORMAT — EXECUTIVE BRIEF\n"
        "═══════════════════════════════════════════\n"
        "Your final response MUST follow this structure:\n\n"
        "## 📋 EXECUTIVE SUMMARY\n"
        "[2-3 sentence overview of the situation, key risks, and recommended posture]\n\n"
        "## 📊 TOOL EXECUTION RESULTS\n"
        "[Structured findings from each sub-agent tool call]\n\n"
        "## 🚨 HUMAN APPROVAL QUEUE\n"
        "[List ALL items requiring human executive sign-off before action]\n\n"
        "## ✅ OPERATIONAL ACTION PLAN\n"
        "[Prioritized, numbered list of next steps for the founder]\n"
    ),
    sub_agents=[FinanceAgent, TalentAgent, GrowthAgent, LegalAgent],
)

# Module-level alias required for ADK and __init__.py export
root_agent = CEOAgent


# ==============================================================================
# SECTION 4 – LOCAL RUNNER (Synchronous Wrapper for Testing)
# ==============================================================================


class LocalRunner:
    """Synchronous and asynchronous local runner wrapping InMemoryRunner for testing."""

    def __init__(self, agent: Agent | None = None) -> None:
        self.agent = agent or root_agent
        self._runner = InMemoryRunner(agent=self.agent)
        # Allow InMemoryRunner to auto-create sessions on first run_async call
        self._runner.auto_create_session = True

    async def _make_message(self, query: str):
        """Wrap a plain string into an ADK-compatible Content object."""
        from google.genai import types as genai_types

        return genai_types.Content(
            role="user",
            parts=[genai_types.Part(text=query)],
        )

    async def run_async(
        self,
        query: str,
        user_id: str = "founder-user",
        session_id: str = "session-001",
    ) -> list[dict[str, Any]]:
        """Stream events asynchronously and collect agent outputs."""
        message = await self._make_message(query)
        events = []
        async for event in self._runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=message,
        ):
            events.append(event)
        return events

    async def stream_async(
        self,
        query: str,
        user_id: str = "founder-user",
        session_id: str = "session-001",
    ):
        """Async generator yielding SSE-compatible event dicts."""
        message = await self._make_message(query)
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
                        yield {
                            "event": "agent_chunk",
                            "data": text,
                            "author": getattr(event, "author", "CEOAgent"),
                        }
            if getattr(event, "turn_complete", False):
                yield {"event": "complete", "data": "[STREAM_COMPLETE]", "author": "system"}

    def run(
        self,
        query: str,
        user_id: str = "founder-user",
        session_id: str = "session-001",
    ) -> list[dict[str, Any]]:
        """Synchronous blocking run."""
        return asyncio.run(self.run_async(query, user_id=user_id, session_id=session_id))
