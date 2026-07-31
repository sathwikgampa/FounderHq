from typing import Dict, Any, List


class StartupMemoryManagerPlaceholder:
    """Startup Memory Manager Placeholder."""

    def __init__(self) -> None:
        self.active_context: List[Dict[str, Any]] = []

    async def store_decision(self, decision: Dict[str, Any]) -> bool:
        return True
