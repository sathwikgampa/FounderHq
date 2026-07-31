"""
FounderHQ API — Root Entry Point
----------------------------------
This file is the single canonical entry point for running the API server.
It delegates entirely to app/main.py (the production-grade app factory)
so there is one consistent middleware stack, CORS policy, and router set
regardless of how the server is started (uvicorn CLI, Docker, or Render).

WHY THIS FILE EXISTS (and why it was a security problem before):
  The previous version of this file contained its own inline FastAPI app with:
    - allow_origins=["*"]  →  wildcard CORS, allowing any origin to make
      credentialed cross-site requests (a serious CSRF/data-theft risk).
    - Duplicated routes not covered by auth or rate limiting middleware.
    - Hardcoded tool dispatch logic that bypassed the production middleware stack.

  All of that is now removed. The production app in app/main.py:
    - Reads allowed origins from settings.CORS_ORIGINS (env var controlled).
    - Enforces SecurityHeadersMiddleware, RateLimiterMiddleware, and JWT auth.
    - Exposes /docs only when DEBUG=True (never in production).

HOW TO START:
  Development:  uvicorn main:app --reload --port 8000
  Production:   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
  Docker:       CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

NOTE: Do not add routes or middleware here. Extend app/main.py and the
      app/api/v1/ module routers instead.
"""

# Re-export the production app so `uvicorn main:app` still works
from app.main import app  # noqa: F401

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
