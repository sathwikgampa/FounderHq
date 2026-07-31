from typing import Any


class AgentEvaluatorBenchmarkPlaceholder:
    """Agent Benchmark Evaluator Placeholder."""

    async def evaluate_response(self, prompt: str, response: str) -> dict[str, Any]:
        return {
            "groundedness_score": 1.0,
            "hallucination_detected": False,
            "quality_rating": "PASS",
        }
