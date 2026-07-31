"""FounderHQ Startup Team Multi-Agent System — Public Package Interface."""

from apps.api.agents.startup_team.agent import (
    CEOAgent,
    FinanceAgent,
    GrowthAgent,
    LegalAgent,
    LocalRunner,
    TalentAgent,
    check_runway,
    create_campaign_plan,
    draft_job_posting,
    root_agent,
    verify_contract,
)

__all__ = [
    # Root agent (ADK standard alias)
    "root_agent",
    # Named agent instances
    "CEOAgent",
    "FinanceAgent",
    "TalentAgent",
    "GrowthAgent",
    "LegalAgent",
    # Tool functions
    "check_runway",
    "draft_job_posting",
    "create_campaign_plan",
    "verify_contract",
    # Runner
    "LocalRunner",
]
