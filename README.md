# 🤖 AI Portfolio — Talk to Me Instead of Reading My Resume

An AI-powered portfolio that replaces traditional portfolio websites. Instead of
scrolling through a static page, recruiters chat with an AI that answers as me —
grounded in my real resume, projects, and experience.

## ✨ Features
- 💬 **ChatGPT-style conversational interface** with real-time SSE streaming
- 🧠 **RAG pipeline over resume data** for accurate, grounded answers
- 🎙️ **Voice input (Speech-to-Text)** and voice output (Text-to-Speech)
- 🌙 **Dark/Light mode** toggle with persistent local storage
- ⚡ **Streaming responses** with animated typing indicator
- 🎯 **Pre-loaded question suggestions** for instant engagement
- 📱 **Fully responsive** mobile-first UI with Tailwind CSS

## 🛠️ Tech Stack
- **Backend:** Python 3.11+, FastAPI, Gemini API (`gemini-2.0-flash`, `text-embedding-004`), NumPy, Uvicorn, SSE Starlette
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Database:** Supabase (optional analytics)
- **Deployment:** Render (Backend) + Vercel (Frontend)

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
```

Add your Gemini API key in `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Generate resume embeddings cache:
```bash
python scripts/generate_embeddings.py
```

Run backend server:
```bash
uvicorn main:app --reload --port 8000
```
API will run at `http://localhost:8000`. Health check: `http://localhost:8000/`.

---

### 2. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📁 Architecture
- `backend/data/resume.json` — Single source of truth for resume & background
- `backend/data/qa_overrides.json` — Best curated responses for common recruiter questions
- `backend/services/persona.py` — System prompt engine that makes the AI speak in first person
- `backend/services/rag.py` — RAG vector search + override matching
- `backend/routers/chat.py` — Real-time Server-Sent Events (SSE) chat endpoint
- `frontend/src/hooks/useChat.ts` — React hook managing chat state and SSE parsing
- `frontend/src/components/chat/ChatWindow.tsx` — Main chat layout and interaction container

## 📄 License
MIT
