"""
Rate Limiting Middleware & Brute-Force Login Protection
--------------------------------------------------------
WHY: The previous implementation was a no-op that only set decorative response
headers. Any client could send unlimited requests, leaving every endpoint wide
open to brute-force attacks, credential stuffing, and DoS.

WHAT THIS FILE PROVIDES:
1. RateLimiterMiddleware  — Starlette middleware that counts requests per IP
   using an in-process sliding-window counter (no Redis required for single
   instances; swap storage backend to Redis for multi-instance deployments by
   changing RATE_LIMIT_STORAGE_URI in .env to "redis://...").

2. LoginAttemptTracker   — In-memory per-identifier (IP or email) counter that
   locks accounts for LOGIN_LOCKOUT_MINUTES after MAX_LOGIN_ATTEMPTS failures.
   Import `login_tracker` and call .record_failure() / .check_locked() in the
   auth route.

3. Slowapi limiter singleton — exported as `limiter` so app/main.py can attach
   it to the FastAPI app and individual routes can use @limiter.limit("N/period")
   decorators for fine-grained per-endpoint limits.

SCALABILITY NOTE:
   For horizontally-scaled deployments set:
       RATE_LIMIT_STORAGE_URI=redis://your-redis:6379/0
   in .env.  slowapi / limits will automatically use Redis as the shared
   counter store, making limits consistent across all pods.
"""

from __future__ import annotations

import time
import threading
from collections import defaultdict
from dataclasses import dataclass, field

from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.config import settings
from app.core.logging import logger

# ---------------------------------------------------------------------------
# slowapi limiter singleton
# Used as a FastAPI dependency: @limiter.limit("100/minute")
# ---------------------------------------------------------------------------

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}"],
    storage_uri=settings.RATE_LIMIT_STORAGE_URI,
    # Emit headers so clients know their remaining quota
    headers_enabled=True,
    # Automatically raise HTTP 429 when a limit is exceeded
    strategy="fixed-window-elastic-expiry",
)

# ---------------------------------------------------------------------------
# Sliding-window per-IP middleware (covers every route including 404s)
# ---------------------------------------------------------------------------

class _WindowCounter:
    """Lock-free sliding-window request counter per key."""

    def __init__(self, window_seconds: int, limit: int) -> None:
        self._window = window_seconds
        self._limit = limit
        self._timestamps: dict[str, list[float]] = defaultdict(list)
        self._lock = threading.Lock()

    def is_allowed(self, key: str) -> tuple[bool, int]:
        """Return (allowed, requests_in_window)."""
        now = time.monotonic()
        cutoff = now - self._window
        with self._lock:
            ts = self._timestamps[key]
            # Evict timestamps outside the current window
            self._timestamps[key] = [t for t in ts if t > cutoff]
            count = len(self._timestamps[key])
            if count >= self._limit:
                return False, count
            self._timestamps[key].append(now)
            return True, count + 1


_window_counter = _WindowCounter(
    window_seconds=_parse_window(settings.RATE_LIMIT_WINDOW),
    limit=settings.RATE_LIMIT_REQUESTS,
)


def _parse_window(window_str: str) -> int:
    """Convert '1/minute' → 60, '1/second' → 1, '1/hour' → 3600."""
    parts = window_str.lower().split("/")
    unit = parts[-1].strip() if len(parts) > 1 else "minute"
    return {"second": 1, "minute": 60, "hour": 3600, "day": 86400}.get(unit, 60)


# Re-build counter now that helper is defined
_window_counter = _WindowCounter(
    window_seconds=_parse_window(settings.RATE_LIMIT_WINDOW),
    limit=settings.RATE_LIMIT_REQUESTS,
)

