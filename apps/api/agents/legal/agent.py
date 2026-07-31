from __future__ import annotations

from apps.api.agents.startup_team.agent import LegalAgent as ADKLegalAgent
from apps.api.agents.startup_team.agent import generate_incorporation_checklist, verify_contract

LegalAgent = ADKLegalAgent

__all__ = ["LegalAgent", "generate_incorporation_checklist", "verify_contract"]
