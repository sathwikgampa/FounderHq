from typing import Any


class GrowthAgentPlaceholder:
    """Growth Agent Google ADK Placeholder."""

    def __init__(self) -> None:
        self.name = "Growth Agent"

    async def generate_gtm_strategy(self) -> dict[str, Any]:
        return {"agent": self.name, "status": "PLACEHOLDER"}
