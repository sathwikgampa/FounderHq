from __future__ import annotations

from apps.api.agents.startup_team.agent import TalentAgent as ADKTalentAgent
from apps.api.agents.startup_team.agent import draft_job_posting

TalentAgent = ADKTalentAgent

__all__ = ["TalentAgent", "draft_job_posting"]
