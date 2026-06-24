from pydantic import BaseModel
from typing import Literal

class StatusUpdate(BaseModel):
    status: Literal[
        "Reported",
        "In Progress",
        "Resolved"
    ]