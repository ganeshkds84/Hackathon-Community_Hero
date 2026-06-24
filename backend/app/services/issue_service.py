from app.database.supabase_client import get_supabase_client
from app.schemas.issue_schema import IssueCreate
from fastapi import HTTPException


def create_issue(issue: IssueCreate):
    supabase = get_supabase_client()

    data = {
        "title": issue.title,
        "description": issue.description,
        "latitude": issue.latitude,
        "longitude": issue.longitude,
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