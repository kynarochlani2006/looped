"""
Thin wrappers around the `fal_client` SDK with small conveniences:

- Loads environment variables from the repo-level `.env` (if python-dotenv is available)
- Validates presence of the FAL API key before every call
- Normalizes return values to dicts where possible
"""

import os
from pathlib import Path
from typing import Any, Dict, Optional, Callable

# Attempt to load environment variables from "learnloop-s2v/.env".
# This is best-effort and will be silently ignored if python-dotenv is not installed.
# Load environment variables from learnloop-s2v/.env if python-dotenv is available
try:
    from dotenv import load_dotenv  # type: ignore

    load_dotenv(dotenv_path=str(Path(__file__).resolve().parents[2] / ".env"))
except Exception:
    pass

# Import the FAL client SDK. We type-ignore to avoid requiring local type stubs.
import fal_client  # type: ignore


def _require_fal_key() -> None:
    """Raise if neither FAL_KEY nor FAL_API_KEY is present in the environment."""
    if not os.getenv("FAL_KEY") and not os.getenv("FAL_API_KEY"):
        raise RuntimeError("FAL_KEY is not set in the environment")


def subscribe(
    model_id: str,
    arguments: Dict[str, Any],
    with_logs: bool = True,
    on_queue_update: Optional[Callable[[Any], None]] = None,
) -> Dict[str, Any]:
    """Submit a request to a FAL model and wait for the result with optional logs.

    Args:
        model_id: Fully qualified model route, e.g. "argil/avatars/text-to-video".
        arguments: Payload passed to FAL.
        with_logs: If True, FAL will stream queue/worker logs.
        on_queue_update: Optional callback invoked on queue state changes.

    Returns:
        A dict-like result object. If the SDK returns a custom object exposing
        a `.dict()` method, we convert it; otherwise we return the raw value.
    """
    _require_fal_key()
    result = fal_client.subscribe(
        model_id,
        arguments=arguments,
        with_logs=with_logs,
        on_queue_update=on_queue_update,
    )
    # Convert to dict if SDK object exposes dict(); otherwise return as-is
    return getattr(result, "dict", lambda: result)()


def submit(model_id: str, arguments: Dict[str, Any], webhook_url: Optional[str] = None):
    """Fire-and-forget submission with optional webhook callback URL."""
    _require_fal_key()
    return fal_client.submit(model_id, arguments=arguments, webhook_url=webhook_url)


def status(model_id: str, request_id: str, with_logs: bool = False) -> Dict[str, Any]:
    """Poll the status of a previously submitted request."""
    _require_fal_key()
    return fal_client.status(model_id, request_id, with_logs=with_logs)


def result(model_id: str, request_id: str) -> Dict[str, Any]:
    """Fetch the final result payload for a completed request."""
    _require_fal_key()
    return fal_client.result(model_id, request_id)


