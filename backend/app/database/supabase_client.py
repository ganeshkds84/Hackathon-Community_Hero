"""Reusable Supabase client for the backend.

This file only creates a client object. It does not create tables, run queries,
or define any API routes.
"""

from __future__ import annotations

from typing import Any

from app.config.settings import settings

_client: Any | None = None


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
    if not settings.supabase_url or not settings.supabase_anon_key:
        raise RuntimeError(
            "Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY in "
            "your backend/.env file (copy from backend/.env.example)."
        )

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
            settings.supabase_anon_key)
    return _client

