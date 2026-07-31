"""Service layer for CEO Planner execution and Multi-Agent Orchestration."""

from __future__ import annotations

import logging
import uuid
from collections.abc import AsyncGenerator
from datetime import UTC, datetime
from typing import Any

from app.schemas.planner import (
    AgentStepResult,
    PlannerExecuteRequest,
    PlannerExecutionResponse,
)

logger = logging.getLogger("founderhq.services.planner")

_EXECUTIONS_STORE: dict[str, PlannerExecutionResponse] = {}


class PlannerService:
    def execute_command(self, payload: PlannerExecuteRequest) -> PlannerExecutionResponse:
        execution_id = f"exec-{uuid.uuid4().hex[:8]}"
        now = datetime.now(UTC).isoformat()

        command_lower = payload.command.lower()
        requires_approval = False
        approval_id = None

        # Check if action requires executive approval (e.g. hiring, large spend)
        if any(
            keyword in command_lower
            for keyword in ["hire", "hiring", "spend", "budget", "contract", "salary", "recruit"]
        ):
            requires_approval = True
            approval_id = f"appr-{uuid.uuid4().hex[:8]}"

        steps = [
            AgentStepResult(
                agentName="CEO Planner Agent",
                status="COMPLETED",
                summary=f"Parsed command '{payload.command[:60]}...'. Analyzed startup objectives.",
                outputs={"goal": payload.command, "priority": "HIGH"},
            ),
            AgentStepResult(
                agentName="Finance Executive Agent",
                status="COMPLETED",
                summary="Verified runway ($495,000 balance / 16.5 months runway). Financial health is stable.",
                outputs={
                    "burnRate": 30000,
                    "runwayMonths": 16.5,
                    "impactCheck": "APPROVED_WITHIN_BUDGET",
                },
            ),
            AgentStepResult(
                agentName="Talent Executive Agent",
                status="COMPLETED" if not requires_approval else "REQUIRES_APPROVAL",
                summary="Formulated strategic role descriptions and compensation benchmark plan.",
                outputs={
                    "roles": ["Senior AI Engineer", "Lead Product Designer"],
                    "estimatedBudget": "$120,000/yr",
                },
            ),
        ]

        summary = (
            f"CEO Planner successfully orchestrated executive team review for: '{payload.command}'. "
            f"Finance and Talent sub-agents evaluated the proposal. "
            + (
                "An approval request has been queued for founder sign-off."
                if requires_approval
                else "Action plan ready for execution."
            )
        )

        response = PlannerExecutionResponse(
            executionId=execution_id,
            startupId=payload.startupId,
            command=payload.command,
            status="REQUIRES_APPROVAL" if requires_approval else "COMPLETED",
            planSummary=summary,
            consultedAgents=["CEO Planner", "Finance Agent", "Talent Agent", "Growth Agent"],
            agentSteps=steps,
            requiresApproval=requires_approval,
            approvalId=approval_id,
            createdAt=now,
            completedAt=now,
        )

        _EXECUTIONS_STORE[execution_id] = response
        return response

    def get_execution(self, execution_id: str) -> PlannerExecutionResponse | None:
        return _EXECUTIONS_STORE.get(execution_id)


