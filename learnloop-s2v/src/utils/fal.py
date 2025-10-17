import os
from pathlib import Path
from typing import Any, Dict, Optional, Callable

# Load environment variables from learnloop-s2v/.env if python-dotenv is available
try:
    from dotenv import load_dotenv  # type: ignore

    load_dotenv(dotenv_path=str(Path(__file__).resolve().parents[2] / ".env"))
except Exception:
    pass

import fal_client  # type: ignore


def _require_fal_key() -> None:
    if not os.getenv("FAL_KEY") and not os.getenv("FAL_API_KEY"):
        raise RuntimeError("FAL_KEY is not set in the environment")


def subscribe(
    model_id: str,
    arguments: Dict[str, Any],
    with_logs: bool = True,
    on_queue_update: Optional[Callable[[Any], None]] = None,
) -> Dict[str, Any]:
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
    _require_fal_key()
    return fal_client.submit(model_id, arguments=arguments, webhook_url=webhook_url)


def status(model_id: str, request_id: str, with_logs: bool = False) -> Dict[str, Any]:
    _require_fal_key()
    return fal_client.status(model_id, request_id, with_logs=with_logs)


def result(model_id: str, request_id: str) -> Dict[str, Any]:
    _require_fal_key()
    return fal_client.result(model_id, request_id)


