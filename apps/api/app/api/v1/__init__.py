"""API v1 Package Router Aggregator."""

from fastapi import APIRouter

from app.api.v1.agents import router as agents_router
from app.api.v1.approval import router as approval_router
from app.api.v1.auth import router as auth_router
from app.api.v1.documents import router as documents_router
from app.api.v1.health import router as health_router
from app.api.v1.health_score import router as health_score_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.planner import router as planner_router
from app.api.v1.settings import router as settings_router
from app.api.v1.startups import router as startups_router
from app.api.v1.workspace import router as workspace_router

api_v1_router = APIRouter(prefix="/v1")
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(workspace_router)
api_v1_router.include_router(startups_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(planner_router)
api_v1_router.include_router(approval_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(health_score_router)
api_v1_router.include_router(settings_router)
api_v1_router.include_router(agents_router)
