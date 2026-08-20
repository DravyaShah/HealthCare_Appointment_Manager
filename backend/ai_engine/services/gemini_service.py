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

PRE_VISIT_PROMPT = """
Analyse these symptoms and return: urgency level (Low / Medium / High), chief complaint, and three suggested questions for the doctor.
Provide your analysis STRICTLY as a valid JSON object. No markdown formatting, just the raw JSON:

{{
    "urgency_level": "Low/Medium/High",
    "chief_complaint": "Brief description of the main issue",
    "suggested_questions": ["Question 1", "Question 2", "Question 3"]
}}

Symptoms: {symptoms}
"""

def generate_pre_visit_summary(symptoms):
    prompt = PRE_VISIT_PROMPT.format(symptoms=symptoms)
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        result = (response.text or "").strip()
        result = result.replace("```json", "").replace("```", "").strip()
        return json.loads(result)
    except Exception as e:
        print(f"Gemini API Error (Pre-visit): {e}")
        return {
            "urgency_level": "Medium",
            "chief_complaint": symptoms[:50] + "..." if len(symptoms) > 50 else symptoms,
            "suggested_questions": ["What is the likely cause of my symptoms?", "Are there any tests I need to take?", "What are my treatment options?"]
        }

POST_VISIT_PROMPT = """
Convert these clinical notes into a patient-friendly summary with medication schedule and follow-up steps.
Provide your analysis STRICTLY as a valid JSON object. No markdown formatting, just the raw JSON:

{{
    "patient_friendly_summary": "A simple explanation of the visit and diagnosis",
    "medication_schedule": [
        {{"name": "Medication 1", "frequency": "frequency details", "duration_days": 5}}
    ],
    "follow_up_steps": ["Step 1", "Step 2"]
}}

Clinical Notes: {notes}
"""

def generate_post_visit_summary(notes):
    prompt = POST_VISIT_PROMPT.format(notes=notes)
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        result = (response.text or "").strip()
        result = result.replace("```json", "").replace("```", "").strip()
        return json.loads(result)
    except Exception as e:
        print(f"Gemini API Error (Post-visit): {e}")
        return {
            "patient_friendly_summary": "AI summary temporarily unavailable. Please refer to your doctor's original notes.",
            "medication_schedule": [],
            "follow_up_steps": ["Follow up as directed by your physician."]
        }