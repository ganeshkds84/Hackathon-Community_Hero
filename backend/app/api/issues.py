from fastapi import APIRouter
from app.schemas.issue_schema import IssueCreate, IssueResponse
from app.services.issue_service import create_issue

router = APIRouter(
    prefix="/issues",
    tags=["Issues"]
)


@router.post("/report", response_model=IssueResponse)
def report_issue(issue: IssueCreate):

    created_issue = create_issue(issue)

    return created_issue