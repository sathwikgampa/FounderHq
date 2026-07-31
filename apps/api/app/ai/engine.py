import json
import logging
import os
import sys
import time
from collections.abc import AsyncGenerator
from typing import Any

from app.ai.approval_store import approval_store

# Ensure project root is on sys.path
_project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

logger = logging.getLogger("founderhq.ai.engine")


class AgentEngine:
    """Production wrapper for Google ADK LocalRunner with structured SSE event streaming."""

    def __init__(self) -> None:
        from apps.api.agents.startup_team.agent import LocalRunner

        self.runner = LocalRunner()
        logger.info("🤖 AgentEngine initialized with CEOAgent and sub-agents.")

    def _parse_tool_response(self, func_response: Any) -> tuple[str, dict[str, Any]]:
        """Extract tool name and response payload dict from a function response."""
        tool_name = getattr(func_response, "name", "unknown_tool")
        response_dict = getattr(func_response, "response", {})
        if isinstance(response_dict, str):
            try:
                response_dict = json.loads(response_dict)
            except Exception:
                response_dict = {"raw_output": response_dict}
        return tool_name, response_dict

    def _should_require_approval(self, response_dict: dict[str, Any]) -> bool:
        """Check if tool response payload indicates human signoff is required."""
        if not isinstance(response_dict, dict):
            return False
        return bool(
            response_dict.get("requires_human_signoff", False)
            or response_dict.get("approval_status") == "HOLD_FOR_HUMAN_APPROVAL"
        )

    async def stream_execution(  # noqa: C901
        self,
        prompt: str,
        workspace_id: str,
        session_id: str,
    ) -> AsyncGenerator[dict[str, Any], None]:
        """Yield structured SSE events for real-time dashboard interaction."""
        yield {
            "event": "session_start",
            "data": json.dumps(
                {
                    "session_id": session_id,
                    "workspace_id": workspace_id,
                    "agent": "CEOAgent",
                    "status": "EXECUTION_STARTED",
                    "timestamp": time.time(),
                }
            ),
        }

        seen_agents: set[str] = set()

        try:
            from google.genai import types as genai_types

            self.runner._runner.auto_create_session = True
            message = genai_types.Content(
                role="user",
                parts=[genai_types.Part(text=prompt)],
            )

            seen_agents.add("CEOAgent")
            yield {
                "event": "agent_started",
                "data": json.dumps(
                    {
                        "agent": "CEOAgent",
                        "role": "Root Orchestrator",
                        "timestamp": time.time(),
                    }
                ),
            }

            accumulated_brief: list[str] = []

            async for event in self.runner._runner.run_async(
                user_id=workspace_id,
                session_id=session_id,
                new_message=message,
            ):
                author = getattr(event, "author", "CEOAgent") or "CEOAgent"

                if author not in seen_agents:
                    seen_agents.add(author)
                    yield {
                        "event": "agent_started",
                        "data": json.dumps({"agent": author, "timestamp": time.time()}),
                    }

                content = event.content
                if content and content.parts:
                    for part in content.parts:
                        text = getattr(part, "text", None)
                        if text and text.strip():
                            accumulated_brief.append(text)

                        func_resp = getattr(part, "function_response", None)
                        if func_resp:
                            tool_name, resp_dict = self._parse_tool_response(func_resp)
                            yield {
                                "event": "tool_executed",
                                "data": json.dumps(
                                    {
                                        "agent": author,
                                        "tool": tool_name,
                                        "result": resp_dict,
                                        "timestamp": time.time(),
                                    }
                                ),
                            }

                            if self._should_require_approval(resp_dict):
                                item = approval_store.enqueue(
                                    session_id=session_id,
                                    workspace_id=workspace_id,
                                    agent=author,
                                    tool=tool_name,
                                    payload=resp_dict,
                                )
                                yield {
                                    "event": "approval_required",
                                    "data": json.dumps(
                                        {
                                            "approval_id": item.id,
                                            "session_id": session_id,
                                            "workspace_id": workspace_id,
                                            "agent": author,
                                            "tool": tool_name,
                                            "payload": resp_dict,
                                            "timestamp": time.time(),
                                        }
                                    ),
                                }

                if getattr(event, "turn_complete", False):
                    full_brief = "".join(accumulated_brief).strip()
                    yield {
                        "event": "final_brief",
                        "data": json.dumps(
                            {
                                "status": "COMPLETED",
                                "session_id": session_id,
                                "workspace_id": workspace_id,
                                "executive_summary": full_brief
                                or "Execution completed successfully.",
                                "timestamp": time.time(),
                            }
                        ),
                    }
                    return

        except Exception as exc:
            logger.error(f"Agent engine execution error: {exc}", exc_info=True)
            yield {
                "event": "error",
                "data": json.dumps(
                    {
                        "error": str(exc),
                        "session_id": session_id,
                        "timestamp": time.time(),
                    }
                ),
            }


_engine_instance: AgentEngine | None = None


def get_engine() -> AgentEngine:
    """Singleton getter for AgentEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = AgentEngine()
    return _engine_instance
