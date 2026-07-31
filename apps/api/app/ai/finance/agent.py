from typing import Any


class FinanceAgentPlaceholder:
    """Finance Agent Google ADK Placeholder."""

    def __init__(self) -> None:
        self.name = "Finance Agent"

    async def analyze_runway(self) -> dict[str, Any]:
        return {"agent": self.name, "status": "PLACEHOLDER"}
