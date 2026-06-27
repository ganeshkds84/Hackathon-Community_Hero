"""Reusable Supabase client for the backend.

This file only creates a client object. It does not create tables, run queries,
or define any API routes.
"""

from __future__ import annotations

import os
from typing import Any

from app.config.settings import settings

_client: Any | None = None

_PLACEHOLDER_SERVICE_KEYS = {
    "",
    "your_actual_service_role_key",
    "your-service-role-key",
}


def _resolve_supabase_api_key() -> str:
    """Prefer the secret/service role key for backend operations such as Storage uploads."""
    service_role_key = settings.supabase_service_role_key or os.getenv("SUPABASE_SECRET_KEY")

    if service_role_key and service_role_key.strip() not in _PLACEHOLDER_SERVICE_KEYS:
        if service_role_key.startswith(("eyJ", "sb_secret_")):
            return service_role_key

    if not settings.supabase_anon_key:
        raise RuntimeError(
            "Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY in "
            "your backend/.env file (copy from backend/.env.example)."
        )

    return settings.supabase_anon_key


def get_supabase_client() -> Any:
    """Create (once) and return a Supabase client.

    Raises:
        RuntimeError: if required environment variables are missing.
        RuntimeError: if the Supabase Python SDK is not installed.
    """

    global _client

    # Return the already-created client (singleton pattern).
    if _client is not None:
        return _client

    # Validate required configuration.
    if not settings.supabase_url:
        raise RuntimeError(
            "Missing Supabase configuration. Set SUPABASE_URL in "
            "your backend/.env file (copy from backend/.env.example)."
        )

    api_key = _resolve_supabase_api_key()

    # Import here so the rest of the app can still run without Supabase installed
    # (helpful during early development).
    try:
        from supabase import create_client  # type: ignore
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "Supabase SDK not installed. Install it with: pip install supabase"
        ) from exc

    # Create and cache the client.
    _client = create_client(
        settings.supabase_url,
        api_key,
    )
    return _client
