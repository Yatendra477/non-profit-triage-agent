"""
Responder Agent — prompt template and route context for generating
empathetic, context-aware support responses.
"""

from __future__ import annotations

# ─────────────────────────────────────────────────────────────────────────────
#  Route → human-readable next-step text
# ─────────────────────────────────────────────────────────────────────────────

ROUTE_CONTEXT_MAP = {
    "human_agent": (
        "Your request has been flagged as urgent and is being escalated to one of "
        "our dedicated team members who will contact you as soon as possible."
    ),
    "finance_team": (
        "Your generous donation enquiry has been forwarded to our Finance & Giving team, "
        "who will reach out to guide you through the process."
    ),
    "volunteer_team": (
        "Your interest in volunteering has been shared with our Volunteer Coordination team. "
        "They will be in touch shortly with opportunities that match your skills."
    ),
    "general_support": (
        "Your message has been received by our Support team, who will respond "
        "within one business day."
    ),
}

# ─────────────────────────────────────────────────────────────────────────────
#  Prompt template
# ─────────────────────────────────────────────────────────────────────────────

RESPONDER_TASK_TEMPLATE = """
Generate an empathetic support response for the following situation.

ORIGINAL MESSAGE:
\"\"\"
{message}
\"\"\"

CONTEXT:
- Sender name    : {name}
- Intent         : {intent}
- Urgency        : {urgency}
- Routing to     : {route}
- Next steps hint: {next_steps}

GUIDELINES:
1. Open with a warm greeting. Address the sender by first name if available.
2. Acknowledge their specific concern (donation offer, volunteer interest, complaint, or emergency).
3. For HIGH urgency: express immediate concern and assure them help is coming.
4. State the next steps clearly but briefly.
5. Close with a supportive, human statement (NOT a generic "Have a nice day").
6. Length: 80-150 words. No bullet points. Natural paragraph form.
7. Tone: warm, professional, empathetic, non-profit aligned.
8. Output ONLY the response text — no labels, no JSON, no markdown.
""".strip()
