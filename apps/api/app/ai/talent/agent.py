from typing import Dict, Any


class TalentAgentPlaceholder:
    """Talent Agent Google ADK Placeholder."""

    def __init__(self) -> None:
        self.name = "Talent Agent"

    async def generate_jd() -> Dict[str, Any]:
        return {"agent": self.name, "status": "PLACEHOLDER"}
