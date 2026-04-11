"""
Gemini AI service for structured pre-consultation report generation.

Rules:
- NEVER produce a medical diagnosis
- NEVER give treatment advice
- Output is informational only — to help the doctor focus during consultation
"""
import json
import re
from typing import Any

import google.generativeai as genai

from config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

_MODEL_NAME = "gemini-1.5-flash"

_SYSTEM_PROMPT = """
You are a medical pre-consultation data extraction assistant for Sambhavna Trust Clinic, Bhopal.

Your job is to read a patient's symptom conversation and produce a STRUCTURED JSON report for the doctor.

STRICT RULES:
1. DO NOT diagnose the patient.
2. DO NOT recommend medications or treatments.
3. DO NOT make definitive medical statements.
4. Output ONLY valid JSON — no markdown, no code fences, no explanation.
5. Use professional medical terminology where appropriate.
6. risk_level must be "low", "medium", or "high" based on symptom severity and urgency.

Output format (JSON only):
{
  "summary": "<2-3 sentence clinical summary of what the patient described>",
  "key_symptoms": ["<symptom 1>", "<symptom 2>", ...],
  "possible_conditions": ["<condition 1>", "<condition 2>", "<condition 3>"],
  "risk_level": "low" | "medium" | "high",
  "doctor_focus": ["<focus point 1>", "<focus point 2>", ...]
}
"""


def _build_conversation_text(messages: list[dict]) -> str:
    lines = []
    for msg in messages:
        role = "Assistant" if msg["sender"] == "ai" else "Patient"
        lines.append(f"{role}: {msg['message']}")
    return "\n".join(lines)


def generate_report(messages: list[dict]) -> dict[str, Any]:
    """
    Takes list of {sender: 'ai'|'patient', message: str}
    Returns structured dict matching AIReportOut schema.
    Raises ValueError on parse failure.
    """
    if not settings.GEMINI_API_KEY:
        return _fallback_report()

    conversation = _build_conversation_text(messages)

    prompt = f"""{_SYSTEM_PROMPT}

--- Patient Conversation ---
{conversation}
--- End Conversation ---

Now produce the JSON report:"""

    model = genai.GenerativeModel(_MODEL_NAME)
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.3,
            max_output_tokens=1024,
        ),
    )

    raw = response.text.strip()

    # Strip markdown code fences if Gemini wraps output anyway
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned non-JSON: {raw[:200]}") from e

    # Normalise risk_level to lowercase
    data["risk_level"] = str(data.get("risk_level", "low")).lower()
    if data["risk_level"] not in ("low", "medium", "high"):
        data["risk_level"] = "low"

    # Ensure all list fields exist
    for key in ("key_symptoms", "possible_conditions", "doctor_focus"):
        if key not in data or not isinstance(data[key], list):
            data[key] = []

    return data


def _fallback_report() -> dict[str, Any]:
    """Used when GEMINI_API_KEY is not set (dev/test mode)."""
    return {
        "summary": "Patient reported symptoms through the pre-consultation chat. "
                   "Full symptom data has been recorded and is available in the conversation log. "
                   "Please review the chat transcript for complete details.",
        "key_symptoms": ["Symptoms recorded via chat", "Requires manual review"],
        "possible_conditions": ["To be determined by physician"],
        "risk_level": "low",
        "doctor_focus": [
            "Review full symptom chat transcript",
            "Conduct thorough physical examination",
            "Take detailed history during consultation",
        ],
    }