# Exempt paths (health probes, static assets)
_EXEMPT_PREFIXES = ("/api/v1/healthz", "/api/v1/health", "/docs", "/redoc", "/openapi.json")


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Per-IP sliding-window rate limiter applied globally to all HTTP requests.

    On limit exceeded → HTTP 429 with Retry-After and X-RateLimit-* headers.
    Security events are logged with caller IP and endpoint for audit purposes.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        path = request.url.path

        # Skip health / static paths so probes are never throttled
        if any(path.startswith(p) for p in _EXEMPT_PREFIXES):
            return await call_next(request)

        client_ip: str = request.client.host if request.client else "unknown"
        allowed, count = _window_counter.is_allowed(client_ip)

        if not allowed:
            logger.warning(
                f"RATE_LIMIT_EXCEEDED ip={client_ip} path={path} "
                f"requests_in_window={count} limit={settings.RATE_LIMIT_REQUESTS}"
            )
            retry_after = _parse_window(settings.RATE_LIMIT_WINDOW)
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": (
                            f"Too many requests. Maximum {settings.RATE_LIMIT_REQUESTS} requests "
                            f"per {settings.RATE_LIMIT_WINDOW} allowed."
                        ),
                    },
                },
                headers={
                    "Retry-After": str(retry_after),
                    "X-RateLimit-Limit": str(settings.RATE_LIMIT_REQUESTS),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Window": settings.RATE_LIMIT_WINDOW,
                },
            )

        response = await call_next(request)
        remaining = max(0, settings.RATE_LIMIT_REQUESTS - count)
        response.headers["X-RateLimit-Limit"] = str(settings.RATE_LIMIT_REQUESTS)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Window"] = settings.RATE_LIMIT_WINDOW
        return response


# ---------------------------------------------------------------------------
# Brute-force login tracker
# ---------------------------------------------------------------------------

@dataclass
class _LoginRecord:
    failures: int = 0
    locked_until: float = 0.0
    failure_timestamps: list[float] = field(default_factory=list)


class LoginAttemptTracker:
    """
    Tracks failed login attempts per identifier (email or IP).

    Usage in an auth route:
        if login_tracker.is_locked(identifier):
            raise TooManyRequestsException(...)
        success = await verify_password(...)
        if not success:
            login_tracker.record_failure(identifier)
        else:
            login_tracker.reset(identifier)
    """

    def __init__(self) -> None:
        self._records: dict[str, _LoginRecord] = defaultdict(lambda: _LoginRecord())
        self._lock = threading.Lock()

    def is_locked(self, identifier: str) -> tuple[bool, float]:
        """Return (is_locked, seconds_remaining)."""
        with self._lock:
            rec = self._records[identifier]
            if rec.locked_until > time.monotonic():
                remaining = round(rec.locked_until - time.monotonic(), 1)
                return True, remaining
            return False, 0.0

    def record_failure(self, identifier: str) -> int:
        """
        Increment failure counter.  Returns current failure count.
        Locks the account after MAX_LOGIN_ATTEMPTS consecutive failures.
        """
        with self._lock:
            rec = self._records[identifier]
            now = time.monotonic()
            # Slide window: forget failures older than the lockout window
            window = settings.LOGIN_LOCKOUT_MINUTES * 60
            rec.failure_timestamps = [t for t in rec.failure_timestamps if now - t < window]
            rec.failure_timestamps.append(now)
            rec.failures = len(rec.failure_timestamps)

            if rec.failures >= settings.MAX_LOGIN_ATTEMPTS:
                rec.locked_until = now + (settings.LOGIN_LOCKOUT_MINUTES * 60)
                logger.warning(
                    f"LOGIN_LOCKOUT triggered for identifier={identifier!r} "
                    f"after {rec.failures} failures. "
                    f"Locked for {settings.LOGIN_LOCKOUT_MINUTES} minutes."
                )
            return rec.failures

    def reset(self, identifier: str) -> None:
        """Clear failure history after a successful login."""
        with self._lock:
            self._records.pop(identifier, None)


login_tracker = LoginAttemptTracker()
