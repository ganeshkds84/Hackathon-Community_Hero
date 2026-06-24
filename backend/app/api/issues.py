from fastapi import APIRouter
from app.schemas.issue_schema import IssueCreate, IssueResponse
from app.services.issue_service import create_issue, get_all_issues,get_issue_by_id,update_issue_status
from app.schemas.status_schema import StatusUpdate
from typing import List 

router = APIRouter(
    prefix="/issues",
    tags=["Issues"]
)


@router.post("/report", response_model=IssueResponse)
def report_issue(issue: IssueCreate):

    created_issue = create_issue(issue)

    return created_issue

@router.get("", response_model=List[IssueResponse])
def get_issues():

    issues = get_all_issues()

    return issues

@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue(issue_id: str):

    issue = get_issue_by_id(issue_id)

    return issue

@router.patch("/{issue_id}/status",
              response_model=IssueResponse)
def change_status(
    issue_id: str,
    status_update: StatusUpdate
):

    updated_issue = update_issue_status(
        issue_id,
        status_update.status
    )

    return updated_issue