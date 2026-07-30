from fastapi import APIRouter, Depends
from main import get_current_user
from services.sheets import sheets_service

router = APIRouter()

@router.get("/stats")
async def get_admin_stats(user=Depends(get_current_user)):
    stats = sheets_service.get_stats()
    return stats
