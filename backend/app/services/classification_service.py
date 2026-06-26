def classify_issue(title: str, description: str):
    text = f"{title} {description}".lower()

    if any(keyword in text for keyword in ("water", "leakage", "pipe")):
        return {
            "category": "Water",
            "severity": "Medium",
            "department": "Water Department",
        }

    if any(keyword in text for keyword in ("streetlight", "light")):
        return {
            "category": "Streetlight",
            "severity": "Medium",
            "department": "Electrical Department",
        }

    if any(keyword in text for keyword in ("garbage", "waste")):
        return {
            "category": "Waste",
            "severity": "Low",
            "department": "Sanitation Department",
        }

    if any(keyword in text for keyword in ("pothole", "road")):
        return {
            "category": "Road",
            "severity": "High",
            "department": "Roads Department",
        }

    return {
        "category": "General",
        "severity": "Low",
        "department": "Municipal Department",
    }
