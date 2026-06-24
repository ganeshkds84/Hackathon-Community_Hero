from app.database.supabase_client import get_supabase_client
from app.schemas.issue_schema import IssueCreate


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