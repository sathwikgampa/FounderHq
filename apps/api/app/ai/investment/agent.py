from typing import Dict, Any


class InvestmentAgentPlaceholder:
    """Investment Agent Google ADK Placeholder."""

    def __init__(self) -> None:
        self.name = "Investment Agent"

    async def model_cap_table() -> Dict[str, Any]:
        return {"agent": self.name, "status": "PLACEHOLDER"}
