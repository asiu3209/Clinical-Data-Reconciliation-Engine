from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Optional

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

@router.post("/reconcile/medication")
def reconcile(data: ReconcileRequest):
    print("Test")