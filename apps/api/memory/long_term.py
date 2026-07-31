from typing import Dict, Any, Optional


class LongTermMemory:
    """Long-term Startup Memory store placeholder."""

    async def save(self, key: str, data: Dict[str, Any]) -> bool:
        return True

    async def get(self, key: str) -> Optional[Dict[str, Any]]:
        return None
