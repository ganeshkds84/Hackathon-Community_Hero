from fastapi import APIRouter
from app.schemas.issue_schema import IssueCreate, IssueResponse, SupportResponse, NearbyIssueResponse, DuplicateCheckResponse, IssueReportResponse
from app.services.issue_service import create_issue, get_all_issues,get_issue_by_id,update_issue_status,get_issue_history
from app.services.issue_service import support_issue,filter_issues,get_dashboard_summary,get_category_analytics
from app.services.location_service import get_nearby_issues
from app.services.duplicate_detection_service import check_duplicate_issue
from app.services.department_service import get_issues_by_department
from app.schemas.dashboard_schema import DashboardSummary, CategoryAnalytics
from app.schemas.status_schema import StatusUpdate
from typing import List 
from app.schemas.history_schema import HistoryResponse

router = APIRouter(
    prefix="/issues",
    tags=["Issues"]
)


@router.post("/report", response_model=IssueReportResponse)
def report_issue(issue: IssueCreate):

    return create_issue(issue)

@router.post("/check-duplicate", response_model=DuplicateCheckResponse)
def check_duplicate_issue_route(issue: IssueCreate):
    return check_duplicate_issue(
        issue.title,
        issue.description,
        issue.latitude,
        issue.longitude,
    )

@router.get("", response_model=List[IssueResponse])
def get_issues():

    issues = get_all_issues()

    return issues

@router.get("/filter")
def filter_issues_route(
    category: str | None = None,
    status: str | None = None,
    severity: str | None = None
):
    return filter_issues(
        category=category,
        status=status,
        severity=severity
    )

@router.get("/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary_route():
    return get_dashboard_summary()

@router.get("/dashboard/categories", response_model=CategoryAnalytics)
def get_category_analytics_route():
    return get_category_analytics()

@router.get("/nearby", response_model=List[NearbyIssueResponse])
def get_nearby_issues_route(
    latitude: float,
    longitude: float,
    radius_km: float = 5,
):
    return get_nearby_issues(latitude, longitude, radius_km)

@router.get("/department/{department_name}", response_model=List[IssueResponse])
def get_department_issues_route(department_name: str):
    return get_issues_by_department(department_name)

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

@router.get(
    "/{issue_id}/history",
    response_model=List[HistoryResponse]
)
def get_history(issue_id: str):

    history = get_issue_history(issue_id)

    return history

@router.patch("/{issue_id}/support", response_model=SupportResponse)
def support_issue_route(issue_id: str):
    return support_issue(issue_id)
