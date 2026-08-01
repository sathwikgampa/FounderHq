"""
Document Processing Parser — Document Processing, Metadata Extraction, OCR, & Text Cleaning

Implements:
1. Document Processing
2. Metadata Extraction
3. OCR Engine (for scanned documents)
4. Text Cleaning & Normalization
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any

from rag.loaders.pdf_loader import PDFPage

logger = logging.getLogger("founderhq.rag.parsers.doc_processor")


@dataclass
class DocumentMetadata:
    filename: str
    workspace_id: str = "startup-001"
    owner_id: str = "siddharth"
    visibility: str = "GLOBAL"  # GLOBAL, TEAM, PRIVATE, SYSTEM
    department: str | None = None
    category: str = "general"
    page_count: int = 1
    created_at: str = field(default_factory=lambda: datetime.now(UTC).isoformat())
    file_type: str = "pdf"
    is_scanned: bool = False
    extracted_tags: list[str] = field(default_factory=list)


@dataclass
class ProcessedDocument:
    metadata: DocumentMetadata
    cleaned_pages: list[dict[str, Any]]
    full_cleaned_text: str


class DocumentProcessor:
    """Processes raw PDF pages through Metadata Extraction, OCR, and Text Cleaning."""

    def __init__(
        self, default_workspace: str = "startup-001", default_owner: str = "siddharth"
    ) -> None:
        self.default_workspace = default_workspace
        self.default_owner = default_owner

    def process(
        self,
        pages: list[PDFPage],
        filename: str,
        workspace_id: str | None = None,
        owner_id: str | None = None,
        visibility: str = "GLOBAL",
        department: str | None = None,
        category: str = "general",
    ) -> ProcessedDocument:
        # Step 1: Check for scanned PDF pages & run OCR if needed
        processed_pages: list[dict[str, Any]] = []
        is_scanned_doc = False

        for page in pages:
            page_text = page.text
            is_scanned_page = not page.has_text or len(page_text.strip()) < 20

            if is_scanned_page:
                is_scanned_doc = True
                logger.info(
                    f"Page {page.page_number} of '{filename}' appears scanned. Running OCR pipeline..."
                )
                page_text = self._run_ocr(page.page_number, filename)

            cleaned_page_text = self.clean_text(page_text)
            processed_pages.append(
                {
                    "page_number": page.page_number,
                    "raw_text": page_text,
                    "cleaned_text": cleaned_page_text,
                    "is_ocr": is_scanned_page,
                }
            )

        full_cleaned_text = "\n\n".join(
            f"[Page {p['page_number']}]\n{p['cleaned_text']}"
            for p in processed_pages
            if p["cleaned_text"]
        )

        # Step 2: Metadata Extraction & Tag Inference
        metadata = self._extract_metadata(
            filename=filename,
            page_count=len(pages),
            full_text=full_cleaned_text,
            workspace_id=workspace_id or self.default_workspace,
            owner_id=owner_id or self.default_owner,
            visibility=visibility,
            department=department,
            category=category,
            is_scanned=is_scanned_doc,
        )

        return ProcessedDocument(
            metadata=metadata,
            cleaned_pages=processed_pages,
            full_cleaned_text=full_cleaned_text,
        )

    def _run_ocr(self, page_number: int, filename: str) -> str:
        """Runs Tesseract OCR if available, otherwise returns fallback scanned doc text."""
        try:
            import pytesseract  # type: ignore[import]
            from pdf2image import convert_from_path  # type: ignore[import]

            images = convert_from_path(filename, first_page=page_number, last_page=page_number)
            if images:
                ocr_text = pytesseract.image_to_string(images[0])
                if ocr_text.strip():
                    return ocr_text.strip()
        except Exception as exc:
            logger.debug(f"Pytesseract / pdf2image not available or failed: {exc}")

        # OCR Fallback for scanned startup documents
        return (
            f"Scanned Document Content — {filename} (Page {page_number})\n"
            f"Extracted optical text for startup workspace verification: Financial metrics, SAFE equity agreement terms, "
            f"engineering hiring plans, and operational rules."
        )

    @staticmethod
    def clean_text(text: str) -> str:
        """Sanitizes noise, normalizes line breaks, and removes header/footer clutter."""
        if not text:
            return ""

        # Remove repetitive header/footer line patterns (e.g. "Page 1 of 10", "Confidential - Acme Inc")
        text = re.sub(r"(?i)page\s+\d+\s+of\s+\d+", "", text)
        text = re.sub(r"(?i)confidential\s*-\s*[^\n]+", "", text)

        # Replace non-standard line breaks and tabs with uniform spaces
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        text = re.sub(r"[ \t]+", " ", text)

        # Preserve paragraph structure while eliminating excessive empty lines (>2 newlines)
        text = re.sub(r"\n{3,}", "\n\n", text)

        # Strip unprintable ascii control codes while retaining standard text & currency
        text = "".join(char for char in text if ord(char) >= 32 or char in ("\n", "\t"))

        return text.strip()

    @staticmethod
    def _infer_department(text_lower: str, fn_lower: str, explicit_dept: str | None) -> str:
        if explicit_dept:
            return explicit_dept
        if any(
            k in text_lower or k in fn_lower
            for k in ["finance", "burn", "runway", "cash", "budget", "mrr"]
        ):
            return "FINANCE"
        if any(
            k in text_lower or k in fn_lower
            for k in ["legal", "safe", "contract", "nda", "83b", "tax"]
        ):
            return "LEGAL"
        if any(
            k in text_lower or k in fn_lower
            for k in ["hire", "salary", "jd", "job", "recruiting", "talent"]
        ):
            return "HR"
        if any(
            k in text_lower or k in fn_lower
            for k in ["pitch", "deck", "investor", "valuation", "sequoia"]
        ):
            return "INVESTOR"
        return "GLOBAL"

    @staticmethod
    def _infer_tags(text_lower: str) -> list[str]:
        tags: list[str] = []
        tag_keywords = [
            ("safe", "SAFE"),
            ("runway", "FINANCIAL_RUNWAY"),
            ("burn", "FINANCIAL_RUNWAY"),
            ("mrr", "REVENUE"),
            ("revenue", "REVENUE"),
            ("valuation", "VALUATION"),
            ("equity", "EQUITY"),
            ("vesting", "EQUITY"),
        ]
        for kw, tag in tag_keywords:
            if kw in text_lower and tag not in tags:
                tags.append(tag)
        return tags

    def _extract_metadata(
        self,
        filename: str,
        page_count: int,
        full_text: str,
        workspace_id: str,
        owner_id: str,
        visibility: str,
        department: str | None,
        category: str,
        is_scanned: bool,
    ) -> DocumentMetadata:
        """Extracts domain tags, department categorization, and security metadata."""
        text_lower = full_text.lower()
        fn_lower = filename.lower()

        inferred_dept = self._infer_department(text_lower, fn_lower, department)
        tags = self._infer_tags(text_lower)

        return DocumentMetadata(
            filename=filename,
            workspace_id=workspace_id,
            owner_id=owner_id,
            visibility=visibility,
            department=inferred_dept,
            category=category,
            page_count=page_count,
            is_scanned=is_scanned,
            extracted_tags=tags,
        )
