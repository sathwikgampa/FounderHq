from __future__ import annotations

from apps.api.agents.startup_team.agent import InvestmentAgent as ADKInvestmentAgent
from apps.api.agents.startup_team.agent import (
    calculate_cap_table_dilution,
    generate_investor_update,
)

InvestmentAgent = ADKInvestmentAgent

__all__ = ["InvestmentAgent", "calculate_cap_table_dilution", "generate_investor_update"]
