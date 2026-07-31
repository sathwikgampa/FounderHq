from typing import Any


class StartupMemoryManagerPlaceholder:
    """Startup Memory Manager Placeholder."""

    def __init__(self) -> None:
        self.active_context: list[dict[str, Any]] = []

    async def store_decision(self, decision: dict[str, Any]) -> bool:
        return True
