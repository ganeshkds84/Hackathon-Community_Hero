"""Pydantic model for tracking issue status changes over time."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class StatusHistory(BaseModel):
    """A record of a status transition for an issue (audit trail)."""

    id: str = Field(..., description="Unique status history record ID (e.g., UUID).")  # Record identifier
    issue_id: str = Field(
        ..., description="The issue ID whose status changed."
    )  # Related issue ID
    old_status: str = Field(
        ..., description="Previous status value before the change."
    )  # Status before update
    new_status: str = Field(
        ..., description="New status value after the change."
    )  # Status after update
    updated_by: str = Field(
        ..., description="User ID (or system ID) that made the change."
    )  # Actor who updated status
    timestamp: datetime = Field(
        ..., description="When the status change occurred."
    )  # Update time

