"""
Classifier Agent — prompt templates for classifying support messages.

Determines:
  - intent  : Donation | Volunteer | Complaint | Emergency Help | General Inquiry
  - urgency : High | Medium | Low
"""

from __future__ import annotations

CLASSIFY_TASK_TEMPLATE = """
Analyse the following support message and classify it.

MESSAGE:
\"\"\"
{message}
\"\"\"

INSTRUCTIONS:
1. Determine the PRIMARY intent from EXACTLY ONE of these options:
   - Donation        : sender wants to contribute money, goods, or resources
   - Volunteer       : sender wants to offer their time or skills
   - Complaint       : sender is unhappy or reporting an issue
   - Emergency Help  : sender or someone they know needs urgent assistance
   - General Inquiry : anything that does not fit the above

2. Determine urgency:
   - High   : life-threatening, immediate crisis, or explicit emergency language
   - Medium : time-sensitive but not life-threatening (e.g., pending deadline)
   - Low    : routine, informational, or no time pressure

3. Output ONLY a JSON object — no explanation, no markdown fences:
{{
  "intent": "<one of the five options above>",
  "urgency": "High | Medium | Low"
}}
""".strip()
