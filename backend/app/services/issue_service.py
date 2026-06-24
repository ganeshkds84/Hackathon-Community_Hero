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