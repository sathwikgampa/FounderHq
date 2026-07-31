"""
FounderHQ API — Root Entry Point
----------------------------------
It delegates entirely to app/main.py (the production-grade app factory)
so there is one consistent middleware stack, CORS policy, and router set
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

    # 5. event: final_brief
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


@app.post(
    "/api/v1/planner/stream",
    summary="Stream CEO Planner Agent Execution (SSE)",
    description="Accepts a founder prompt and streams live routing & sub-agent execution events via SSE.",
    tags=["CEO Planner"],
)
async def stream_planner_execution(payload: PlannerStreamRequest):
    session_id = f"{payload.workspace_id}::{uuid.uuid4().hex[:8]}"
    logger.info(
        f"🤖 Workflow routing stream | workspace={payload.workspace_id} | "
        f"session={session_id} | prompt={payload.prompt[:80]}..."
    )

    return EventSourceResponse(
        content=_planner_event_stream(
            prompt=payload.prompt,
            workspace_id=payload.workspace_id,
            session_id=session_id,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "X-Session-ID": session_id,
            "X-Workspace-ID": payload.workspace_id,
        },
    )


@app.get(
    "/api/v1/healthz",
    response_model=HealthResponse,
    summary="Liveness Probe",
    tags=["Health"],
    status_code=status.HTTP_200_OK,
)
async def liveness_check():
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        environment="development",
        timestamp=datetime.now(UTC).isoformat(),
    )


@app.get("/", include_in_schema=False)
async def root_ping():
    return JSONResponse(
        content={
            "name": "FounderHQ Dynamic CEO Workflow Routing API",
            "version": "1.0.0",
            "status": "ONLINE",
            "docs": "/docs",
            "planner_stream": "POST /api/v1/planner/stream",
        }
    )

if __name__ == "__main__":
    import uvicorn
    from app.core.config import settings

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info",
    )
