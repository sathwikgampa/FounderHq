from typing import Dict, Any


class LegalAgentPlaceholder:
    """Legal Agent Google ADK Placeholder."""

    def __init__(self) -> None:
        self.name = "Legal Agent"

    async def review_contract() -> Dict[str, Any]:
        return {"agent": self.name, "status": "PLACEHOLDER"}
