"""
Security Audit Logger
----------------------
WHY: Without dedicated security event logging, failed logins, 403s, rate-limit
hits, and suspicious payloads are silently swallowed. Compliance frameworks
(SOC 2, ISO 27001) require an immutable audit trail for all auth and access
events. This module provides a structured audit logger that emits JSON records
to stdout (captured by any log aggregator — Datadog, CloudWatch, GCP Logging)
and can be extended to write to a persistent store.

EVENTS EMITTED (all contain: event_type, timestamp, ip, user_id, details):
  AUTH_LOGIN_SUCCESS      — successful authentication
  AUTH_LOGIN_FAILURE      — bad password / invalid token
  AUTH_LOGIN_LOCKED       — identifier locked after too many failures
  AUTH_LOGOUT             — explicit sign-out
  AUTH_TOKEN_REVOKED      — revoked Firebase token presented
  AUTHZ_FORBIDDEN         — authenticated user lacks required role/permission
  RATE_LIMIT_EXCEEDED     — IP throttled by rate limiter
  UPLOAD_REJECTED         — file upload blocked (bad MIME / size)
  SUSPICIOUS_INPUT        — request body contains injection-like patterns
  WORKSPACE_ACCESS        — workspace context resolution events
"""

from __future__ import annotations

import json
import logging
import sys
from datetime import UTC, datetime
from typing import Any


class _AuditHandler(logging.StreamHandler):
    """Dedicated stream handler that writes JSON audit records to stdout."""

    def emit(self, record: logging.LogRecord) -> None:
        try:
            sys.stdout.write(self.format(record) + "\n")
            sys.stdout.flush()
        except Exception:  # noqa: BLE001
            self.handleError(record)


class _AuditFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "audit": True,
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname,
        }
        if isinstance(record.msg, dict):
            payload.update(record.msg)
        else:
            payload["message"] = record.getMessage()
        return json.dumps(payload, default=str)


def _build_audit_logger() -> logging.Logger:
    log = logging.getLogger("founderhq.audit")
    log.setLevel(logging.INFO)
    log.propagate = False  # don't bubble up to root logger
    handler = _AuditHandler()
    handler.setFormatter(_AuditFormatter())
    if not log.handlers:
        log.addHandler(handler)
    return log


_audit_log = _build_audit_logger()


# ---------------------------------------------------------------------------
# Public helper — call from routes and middleware
# ---------------------------------------------------------------------------

def audit(
    event_type: str,
    *,
    ip: str = "unknown",
    user_id: str | None = None,
    email: str | None = None,
    path: str | None = None,
    details: dict[str, Any] | None = None,
    severity: str = "INFO",
) -> None:
    """
    Emit a structured audit record.

    Parameters
    ----------
    event_type : str
        One of the event constants defined in this module's docstring.
    ip : str
        Caller IP address.
    user_id : str | None
        Firebase UID or internal user ID, if known.
    email : str | None
        Email address, if known (never log full passwords).
    path : str | None
        Request path being accessed.
    details : dict | None
        Arbitrary extra context (do NOT include secrets or PII beyond email).
    severity : str
        Override log level: "INFO" | "WARNING" | "ERROR".
    """
    record: dict[str, Any] = {
        "event_type": event_type,
        "ip": ip,
    }
    if user_id:
        record["user_id"] = user_id
    if email:
        record["email"] = email
    if path:
        record["path"] = path
    if details:
        record["details"] = details

    level = getattr(logging, severity.upper(), logging.INFO)
    _audit_log.log(level, record)
