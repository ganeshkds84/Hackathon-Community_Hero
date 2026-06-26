from app.database.supabase_client import get_supabase_client


def get_issues_by_department(department_name: str):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("issues")
        .select("*")
        .execute()
    )

    department_name_lower = department_name.lower()
    return [
        issue for issue in response.data
        if issue.get("department") is not None
        and issue.get("department").lower() == department_name_lower
    ]
