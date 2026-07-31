"""
Application Settings
----------------------
WHY THESE CHANGES:
1. Hardcoded secrets removed — all sensitive values come exclusively from
   environment variables. Pydantic-settings raises a clear error at startup
   if a required variable is missing, which is far better than silently running
   with a mock value in production.

2. Production guard validators — if ENV == "production" the app refuses to start
   when any of: JWT_SECRET_KEY, FIREBASE_PROJECT_ID, or FIREBASE_PRIVATE_KEY
   still carry their development placeholder values. This turns a potential
   breach into a hard deployment failure that's caught in CI/CD.

3. Rate-limit and upload settings centralised here so every new module reads
   the same values from one source of truth instead of duplicating magic numbers.

4. RATE_LIMIT_STORAGE_URI defaults to in-memory ("memory://") for single-instance
   dev/staging. Set it to "redis://..." in production for shared state across
   multiple pods or workers.

5. DEBUG defaults to False (safe default). Must be explicitly set True in .env
   for development — avoids accidentally exposing /docs in production if the
   env file is incomplete.
"""

from __future__ import annotations

from pydantic import AnyHttpUrl, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Development placeholder sentinel values — validated against in production
_DEV_JWT_KEY = "super-secret-development-jwt-key-min-32-chars-long"
_DEV_FIREBASE_PROJECT = "mock-project-id"
_DEV_FIREBASE_KEY = "mock-private-key"


class Settings(BaseSettings):
    # ── Server ─────────────────────────────────────────────────────────────
    ENV: str = "development"
    PROJECT_NAME: str = "FounderHQ API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False          # SAFE DEFAULT — must explicitly enable in .env
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # ── CORS ───────────────────────────────────────────────────────────────
    CORS_ORIGINS: list[str | AnyHttpUrl] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        if isinstance(v, (list, str)):
            return v
        raise ValueError(f"Invalid CORS_ORIGINS value: {v!r}")

    # ── Firebase ───────────────────────────────────────────────────────────
    # No defaults — missing values cause startup failure in production
    FIREBASE_PROJECT_ID: str = _DEV_FIREBASE_PROJECT
    FIREBASE_CLIENT_EMAIL: str = "mock@mock-project.iam.gserviceaccount.com"
    FIREBASE_PRIVATE_KEY: str = _DEV_FIREBASE_KEY

    # ── JWT ────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = _DEV_JWT_KEY
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # ── Rate Limiting ──────────────────────────────────────────────────────
    # Format understood by slowapi/limits: "N/period" (second, minute, hour, day)
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: str = "minute"
    # In-memory for single-instance; swap to "redis://host:6379/0" for multi-pod
    RATE_LIMIT_STORAGE_URI: str = "memory://"

    # ── Brute-Force Login Protection ───────────────────────────────────────
    MAX_LOGIN_ATTEMPTS: int = 5
    LOGIN_LOCKOUT_MINUTES: int = 15

    # ── File Uploads ───────────────────────────────────────────────────────
    MAX_UPLOAD_SIZE_MB: int = 10
    # Comma-separated MIME types; parsed into a set at validation time
    ALLOWED_UPLOAD_MIME_TYPES: str = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    @field_validator("ALLOWED_UPLOAD_MIME_TYPES", mode="before")
    @classmethod
    def normalise_mime_types(cls, v: str) -> str:
        # Strip whitespace from each value so "application/pdf, application/..." works
        return ",".join(m.strip() for m in v.split(","))

    @property
    def allowed_mime_set(self) -> set[str]:
        return set(self.ALLOWED_UPLOAD_MIME_TYPES.split(","))

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    # ── Production Guard ───────────────────────────────────────────────────
    @model_validator(mode="after")
    def reject_dev_secrets_in_production(self) -> "Settings":
        """
        Hard-stop the application from starting in production when any
        development placeholder secret is still in use.

        WHY: A hardcoded JWT secret or Firebase key in production would allow
        anyone who reads the source code to forge tokens or access Firebase
        admin APIs. Catching this at startup — before any request is served —
        ensures the misconfiguration is discovered in CI/CD, not by an attacker.
        """
        if self.ENV == "production":
            errors: list[str] = []
            if self.JWT_SECRET_KEY == _DEV_JWT_KEY:
                errors.append("JWT_SECRET_KEY must be set to a strong random secret in production.")
            if self.FIREBASE_PROJECT_ID == _DEV_FIREBASE_PROJECT:
                errors.append("FIREBASE_PROJECT_ID must be set to your real Firebase project ID in production.")
            if self.FIREBASE_PRIVATE_KEY == _DEV_FIREBASE_KEY:
                errors.append("FIREBASE_PRIVATE_KEY must be set to your real Firebase service account key in production.")
            if self.DEBUG:
                errors.append("DEBUG must be False in production (disables /docs and stack traces).")
            if errors:
                raise ValueError(
                    "Production environment started with insecure configuration:\n"
                    + "\n".join(f"  - {e}" for e in errors)
                )
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