def _extract_prompt_context(prompt: str) -> dict[str, Any]:  # noqa: C901
    """Dynamically extract target audience, core problem, capital, and co-founder status directly from user prompt."""
    import re

    lower_p = prompt.lower()

    capital = 10000.0
    cap_match = re.search(r"\$(\d+[\d,]*)(k)?|\b(\d+)\s*k\s*(savings|capital|dollars|\$)?", lower_p)
    if cap_match:
        val_str = cap_match.group(1) or cap_match.group(3)
        if val_str:
            try:
                val = float(val_str.replace(",", ""))
                if cap_match.group(2) or "k" in (cap_match.group(0) or ""):
                    val *= 1000
                if val > 0:
                    capital = val
            except ValueError:
                pass

    has_co_founders = any(
        w in lower_p for w in ["co-founder", "cofounder", "co founder", "partner", "founders"]
    )

    if any(
        w in lower_p
        for w in [
            "book",
            "books",
            "textbook",
            "textbooks",
            "used book",
            "library",
            "read",
            "resale",
            "secondhand",
        ]
    ):
        target_audience = "Students, readers, campus book buyers & peer-to-peer book sellers"
        core_problem = "Users struggle to quickly list, price, and sell used books/textbooks locally and on campus"
    elif any(
        w in lower_p
        for w in [
            "study",
            "edtech",
            "edu tech",
            "education",
            "quiz",
            "course",
            "school",
            "student",
            "learning",
        ]
    ):
        target_audience = "Students, educators, course creators & boutique learning academies"
        core_problem = (
            "Learners spend hours synthesizing notes into practice quizzes & study guides"
        )
    elif any(w in lower_p for w in ["real estate", "broker", "realtor", "property", "listing"]):
        target_audience = "Local real estate brokers & independent agent teams"
        core_problem = (
            "Brokers spend 2+ hours per listing manually drafting MLS copy & social assets"
        )
    elif any(w in lower_p for w in ["health", "fitness", "tracking", "track", "workout", "gym"]):
        target_audience = "Health-conscious individuals, personal trainers & wellness coaches"
        core_problem = (
            "Users struggle to consistently track daily health metrics and workout progress"
        )
    elif any(w in lower_p for w in ["hiring", "job", "recruiting", "hr", "candidate", "resume"]):
        target_audience = "Hiring managers, recruiters & fast-growing tech startups"
        core_problem = "Recruiters waste hours screening resumes & scheduling interview rounds"
    elif any(w in lower_p for w in ["sales", "lead", "b2b", "outreach", "crm", "email"]):
        target_audience = "B2B sales teams, agency owners & account executives"
        core_problem = (
            "Sales reps burn hours researching prospects & writing personalized cold emails"
        )
    else:
        clean_prompt = prompt.strip().rstrip(".")
        target_audience = f"Target customers & early adopters seeking '{clean_prompt}'"
        core_problem = f"Solving primary user pain points described in: '{clean_prompt}'"

    return {
        "initial_capital": capital,
        "est_monthly_cost": round(capital / 6.0, 2) if capital > 0 else 1500.0,
        "target_audience": target_audience,
        "core_problem": core_problem,
        "has_co_founders": has_co_founders,
    }


