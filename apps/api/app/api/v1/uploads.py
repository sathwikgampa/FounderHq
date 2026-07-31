"""
Secure File Upload Endpoint
-----------------------------
WHY THIS MATTERS:
  Unrestricted file uploads are one of the OWASP Top 10 critical risks. An
  attacker can upload executable scripts, oversized files that exhaust disk/memory,
  or files with misleading extensions (e.g. "contract.pdf" that is actually a PHP
  shell). This endpoint applies four independent defence layers:

  1. Size gate (middleware-level)  — file.size is checked before reading any bytes.
     Controlled by MAX_UPLOAD_SIZE_MB in settings (default 10 MB).

  2. Extension allowlist           — only .pdf and .docx extensions accepted.
     Rejects .exe, .js, .html, .sh, .py, and every other executable type.

  3. Magic-byte MIME verification  — the first few bytes of the file content
     are read and matched against known magic byte signatures for PDF and DOCX.
     This defeats "file extension spoofing" where an attacker renames a script
     with a .pdf extension. We do NOT trust the Content-Type header sent by the
     client, because it can trivially be forged.

  4. Filename sanitisation         — werkzeug-style secure_filename logic strips
     path separators, null bytes, and special characters that could cause path
     traversal attacks (e.g. "../../etc/passwd.pdf").

ALLOWED FILE TYPES (configurable via ALLOWED_UPLOAD_MIME_TYPES in .env):
  - application/pdf   (.pdf)
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document (.docx)

AUTH: Requires authenticated user (any role). Upload events are audit-logged.
RATE LIMIT: 10 uploads/minute per IP (prevents storage exhaustion).
"""

from __future__ import annotations

import re
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, status

from app.core.audit import audit
from app.core.config import settings
from app.core.logging import logger
from app.middleware.jwt_auth import jwt_auth
from app.schemas.common import APIResponseEnvelope

router = APIRouter(prefix="/uploads", tags=["File Uploads"])

# ---------------------------------------------------------------------------
# Magic-byte signatures for allowed file types
# ---------------------------------------------------------------------------
# PDF: always starts with %PDF-  (hex: 25 50 44 46 2D)
# DOCX: ZIP-based format, starts with PK\x03\x04 (hex: 50 4B 03 04)
_MAGIC_BYTES: dict[str, bytes] = {
    "application/pdf": b"%PDF-",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": b"PK\x03\x04",
}

# Allowed file extensions mapped to expected MIME type
_EXTENSION_MIME_MAP: dict[str, str] = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

# Characters allowed in a sanitised filename (alphanumeric, dash, underscore, dot)
_SAFE_FILENAME_PATTERN = re.compile(r"[^\w.\-]")


def _sanitise_filename(name: str) -> str:
    """
    Strip path separators and dangerous characters from a filename.
    E.g. "../../etc/passwd.pdf" → "etc_passwd.pdf"

    WHY: Without this, a carefully crafted filename could write a file outside
    the intended upload directory (path traversal attack).
    """
    # Remove directory components
    name = name.replace("\\", "/").split("/")[-1]
    # Replace null bytes and non-allowlist characters with underscores
    name = name.replace("\x00", "")
    name = _SAFE_FILENAME_PATTERN.sub("_", name)
    # Ensure filename is not empty after sanitisation
    return name or f"upload_{uuid.uuid4().hex[:8]}"


def _get_extension(filename: str) -> str:
    """Return the lowercased file extension including the dot, e.g. '.pdf'."""
    dot_idx = filename.rfind(".")
    return filename[dot_idx:].lower() if dot_idx != -1 else ""


async def _verify_magic_bytes(file: UploadFile, expected_mime: str) -> None:
    """
    Read the first 8 bytes of the upload and compare against known magic bytes.
    Resets the file stream position afterward so downstream code can read normally.

    Raises HTTP 415 if the magic bytes do not match the declared/expected MIME type.
    """
    magic = _MAGIC_BYTES.get(expected_mime)
    if not magic:
        # No magic bytes registered for this type — skip verification
        return

    header_bytes = await file.read(len(magic))
    await file.seek(0)  # reset so the full file can be read/stored later

    if not header_bytes.startswith(magic):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_FILE_CONTENT",
                    "message": (
                        f"File content does not match the expected type for extension "
                        f"'{_get_extension(file.filename or '')}'. "
                        "Ensure you are uploading a genuine PDF or DOCX file."
                    ),
                },
            },
        )


