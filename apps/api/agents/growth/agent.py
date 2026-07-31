from __future__ import annotations

from apps.api.agents.startup_team.agent import GrowthAgent as ADKGrowthAgent
from apps.api.agents.startup_team.agent import build_gtm_launch_plan, create_campaign_plan

GrowthAgent = ADKGrowthAgent

__all__ = ["GrowthAgent", "build_gtm_launch_plan", "create_campaign_plan"]
