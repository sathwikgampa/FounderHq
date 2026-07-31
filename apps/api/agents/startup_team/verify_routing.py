"""
FounderHQ — Dynamic CEO Workflow Routing & Event Contract Verification
"""

import io
import json
import sys
import time
from pathlib import Path
from typing import Any

# Force UTF-8 output on Windows
if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[4]
API_ROOT = ROOT / "apps" / "api"
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(API_ROOT) not in sys.path:
    sys.path.insert(0, str(API_ROOT))

from apps.api.agents.startup_team.agent import analyze_and_route_workflow  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from main import app  # noqa: E402


def verify_routing_logic():
    """Verify task analysis and dependency check in analyze_and_route_workflow."""
    print("\n-----------------------------------------------------------------")
    print("STEP 1: Testing Dynamic CEO Task Router Logic")
    print("-----------------------------------------------------------------")

    prompt = (
        "We want to expand our tech team. Check if we can afford a $130k Senior AI Engineer, "
        "draft the job post, estimate the AWS cloud cost for 20k users, and review the employment contract risks."
    )

    route_res = analyze_and_route_workflow(prompt)
    selected = route_res["selected_agents"]
    wf_type = route_res["workflow_type"]

    print(f"  Input Command: '{prompt[:70]}...'")
    print(f"  Selected Agents: {selected}")
    print(f"  Workflow Type:   {wf_type}")

    assert "FinanceAgent" in selected, "Missing FinanceAgent"
    assert "TalentAgent" in selected, "Missing TalentAgent"
    assert "TechArchitectAgent" in selected, "Missing TechArchitectAgent"
    assert "LegalAgent" in selected, "Missing LegalAgent"

    # Dependency check: FinanceAgent must come before TalentAgent
    fin_idx = selected.index("FinanceAgent")
    tal_idx = selected.index("TalentAgent")
    assert (
        fin_idx < tal_idx
    ), f"Dependency error: FinanceAgent ({fin_idx}) should execute before TalentAgent ({tal_idx})"
    assert wf_type == "SEQUENTIAL", f"Expected SEQUENTIAL workflow, got {wf_type}"

    print("  ✅ STEP 1 PASSED: Dynamic routing & sequential dependency validation successful.")


def verify_sse_event_contract():
    """Verify FastAPI POST /api/v1/planner/stream SSE event stream contract."""
    print("\n-----------------------------------------------------------------")
    print("STEP 2: Testing FastAPI SSE Event Stream Contract")
    print("-----------------------------------------------------------------")

    client = TestClient(app, raise_server_exceptions=False)
    prompt = (
        "We want to expand our tech team. Check if we can afford a $130k Senior AI Engineer, "
        "draft the job post, estimate the AWS cloud cost for 20k users, and review the employment contract risks."
    )

    resp = client.post(
        "/api/v1/planner/stream",
        json={"prompt": prompt, "workspace_id": "ws-verify-routing"},
        headers={"Accept": "text/event-stream"},
        timeout=30,
    )
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

    # Parse SSE events
    events: list[dict[str, Any]] = []
    curr_event = None
    for line in resp.text.splitlines():
        if line.startswith("event:"):
            curr_event = line[len("event:") :].strip()
        elif line.startswith("data:") and curr_event:
            data_str = line[len("data:") :].strip()
            events.append({"event": curr_event, "data": json.loads(data_str)})
            curr_event = None

    event_names = [e["event"] for e in events]
    print(f"  SSE Events Received ({len(events)}): {event_names}")

    # Contract assertions
    assert "routing_decision" in event_names, "Missing 'routing_decision' event!"
    assert "agent_start" in event_names, "Missing 'agent_start' event!"
    assert "tool_executed" in event_names, "Missing 'tool_executed' event!"
    assert "approval_flag" in event_names, "Missing 'approval_flag' event!"
    assert "final_brief" in event_names, "Missing 'final_brief' event!"

    routing_evt = next(e for e in events if e["event"] == "routing_decision")
    print(f"  ✅ Routing Decision Payload: {routing_evt['data']}")

    print("  ✅ STEP 2 PASSED: All 5 SSE contract events emitted cleanly.")


def main():
    print("=================================================================")
    print("  FounderHQ - Dynamic CEO Routing & SSE Verification  ")
    print("=================================================================")
    start = time.time()
    verify_routing_logic()
    verify_sse_event_contract()
    elapsed = round(time.time() - start, 2)
    print("\n=================================================================")
    print(f"✅ ALL ROUTING & SSE CONTRACT CHECKS PASSED  ·  {elapsed}s")
    print("=================================================================\n")


if __name__ == "__main__":
    main()
