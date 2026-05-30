"""
FastAPI application entry point.

Startup sequence:
    1. Load settings from .env
    2. Configure structured logging
    3. Warm up the LLM singleton
    4. Register routes
    5. Serve via Uvicorn

Run locally:
    uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.config.settings import get_settings
from backend.routes.health import router as health_router
from backend.routes.triage import router as triage_router
from backend.utils.logger import configure_logging, get_logger

# ─────────────────────────────────────────────────────────────────────────────
#  Bootstrap
# ─────────────────────────────────────────────────────────────────────────────
settings = get_settings()

configure_logging(
    log_level=settings.log_level,
    is_production=(settings.app_env == "production"),
)

logger = get_logger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
#  Application factory
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Non-Profit Support Triage Agent",
    description=(
        "An intelligent multi-agent system that classifies, enriches, and routes "
        "incoming non-profit support messages using CrewAI + Groq (Llama 3)."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(health_router)
app.include_router(triage_router)

# ── Serve frontend static files ───────────────────────────────────────────────
import os
_FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.isdir(_FRONTEND_DIR):
    app.mount("/ui", StaticFiles(directory=_FRONTEND_DIR, html=True), name="frontend")

# ─────────────────────────────────────────────────────────────────────────────
#  Startup / Shutdown events
# ─────────────────────────────────────────────────────────────────────────────


@app.on_event("startup")
async def on_startup() -> None:
    logger.info(
        "application_starting",
        env=settings.app_env,
        model=settings.groq_model,
        port=settings.app_port,
    )
    # Eagerly validate the Groq key so misconfiguration surfaces immediately
    if not settings.groq_api_key:
        logger.warning(
            "groq_key_missing",
            hint="Set GROQ_API_KEY in your .env file before sending requests.",
        )
    else:
        logger.info("groq_key_loaded", model=settings.groq_model)


@app.on_event("shutdown")
async def on_shutdown() -> None:
    logger.info("application_shutdown")


# ─────────────────────────────────────────────────────────────────────────────
#  Dev runner
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=True,
        log_level=settings.log_level.lower(),
    )