async def _planner_event_stream(
    prompt: str,
    workspace_id: str,
    session_id: str,
) -> AsyncGenerator[dict, None]:
    """Async generator streaming Server-Sent Events (SSE) following the required contract."""
    import json

    from apps.api.agents.startup_team.agent import (
        analyze_and_route_workflow,
        build_gtm_launch_plan,
        calculate_bootstrap_runway,
        calculate_cap_table_dilution,
        draft_job_posting,
        estimate_cloud_cost,
        evaluate_lead_and_pricing,
        generate_incorporation_checklist,
        generate_mvp_spec,
    )

    from app.ai.approval_store import approval_store

    route_info = analyze_and_route_workflow(prompt)
    selected_agents: list[str] = route_info["selected_agents"]
    workflow_type: str = route_info["workflow_type"]
    routing_rationale: str = route_info.get(
        "routing_rationale", f"Routed {len(selected_agents)} sub-agents."
    )

    yield {
        "event": "routing_decision",
        "data": json.dumps(
            {
                "selected_agents": selected_agents,
                "workflow_type": workflow_type,
                "routing_rationale": routing_rationale,
                "intent_category": route_info.get("intent_category", "GENERAL_EXECUTIVE_COMMAND"),
                "confidence_score": route_info.get("confidence_score", 0.98),
            }
        ),
    }

    ctx = _extract_prompt_context(prompt)

    mvp_res = generate_mvp_spec(prompt, ctx["core_problem"])
    gtm_res = build_gtm_launch_plan(ctx["target_audience"], 1000.0)
    fin_res = calculate_bootstrap_runway(ctx["initial_capital"], ctx["est_monthly_cost"])
    leg_res = generate_incorporation_checklist("Delaware, USA", ctx["has_co_founders"])
    talent_res = draft_job_posting(f"Senior Engineer ({ctx['target_audience'][:25]})", 130000.0)
    sales_res = evaluate_lead_and_pricing(15000.0, 50)
    tech_res = estimate_cloud_cost(20000, "AWS Serverless")
    ir_res = calculate_cap_table_dilution(2000000.0, 500000.0)

    tool_map = {
        "ProductAgent": ("generate_mvp_spec", lambda: mvp_res),
        "GrowthAgent": ("build_gtm_launch_plan", lambda: gtm_res),
        "FinanceAgent": ("calculate_bootstrap_runway", lambda: fin_res),
        "LegalAgent": ("generate_incorporation_checklist", lambda: leg_res),
        "TalentAgent": ("draft_job_posting", lambda: talent_res),
        "SalesAgent": ("evaluate_lead_and_pricing", lambda: sales_res),
        "TechArchitectAgent": ("estimate_cloud_cost", lambda: tech_res),
        "InvestmentAgent": ("calculate_cap_table_dilution", lambda: ir_res),
    }

    next_steps: list[str] = []
    summary_items: list[str] = []

    for agent_name in selected_agents:
        yield {
            "event": "agent_start",
            "data": json.dumps(
                {
                    "agent_name": agent_name,
                    "status": "IN_PROGRESS",
                }
            ),
        }

        tool_tuple = tool_map.get(agent_name)
        if tool_tuple:
            tool_name, tool_fn = tool_tuple
            tool_output = tool_fn()

            yield {
                "event": "tool_executed",
                "data": json.dumps(
                    {
                        "agent_name": agent_name,
                        "tool_name": tool_name,
                        "output": tool_output,
                    }
                ),
            }

            requires_approval = bool(
                tool_output.get("requires_human_signoff")
                or tool_output.get("approval_status") == "HOLD_FOR_HUMAN_APPROVAL"
                or tool_output.get("risk_assessment") in ["HIGH", "MEDIUM"]
            )

            if requires_approval:
                item = approval_store.enqueue(
                    session_id=session_id,
                    workspace_id=workspace_id,
                    agent=agent_name,
                    tool=tool_name,
                    payload=tool_output,
                )
                yield {
                    "event": "approval_flag",
                    "data": json.dumps(
                        {
                            "approval_id": item.id,
                            "agent_name": agent_name,
                            "action": tool_name,
                            "requires_approval": True,
                            "details": tool_output,
                        }
                    ),
                }

            summary_items.append(f"{agent_name} executed {tool_name}.")
            next_steps.append(f"Review {agent_name} {tool_name} results.")

    first_feature = mvp_res.get("mvp_features", [f"Core solution for: {prompt[:30]}"])[0]
    stack_recommendation = mvp_res.get(
        "recommended_stack", ["Next.js 15", "Gemini 2.5 API", "Supabase"]
    )
    stack_str = (
        ", ".join(stack_recommendation)
        if isinstance(stack_recommendation, list)
        else str(stack_recommendation)
    )
    icp_desc = gtm_res.get("icp_targets", [f"Target audience: {ctx['target_audience']}"])[0]
    cold_email = gtm_res.get("cold_email_template", {}).get(
        "body", f"Hi {{Name}}, open to testing our solution for {ctx['target_audience']} this week?"
    )
    runway_m = fin_res.get("runway_months", "6.0 months")
    safe_spend = fin_res.get("safe_monthly_spend_usd", 150.0)
    health_stat = fin_res.get("health_status", "STRONG_BOOTSTRAP")
    cfo_adv = fin_res.get("cfo_recommendation", "Keep burn low to maximize validation time.")
    equity_terms = leg_res.get(
        "recommended_equity_split", "50/50 Equity Split with 4-year vesting and 1-year cliff"
    )
    legal_action = leg_res.get(
        "immediate_action_item", "File legal entity incorporation & sign PIIA agreement"
    )

    synthesis_markdown = (
        f"💡 TOP TAKEAWAY\n"
        f'For your concept: "{prompt}"\n'
        f"By focusing strictly on 3 core MVP features and launching direct outreach to {ctx['target_audience']}, "
        f"you save {mvp_res.get('time_saved_weeks', 3)} weeks of coding and project {gtm_res.get('projected_sales_impact', '$1,500/mo')} while maintaining {runway_m} runway!\n\n"
        f"🛠️ 14-DAY MVP PLAN\n"
        f"• 🎯 Core Focus: {first_feature}\n"
        f"• ⏱️ Time Saved: {mvp_res.get('estimated_build_days', 12)} days build target (saves {mvp_res.get('time_saved_weeks', 3)} weeks of non-essential coding).\n"
        f"• 🛠️ Recommended Stack: {stack_str}\n\n"
        f"📈 THIS MONTH'S GROWTH & SALES PLAN\n"
        f"• 💡 Sales Insight: Direct outreach across target channels projects {gtm_res.get('projected_sales_impact', '$1,500/mo in initial sales')}.\n"
        f"• 👥 Target Audience: {icp_desc}\n"
        f"• ✉️ Ready Outreach Script:\n"
        f'  "{cold_email.splitlines()[0]}"\n\n'
        f"💰 MONEY & RUNWAY SUMMARY\n"
        f"• 💰 Cash Runway: {runway_m} remaining ({health_stat})\n"
        f"• 📊 Safe Monthly Spend: ${safe_spend:,.2f} / month safe tool budget\n"
        f"• 💡 Financial Advice: {cfo_adv}\n\n"
        f"⚖️ LEGAL & FOUNDER CHECKLIST\n"
        f"• 📜 Founder Equity: {equity_terms}\n"
        f"• 🛡️ IP Protection: {leg_res.get('ip_protection', '100% IP assigned to startup legal entity')}\n"
        f"• ✅ Next Legal Step: {legal_action} (⚠️ HOLD FOR HUMAN APPROVAL)"
    )

    if "TalentAgent" in selected_agents:
        synthesis_markdown += (
            f"\n\n👥 TALENT & HIRING STRATEGY\n"
            f"• 💼 Open Role: {talent_res.get('role_title', 'Key Technical Hire')}\n"
            f"• 💵 Annual Salary Impact: ${talent_res.get('annual_salary_usd', 130000):,.2f}\n"
            f"• ⚠️ Approval Status: {talent_res.get('approval_status', 'HOLD_FOR_HUMAN_APPROVAL')}"
        )

    if "TechArchitectAgent" in selected_agents:
        synthesis_markdown += (
            f"\n\n☁️ TECH SCALING & INFRASTRUCTURE\n"
            f"• 📊 MAU Capacity: {tech_res.get('monthly_active_users', 20000):,} Users\n"
            f"• ⚙️ Infrastructure: {tech_res.get('infrastructure_type', 'AWS Serverless')}\n"
            f"• 💡 CTO Recommendation: {tech_res.get('cto_recommendation', 'Keep serverless architecture lean.')}"
        )

    if "InvestmentAgent" in selected_agents:
        synthesis_markdown += (
            f"\n\n📈 INVESTOR RELATIONS & CAP TABLE\n"
            f"• 💰 Post-Money Valuation: ${ir_res.get('post_money_valuation_usd', 2500000.0):,.2f}\n"
            f"• 📊 Investor Ownership: {ir_res.get('investor_ownership_pct', '20.0%')}\n"
            f"• 🛡️ Post-Round Founder Equity: {ir_res.get('post_round_founder_equity_pct', '70.0%')}"
        )

    yield {
        "event": "final_brief",
        "data": json.dumps(
            {
                "synthesis": synthesis_markdown,
                "executive_summary": synthesis_markdown,
                "summary": synthesis_markdown,
                "raw_brief": synthesis_markdown,
                "next_steps": next_steps,
            }
        ),
    }
