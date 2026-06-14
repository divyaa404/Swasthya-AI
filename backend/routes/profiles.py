from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from services.supabase_service import supabase
from services.qr_service import QRService
from services.auth_middleware import get_current_user
from schemas.models import UpdateProfileRequest, UpdateMedicalRequest

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("/me")
async def get_my_profile(current_user = Depends(get_current_user)):
    res = supabase.table("patients").select("*").eq("id", current_user.id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    patient = res.data[0]
    return {
        "id": patient.get("id"),
        "email": patient.get("email"),
        "full_name": patient.get("full_name"),
        "phone": patient.get("phone_number")
    }

@router.put("")
async def update_my_profile(data: UpdateProfileRequest, current_user = Depends(get_current_user)):
    db_payload = {
        "id": current_user.id,
        "full_name": data.full_name,
        "phone_number": data.phone,
        "age": data.age,
        "gender": data.gender
    }
    res = supabase.table("patients").upsert(db_payload).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to update profile")
    
    return {"status": "success", "profile": res.data[0]}

@router.get("/medical")
async def get_my_medical_info(current_user = Depends(get_current_user)):
    res = supabase.table("medical_information").select("*").eq("patient_id", current_user.id).execute()
    if not res.data:
        return {}
    return res.data[0]

@router.put("/medical")
async def update_my_medical_info(data: UpdateMedicalRequest, current_user = Depends(get_current_user)):
    db_payload = {
        "patient_id": current_user.id,
        "weight": data.weight,
        "height": data.height,
        "blood_type": data.blood_type,
        "allergies": data.allergies,
        "blood_pressure": data.blood_pressure,
        "heart_rate": data.heart_rate,
        "oxygen_level": data.oxygen_level,
        "surgeries": data.surgeries,
        "chronic_conditions": data.chronic_conditions,
        "vaccinations": data.vaccinations,
        "family_genetics": data.family_genetics,
        "updated_at": datetime.now().isoformat()
    }
    # Explicitly target on_conflict="patient_id" to prevent duplicate key constraint violations
    res = supabase.table("medical_information").upsert(db_payload, on_conflict="patient_id").execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to update medical information")
    
    return {"status": "success", "medical_information": res.data[0]}
