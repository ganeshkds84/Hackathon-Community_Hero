import os
import traceback

from google import genai

from app.config.settings import settings

FALLBACK_ANALYSIS = "AI analysis unavailable."
GEMINI_MODEL = "gemini-2.0-flash"


def generate_issue_analysis(title: str, description: str) -> dict[str, str]:
    api_key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY")

    print("API Key Loaded:", api_key is not None)
    if api_key:
        print("API Key Prefix:", api_key[:10])

    if not api_key:
        return {"analysis": FALLBACK_ANALYSIS}

    prompt = f"""You are a civic issue analyst for a community reporting platform.

Analyze the following community issue report and provide a short, practical response with these sections:

1. Issue Summary: 2-3 concise sentences describing the problem.
2. Estimated Public Impact: Brief assessment of how this affects residents or public safety.
3. Suggested Action: One clear recommended next step for the responsible department.

Issue Title: {title}
Issue Description: {description}

Keep the full response brief and easy for municipal staff to read."""

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        analysis = ""

        if hasattr(response, "text") and response.text:
            analysis = response.text.strip()
        if not analysis:
            return {"analysis": FALLBACK_ANALYSIS}

        return {"analysis": analysis}
    except Exception as e:
        print(f"Gemini Error: {e}")
        traceback.print_exc()
        return {"analysis": FALLBACK_ANALYSIS}
