from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_issues: int
    reported: int
    in_progress: int
    resolved: int
