"""
Robust JSON/entity parsing utilities.

LLMs frequently wrap JSON in markdown fences or add commentary before/after.
These helpers extract clean JSON from arbitrary LLM output text, with retry
support and typed exceptions for predictable error handling.
"""

from __future__ import annotations

import json
import re
from typing import Any

from backend.utils.logger import get_logger

logger = get_logger(__name__)


class JSONParseError(Exception):
    """Raised when JSON cannot be extracted from the LLM output."""


# ─────────────────────────────────────────────────────────────────────────────
#  Core extractor
# ─────────────────────────────────────────────────────────────────────────────


def extract_json(text: str) -> dict[str, Any]:
    """
    Extract and parse a JSON object from arbitrary LLM output.

    Strategy (in order):
    1. Direct json.loads on the raw text.
    2. Regex search for the first {...} balanced block.
    3. Strip markdown code fences and retry.

    Args:
        text: Raw string returned by the LLM.

    Returns:
        Parsed Python dict.

    Raises:
        JSONParseError: If no valid JSON object was found.
    """
    if not text or not text.strip():
        raise JSONParseError("LLM returned an empty response.")

    # Strategy 1 — direct parse
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Strategy 2 — strip markdown fences
    fence_pattern = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.IGNORECASE)
    fence_match = fence_pattern.search(text)
    if fence_match:
        try:
            return json.loads(fence_match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Strategy 3 — find first balanced {...} block
    brace_pattern = re.compile(r"\{[\s\S]*\}")
    brace_match = brace_pattern.search(text)
    if brace_match:
        try:
            return json.loads(brace_match.group())
        except json.JSONDecodeError:
            pass

    logger.warning("json_extraction_failed", raw_text_preview=text[:300])
    raise JSONParseError(f"No valid JSON found in LLM output: {text[:200]!r}")


# ─────────────────────────────────────────────────────────────────────────────
#  Domain-specific parsers with safe defaults
# ─────────────────────────────────────────────────────────────────────────────


def parse_classification(text: str) -> dict[str, str]:
    """
    Parse the classifier agent's output into {intent, urgency}.

    Falls back to safe defaults rather than raising to keep the pipeline alive.
    """
    valid_intents = {
        "Donation", "Volunteer", "Complaint", "Emergency Help", "General Inquiry"
    }
    valid_urgency = {"High", "Medium", "Low"}

    defaults = {"intent": "General Inquiry", "urgency": "Low"}

    try:
        data = extract_json(text)
    except JSONParseError:
        logger.warning("classification_parse_failed", raw=text[:200])
        return defaults

    intent = data.get("intent", "General Inquiry")
    urgency = data.get("urgency", "Low")

    # Normalise casing / fallback
    intent = intent if intent in valid_intents else "General Inquiry"
    urgency = urgency if urgency in valid_urgency else "Low"

    return {"intent": intent, "urgency": urgency}


def parse_entities(text: str) -> dict[str, str]:
    """
    Parse the NER agent's output into a flat entity dict.

    Returns an entity dict with empty-string defaults for missing fields.
    """
    entity_keys = {"full_name", "phone_number", "email", "location", "case_id", "date"}
    empty_entities = {k: "" for k in entity_keys}

    try:
        data = extract_json(text)
    except JSONParseError:
        logger.warning("ner_parse_failed", raw=text[:200])
        return empty_entities

    # Handle both {"entities": {...}} and flat {"full_name": ...} shapes
    entities_raw = data.get("entities", data)
    if not isinstance(entities_raw, dict):
        return empty_entities

    # Fill missing keys with empty strings; strip whitespace from values
    return {k: str(entities_raw.get(k, "")).strip() for k in entity_keys}


def parse_decision(text: str) -> dict[str, Any]:
    """
    Parse the decision agent's output into {route, escalated, priority}.
    """
    valid_routes = {"human_agent", "finance_team", "volunteer_team", "general_support"}
    defaults: dict[str, Any] = {
        "route": "general_support",
        "escalated": False,
        "priority": "Low",
    }

    try:
        data = extract_json(text)
    except JSONParseError:
        logger.warning("decision_parse_failed", raw=text[:200])
        return defaults

    route = data.get("route", "general_support")
    route = route if route in valid_routes else "general_support"

    return {
        "route": route,
        "escalated": bool(data.get("escalated", False)),
        "priority": data.get("priority", "Low"),
    }
