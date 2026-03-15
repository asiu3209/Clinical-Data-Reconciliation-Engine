from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Optional
from ai.llm_service import callLLm

class ValidateRequest(BaseModel):
    demographics: Dict
    medications: List[str]
    allegeries: List[str]
    conditions: List[str]
    vital_signs: Dict
    last_updated: str

router = APIRouter()

def buildValidationPrompt(record: Dict):
        return f"""
You are checking healthcare data quality.

Patient record:
{record}

Detect:
- physiologically impossible vital signs
- drug-disease mismatches
- missing critical information

Return ONLY valid JSON in this format:

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
"""

@router.post("/validate/data-quality")
def validate(data: ValidateRequest):
    record = data.model_dump()
    prompt = buildValidationPrompt(record)
    response = callLLm(prompt)
    return response