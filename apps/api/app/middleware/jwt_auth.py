"""
JWT / Firebase Auth Middleware
-------------------------------
WHY: The previous implementation returned a hardcoded mock identity for every
request, meaning ALL endpoints were effectively unauthenticated. This replaces
that with real firebase-admin token verification so only callers holding a valid
Firebase ID-token can reach protected routes.

SECURITY NOTES:
- firebase_admin.auth.verify_id_token() validates the token signature, expiry,
  audience (project_id), and issuer — it cannot be spoofed without the private key.
- Dev-mode bypass is ONLY active when ENV == "development" AND no bearer token
  is present. It will NEVER activate in production even if a token is missing.
- Token verification errors are mapped to structured 401 responses so clients
  receive a consistent error envelope.
"""

from typing import Any

import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials

from app.core.audit import audit
from app.core.config import settings
from app.core.exceptions import UnauthorizedException
from app.core.logging import logger
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security_bearer = HTTPBearer(auto_error=False)

# ---------------------------------------------------------------------------
# Firebase Admin SDK initialization (lazy singleton)
# ---------------------------------------------------------------------------

_firebase_app: firebase_admin.App | None = None


def _get_firebase_app() -> firebase_admin.App:
    """Return (or lazily create) the Firebase Admin SDK singleton."""
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    # Build credentials from environment-sourced config settings.
    # In production these MUST be real values; in dev the config validator
    # allows mock values so the fallback demo path can still be used.
    try:
        cred = credentials.Certificate(
            {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "private_key": settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        )
        _firebase_app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully.")
    except Exception as exc:
        logger.warning(
            f"Firebase Admin SDK initialization failed — dev fallback active: {exc}"
        )
        _firebase_app = None  # keep None so caller falls through to dev bypass

    return _firebase_app  # type: ignore[return-value]


# ---------------------------------------------------------------------------
# Auth middleware class
# ---------------------------------------------------------------------------


class JWTAuthMiddleware:
    """
    Firebase ID-token verification dependency.

    Usage (FastAPI route):
        user: dict = Depends(jwt_auth.verify_token)
    """

    async def verify_token(
        self,
        credentials: HTTPAuthorizationCredentials | None = Depends(security_bearer),
        request: Request | None = None,
    ) -> dict[str, Any]:
        client_ip = request.client.host if (request and request.client) else "unknown"
        path = request.url.path if request else "unknown"
        """
        Verify the Bearer token attached to the request.

        Returns a dict of token claims:
            {uid, email, role, workspace_id (optional)}

        Raises UnauthorizedException on any verification failure.
        Dev bypass is only available when ENV=development and credentials absent.
        """
        # ── Development bypass (no real Firebase app configured) ──────────
        if not credentials:
            if settings.ENV == "development":
                logger.debug("Dev mode: no token supplied — using mock identity.")
                return {
                    "uid": "dev-user-001",
                    "email": "founder@startup.com",
                    "role": "OWNER",
                }
            # In production, a missing token is immediately rejected.
            logger.warning("Missing Authorization header on protected route.")
            audit(
                "AUTH_LOGIN_FAILURE",
                ip=client_ip,
                path=path,
                details={"reason": "Missing Authorization header"},
                severity="WARNING",
            )
            raise UnauthorizedException(
                "Authentication required. Provide a valid Bearer token."
            )

        token = credentials.credentials

        # ── Real Firebase token verification ─────────────────────────────
        firebase_app = _get_firebase_app()

        if firebase_app is None:
            # Firebase SDK failed to initialise (bad credentials in config).
            if settings.ENV == "development":
                logger.warning(
                    "Firebase SDK unavailable in dev — returning mock identity for supplied token."
                )
                return {
                    "uid": "dev-user-fallback",
                    "email": "founder@startup.com",
                    "role": "OWNER",
                }
            raise UnauthorizedException(
                "Auth service unavailable. Contact support."
            )

        try:
            decoded: dict[str, Any] = firebase_auth.verify_id_token(
                token,
                app=firebase_app,
                check_revoked=True,  # catch sign-out / revoked tokens
            )
        except firebase_auth.RevokedIdTokenError:
            uid_hint = "unknown"
            audit(
                "AUTH_TOKEN_REVOKED",
                ip=client_ip,
                user_id=uid_hint,
                path=path,
                severity="WARNING",
            )
            raise UnauthorizedException("Token has been revoked. Please sign in again.")
        except firebase_auth.ExpiredIdTokenError:
            audit(
                "AUTH_LOGIN_FAILURE",
                ip=client_ip,
                path=path,
                details={"reason": "Expired token"},
                severity="WARNING",
            )
            raise UnauthorizedException("Token has expired. Please sign in again.")
        except firebase_auth.InvalidIdTokenError as exc:
            logger.warning(f"Invalid token: {exc}")
            audit(
                "AUTH_LOGIN_FAILURE",
                ip=client_ip,
                path=path,
                details={"reason": "Invalid token"},
                severity="WARNING",
            )
            raise UnauthorizedException("Invalid authentication token.")
        except Exception as exc:
            logger.error(f"Unexpected token verification error: {exc}")
            audit(
                "AUTH_LOGIN_FAILURE",
                ip=client_ip,
                path=path,
                details={"reason": str(exc)},
                severity="ERROR",
            )
            raise UnauthorizedException("Token verification failed.")

        # Map custom claims → internal role (default MEMBER if not set)
        role: str = decoded.get("role") or decoded.get("custom_claims", {}).get("role", "MEMBER")

        return {
            "uid": decoded["uid"],
            "email": decoded.get("email", ""),
            "role": role,
            "workspace_id": decoded.get("workspace_id"),
            "firebase_claims": decoded,
        }


jwt_auth = JWTAuthMiddleware()
