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
    build_gtm_launch_plan,
    calculate_bootstrap_runway,
    check_runway,
    create_campaign_plan,
    draft_job_posting,
    estimate_cloud_cost,
    evaluate_lead_and_pricing,
    generate_incorporation_checklist,
    generate_mvp_spec,
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
    # Incubator & Operational Tool functions
    "generate_mvp_spec",
    "build_gtm_launch_plan",
    "calculate_bootstrap_runway",
    "generate_incorporation_checklist",
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
