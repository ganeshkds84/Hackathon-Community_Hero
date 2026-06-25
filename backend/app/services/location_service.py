import math

from app.database.supabase_client import get_supabase_client

EARTH_RADIUS_KM = 6371.0


def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return EARTH_RADIUS_KM * c


def get_nearby_issues(latitude: float, longitude: float, radius_km: float):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("issues")
        .select("*")
        .execute()
    )

    nearby = []
    for issue in response.data:
        issue_lat = issue.get("latitude")
        issue_lon = issue.get("longitude")
        if issue_lat is None or issue_lon is None:
            continue

        distance = calculate_distance_km(latitude, longitude, issue_lat, issue_lon)
        if distance <= radius_km:
            nearby.append({
                "id": issue["id"],
                "title": issue["title"],
                "category": issue.get("category"),
                "status": issue.get("status"),
                "distance_km": distance,
            })

    nearby.sort(key=lambda item: item["distance_km"])
    return nearby
