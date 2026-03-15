from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Optional
from ai.llm_service import callLLm

router = APIRouter()

class PatientContext(BaseModel):
    age:int
    conditions: List[str]
    recent_labs: Dict

class SourceRecord(BaseModel):
    system:str
    medication: str
    last_updated: Optional[str] = None
    last_filled: Optional[str] = None
    source_reliability: str

class ReconcileRequest(BaseModel):
    patient: PatientContext
    sources: List[SourceRecord]

def buildReconciliationPrompt(patient: PatientContext, sources: List[SourceRecord]):
    formatted_sources = "\n".join(
        [
            f"- System: {s.system}, Medication: {s.medication}, "
            f"Last Updated: {s.last_updated}, Last Filled: {s.last_filled}, "
            f"Reliability: {s.source_reliability}"
            for s in sources
        ]
    )
    return f"""
You are assisting with clinical medication reconciliation.

Patient context:
Age: {patient.age}
Conditions: {patient.conditions}
Recent labs: {patient.recent_labs}

Medication records from different systems:
{formatted_sources}

Determine the most likely correct medication record.

Return ONLY valid JSON in this format:

{{
"reconciled_medication": "...",
"confidence_score": 0.0,
"reasoning": "...",
"recommended_actions": ["...", "..."],
"clinical_safety_check": "PASSED or FAILED"
}}
"""

@router.post("/reconcile/medication")
def reconcile(data: ReconcileRequest):
    prompt = buildReconciliationPrompt(data.patient,data.sources)
    response = callLLm(prompt)
    return response

