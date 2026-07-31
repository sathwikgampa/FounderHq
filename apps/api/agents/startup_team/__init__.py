"""FounderHQ Startup Team Multi-Agent System — Public Package Interface."""

from apps.api.agents.startup_team.agent import (
    CEOAgent,
    FinanceAgent,
    GrowthAgent,
    InvestmentAgent,
    LegalAgent,
    LocalRunner,
    ProductAgent,
    SalesAgent,
    TalentAgent,
    TechArchitectAgent,
    analyze_and_route_workflow,
    check_runway,
    create_campaign_plan,
    draft_job_posting,
    estimate_cloud_cost,
    evaluate_lead_and_pricing,
    prioritize_features,
    root_agent,
    verify_contract,
)

__all__ = [
    # Root agent (ADK standard alias)
    "root_agent",
    "analyze_and_route_workflow",
    # Named agent instances
    "CEOAgent",
    "FinanceAgent",
    "TalentAgent",
    "GrowthAgent",
    "LegalAgent",
    "SalesAgent",
    "ProductAgent",
    "TechArchitectAgent",
    "InvestmentAgent",
    # Tool functions
    "check_runway",
    "draft_job_posting",
    "create_campaign_plan",
    "verify_contract",
    "evaluate_lead_and_pricing",
    "prioritize_features",
    "estimate_cloud_cost",
    # Runner
    "LocalRunner",
]
