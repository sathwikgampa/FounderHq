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
    def _try_pypdf(pdf_bytes: bytes, file_name: str) -> list[PDFPage]:
        try:
            import pypdf

            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            pages = [
                PDFPage(
                    page_number=idx + 1,
                    text=(page.extract_text() or "").strip(),
                    has_text=bool((page.extract_text() or "").strip()),
                )
                for idx, page in enumerate(reader.pages)
            ]
            if pages and all(p.has_text for p in pages):
                return pages
        except Exception as exc:
            logger.debug(f"pypdf extraction failed for {file_name}: {exc}")
        return []

    @staticmethod
    def _try_fitz(pdf_bytes: bytes, file_name: str) -> list[PDFPage]:
        try:
            import fitz  # type: ignore[import]

            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            pages: list[PDFPage] = []
            for idx in range(len(doc)):
                page = doc[idx]
                text = page.get_text() or ""
                if not text.strip():
                    text = PDFLoader._ocr_fitz_page(page)
                pages.append(
                    PDFPage(page_number=idx + 1, text=text.strip(), has_text=bool(text.strip()))
                )
            if any(p.has_text for p in pages):
                return pages
        except Exception as exc:
            logger.debug(f"PyMuPDF extraction failed for {file_name}: {exc}")
        return []

    @staticmethod
    def _try_raw_stream(pdf_bytes: bytes, file_name: str) -> list[PDFPage]:
        try:
            import re

            raw_str = pdf_bytes.decode("latin-1", errors="ignore")
            text_blocks = re.findall(r"\((.*?)\)\s*Tj", raw_str) or re.findall(
                r"\[\((.*?)\)\]\s*TJ", raw_str
            )
            cleaned_text = " ".join(text_blocks).strip()
            if cleaned_text:
                return [PDFPage(page_number=1, text=cleaned_text, has_text=True)]
        except Exception as exc:
            logger.warning(f"Raw text stream parsing failed for {file_name}: {exc}")
        return []

    @staticmethod
    def _extract_pages(pdf_bytes: bytes, file_name: str) -> list[PDFPage]:
        if not pdf_bytes.lstrip().startswith(b"%PDF-"):
            text = pdf_bytes.decode("utf-8", errors="ignore").strip()
            if text:
                return [PDFPage(page_number=1, text=text, has_text=True)]

        pages = PDFLoader._try_pypdf(pdf_bytes, file_name)
        if pages:
            return pages

        pages = PDFLoader._try_fitz(pdf_bytes, file_name)
        if pages:
            return pages

        pages = PDFLoader._try_raw_stream(pdf_bytes, file_name)
        if pages:
            return pages

        return [PDFPage(page_number=1, text="", has_text=False)]

    @staticmethod
    def _ocr_fitz_page(page: object) -> str:
        """OCR a rendered PDF page without relying on an uploaded file path."""
        try:
            import io

            import pytesseract  # type: ignore[import]
            from PIL import Image  # type: ignore[import]

            pixmap = page.get_pixmap()  # type: ignore[attr-defined]
            image = Image.open(io.BytesIO(pixmap.tobytes("png")))
            return pytesseract.image_to_string(image).strip()
        except Exception as exc:
            logger.debug("PyMuPDF/Tesseract OCR unavailable: %s", exc)
            return ""
