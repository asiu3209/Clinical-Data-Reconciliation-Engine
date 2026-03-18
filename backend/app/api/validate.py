from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List
from ai.llm_service import callLLm
import json

class ValidateRequest(BaseModel):
    demographics: Dict
    medications: List[str]
    allergies: List[str]
    conditions: List[str]
    vital_signs: Dict
    last_updated: str

router = APIRouter()

def buildValidationPrompt(record: Dict):
    return f"""
You are checking healthcare data quality.

Patient record:
{json.dumps(record, indent=2)}

Detect:
- physiologically impossible vital signs
- drug-disease mismatches
- missing critical information

Return ONLY raw JSON in this format. Do not include explanations, markdown, or code blocks.

JSON format:

{{
"overall_score": 0,
"breakdown": {{
    "completeness": 0,
    "accuracy": 0,
    "timeliness": 0,
    "clinical_plausibility": 0
}},
"issues_detected": [
    {{
        "field": "string",
        "issue": "string",
        "severity": "low | medium | high"
    }}
]
}}

### Scoring rules:
- overall_score: 0-100, average of the four breakdown scores
- completeness: % of required information present
- accuracy: % of medications, conditions, allergies, and demographics correctly listed
- timeliness: 100 if record last_updated is within 1 month, 75 if 1-3 months, 50 if 3-6 months, 25 if 6-12 months, 0 if older
- clinical_plausibility: 100 if vital signs are normal, scale down for abnormal values
- provide issues that show abnormal information, such as old data, missing information, etc
"""

@router.post("/validate/data-quality")
def validate(data: ValidateRequest):
    record = data.model_dump()
    prompt = buildValidationPrompt(record)
    response = callLLm(prompt)
    return response