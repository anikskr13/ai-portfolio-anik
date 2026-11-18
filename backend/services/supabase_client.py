from config import settings

try:
    if settings.supabase_url and settings.supabase_key:
        from supabase import create_client
        supabase = create_client(settings.supabase_url, settings.supabase_key)
    else:
        supabase = None
except Exception:
    supabase = None


async def log_message(session_id: str, role: str, message: str):
    """Log a conversation message. Silently fails if Supabase is not configured."""
    if not supabase:
        return
    try:
        supabase.table("conversations").insert({
            "session_id": session_id,
            "role": role,
            "message": message,
        }).execute()
    except Exception as e:
        print(f"Failed to log message: {e}")


async def upsert_visitor(session_id: str, user_agent: str = "unknown"):
    """Track a visitor session. Silently fails if Supabase is not configured."""
    if not supabase:
        return
    try:
        supabase.table("visitors").upsert({
            "session_id": session_id,
            "user_agent": user_agent,
        }, on_conflict="session_id").execute()
    except Exception as e:
        print(f"Failed to upsert visitor: {e}")


async def get_analytics() -> dict:
    """Fetch analytics data for the admin dashboard."""
    if not supabase:
        return {"visitors": 0, "conversations": 0, "top_questions": []}

    try:
        visitors = supabase.table("visitors").select("*", count="exact").execute()
        conversations = supabase.table("conversations").select("*", count="exact").execute()
        recent_qs = (
            supabase.table("conversations")
            .select("message")
            .eq("role", "user")
            .order("created_at", desc=True)
            .limit(50)
            .execute()
        )

        return {
            "visitors": visitors.count or 0,
            "conversations": conversations.count or 0,
            "top_questions": [q["message"] for q in (recent_qs.data or [])],
        }
    except Exception as e:
        print(f"Analytics error: {e}")
        return {"visitors": 0, "conversations": 0, "top_questions": []}
