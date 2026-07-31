"""
Unit tests for FounderHQ 9-Agent AI Startup OS architecture.
Tests configuration, tool outputs, dynamic routing, and threshold sign-offs.
"""

from apps.api.agents.startup_team.agent import (
    CEOAgent,
    FinanceAgent,
    GrowthAgent,
    InvestmentAgent,
    LegalAgent,
    ProductAgent,
    SalesAgent,
    TalentAgent,
    TechArchitectAgent,
    analyze_and_route_workflow,
    calculate_cap_table_dilution,
    create_campaign_plan,
    draft_job_posting,
    evaluate_lead_and_pricing,
    generate_investor_update,
)


def test_agent_configurations():
    """Verify all 9 agents are initialized with proper names and bindings."""
    assert CEOAgent.name == "CEOAgent"
    assert len(CEOAgent.sub_agents) == 8

    agents = [
        FinanceAgent,
        TalentAgent,
        GrowthAgent,
        LegalAgent,
        SalesAgent,
        ProductAgent,
        TechArchitectAgent,
        InvestmentAgent,
    ]
    for agent in agents:
        assert agent.name is not None
        assert agent.instruction is not None


def test_investment_agent_tools():
    """Verify InvestmentAgent deterministic tools and threshold outputs."""
    dilution = calculate_cap_table_dilution(
        pre_money_valuation=2000000.0, investment_amount=500000.0
    )
    assert dilution["tool"] == "calculate_cap_table_dilution"
    assert dilution["post_money_valuation_usd"] == 2500000.0
    assert dilution["investor_ownership_pct"] == "20.0%"
    assert dilution["requires_human_signoff"] is True
    assert dilution["approval_status"] == "HOLD_FOR_HUMAN_APPROVAL"

    update = generate_investor_update(
        monthly_recurring_revenue=15000.0,
        monthly_burn=5000.0,
        runway_months=18.0,
        key_milestones="Launched beta with 500 active users",
    )
    assert update["tool"] == "generate_investor_update"
    assert update["ir_status"] == "HEALTHY"
    assert "beta" in update["key_milestones"].lower()


def test_routing_engine_incubation_and_specialized():
    """Test dynamic routing engine intent classification and metadata completeness."""
    res_incubator = analyze_and_route_workflow(
        "We want a 30-day incubator launch plan for a B2B AI app"
    )
    assert res_incubator["workflow_type"] == "SEQUENTIAL"
    assert "ProductAgent" in res_incubator["selected_agents"]
    assert res_incubator["intent_category"] == "FULL_INCUBATOR_LAUNCH"
    assert "routing_rationale" in res_incubator
    assert res_incubator["confidence_score"] == 0.99

    res_finance_talent = analyze_and_route_workflow(
        "Check runway with $250k and hire senior engineer at $130k"
    )
    assert res_finance_talent["workflow_type"] == "SEQUENTIAL"
    assert res_finance_talent["selected_agents"][0] == "FinanceAgent"
    assert "TalentAgent" in res_finance_talent["selected_agents"]


def test_deterministic_tools_human_approval_triggers():
    """Verify that high-impact actions mandate human approval sign-off."""
    posting = draft_job_posting("Senior ML Engineer", 150000.0)
    assert posting["requires_human_signoff"] is True

    campaign_high = create_campaign_plan("Google Ads", 10000.0)
    assert campaign_high["requires_human_signoff"] is True

    campaign_low = create_campaign_plan("Google Ads", 1000.0)
    assert campaign_low["requires_human_signoff"] is False

    deal_enterprise = evaluate_lead_and_pricing(15000.0, 60)
    assert deal_enterprise["requires_human_signoff"] is True


def test_agents_info_api_endpoint():
    """Verify GET /api/v1/agents/info returns HTTP 200 OK with complete agent metadata."""
    from fastapi.testclient import TestClient

    from app.main import app

    client = TestClient(app)
    response = client.get("/api/v1/agents/info")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "ceo_agent" in data["agents"]
    assert "product_agent" in data["agents"]
    assert "growth_agent" in data["agents"]
    assert "finance_agent" in data["agents"]
    assert "legal_agent" in data["agents"]

    # Test single agent slug lookup
    single_res = client.get("/api/v1/agents/finance")
    assert single_res.status_code == 200
    single_data = single_res.json()
    assert single_data["title"] == "Finance Agent (CFO)"
    assert single_data["model"] == "gemini-2.5-flash"
