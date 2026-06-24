from pydantic import BaseModel
from datetime import datetime


class HistoryResponse(BaseModel):
    old_status: str | None
    new_status: str
    changed_at: datetime