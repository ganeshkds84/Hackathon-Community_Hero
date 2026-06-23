"""Pydantic model for a platform user.

Note: This is NOT a database model yet. It is a plain Pydantic BaseModel that
describes the shape of user data in Python.
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class User(BaseModel):
    """A user in the Community Hero platform."""

    id: str = Field(..., description="Unique user ID (e.g., UUID from Supabase).")  # User identifier
    name: str = Field(..., description="Display name shown in the app.")  # Friendly name
    email: str = Field(..., description="User email address used for login/contact.")  # Email address
    avatar_url: str | None = Field(
        default=None, description="Optional profile picture URL."
    )  # Profile image URL (optional)
    points: int = Field(default=0, description="Gamification/community points total.")  # Points earned
    created_at: datetime = Field(
        ..., description="Timestamp when the user was created."
    )  # Account creation time

