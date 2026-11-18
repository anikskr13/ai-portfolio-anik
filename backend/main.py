from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import chat, analytics

app = FastAPI(
    title="AI Portfolio API",
    description="Backend for AI-powered portfolio chatbot",
    version="1.0.0",
)

# CORS — allow the React frontend to call the API
origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat.router)
app.include_router(analytics.router)


@app.get("/")
def health():
    return {"status": "ok", "message": "AI Portfolio API is running"}


@app.get("/api/info")
def info():
    """Public endpoint returning basic portfolio info for the frontend header."""
    from services.resume_loader import load_resume
    data = load_resume()
    return {
        "name": data.get("name"),
        "title": data.get("title"),
        "email": data.get("email"),
        "github": data.get("github"),
        "linkedin": data.get("linkedin"),
    }
