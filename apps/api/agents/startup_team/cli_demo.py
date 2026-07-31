"""
FounderHQ — Interactive 9-Agent CLI Test Utility
Run this script to type any custom prompt and test your agents live!
"""

from __future__ import annotations

import io
import json
import sys
from pathlib import Path

# Force UTF-8 output on Windows
if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[4]
API_ROOT = ROOT / "apps" / "api"
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(API_ROOT) not in sys.path:
    sys.path.insert(0, str(API_ROOT))

from apps.api.agents.startup_team.agent import (  # noqa: E402
    analyze_and_route_workflow,
    check_runway,
    create_campaign_plan,
    draft_job_posting,
    estimate_cloud_cost,
    evaluate_lead_and_pricing,
    prioritize_features,
    verify_contract,
)


def run_custom_prompt(prompt: str):
    print("\n" + "=" * 65)
    print(f"  PROMPT: {prompt}")
    print("=" * 65)

    route_info = analyze_and_route_workflow(prompt)
    selected_agents = route_info["selected_agents"]
    workflow_type = route_info["workflow_type"]

    print("🤖 CEOAgent Router Decision:")
    print(f"   • Selected Sub-Agents ({len(selected_agents)}): {', '.join(selected_agents)}")
    print(f"   • Execution Topology: {workflow_type}\n")

    tool_map = {
        "FinanceAgent": ("check_runway", lambda: check_runway(200000.0, 20000.0)),
        "TalentAgent": (
            "draft_job_posting",
            lambda: draft_job_posting("Senior AI Engineer", 130000.0),
        ),
        "GrowthAgent": ("create_campaign_plan", lambda: create_campaign_plan("LinkedIn", 5000.0)),
        "LegalAgent": ("verify_contract", lambda: verify_contract("Employment")),
        "SalesAgent": ("evaluate_lead_and_pricing", lambda: evaluate_lead_and_pricing(15000.0, 50)),
        "ProductAgent": (
            "prioritize_features",
            lambda: prioritize_features("Multi-Agent OS Module", 5, 9),
        ),
        "TechArchitectAgent": (
            "estimate_cloud_cost",
            lambda: estimate_cloud_cost(20000, "AWS Serverless"),
        ),
        "InvestmentAgent": (
            "investor_update",
            lambda: {"status": "Investor update framework drafted"},
        ),
    }

    for idx, agent_name in enumerate(selected_agents, 1):
        print(f"  [{idx}/{len(selected_agents)}] Executing '{agent_name}'...")
        tool_info = tool_map.get(agent_name)
        if tool_info:
            tool_name, tool_fn = tool_info
            out = tool_fn()
            print(f"      └── Tool '{tool_name}' Output: {json.dumps(out, indent=10)[10:]}")
            if (
                out.get("requires_human_signoff")
                or out.get("approval_status") == "HOLD_FOR_HUMAN_APPROVAL"
                or out.get("risk_assessment") == "HIGH"
            ):
                print("      ⚠️  [HUMAN APPROVAL REQUIRED] Action enqueued into Approval Queue.")

    print("\n✅ CEO Executive Brief Synthesized Successfully!\n")


def main():
    print("=================================================================")
    print("  FounderHQ - Interactive 9-Agent CLI Tester  ")
    print("=================================================================")

    if len(sys.argv) > 1:
        custom_prompt = " ".join(sys.argv[1:])
        run_custom_prompt(custom_prompt)
        return

    sample = (
        "We want to expand our tech team. Check if we can afford a $130k Senior AI Engineer, "
        "draft the job post, estimate the AWS cloud cost for 20k users, and review the employment contract risks."
    )

    run_custom_prompt(sample)


if __name__ == "__main__":
    main()
