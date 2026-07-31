from typing import Any


class ShortTermMemory:
    """Short-term active conversation context placeholder."""

    def __init__(self) -> None:
        self.buffer: list[dict[str, Any]] = []
