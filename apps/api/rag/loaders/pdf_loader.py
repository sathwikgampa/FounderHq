"""
PDF Loader Module — Document Processing Stage 1

Supports loading PDF documents from file paths or raw binary streams,
extracting page-by-page text with layout metadata.
"""

from __future__ import annotations

import io
import logging
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger("founderhq.rag.loaders.pdf_loader")


@dataclass
class PDFPage:
    page_number: int
    text: str
    has_text: bool


class PDFLoader:
    """Extracts text content page-by-page from PDF files or binary streams."""

    @staticmethod
    def load_pdf(source: str | Path | bytes) -> list[PDFPage]:
        pdf_bytes: bytes
        file_name: str = "document.pdf"

        if isinstance(source, (str, Path)):
            path = Path(source)
            file_name = path.name
            if not path.exists():
                logger.error(f"PDF file not found at path: {path}")
                return [PDFPage(page_number=1, text="", has_text=False)]
            pdf_bytes = path.read_bytes()
        else:
            pdf_bytes = source

        pages = PDFLoader._extract_pages(pdf_bytes, file_name)
        logger.info(f"Loaded PDF '{file_name}': extracted {len(pages)} pages.")
        return pages

    @staticmethod
    def _extract_pages(pdf_bytes: bytes, file_name: str) -> list[PDFPage]:
        pages: list[PDFPage] = []

        # Strategy 1: pypdf if available
        try:
            import pypdf

            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            for idx, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages.append(
                    PDFPage(
                        page_number=idx + 1,
                        text=text.strip(),
                        has_text=bool(text.strip()),
                    )
                )
            if pages:
                return pages
        except Exception as exc:
            logger.debug(f"pypdf extraction failed or not available for {file_name}: {exc}")

        # Strategy 2: PyMuPDF (fitz) if available
        try:
            import fitz  # type: ignore[import]

            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            for idx in range(len(doc)):
                page = doc[idx]
                text = page.get_text() or ""
                pages.append(
                    PDFPage(
                        page_number=idx + 1,
                        text=text.strip(),
                        has_text=bool(text.strip()),
                    )
                )
            if pages:
                return pages
        except Exception as exc:
            logger.debug(f"PyMuPDF extraction failed for {file_name}: {exc}")

        # Fallback Strategy 3: Text / Stream scanner for text content or synthetic stream decoding
        try:
            # Decode printable ASCII strings from PDF stream
            raw_str = pdf_bytes.decode("latin-1", errors="ignore")
            # Extract plain text snippets from BT / ET text blocks or stream sections
            import re

            text_blocks = re.findall(r"\((.*?)\)\s*Tj", raw_str)
            if not text_blocks:
                text_blocks = re.findall(r"\[\((.*?)\)\]\s*TJ", raw_str)

            cleaned_text = " ".join(text_blocks).strip()
            if cleaned_text:
                return [PDFPage(page_number=1, text=cleaned_text, has_text=True)]
        except Exception as exc:
            logger.warning(f"Raw text stream parsing failed for {file_name}: {exc}")

        # If empty or scanned PDF, return single empty page to trigger OCR pipeline downstream
        return [PDFPage(page_number=1, text="", has_text=False)]
