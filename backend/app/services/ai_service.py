import json

from openai import OpenAI, RateLimitError

from app.config import OPENROUTER_API_KEY


client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)


def generate_ai_analysis(analytics: dict):

    prompt = f"""
You are an experienced e-commerce business analyst.

A vendor dashboard has already calculated all business metrics.

DO NOT repeat the metrics.

Instead,

1. Write a short executive summary.
2. Give exactly 3 actionable recommendations.
3. Give exactly 2 business risks.

Return ONLY valid JSON.

Format:

{{
    "summary": "...",

    "recommendations": [
        "...",
        "...",
        "..."
    ],

    "risks": [
        "...",
        "..."
    ]
}}

Vendor Analytics:

{json.dumps(analytics, indent=2)}
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b:free",
            temperature=0.4,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        content = response.choices[0].message.content

        print("\n========== AI RESPONSE ==========")
        print(content)
        print("=================================\n")

        return json.loads(content)

    except RateLimitError:

        print("OpenRouter daily limit reached.")

        return {
            "summary": "AI analysis is temporarily unavailable because the OpenRouter daily request limit has been reached.",
            "recommendations": [
                "Retry after the daily API quota resets.",
                "Use the benchmark and business insights to evaluate current performance.",
                "Consider upgrading the OpenRouter plan if frequent AI analysis is required."
            ],
            "risks": [
                "Live AI recommendations cannot be generated until API access is restored.",
                "Business decisions are currently based only on calculated analytics."
            ]
        }

    except json.JSONDecodeError:

        print("AI returned invalid JSON.")

        return {
            "summary": "The AI generated an invalid response format.",
            "recommendations": [
                "Retry the analysis.",
                "Verify the AI prompt returns JSON only.",
                "Check the raw AI response in the terminal."
            ],
            "risks": [
                "The AI output could not be parsed.",
                "No personalized recommendations are available."
            ]
        }

    except Exception as e:

        print(f"AI Error: {e}")

        return {
            "summary": "AI analysis is currently unavailable.",
            "recommendations": [
                "Try again in a few minutes.",
                "Verify the API key and internet connection.",
                "Check the backend logs for additional details."
            ],
            "risks": [
                "Unable to retrieve AI-generated business insights.",
                "External AI service is temporarily unavailable."
            ]
        }