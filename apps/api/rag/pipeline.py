from typing import Any


class RAGPipelinePlaceholder:
    """RAG Pipeline controller placeholder."""

    async def execute_retrieval(self, query: str) -> list[dict[str, Any]]:
        return []
