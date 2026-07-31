from typing import Any


class LegalAgentPlaceholder:
    """Legal Agent Google ADK Placeholder."""

    def __init__(self) -> None:
        self.name = "Legal Agent"

    async def review_contract(self) -> dict[str, Any]:
        return {"agent": self.name, "status": "PLACEHOLDER"}
