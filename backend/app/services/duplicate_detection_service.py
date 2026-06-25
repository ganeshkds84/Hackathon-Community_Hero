from app.database.supabase_client import get_supabase_client
from app.services.classification_service import classify_issue
from app.services.location_service import calculate_distance_km

DUPLICATE_RADIUS_KM = 0.1


def check_duplicate_issue(
    title: str,
    description: str,
    latitude: float,
    longitude: float,
):
    classification = classify_issue(title, description)
    incoming_category = classification["category"]

    supabase = get_supabase_client()

    response = (
        supabase
        .table("issues")
        .select("*")
        .execute()
    )

    for issue in response.data:
        issue_lat = issue.get("latitude")
        issue_lon = issue.get("longitude")
        if issue_lat is None or issue_lon is None:
            continue

        issue_category = issue.get("category")
        if issue_category is None:
            continue

        if issue_category != incoming_category:
            continue

        distance = calculate_distance_km(latitude, longitude, issue_lat, issue_lon)
        if distance <= DUPLICATE_RADIUS_KM:
            return {
                "possible_duplicate": True,
                "existing_issue_id": issue["id"],
                "message": "Similar issue already exists nearby",
            }

    return {
        "possible_duplicate": False,
        "existing_issue_id": None,
        "message": "No duplicate found",
    }
