from typing import List, Dict, Any


class ShortTermMemory:
    """Short-term active conversation context placeholder."""

    def __init__(self) -> None:
        self.buffer: List[Dict[str, Any]] = []
