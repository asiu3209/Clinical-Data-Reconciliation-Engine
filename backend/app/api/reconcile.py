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
    source_reliability: str | float

class ReconcileRequest(BaseModel):
    patient_context: PatientContext
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

Return ONLY raw JSON in this format.

Do not include markdown formatting.
Do not include explanations.
Do not include code blocks.

{{
"reconciled_medication": "Metformin 500mg twice daily",
"confidence_score": 0.88,
"reasoning": "Primary care record is most recent clinical encounter. Dose reduction appropriate given declining kidney function (eGFR 45). Pharmacy fi ll may refl ect old prescription.",
"recommended_actions": [
"Update Hospital EHR to 500mg twice daily",
"Verify with pharmacist that correct dose is being fi lled"
],
"clinical_safety_check": "PASSED"
}}
"""

@router.post("/reconcile/medication")
def reconcile(data: ReconcileRequest):
    prompt = buildReconciliationPrompt(data.patient_context,data.sources)
    response = callLLm(prompt)
    return response

