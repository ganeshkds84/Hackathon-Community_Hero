"""Pydantic schemas for issue-related API inputs/outputs.

Schemas are the request/response shapes used by API endpoints.
This file does not create any routes in this phase.
"""

from __future__ import annotations
from uuid import UUID

from pydantic import BaseModel, Field


class IssueCreate(BaseModel):
    """Fields required from a client when creating a new issue."""

    title: str = Field(..., description="Short title for the issue being reported.")  # Issue title
    description: str = Field(
        ..., description="Detailed description written by the reporter."
    )  # Issue details
    latitude: float = Field(..., description="Latitude where the issue is located.")  # Map latitude
    longitude: float = Field(..., description="Longitude where the issue is located.")  # Map longitude


class IssueResponse(BaseModel):
    """Fields returned to clients when reading an issue."""

    id: str = Field(..., description="Unique issue ID.")  # Issue identifier
    title: str = Field(..., description="Short title for the issue.")  # Issue title
    description: str = Field(..., description="Detailed issue description.")  # Issue details
    category: str | None = Field(
        default=None, description="Category label (may be set later)."
    )  # Category (optional at first)
    severity: str | None = Field(
        default=None, description="Severity label (may be set later)."
    )  # Severity (optional at first)
    status: str = Field(..., description="Current status of the issue.")  # Workflow status
    department: str | None = Field(
        default=None, description="Department responsible for handling the issue."
    )  # Assigned department (optional)
    latitude: float = Field(..., description="Latitude of the issue location.")  # Map latitude
    longitude: float = Field(..., description="Longitude of the issue location.")  # Map longitude
    image_url: str | None = Field(
        default=None, description="Optional URL of an image associated with the issue."
    )  # Image URL (optional)

class SupportResponse(BaseModel):
    id: UUID
    support_count: int
