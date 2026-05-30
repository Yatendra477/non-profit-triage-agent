"""
LLM service: shared ChatGroq instance (Llama 3.3-70b via Groq).

A singleton LLM is created once at module import time and reused across all
agents. Swap the model via GROQ_MODEL in your .env file.

Groq free-tier limits:
  llama-3.3-70b-versatile : 30 RPM, 14,400 req/day, 100K TPM
  llama-3.1-8b-instant    : 30 RPM, 14,400 req/day, 100K TPM
Retry logic handles transient 429s automatically.
"""

from __future__ import annotations

from functools import lru_cache

from langchain_groq import ChatGroq
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from backend.config.settings import get_settings
from backend.utils.logger import get_logger

logger = get_logger(__name__)
settings = get_settings()


@lru_cache(maxsize=1)
def get_llm() -> ChatGroq:
    """
    Build and return a cached ChatGroq instance.
    """
    if not settings.groq_api_key:
        raise EnvironmentError(
            "GROQ_API_KEY is not set. "
            "Add your Groq API key to the .env file."
        )

    logger.info(
        "llm_initialised",
        provider="groq",
        model=settings.groq_model,
        temperature=settings.groq_temperature,
    )

    return ChatGroq(
        api_key=settings.groq_api_key,
        model=settings.groq_model,
        temperature=settings.groq_temperature,
        max_tokens=settings.groq_max_tokens,
    )


# ─────────────────────────────────────────────────────────────────────────────
#  Retry-wrapped LLM call helper  (handles 429 rate limits automatically)
# ─────────────────────────────────────────────────────────────────────────────

def _is_rate_limit(exc: Exception) -> bool:
    """Return True if the exception is a Groq 429 / rate limit error."""
    msg = str(exc).lower()
    return "rate_limit" in msg or "429" in msg or "rate" in msg


@retry(
    retry=retry_if_exception_type(Exception),
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=2, min=5, max=60),
    reraise=True,
)
def invoke_llm(prompt: str) -> str:
    """
    Invoke the LLM with automatic retry on rate-limit errors.

    Args:
        prompt: The full prompt string to send to the model.

    Returns:
        The model's response content as a string.
    """
    llm = get_llm()
    response = llm.invoke(prompt)
    content = response.content if hasattr(response, "content") else str(response)
    logger.debug("llm_response_received", preview=content[:200])
    return content
