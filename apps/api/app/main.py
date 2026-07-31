import time
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api import api_v1_router
from app.core.config import settings
from app.core.logging import logger
from app.middleware.cors import setup_cors
from app.middleware.rate_limiter import RateLimiterMiddleware
from app.middleware.security import SecurityHeadersMiddleware
from app.middleware.workspace import WorkspaceContextMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    description="FounderHQ Production-Grade FastAPI Backend & AI Agent Engine Foundation",
)

# Setup Middleware
setup_cors(app)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(WorkspaceContextMiddleware)
app.add_middleware(RateLimiterMiddleware)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = round((time.time() - start_time) * 1000, 2)
    logger.info(
        f"{request.method} {request.url.path} - Status: {response.status_code} - Duration: {duration}ms"
    )
    return response


# Register API Routers
app.include_router(api_v1_router, prefix="/api")


@app.get("/", include_in_schema=False)
async def root_ping():
    return JSONResponse(
        content={
            "name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "ONLINE",
            "documentation": "/docs" if settings.DEBUG else "DISABLED",
        }
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
