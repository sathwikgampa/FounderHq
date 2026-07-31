from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.schemas.agents import AgentMetadata, AgentsInfoResponse

router = APIRouter(prefix="/agents", tags=["Agent Metadata"])

AGENTS_DATABASE: dict[str, dict[str, Any]] = {
    "ceo_agent": {
        "id": "ceo",
        "title": "CEO Agent (Incubator Lead)",
        "role": "Root Orchestrator & Strategy Synthesizer",
        "model": "gemini-2.5-pro",
        "tool_used": "analyze_and_route_workflow",
        "description": "Serves as your primary AI Co-Founder interface. Parses raw commands, delegates tasks across all departments, and synthesizes outputs into clean execution plans.",
        "key_capabilities": [
            "30-Day Launch Blueprint Generation",
            "Multi-Agent Workflow Delegation",
            "Strategic Alignment",
        ],
        "status": "ACTIVE",
        "default_prompt": "Create a 30-day 0-to-1 incubator launch plan for my B2B AI startup idea.",
    },
    "product_agent": {
        "id": "product",
        "title": "Product Agent (Head of MVP)",
        "role": "MVP Scoping & Technical Architecture",
        "model": "gemini-2.5-flash",
        "tool_used": "generate_mvp_spec",
        "description": "Trims product scope down to essential V1 features so you can ship an MVP in 14 days without wasting development cycles.",
        "key_capabilities": [
            "14-Day MVP Tech Stack Selection",
            "Scope Trimming",
            "Feature Prioritization",
        ],
        "status": "ACTIVE",
        "default_prompt": "Trim feature scope and recommend a 14-day tech stack for our MVP.",
    },
    "growth_agent": {
        "id": "growth",
        "title": "Growth Agent (Head of GTM & Sales)",
        "role": "Customer Acquisition & Outreach",
        "model": "gemini-2.5-flash",
        "tool_used": "build_gtm_launch_plan",
        "description": "Designs pre-launch waitlist campaigns, drafts cold email/LinkedIn outreach templates, and projects initial monthly sales targets.",
        "key_capabilities": [
            "Ideal Customer Profile (ICP) Targeting",
            "Cold Email Generation",
            "Pre-Launch Sales Forecasting",
        ],
        "status": "ACTIVE",
        "default_prompt": "Build a pre-launch GTM campaign with ICP targets and cold email scripts.",
    },
    "finance_agent": {
        "id": "finance",
        "title": "Finance Agent (CFO)",
        "role": "Lean Budgeting & Runway Management",
        "model": "gemini-2.5-flash",
        "tool_used": "calculate_bootstrap_runway",
        "description": "Calculates zero-revenue capital runway, enforces safe monthly software expenditure limits, and protects bootstrap cash flow.",
        "key_capabilities": [
            "Burn Rate & Runway Calculation",
            "Software Tool Budgeting",
            "Cash Safety Warnings",
        ],
        "status": "ACTIVE",
        "default_prompt": "Calculate runway with $250,000 capital and $15,000 monthly burn.",
    },
    "legal_agent": {
        "id": "legal",
        "title": "Legal & HR Agent (General Counsel)",
        "role": "Equity Vesting & Contract Risk Audit",
        "model": "gemini-2.5-flash",
        "tool_used": "generate_incorporation_checklist",
        "description": "Generates standard founder equity vesting terms (4-year / 1-year cliff), NDA templates, IP assignment agreements, and incorporation checklists.",
        "key_capabilities": [
            "Founder Equity Vesting Setup",
            "IP Protection",
            "Human Approval Queue Flagging",
        ],
        "status": "ACTIVE",
        "default_prompt": "Generate incorporation checklist and equity vesting terms for Delaware C-Corp.",
    },
    "talent_agent": {
        "id": "talent",
        "title": "Talent Agent (Head of HR)",
        "role": "Headcount Planning & Job Specifications",
        "model": "gemini-2.5-flash",
        "tool_used": "draft_job_posting",
        "description": "Drafts structured job descriptions for technical hires and evaluates monthly burn impacts prior to human approval.",
        "key_capabilities": [
            "Technical Role Description Drafting",
            "Salary Burn Impact Analysis",
            "Approval Queue Routing",
        ],
        "status": "ACTIVE",
        "default_prompt": "Draft job description and evaluate monthly burn impact for a $140,000 Senior AI Engineer.",
    },
    "sales_agent": {
        "id": "sales",
        "title": "Sales Agent (Head of Sales)",
        "role": "B2B Deal Scoring & Pricing Strategy",
        "model": "gemini-2.5-flash",
        "tool_used": "evaluate_lead_and_pricing",
        "description": "Scores enterprise B2B sales leads, calculates tiered seat volume discounts, and flags high-value deals.",
        "key_capabilities": [
            "Lead Tier Priority Scoring",
            "Volume Discount Modeling",
            "Deal Approval Gatekeeping",
        ],
        "status": "ACTIVE",
        "default_prompt": "Score B2B sales lead for 60 seats at $20,000 contract value.",
    },
    "tech_architect_agent": {
        "id": "tech",
        "title": "Tech Architect Agent (CTO)",
        "role": "Cloud Infrastructure Cost Scaling",
        "model": "gemini-2.5-flash",
        "tool_used": "estimate_cloud_cost",
        "description": "Projects serverless compute, database, and LLM API cost scaling as active user traffic grows.",
        "key_capabilities": [
            "Serverless & Database Cost Estimation",
            "LLM API Usage Forecasting",
            "Infra Scaling Recommendations",
        ],
        "status": "ACTIVE",
        "default_prompt": "Estimate AWS serverless cloud cost for 50,000 monthly active users.",
    },
    "investment_agent": {
        "id": "investment",
        "title": "Investment Agent (Head of IR)",
        "role": "Fundraising Pitch & Cap Table Modeling",
        "model": "gemini-2.5-flash",
        "tool_used": "calculate_cap_table_dilution",
        "description": "Computes pre/post-money round valuation, investor equity percentage, option pool reservation, and founder dilution.",
        "key_capabilities": [
            "Cap Table Dilution Modeling",
            "Monthly Investor Updates",
            "Post-Money Valuation Analysis",
        ],
        "status": "ACTIVE",
        "default_prompt": "Calculate cap table dilution for $500,000 seed investment at $2,000,000 pre-money valuation.",
    },
}

