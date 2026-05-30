"""
Triage route — POST /triage

Accepts a raw support message, runs it through the parallel LLM pipeline,
and returns a structured TriageResponse.
"""

from __future__ import annotations

import time

from fastapi import APIRouter, HTTPException, Request, status

from backend.models.schemas import TriageRequest, TriageResponse
from backend.services.triage_service import run_triage
from backend.utils.logger import get_logger

router = APIRouter(tags=["triage"])
logger = get_logger(__name__)


@router.post(
    "/triage",
    response_model=TriageResponse,
    status_code=status.HTTP_200_OK,
    summary="Triage a Support Message",
    description=(
        "Classifies the incoming message by intent and urgency, extracts named "
        "entities, applies routing rules, and generates an empathetic AI response."
    ),
)
async def triage_message(request: Request, payload: TriageRequest) -> TriageResponse:
    """
    Full triage pipeline endpoint.

    - **message**: The raw support message (3–4000 characters).
    - **session_id**: Optional. Provide the same ID across requests to enable
      conversation memory.
    """
    start = time.perf_counter()
    client_ip = request.client.host if request.client else "unknown"

    logger.info(
        "triage_endpoint_called",
        client_ip=client_ip,
        session_id=payload.session_id,
        message_length=len(payload.message),
    )

    try:
        result = await run_triage(
            message=payload.message,
            session_id=payload.session_id,
        )
    except EnvironmentError as exc:
        # Missing API key or configuration error
        logger.error("triage_config_error", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        # Surface rate-limit / quota errors as 429 so the frontend can handle them
        err_str = str(exc).lower()
        is_rate_limit = (
            "resource_exhausted" in err_str
            or "429" in err_str
            or "quota" in err_str
            or "rate" in err_str
        )
        if is_rate_limit:
            logger.warning("triage_rate_limit", error=str(exc))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "quota: Groq API daily quota exhausted. "
                    "Please wait a few hours and try again, or upgrade your API plan."
                ),
            ) from exc
        logger.error("triage_unexpected_error", error=str(exc), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during triage. Please try again.",
        ) from exc

    elapsed = (time.perf_counter() - start) * 1000
    logger.info(
        "triage_endpoint_completed",
        route=result.route,
        intent=result.intent,
        urgency=result.urgency,
        elapsed_ms=round(elapsed, 1),
    )

    return result
