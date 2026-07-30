from fastapi import APIRouter, Depends
from pydantic import BaseModel
from main import get_current_user

router = APIRouter()

class FIRRequest(BaseModel):
    details: str

@router.post("/generate-fir")
async def generate_fir(req: FIRRequest, user=Depends(get_current_user)):
    # Connect to AI to generate FIR
    return {"response": "This is a drafted FIR based on: " + req.details}

@router.post("/analyze-evidence")
async def analyze_evidence(user=Depends(get_current_user)):
    # Analyze evidence
    return {"response": "Evidence analyzed"}
