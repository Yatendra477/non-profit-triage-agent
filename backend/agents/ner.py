"""
NER Agent — helpers and prompt template for Named Entity Recognition.

Extracts structured entities from support messages:
  full_name, phone_number, email, location, case_id, date

Strategy:
  1. spaCy pre-pass: fast, free entity detection (PERSON, GPE, DATE)
  2. Regex pre-pass: reliable phone + email extraction
  3. LLM pass: fills gaps and validates with reasoning
"""

from __future__ import annotations

import re

from backend.utils.logger import get_logger

logger = get_logger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
#  spaCy (optional — gracefully degraded if model not installed)
# ─────────────────────────────────────────────────────────────────────────────

try:
    import spacy

    _NLP = spacy.load("en_core_web_sm")
    _SPACY_AVAILABLE = True
    logger.info("spacy_model_loaded", model="en_core_web_sm")
except (ImportError, OSError):
    _NLP = None
    _SPACY_AVAILABLE = False
    logger.warning(
        "spacy_model_unavailable",
        hint="Run: python -m spacy download en_core_web_sm",
    )


# ─────────────────────────────────────────────────────────────────────────────
#  Pre-extraction helpers
# ─────────────────────────────────────────────────────────────────────────────

_PHONE_RE = re.compile(
    r"(?:\+?\d{1,3}[-.\\s]?)?"
    r"(?:\(?\d{1,4}\)?[-.\\s]?)?"
    r"\d{1,4}[-.\\s]?\d{1,4}[-.\\s]?\d{1,9}"
)
_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
_CASE_RE = re.compile(r"\b(?:case|ticket|ref|id)[:\s#]*([A-Z0-9\-]+)\b", re.IGNORECASE)


def _spacy_hints(message: str) -> dict[str, str]:
    """Run spaCy NER and return a partial entity dict."""
    hints: dict[str, str] = {"full_name": "", "location": "", "date": ""}
    if not _SPACY_AVAILABLE or _NLP is None:
        return hints

    doc = _NLP(message)
    for ent in doc.ents:
        if ent.label_ == "PERSON" and not hints["full_name"]:
            hints["full_name"] = ent.text
        elif ent.label_ in ("GPE", "LOC", "FAC") and not hints["location"]:
            hints["location"] = ent.text
        elif ent.label_ == "DATE" and not hints["date"]:
            hints["date"] = ent.text

    return hints


def _regex_hints(message: str) -> dict[str, str]:
    """Run regex passes for phone, email, and case ID."""
    hints: dict[str, str] = {"phone_number": "", "email": "", "case_id": ""}

    email = _EMAIL_RE.search(message)
    if email:
        hints["email"] = email.group()

    case = _CASE_RE.search(message)
    if case:
        hints["case_id"] = case.group(1)

    phone = _PHONE_RE.search(message)
    if phone:
        digits = re.sub(r"\D", "", phone.group())
        if len(digits) >= 7:
            hints["phone_number"] = phone.group().strip()

    return hints


def get_pre_extracted_hints(message: str) -> dict[str, str]:
    """Combine spaCy and regex hints into a single dict."""
    hints = {}
    hints.update(_spacy_hints(message))
    hints.update(_regex_hints(message))
    return hints


# ─────────────────────────────────────────────────────────────────────────────
#  Prompt template
# ─────────────────────────────────────────────────────────────────────────────

NER_TASK_TEMPLATE = """
Extract named entities from the following support message.

MESSAGE:
\"\"\"
{message}
\"\"\"

PRE-EXTRACTED HINTS (from automated tools — may be incomplete or wrong):
{hints}

INSTRUCTIONS:
- Use the hints as a starting point, but apply your own reasoning.
- NEVER invent or hallucinate values. Leave a field as "" if absent.
- full_name   : The sender's full name if explicitly stated.
- phone_number: Any phone number in the message (include country code if present).
- email       : Any email address in the message.
- location    : City, state, country, or neighbourhood mentioned.
- case_id     : Any ticket/case/reference number (e.g., "Case #4892").
- date        : Any date or time reference (e.g., "next Monday", "2024-03-15").

Output ONLY the following JSON — no explanation, no markdown fences:
{{
  "entities": {{
    "full_name": "",
    "phone_number": "",
    "email": "",
    "location": "",
    "case_id": "",
    "date": ""
  }}
}}
""".strip()
