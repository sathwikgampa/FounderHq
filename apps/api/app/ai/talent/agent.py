from typing import Any


class TalentAgentPlaceholder:
    """Talent Agent Google ADK Placeholder."""

    def __init__(self) -> None:
        self.name = "Talent Agent"

    async def generate_jd(self) -> dict[str, Any]:
        return {"agent": self.name, "status": "PLACEHOLDER"}
