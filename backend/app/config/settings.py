"""Application configuration (environment variables loaded from `.env`)."""

from __future__ import annotations

import os

from dotenv import load_dotenv

# Load variables from a local `.env` file into the process environment.
# This makes `os.getenv("NAME")` work in local development.
load_dotenv()


class Settings:
    """Simple settings container loaded from environment variables."""

    # General app settings
    app_name: str = os.getenv("APP_NAME", "Community Hero API")
    app_env: str = os.getenv("APP_ENV", "development")
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

    # CORS settings (kept simple for now)
    cors_origin: str = os.getenv("CORS_ORIGIN", "http://localhost:3000")

    # Supabase settings (required for Supabase client)
    # Supabase settings
    supabase_url: str | None = os.getenv("SUPABASE_URL")
    supabase_anon_key: str | None = os.getenv("SUPABASE_ANON_KEY")
    supabase_service_role_key: str | None = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Create a single settings instance that can be imported anywhere.
settings = Settings()
