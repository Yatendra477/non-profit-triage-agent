"""
Health check route.
"""

from fastapi import APIRouter

from backend.config.settings import get_settings
from backend.models.schemas import HealthResponse

router = APIRouter(tags=["health"])
settings = get_settings()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health Check",
    description="Returns the operational status of the triage service.",
)
async def health_check() -> HealthResponse:
    """Lightweight liveness probe — safe to call frequently."""
    return HealthResponse(
        status="ok",
        version="1.0.0",
        environment=settings.app_env,
    )
