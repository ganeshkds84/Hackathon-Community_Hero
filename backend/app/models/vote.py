"""Pydantic model representing a vote/support on an issue."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class Vote(BaseModel):
    """A single user's vote on a specific issue."""

    id: str = Field(..., description="Unique vote ID (e.g., UUID).")  # Vote identifier
    issue_id: str = Field(..., description="The ID of the issue being voted on.")  # Target issue ID
    user_id: str = Field(..., description="The ID of the user who cast the vote.")  # Voter user ID
    vote_type: str = Field(
        ..., description="Type of vote (e.g., support, downvote)."
    )  # Vote category/meaning
    created_at: datetime = Field(
        ..., description="Timestamp when the vote was created."
    )  # Vote time