# Alias mappings for route parameter lookups
SLUG_TO_KEY = {
    "ceo": "ceo_agent",
    "ceo_agent": "ceo_agent",
    "product": "product_agent",
    "product_agent": "product_agent",
    "growth": "growth_agent",
    "growth_agent": "growth_agent",
    "finance": "finance_agent",
    "finance_agent": "finance_agent",
    "legal": "legal_agent",
    "legal_agent": "legal_agent",
    "talent": "talent_agent",
    "talent_agent": "talent_agent",
    "sales": "sales_agent",
    "sales_agent": "sales_agent",
    "tech": "tech_architect_agent",
    "tech_architect_agent": "tech_architect_agent",
    "investment": "investment_agent",
    "investment_agent": "investment_agent",
    "investors": "investment_agent",
    "hiring": "talent_agent",
}


@router.get(
    "/info",
    response_model=AgentsInfoResponse,
    summary="Get All Executive Agent Metadata",
    description="Returns detailed metadata, tools, models, and capabilities for all FounderHQ executive agents.",
)
async def get_all_agents_info() -> dict[str, Any]:
    """Return JSON metadata for all 5 specialized core agents and full executive suite."""
    formatted_agents = {k: AgentMetadata(**v) for k, v in AGENTS_DATABASE.items()}
    return {
        "status": "success",
        "total_agents": len(formatted_agents),
        "agents": formatted_agents,
    }


@router.get(
    "/{agent_id}",
    response_model=AgentMetadata,
    summary="Get Specific Agent Metadata by ID or Slug",
    description="Fetch single agent metadata by slug (e.g. 'finance', 'product', 'ceo').",
)
async def get_agent_by_id(agent_id: str) -> AgentMetadata:
    """Fetch single agent metadata by slug identifier."""
    slug = agent_id.lower().strip()
    key = SLUG_TO_KEY.get(slug)
    if not key or key not in AGENTS_DATABASE:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{agent_id}' not found. Valid slugs: {list(SLUG_TO_KEY.keys())}",
        )
    return AgentMetadata(**AGENTS_DATABASE[key])
