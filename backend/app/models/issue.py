"""Pydantic model for a community-reported issue.

This describes the data shape for an issue report. It does not connect to a
database in this phase.
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class Issue(BaseModel):
    """An issue reported by a community member (e.g., pothole, broken light)."""

    id: str = Field(..., description="Unique issue ID (e.g., UUID).")  # Issue identifier
    title: str = Field(..., description="Short human-readable title for the issue.")  # Issue title
    description: str = Field(
        ..., description="Detailed description of the problem."
    )  # Full issue details
    category: str = Field(
        ..., description="Issue category (e.g., Roads, Sanitation, Safety)."
    )  # Category label
    severity: str = Field(
        ..., description="Severity level (e.g., low, medium, high)."
    )  # Severity label
    latitude: float = Field(..., description="Latitude of the issue location.")  # Map latitude
    longitude: float = Field(..., description="Longitude of the issue location.")  # Map longitude
    image_url: str | None = Field(
        default=None, description="Optional image evidence URL."
    )  # Photo URL (optional)
    status: str = Field(
        ..., description="Current status (e.g., open, in_progress, resolved)."
    )  # Current workflow status
    department: str | None = Field(
        default=None, description="Responsible department (if assigned)."
    )  # Owning department (optional)
    reporter_id: str = Field(
        ..., description="User ID of the person who reported the issue."
    )  # Reporter user ID
    support_count: int = Field(
        default=0, description="Number of community supports/upvotes."
    )  # Support tally
    created_at: datetime = Field(
        ..., description="Timestamp when the issue was created."
    )  # Issue creation time