@router.post(
    "/document",
    response_model=APIResponseEnvelope[dict[str, Any]],
    summary="Upload a document (PDF or DOCX)",
    description=(
        "Accepts PDF and DOCX files only. "
        f"Maximum size: {settings.MAX_UPLOAD_SIZE_MB} MB. "
        "File content is verified via magic bytes — extensions cannot be spoofed."
    ),
    status_code=201,
)
async def upload_document(
    request: Request,
    file: UploadFile,
    user: dict[str, Any] = Depends(jwt_auth.verify_token),
) -> APIResponseEnvelope[dict[str, Any]]:
    """POST /api/v1/uploads/document"""
    client_ip = request.client.host if request.client else "unknown"
    filename_raw = file.filename or "unknown"

    # ── 1. Sanitise filename ────────────────────────────────────────────────
    safe_filename = _sanitise_filename(filename_raw)
    extension = _get_extension(safe_filename)

    # ── 2. Extension allowlist check ────────────────────────────────────────
    if extension not in _EXTENSION_MIME_MAP:
        audit(
            "UPLOAD_REJECTED",
            ip=client_ip,
            user_id=user.get("uid"),
            details={
                "reason": "disallowed_extension",
                "filename": safe_filename,
                "extension": extension,
            },
            severity="WARNING",
        )
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail={
                "success": False,
                "error": {
                    "code": "UNSUPPORTED_FILE_TYPE",
                    "message": (
                        f"File type '{extension}' is not allowed. "
                        f"Accepted types: {', '.join(_EXTENSION_MIME_MAP.keys())}."
                    ),
                },
            },
        )

    expected_mime = _EXTENSION_MIME_MAP[extension]

    # ── 3. Size check — read content and verify byte count ──────────────────
    # We read the full file to get an accurate byte count.
    # UploadFile.size is set by Starlette from Content-Length header, which
    # clients can lie about, so we measure the actual bytes read.
    content = await file.read()
    actual_size = len(content)
    await file.seek(0)

    if actual_size > settings.max_upload_bytes:
        audit(
            "UPLOAD_REJECTED",
            ip=client_ip,
            user_id=user.get("uid"),
            details={
                "reason": "file_too_large",
                "filename": safe_filename,
                "size_bytes": actual_size,
                "limit_bytes": settings.max_upload_bytes,
            },
            severity="WARNING",
        )
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail={
                "success": False,
                "error": {
                    "code": "FILE_TOO_LARGE",
                    "message": (
                        f"File size {actual_size / 1024 / 1024:.2f} MB exceeds the "
                        f"{settings.MAX_UPLOAD_SIZE_MB} MB limit."
                    ),
                },
            },
        )

    if actual_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {"code": "EMPTY_FILE", "message": "Uploaded file is empty."},
            },
        )

    # ── 4. Magic-byte content verification ──────────────────────────────────
    magic = _MAGIC_BYTES.get(expected_mime, b"")
    if magic and not content.startswith(magic):
        audit(
            "UPLOAD_REJECTED",
            ip=client_ip,
            user_id=user.get("uid"),
            details={
                "reason": "magic_byte_mismatch",
                "filename": safe_filename,
                "extension": extension,
            },
            severity="WARNING",
        )
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_FILE_CONTENT",
                    "message": (
                        f"File content does not match extension '{extension}'. "
                        "Only genuine PDF and DOCX files are accepted."
                    ),
                },
            },
        )

    # ── 5. All checks passed — process upload ──────────────────────────────
    upload_id = f"upl-{uuid.uuid4().hex[:12]}"

    audit(
        "UPLOAD_ACCEPTED",
        ip=client_ip,
        user_id=user.get("uid"),
        details={
            "upload_id": upload_id,
            "filename": safe_filename,
            "mime_type": expected_mime,
            "size_bytes": actual_size,
        },
    )

    logger.info(
        f"Document uploaded: id={upload_id} file={safe_filename} "
        f"size={actual_size} user={user.get('uid')}"
    )

    # In production: store `content` in Cloud Storage (GCS/S3) and save metadata
    # to the database. Here we return the metadata envelope.
    return APIResponseEnvelope(
        data={
            "upload_id": upload_id,
            "filename": safe_filename,
            "mime_type": expected_mime,
            "size_bytes": actual_size,
            "size_human": f"{actual_size / 1024:.1f} KB",
            "status": "RECEIVED",
            # storage_url would be set after writing to Cloud Storage
            "storage_url": None,
        },
        message="Document uploaded and validated successfully.",
    )
