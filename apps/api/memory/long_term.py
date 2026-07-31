from typing import Any


class LongTermMemory:
    """Long-term Startup Memory store placeholder."""

    async def save(self, key: str, data: dict[str, Any]) -> bool:
        return True

    async def get(self, key: str) -> dict[str, Any] | None:
        return None
