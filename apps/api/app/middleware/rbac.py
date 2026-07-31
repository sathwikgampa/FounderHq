"""
Role-Based Access Control (RBAC) Dependency
---------------------------------------------
WHY: Centralising role checks here means every new route automatically
inherits the same auditing and error contract just by using
Depends(require_role([...])).

SECURITY: Every FORBIDDEN event is emitted to the audit log so that
repeated access violations (e.g. a MEMBER role trying OWNER-only endpoints)
can be detected as potential privilege-escalation attempts.
"""

from typing import Any

from app.core.audit import audit
from app.core.exceptions import ForbiddenException
from app.middleware.jwt_auth import jwt_auth
from fastapi import Depends, Request


class RBACMiddleware:
    """Role-Based Access Control FastAPI dependency."""

    def __init__(self, allowed_roles: list[str]) -> None:
        self.allowed_roles = allowed_roles

    def __call__(
        self,
        request: Request,
        user: dict[str, Any] = Depends(jwt_auth.verify_token),
    ) -> dict[str, Any]:
        user_role = user.get("role", "GUEST")
        if user_role not in self.allowed_roles:
            client_ip = request.client.host if request.client else "unknown"
            audit(
                "AUTHZ_FORBIDDEN",
                ip=client_ip,
                user_id=user.get("uid"),
                email=user.get("email"),
                path=str(request.url.path),
                details={
                    "user_role": user_role,
                    "required_roles": self.allowed_roles,
                },
                severity="WARNING",
            )
            raise ForbiddenException(
                f"User role '{user_role}' lacks required permissions. "
                f"Required: {self.allowed_roles}."
            )
        return user


def require_role(roles: list[str]) -> RBACMiddleware:
    """Factory — usage: Depends(require_role(['OWNER', 'ADMIN']))"""
    return RBACMiddleware(allowed_roles=roles)
