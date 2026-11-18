from fastapi import APIRouter, Header, HTTPException
from config import settings
from services.supabase_client import get_analytics

router = APIRouter()


@router.get("/api/analytics")
async def analytics(authorization: str = Header(default="")):
    """
    Admin-only endpoint returning analytics data.
    Requires Bearer token matching ADMIN_PASSWORD.
    """
    expected = f"Bearer {settings.admin_password}"
    if authorization != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")

    data = await get_analytics()
    return data
