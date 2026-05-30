"""
Structured logging configuration using structlog.

Call `configure_logging()` once at application startup.
Use `get_logger(__name__)` anywhere in the codebase to obtain a bound logger.

Log output:
- Development: pretty-printed, colourised console output
- Production : JSON lines suitable for log aggregation (Datadog, CloudWatch, etc.)
"""

import logging
import sys
from typing import Any

import structlog


def configure_logging(log_level: str = "INFO", is_production: bool = False) -> None:
    """Set up structlog and stdlib logging.

    Args:
        log_level: One of DEBUG, INFO, WARNING, ERROR, CRITICAL.
        is_production: When True, emits JSON lines; otherwise pretty console output.
    """
    # NOTE: add_logger_name requires stdlib LoggerFactory; skip it to stay
    # compatible with the lightweight PrintLoggerFactory used here.
    shared_processors: list[Any] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    if is_production:
        renderer = structlog.processors.JSONRenderer()
    else:
        renderer = structlog.dev.ConsoleRenderer(colors=True)  # type: ignore[assignment]

    structlog.configure(
        processors=shared_processors + [renderer],
        wrapper_class=structlog.make_filtering_bound_logger(
            logging.getLevelName(log_level.upper())
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(file=sys.stdout),
        cache_logger_on_first_use=True,
    )

    # Also configure stdlib logging so third-party libraries pipe through
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=logging.getLevelName(log_level.upper()),
    )


def get_logger(name: str) -> structlog.BoundLogger:
    """Return a bound structlog logger bound with the module name as a key."""
    return structlog.get_logger().bind(module=name)
