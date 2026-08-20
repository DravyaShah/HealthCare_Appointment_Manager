import json

from google import genai

from django.conf import settings

from ai_engine.prompts.health_insights import (
    HEALTH_INSIGHT_PROMPT
)


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def generate_health_insight(appointment_reason,medicines,diagnosis,instructions,report_text):

    prompt = HEALTH_INSIGHT_PROMPT.format(
        appointment_reason=appointment_reason,
        medicines=medicines,
        diagnosis=diagnosis,
        instructions=instructions,
        report_text=report_text
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        result = (response.text or "").strip()
        result = result.replace("```json", "").replace("```", "").strip()
        return json.loads(result)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Return a fallback JSON response if the API times out or fails
        return {
            "summary": "AI service temporarily unavailable. Please try again later.",
            "key_findings": [],
            "medication_guidance": [],
            "recommendations": [],
            "foods_to_eat": [],
            "foods_to_avoid": [],
            "home_care_tips": [],
            "follow_up_questions": [
                {
                    "question": "What should I ask my doctor next?",
                    "answer": "Since the AI is temporarily unavailable, please discuss your test results directly with your healthcare provider."
                }
            ],
            "risk_factors": [],
            "confidence_level": "low"
        }

NEWS_INSIGHT_PROMPT = """
You are an expert medical analyst. Analyze the following medical news article.
Provide your analysis STRICTLY as a valid JSON object matching this structure perfectly. No markdown formatting, just the raw JSON:

{{
    "executive_summary": "A 2-3 sentence overview of the article.",
    "key_findings": ["Finding 1", "Finding 2"],
    "why_this_matters": "A concise explanation of the impact on healthcare or patients.",
    "doctor_perspective": "A professional take on how this affects clinical practice."
}}

Article Title: {title}
Article Summary/Content: {content}
"""

def generate_news_insight(title, content):
    prompt = NEWS_INSIGHT_PROMPT.format(title=title, content=content)
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        result = (response.text or "").strip()
        result = result.replace("```json", "").replace("```", "").strip()
        return json.loads(result)
    except Exception as e:
        print(f"Gemini API Error (News): {e}")
        return {
            "executive_summary": "AI summary temporarily unavailable.",
            "key_findings": ["Unable to extract findings."],
            "why_this_matters": "Service unavailable.",
            "doctor_perspective": "Service unavailable."
        }