from fastapi import APIRouter
from app.schemas.issue_schema import IssueCreate, IssueResponse
from app.services.issue_service import create_issue, get_all_issues,get_issue_by_id
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