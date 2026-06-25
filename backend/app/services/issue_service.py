from app.database.supabase_client import get_supabase_client
from app.schemas.issue_schema import IssueCreate
from app.services.classification_service import classify_issue
from fastapi import HTTPException


def create_issue(issue: IssueCreate):
    supabase = get_supabase_client()

    classification = classify_issue(issue.title, issue.description)

    data = {
        "title": issue.title,
        "description": issue.description,
        "latitude": issue.latitude,
        "longitude": issue.longitude,
        "category": classification["category"],
        "severity": classification["severity"],
        "department": classification["department"],
    }

    response = (
        supabase
        .table("issues")
        .insert(data)
        .execute()
    )

    return response.data[0]

def get_all_issues():
    supabase = get_supabase_client()

    response = (
        supabase
        .table("issues")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data

def get_issue_by_id(issue_id: str):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("issues")
        .select("*")
        .eq("id", issue_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    return response.data[0]

def update_issue_status(issue_id: str, status: str):

    supabase = get_supabase_client()

    response = (
        supabase
        .table("issues")
        .select("*")
        .eq("id", issue_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    current_issue = response.data[0]
    old_status = current_issue["status"]

    updated_response = (
        supabase
        .table("issues")
        .update({"status": status})
        .eq("id", issue_id)
        .execute()
    )

    history_data = {
        "issue_id": issue_id,
        "old_status": old_status,
        "new_status": status
    }

    (
        supabase
        .table("status_history")
        .insert(history_data)
        .execute()
    )

    return updated_response.data[0]

def get_issue_history(issue_id: str):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("status_history")
        .select("*")
        .eq("issue_id", issue_id)
        .order("changed_at")
        .execute()
    )

    return response.data

def support_issue(issue_id: str):
    supabase = get_supabase_client()
    response = (
        supabase.table("issues")
        .select("*")
        .eq("id", issue_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Issue not found")

    issue = response.data[0]
    current_support = issue.get("support_count", 0)

    if current_support is None:
        current_support = 0

    new_support = current_support + 1

    (
        supabase.table("issues")
        .update({"support_count": new_support})
        .eq("id", issue_id)
        .execute()
    )

    return {
        "id": issue_id,
        "support_count": new_support
    }

def filter_issues(
    category: str | None = None,
    status: str | None = None,
    severity: str | None = None
):
    supabase = get_supabase_client()

    query = supabase.table("issues").select("*")

    if category:
        query = query.eq("category", category)

    if status:
        query = query.eq("status", status)

    if severity:
        query = query.eq("severity", severity)

    response = query.execute()

    return response.data

def get_dashboard_summary():
    supabase = get_supabase_client()

    response = (
        supabase
        .table("issues")
        .select("*")
        .execute()
    )

    issues = response.data
    total_issues = len(issues)
    reported = sum(1 for issue in issues if issue.get("status") == "Reported")
    in_progress = sum(1 for issue in issues if issue.get("status") == "In Progress")
    resolved = sum(1 for issue in issues if issue.get("status") == "Resolved")

    return {
        "total_issues": total_issues,
        "reported": reported,
        "in_progress": in_progress,
        "resolved": resolved,
    }