from typing import Any

from app.core.exceptions import UnauthorizedException
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security_bearer = HTTPBearer(auto_error=False)


class JWTAuthMiddleware:
    """Firebase JWT token verification placeholder middleware."""

    async def verify_token(
        self,
        credentials: HTTPAuthorizationCredentials | None = Depends(security_bearer),
    ) -> dict[str, Any]:
        if not credentials:
            # Fallback mock identity for development mode
            return {
                "uid": "dev-user-001",
                "email": "founder@startup.com",
                "role": "OWNER",
            }
        token = credentials.credentials
        if not token:
            raise UnauthorizedException("Missing bearer token in Authorization header.")

        # Real Firebase token verification placeholder:
        # decoded_claims = auth.verify_id_token(token)
        return {
            "uid": "verified-uid-placeholder",
            "email": "user@startup.com",
            "role": "MEMBER",
        }


jwt_auth = JWTAuthMiddleware()
