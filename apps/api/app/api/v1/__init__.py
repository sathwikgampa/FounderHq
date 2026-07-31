"""
API v1 Package Router Aggregator
----------------------------------
SCALABILITY: Each module is registered as an independent sub-router with its
own prefix and tag. Adding a new module (e.g. Sales, Operations) requires only:
  1. Create apps/api/app/api/v1/<module>.py with its APIRouter
  2. Create apps/api/app/schemas/<module>.py with its Pydantic models
  3. Import and register the router in this file (one line each)

No other file needs to change. This pattern ensures zero coupling between
business modules at the routing layer.
"""

from fastapi import APIRouter

# Core infrastructure routers (always present)
from app.api.v1.approval import router as approval_router
from app.api.v1.auth import router as auth_router
from app.api.v1.health import router as health_router
from app.api.v1.planner import router as planner_router
from app.api.v1.workspace import router as workspace_router

# Business domain module routers
from app.api.v1.finance import router as finance_router
from app.api.v1.hiring import router as hiring_router
from app.api.v1.investment import router as investment_router
from app.api.v1.legal import router as legal_router
from app.api.v1.marketing import router as marketing_router
from app.api.v1.reports import router as reports_router
from app.api.v1.uploads import router as uploads_router

api_v1_router = APIRouter(prefix="/v1")

# ── Infrastructure ────────────────────────────────────────────────────────
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(workspace_router)
api_v1_router.include_router(planner_router)
api_v1_router.include_router(approval_router)

# ── Business Domains ──────────────────────────────────────────────────────
# New modules: simply add include_router() below this comment
api_v1_router.include_router(finance_router)
api_v1_router.include_router(hiring_router)
api_v1_router.include_router(legal_router)
api_v1_router.include_router(marketing_router)
api_v1_router.include_router(investment_router)
api_v1_router.include_router(reports_router)
api_v1_router.include_router(uploads_router)
