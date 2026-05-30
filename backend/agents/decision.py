"""
Decision Agent — deterministic routing logic for triaged support requests.

Rule engine (no LLM needed):
  - urgency == "High"       → route = human_agent   (escalated = True)
  - intent  == "Donation"   → route = finance_team
  - intent  == "Volunteer"  → route = volunteer_team
  - else                    → route = general_support
"""

from __future__ import annotations

from backend.models.schemas import DecisionResult
from backend.utils.logger import get_logger

logger = get_logger(__name__)


def apply_routing_rules(intent: str, urgency: str) -> DecisionResult:
    """
    Apply deterministic routing rules and return a DecisionResult.

    Args:
        intent : The classified intent string.
        urgency: The assessed urgency string.

    Returns:
        DecisionResult with route, escalated flag, and priority.
    """
    logger.info("applying_routing_rules", intent=intent, urgency=urgency)

    if urgency == "High":
        result = DecisionResult(route="human_agent", escalated=True, priority="High")

    elif intent == "Donation":
        result = DecisionResult(route="finance_team", escalated=False, priority=urgency)  # type: ignore[arg-type]

    elif intent == "Volunteer":
        result = DecisionResult(route="volunteer_team", escalated=False, priority=urgency)  # type: ignore[arg-type]

    elif intent == "Complaint":
        result = DecisionResult(route="general_support", escalated=False, priority=urgency)  # type: ignore[arg-type]

    else:
        result = DecisionResult(route="general_support", escalated=False, priority="Low")

    logger.info(
        "routing_decision",
        route=result.route,
        escalated=result.escalated,
        priority=result.priority,
    )
    return result
