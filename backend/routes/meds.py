from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from services.supabase_service import SupabaseService

router = APIRouter(prefix="/meds", tags=["meds"])

class AdherenceLogRequest(BaseModel):
    patient_id: str
    medicine: str

class MedicineAddRequest(BaseModel):
    medicine_name: str
    dosage: str = ""
    frequency: str = ""
    is_critical: bool = False
    patient_id: str = ""

@router.get("/search")
async def search_meds(query: str = Query(..., min_length=1)):
    results = SupabaseService.search_medicines(query)
    return {"status": "success", "results": results}

@router.get("/{patient_id}")
async def get_meds(patient_id: str):
    meds = SupabaseService.get_medicines(patient_id)
    return {"status": "success", "medications": meds}

@router.post("/log")
async def log_med(data: AdherenceLogRequest):
    log = SupabaseService.log_adherence(data.patient_id, data.medicine)
    if not log:
        raise HTTPException(status_code=500, detail="Failed to log adherence")
    
    return {"status": "success", "message": "Adherence logged"}

@router.post("/add")
async def add_med(data: MedicineAddRequest, patient_id: str = None):
    # Retrieve patient_id from parameter or from body
    pid = patient_id or data.patient_id
    if not pid:
        raise HTTPException(status_code=400, detail="patient_id is required")
        
    res = SupabaseService.add_medicine(pid, data.model_dump())
    if not res:
        raise HTTPException(status_code=500, detail="Failed to add medicine")
    
    return {"status": "success", "message": "Medicine added", "data": res}

