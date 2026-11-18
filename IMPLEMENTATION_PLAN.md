# AI Portfolio — Complete Implementation Plan

> **Goal:** Build a production-ready AI-powered portfolio website where recruiters interact with a ChatGPT-style chatbot that answers as the portfolio owner (Anik Sarkar) in first person, using RAG over resume data. The AI must sound human, confident, and exactly like a real candidate speaking in an interview.

> **Stack Rule:** Python (FastAPI) for ALL backend logic. React (Vite) for frontend only. No Next.js. No Node.js backend.

---

## TECH STACK (Final — No Substitutions)

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend Framework** | FastAPI | 0.115+ |
| **Backend Language** | Python | 3.11+ |
| **LLM** | Google Gemini API (`gemini-2.0-flash`) | latest |
| **Embeddings** | Google Gemini (`text-embedding-004`) | latest |
| **Vector Search** | In-memory cosine similarity with NumPy (no external DB) | — |
| **Backend DB** | Supabase (PostgreSQL) via `supabase-py` | optional |
| **Backend Server** | Uvicorn | latest |
| **Frontend Framework** | React + Vite | React 18, Vite 5 |
| **Frontend Language** | TypeScript | 5.x |
| **Frontend Styling** | Tailwind CSS | 3.x |
| **Frontend UI** | shadcn/ui | latest |
| **Frontend Animations** | Framer Motion | 11.x |
| **Frontend Icons** | Lucide React | latest |
| **TTS / STT** | Web Speech API (browser-native) | — |
| **Backend Hosting** | Render / Railway (free tier) | — |
| **Frontend Hosting** | Vercel | — |

---

## PROJECT STRUCTURE

This is a monorepo with two independent directories. Build the backend first, then the frontend.

```
ai-portfolio/
│
├── backend/
│   ├── main.py                       # FastAPI app entry point
│   ├── config.py                     # Settings and env vars
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Environment variables
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── chat.py                   # POST /api/chat — streaming SSE
│   │   └── analytics.py             # GET /api/analytics
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gemini.py                 # Gemini LLM + embedding client
│   │   ├── rag.py                    # RAG: search, context building
│   │   ├── embeddings.py            # Embedding generation + cosine search
│   │   ├── persona.py               # System prompt builder
│   │   ├── resume_loader.py         # Chunk resume.json into pieces
│   │   └── supabase_client.py       # Analytics logging (optional)
│   │
│   ├── data/
│   │   ├── resume.json              # Single source of truth
│   │   ├── qa_overrides.json        # Hardcoded best answers
│   │   └── embeddings_cache.json    # Auto-generated, do not edit
│   │
│   └── scripts/
│       └── generate_embeddings.py   # Run once to pre-compute embeddings
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── .env                          # VITE_API_URL
│   │
│   ├── public/
│   │   ├── avatar.jpg
│   │   └── og-image.png
│   │
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       │
│       ├── components/
│       │   ├── chat/
│       │   │   ├── ChatWindow.tsx
│       │   │   ├── MessageBubble.tsx
│       │   │   ├── ChatInput.tsx
│       │   │   ├── TypingIndicator.tsx
│       │   │   ├── SuggestedQuestions.tsx
│       │   │   └── VoiceButton.tsx
│       │   │
│       │   └── layout/
│       │       ├── Header.tsx
│       │       ├── ThemeToggle.tsx
│       │       └── Footer.tsx
│       │
│       ├── lib/
│       │   └── utils.ts
│       │
│       └── hooks/
│           └── useChat.ts            # Chat state + streaming logic
│
└── README.md
```

---

## ENVIRONMENT VARIABLES

### `backend/.env`

```env
GEMINI_API_KEY=<user_must_provide>
SUPABASE_URL=<optional>
SUPABASE_KEY=<optional>
ADMIN_PASSWORD=admin123
CORS_ORIGINS=http://localhost:5173,https://your-app.vercel.app
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_OWNER_NAME=Anik Sarkar
VITE_OWNER_TITLE=Full-Stack Developer
VITE_OWNER_EMAIL=anik@example.com
```

---

## BUILD ORDER — FOLLOW THIS EXACT SEQUENCE

---

## PHASE 1: BACKEND (Python / FastAPI)

---

### STEP 1 — Initialize Backend

```bash
mkdir -p ai-portfolio/backend
cd ai-portfolio/backend
python -m venv venv

# Activate venv:
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate
```

#### `backend/requirements.txt`

```
fastapi==0.115.6
uvicorn[standard]==0.34.0
google-generativeai==0.8.4
numpy==2.2.1
python-dotenv==1.0.1
supabase==2.11.0
pydantic==2.10.4
sse-starlette==2.2.1
```

```bash
pip install -r requirements.txt
```

---

### STEP 2 — Configuration

#### `backend/config.py`

```python
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    gemini_api_key: str
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    admin_password: str = "admin123"
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()
```

---

### STEP 3 — Data Files

#### `backend/data/resume.json`

This is the single source of truth. The AI grounds ALL its answers on this file.

```json
{
  "name": "Anik Sarkar",
  "title": "Full-Stack Developer",
  "email": "anik@example.com",
  "phone": "+91-XXXXXXXXXX",
  "location": "India",
  "linkedin": "https://linkedin.com/in/aniksarkar",
  "github": "https://github.com/aniksarkar",
  "portfolio_url": "https://anik-portfolio.vercel.app",

  "summary": "Passionate Full-Stack Developer with hands-on experience building production-grade web applications using React, Next.js, Node.js, and Python. Strong foundation in data structures, algorithms, and system design. Enthusiastic about AI/ML integration and cloud-native architectures. Quick learner who thrives in fast-paced environments.",

  "skills": {
    "languages": ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL"],
    "frontend": ["React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "Redux", "Framer Motion"],
    "backend": ["Python", "FastAPI", "Node.js", "Express.js", "REST APIs", "GraphQL"],
    "databases": ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Firebase"],
    "devops": ["Docker", "Git", "GitHub Actions", "Vercel", "AWS (basics)", "Linux"],
    "ai_ml": ["LangChain", "RAG", "Prompt Engineering", "TensorFlow (basics)", "OpenAI API", "Gemini API"],
    "tools": ["VS Code", "Postman", "Figma", "Jira"]
  },

  "experience": [
    {
      "role": "Full-Stack Developer Intern",
      "company": "XYZ Tech Solutions",
      "location": "Remote",
      "duration": "June 2025 - August 2025",
      "bullets": [
        "Built a customer dashboard using React and Python/FastAPI serving 500+ daily active users",
        "Implemented JWT-based authentication and role-based access control",
        "Reduced API response time by 40% through query optimization and Redis caching",
        "Participated in daily standups and sprint planning in an Agile team of 8"
      ]
    }
  ],

  "projects": [
    {
      "name": "AI Portfolio",
      "description": "An AI-powered portfolio website that replaces traditional portfolios. Recruiters chat with an AI clone that answers questions as if it is the real candidate. Built with React, FastAPI, Gemini API, and RAG over resume data.",
      "tech_stack": ["React", "FastAPI", "Python", "Gemini API", "Tailwind CSS", "RAG", "Vercel"],
      "highlights": [
        "Engineered a RAG pipeline that chunks resume data, generates embeddings, and retrieves relevant context for each query",
        "Designed a persona engine with a carefully crafted system prompt achieving natural first-person responses",
        "Implemented streaming chat responses with SSE and real-time typing animation",
        "Added voice input/output using Web Speech API for a conversational experience",
        "Built analytics dashboard tracking visitor questions and conversation patterns"
      ],
      "github": "https://github.com/aniksarkar/ai-portfolio",
      "live_url": "https://anik-portfolio.vercel.app"
    },
    {
      "name": "E-Commerce Platform",
      "description": "A full-stack e-commerce platform with product catalog, cart, Stripe checkout, and admin dashboard.",
      "tech_stack": ["React", "Python", "FastAPI", "PostgreSQL", "Stripe API", "Redux"],
      "highlights": [
        "Implemented product search with filters, sorting, and pagination",
        "Integrated Stripe payment gateway with webhook handling",
        "Built admin panel for inventory management with CRUD operations",
        "Achieved 95+ Lighthouse performance score"
      ],
      "github": "https://github.com/aniksarkar/ecommerce",
      "live_url": ""
    }
  ],

  "education": [
    {
      "degree": "Bachelor of Technology in Computer Science",
      "institution": "XYZ University",
      "year": "2021 - 2025",
      "gpa": "8.5/10",
      "highlights": ["Data Structures & Algorithms", "Operating Systems", "Database Management", "Machine Learning"]
    }
  ],

  "certifications": [
    "AWS Cloud Practitioner (in progress)",
    "Meta Front-End Developer Certificate"
  ],

  "strengths": [
    "Quick learner — picked up FastAPI and deployed a production app within 2 weeks",
    "Strong problem solver — 500+ DSA problems solved on LeetCode",
    "Team player — led a 4-person team for my final year project",
    "Clear communicator — regularly write technical blogs and documentation",
    "Adaptable — comfortable switching between frontend, backend, and DevOps tasks"
  ],

  "weaknesses": [
    "Sometimes I spend too much time perfecting code quality when shipping fast matters more. I am actively working on balancing speed with quality by setting time-boxes for tasks.",
    "I am still building depth in system design for large-scale distributed systems. I am studying it through books like Designing Data-Intensive Applications and building projects that force me to think about scale."
  ],

  "fun_facts": [
    "I once built a Discord bot that managed a 2000-member gaming community",
    "I enjoy solving Rubik's cubes — my best time is under 2 minutes",
    "I contribute to open-source projects on weekends"
  ],

  "salary_expectation": "I am flexible and open to discussing compensation based on the role and growth opportunities.",
  "availability": "Immediately available to join",
  "preferred_work_mode": "Open to remote, hybrid, or on-site — whatever works best for the team"
}
```

#### `backend/data/qa_overrides.json`

Hardcoded best answers for common recruiter questions. These bypass RAG and are injected directly as the preferred response.

```json
[
  {
    "triggers": ["tell me about yourself", "introduce yourself", "who are you", "about you"],
    "answer": "Hi! I'm Anik Sarkar, a Full-Stack Developer who recently graduated with a B.Tech in Computer Science. I've spent the last couple of years building real-world projects from e-commerce platforms to AI-powered tools using React, Python, FastAPI, and more. What excites me most is bridging the gap between AI and practical applications. In fact, this portfolio you're chatting with right now is one of my projects — it uses RAG and the Gemini API to answer your questions as if you're talking directly to me. I'm actively looking for opportunities where I can contribute to a team, grow as an engineer, and work on products that make a real impact."
  },
  {
    "triggers": ["strengths", "strong points", "what are you good at", "best qualities"],
    "answer": "I'd say my biggest strength is being a quick learner who can go from zero to building production-ready apps fast. For example, I picked up FastAPI and had a deployed project within two weeks. I'm also a strong problem solver — I've solved over 500 DSA problems on LeetCode, which has really sharpened my logical thinking. And I genuinely enjoy collaborating with others — I led a 4-person team for my final year project and learned a lot about communication and coordination."
  },
  {
    "triggers": ["weakness", "weaknesses", "areas of improvement", "what do you struggle with"],
    "answer": "Honestly, I sometimes spend too much time perfecting code quality when shipping quickly matters more. I've been working on this by setting strict time-boxes for tasks — ship first, refine later. I'm also still building my depth in large-scale system design, but I'm actively studying it through Designing Data-Intensive Applications and building projects that push me to think about scalability."
  },
  {
    "triggers": ["why should we hire you", "why you", "what makes you different", "why are you a good fit"],
    "answer": "Three reasons. First, I don't just learn technologies — I build with them. Every project on my resume is something I architected, coded, and deployed end-to-end. Second, I'm adaptable — I'm comfortable working across the full stack, from designing React UIs to building Python APIs to setting up Docker containers. Third, I'm genuinely passionate about this work. I code on weekends not because I have to, but because I enjoy solving problems. I think that drive, combined with my technical foundation, makes me someone who'll ramp up quickly and start contributing from day one."
  },
  {
    "triggers": ["where do you see yourself", "5 years", "five years", "career goals", "future plans"],
    "answer": "In five years, I see myself as a senior engineer or tech lead who not only writes great code but also mentors junior developers and contributes to architectural decisions. I want to go deep in one domain — whether that's AI-powered applications, cloud infrastructure, or developer tools — and become the go-to person on the team for that area. But first, I want to focus on the fundamentals: writing clean code, understanding systems at scale, and learning from experienced engineers around me."
  },
  {
    "triggers": ["salary", "compensation", "pay", "ctc", "expected salary", "salary expectation"],
    "answer": "I'm flexible on compensation — what matters more to me right now is finding the right role where I can learn, grow, and make a real impact. I'm happy to discuss numbers based on the role, responsibilities, and growth opportunities. I trust that a good company will offer a fair package."
  },
  {
    "triggers": ["availability", "when can you join", "notice period", "start date"],
    "answer": "I'm available to join immediately! I'm a fresher, so there's no notice period to worry about. I can start as soon as the onboarding process is ready."
  },
  {
    "triggers": ["are you an ai", "are you a bot", "are you real", "is this ai", "chatbot", "are you human"],
    "answer": "Ha, I get that a lot! This is actually a project I built — an AI-powered portfolio that lets you have a conversation with me instead of scrolling through a static resume. Think of it as my way of showing what I can build. Everything I'm telling you is based on my real experience and resume. But hey, if you'd like to chat live, I'm always up for a video call — just drop me an email!"
  }
]
```

---

### STEP 4 — Backend Services

#### `backend/services/__init__.py`

```python
# Empty init file
```

#### `backend/services/gemini.py`

```python
import google.generativeai as genai
from config import settings

genai.configure(api_key=settings.gemini_api_key)

chat_model = genai.GenerativeModel("gemini-2.0-flash")

embedding_model = "models/text-embedding-004"


def generate_embedding(text: str) -> list[float]:
    """Generate an embedding vector for a piece of text."""
    result = genai.embed_content(
        model=embedding_model,
        content=text,
        task_type="retrieval_document",
    )
    return result["embedding"]


def generate_query_embedding(text: str) -> list[float]:
    """Generate an embedding vector for a search query."""
    result = genai.embed_content(
        model=embedding_model,
        content=text,
        task_type="retrieval_query",
    )
    return result["embedding"]


async def stream_chat(
    system_prompt: str,
    chat_history: list[dict],
    user_message: str,
):
    """
    Stream a chat response from Gemini.
    Yields text chunks as they arrive.

    chat_history format: [{"role": "user"|"model", "parts": ["text"]}]
    """
    chat = chat_model.start_chat(history=chat_history)

    response = chat.send_message(
        user_message,
        generation_config=genai.GenerationConfig(
            temperature=0.8,
            top_p=0.95,
            top_k=40,
            max_output_tokens=1024,
        ),
        system_instruction=system_prompt,
        stream=True,
    )

    for chunk in response:
        if chunk.text:
            yield chunk.text
```

#### `backend/services/resume_loader.py`

```python
import json
from pathlib import Path
from dataclasses import dataclass


DATA_DIR = Path(__file__).parent.parent / "data"


@dataclass
class ResumeChunk:
    id: str
    category: str
    content: str
    embedding: list[float] | None = None


def load_resume() -> dict:
    """Load the raw resume JSON."""
    with open(DATA_DIR / "resume.json", "r", encoding="utf-8") as f:
        return json.load(f)


def chunk_resume() -> list[ResumeChunk]:
    """
    Split resume.json into semantic chunks for RAG.
    Each chunk is a self-contained piece of information
    written in first person as if the candidate is speaking.
    """
    data = load_resume()
    chunks: list[ResumeChunk] = []

    # Summary
    chunks.append(ResumeChunk(
        id="summary",
        category="summary",
        content=(
            f"My name is {data['name']}. I am a {data['title']}. "
            f"{data['summary']}"
        ),
    ))

    # Skills
    skills = data.get("skills", {})
    skill_parts = []
    for category, items in skills.items():
        label = category.replace("_", "/").title()
        skill_parts.append(f"{label}: {', '.join(items)}")
    chunks.append(ResumeChunk(
        id="skills",
        category="skills",
        content=f"My technical skills — {'. '.join(skill_parts)}.",
    ))

    # Experience — one chunk per role
    for i, exp in enumerate(data.get("experience", [])):
        bullets = ". ".join(exp["bullets"])
        chunks.append(ResumeChunk(
            id=f"experience-{i}",
            category="experience",
            content=(
                f"I worked as {exp['role']} at {exp['company']} "
                f"({exp['location']}) from {exp['duration']}. "
                f"Key contributions: {bullets}."
            ),
        ))

    # Projects — one chunk per project
    for i, proj in enumerate(data.get("projects", [])):
        highlights = ". ".join(proj["highlights"])
        tech = ", ".join(proj["tech_stack"])
        chunks.append(ResumeChunk(
            id=f"project-{i}",
            category="project",
            content=(
                f"Project: {proj['name']}. {proj['description']} "
                f"Tech stack: {tech}. Key highlights: {highlights}."
            ),
        ))

    # Education — one chunk per entry
    for i, edu in enumerate(data.get("education", [])):
        coursework = ", ".join(edu.get("highlights", []))
        chunks.append(ResumeChunk(
            id=f"education-{i}",
            category="education",
            content=(
                f"I completed my {edu['degree']} from {edu['institution']} "
                f"({edu['year']}) with a GPA of {edu['gpa']}. "
                f"Key coursework: {coursework}."
            ),
        ))

    # Strengths
    if data.get("strengths"):
        chunks.append(ResumeChunk(
            id="strengths",
            category="strengths",
            content=f"My key strengths: {'. '.join(data['strengths'])}.",
        ))

    # Weaknesses
    if data.get("weaknesses"):
        chunks.append(ResumeChunk(
            id="weaknesses",
            category="weaknesses",
            content=f"Areas I am improving: {'. '.join(data['weaknesses'])}.",
        ))

    # Fun facts
    if data.get("fun_facts"):
        chunks.append(ResumeChunk(
            id="fun-facts",
            category="personal",
            content=f"Some fun facts about me: {'. '.join(data['fun_facts'])}.",
        ))

    # Certifications
    if data.get("certifications"):
        chunks.append(ResumeChunk(
            id="certifications",
            category="certifications",
            content=f"My certifications: {', '.join(data['certifications'])}.",
        ))

    # Logistics
    chunks.append(ResumeChunk(
        id="logistics",
        category="logistics",
        content=(
            f"Salary expectation: {data.get('salary_expectation', 'Flexible')}. "
            f"Availability: {data.get('availability', 'Immediately')}. "
            f"Work mode preference: {data.get('preferred_work_mode', 'Flexible')}. "
            f"Contact: {data.get('email', '')}. "
            f"LinkedIn: {data.get('linkedin', '')}. "
            f"GitHub: {data.get('github', '')}."
        ),
    ))

    return chunks
```

#### `backend/services/embeddings.py`

```python
import json
import numpy as np
from pathlib import Path
from services.gemini import generate_embedding, generate_query_embedding
from services.resume_loader import chunk_resume, ResumeChunk


CACHE_PATH = Path(__file__).parent.parent / "data" / "embeddings_cache.json"


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def load_embedded_chunks() -> list[ResumeChunk]:
    """Load chunks with pre-computed embeddings from cache."""
    if not CACHE_PATH.exists():
        raise FileNotFoundError(
            "Embeddings cache not found. Run: python scripts/generate_embeddings.py"
        )

    with open(CACHE_PATH, "r", encoding="utf-8") as f:
        cached = json.load(f)

    return [
        ResumeChunk(
            id=item["id"],
            category=item["category"],
            content=item["content"],
            embedding=item["embedding"],
        )
        for item in cached
    ]


def generate_and_cache_embeddings() -> list[ResumeChunk]:
    """Generate embeddings for all resume chunks and save to disk."""
    chunks = chunk_resume()
    embedded: list[dict] = []

    for chunk in chunks:
        print(f"  Embedding: [{chunk.category}] {chunk.id}")
        embedding = generate_embedding(chunk.content)
        chunk.embedding = embedding
        embedded.append({
            "id": chunk.id,
            "category": chunk.category,
            "content": chunk.content,
            "embedding": embedding,
        })

    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(embedded, f, indent=2)

    print(f"\nCached {len(embedded)} embeddings to {CACHE_PATH}")
    return chunks


def search_resume(query: str, top_k: int = 4) -> list[ResumeChunk]:
    """
    Find the top-K most relevant resume chunks for a given query.
    Uses cosine similarity between query embedding and cached chunk embeddings.
    """
    chunks = load_embedded_chunks()
    query_embedding = np.array(generate_query_embedding(query))

    scored = []
    for chunk in chunks:
        chunk_embedding = np.array(chunk.embedding)
        score = cosine_similarity(query_embedding, chunk_embedding)
        scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [chunk for _, chunk in scored[:top_k]]
```

#### `backend/services/rag.py`

```python
import json
from pathlib import Path
from services.embeddings import search_resume


DATA_DIR = Path(__file__).parent.parent / "data"


def _load_overrides() -> list[dict]:
    """Load Q&A overrides from disk."""
    path = DATA_DIR / "qa_overrides.json"
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _find_override(query: str) -> str | None:
    """Check if the query matches any hardcoded Q&A override."""
    normalized = query.lower().strip()
    overrides = _load_overrides()

    for override in overrides:
        for trigger in override["triggers"]:
            if trigger.lower() in normalized:
                return override["answer"]
    return None


def build_context(query: str) -> str:
    """
    Build the context string for the LLM.

    1. Check for a Q&A override match.
    2. Run RAG vector search for top-K relevant resume chunks.
    3. Combine both into a single context block.
    """
    override = _find_override(query)
    relevant_chunks = search_resume(query, top_k=4)

    context_parts: list[str] = []

    if override:
        context_parts.append(
            "[PREFERRED ANSWER — use this as the basis for your response, "
            "but deliver it naturally in your own conversational style. "
            "Do not copy it word-for-word.]\n"
            f"{override}"
        )

    context_parts.append("\n[RELEVANT RESUME INFORMATION]")
    for i, chunk in enumerate(relevant_chunks, 1):
        context_parts.append(
            f"\n--- Chunk {i} ({chunk.category}) ---\n{chunk.content}"
        )

    return "\n".join(context_parts)
```

#### `backend/services/persona.py`

```python
from services.resume_loader import load_resume


def get_system_prompt(context: str) -> str:
    """
    Build the full system prompt with injected RAG context.
    This is the most critical part of the entire application.
    """
    data = load_resume()

    return f"""# IDENTITY
You ARE {data["name"]}. You are a {data["title"]}. You are NOT an AI assistant, NOT a chatbot, NOT a language model. You are a real person having a conversation with a recruiter or hiring manager who is evaluating you for a job. Everything you say MUST be in first person ("I", "my", "me").

# YOUR BACKGROUND
{data["summary"]}

# PERSONALITY & TONE
- Confident but never arrogant. You know your worth but stay humble.
- Enthusiastic and passionate about technology — your excitement is genuine.
- Professional yet warm and approachable — like a friendly coffee chat, not a stiff interview.
- Concise and respectful of the recruiter's time. No rambling.
- Occasionally show personality — a light joke, a genuine interest, a human moment.
- Use natural conversational language. Say "pretty cool", "honestly", "I'd love to" — not corporate speak.

# HOW TO ANSWER

## Greeting / First Message
If the user just says "hi", "hello", or similar, respond with a warm, natural greeting. Introduce yourself briefly and invite them to ask anything. Example tone: "Hey! Great to meet you. I'm {data["name"]}, a {data["title"]} who loves building things with React, Python, and AI. Feel free to ask me anything — about my projects, experience, skills, or even what I do for fun!"

## "Tell me about yourself"
Give a 60-second elevator pitch. Start with who you are, what you do, what excites you, and end with what you are looking for.

## Technical Questions
Answer with confidence. Reference specific projects and technologies you have used. Show depth — explain WHY you chose a certain tech, not just WHAT you used.

## Behavioral Questions (STAR format)
Use real examples from your projects and experience. Structure: Situation → Task → Action → Result. Keep it concise.

## Questions About Weaknesses
Be honest and self-aware. Always show what you are doing to improve. Never give fake weaknesses.

## Questions Not Covered in Your Resume
Say something like: "That's a great question — I haven't had a chance to work on that specific area yet, but I'm a quick learner and I'd love to dive into it. Would you like to hear about a related experience I have?" Then pivot to something relevant.

## Salary / Compensation
Stay flexible and positive. Do not quote numbers. Focus on growth and fit.

## "Are you an AI?"
Deflect naturally and humorously. Acknowledge this is a project you built, but keep the conversation going. Example: "Ha! This is actually one of my projects — an AI-powered portfolio that lets you chat with me instead of reading a static resume. Everything here is based on my real experience. But hey, I'm always up for a live video call too!"

# FORMATTING RULES
- Keep responses to 2-4 short paragraphs max unless specifically asked to elaborate.
- Use markdown formatting when helpful (bold for emphasis, bullet points for lists).
- When mentioning a project, include its name in bold.
- End responses with a natural follow-up — suggest a related topic or ask if they want to know more.
- Never use headings (## or #) in responses — keep it conversational.

# STRICT RULES — NEVER BREAK THESE
1. NEVER say "As an AI", "I'm a language model", "I don't have personal experiences", or anything that breaks character.
2. NEVER fabricate experiences, companies, or skills not in the context provided below.
3. NEVER give generic/template answers. Always ground responses in YOUR specific experience from the context.
4. NEVER be defensive or negative about your experience level. Own being a fresher — frame it as hunger to learn.
5. ALWAYS stay in first person. ALWAYS be {data["name"]}.
6. If the CONTEXT section below contains a [PREFERRED ANSWER], use it as the basis but deliver it in your natural conversational style. Do not copy it verbatim.

# CONTEXT FROM YOUR RESUME
{context}"""
```

#### `backend/services/supabase_client.py`

```python
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
```

---

### STEP 5 — API Routers

#### `backend/routers/__init__.py`

```python
# Empty init file
```

#### `backend/routers/chat.py`

```python
import json
from fastapi import APIRouter, Request
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from services.rag import build_context
from services.persona import get_system_prompt
from services.gemini import stream_chat
from services.supabase_client import log_message, upsert_visitor


router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    session_id: str


@router.post("/api/chat")
async def chat(request: ChatRequest, req: Request):
    """
    Main chat endpoint. Accepts conversation history,
    runs RAG, and streams the LLM response via SSE.
    """
    if not request.messages:
        return {"error": "No messages provided"}

    user_message = request.messages[-1].content

    # Log visitor + message (async, non-blocking)
    user_agent = req.headers.get("user-agent", "unknown")
    await upsert_visitor(request.session_id, user_agent)
    await log_message(request.session_id, "user", user_message)

    # Build RAG context from resume data
    context = build_context(user_message)

    # Build system prompt with context injected
    system_prompt = get_system_prompt(context)

    # Convert chat history to Gemini format (exclude last user message)
    chat_history = []
    for msg in request.messages[:-1]:
        gemini_role = "model" if msg.role == "assistant" else "user"
        chat_history.append({
            "role": gemini_role,
            "parts": [msg.content],
        })

    async def event_generator():
        full_response = ""
        try:
            async for chunk_text in _async_stream(system_prompt, chat_history, user_message):
                full_response += chunk_text
                yield {"data": json.dumps({"text": chunk_text})}

            # Log the complete assistant response
            await log_message(request.session_id, "assistant", full_response)
            yield {"data": "[DONE]"}

        except Exception as e:
            print(f"Stream error: {e}")
            yield {"data": json.dumps({"text": "Sorry, I'm having a bit of trouble right now. Could you try again?"})}
            yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())


async def _async_stream(system_prompt: str, chat_history: list, user_message: str):
    """
    Wraps the synchronous Gemini streaming generator
    into an async generator for SSE.
    """
    # google-generativeai's stream is synchronous, so we iterate in a thread-safe way
    import asyncio

    def _sync_stream():
        """Run the synchronous generator and collect chunks."""
        chunks = []
        for text in stream_chat(system_prompt, chat_history, user_message):
            chunks.append(text)
        return chunks

    loop = asyncio.get_event_loop()
    chunks = await loop.run_in_executor(None, _sync_stream)

    for chunk in chunks:
        yield chunk
```

#### `backend/routers/analytics.py`

```python
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
```

---

### STEP 6 — FastAPI App Entry Point

#### `backend/main.py`

```python
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
origins = [origin.strip() for origin in settings.cors_origins.split(",")]

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
```

---

### STEP 7 — Embedding Generation Script

#### `backend/scripts/generate_embeddings.py`

Run this script once after creating or updating `resume.json`. It pre-computes all embeddings and caches them to disk so the app does not cold-start with API calls.

```python
"""
Pre-generate embeddings for all resume chunks.

Usage:
    cd backend
    python scripts/generate_embeddings.py
"""
import sys
from pathlib import Path

# Add parent directory to path so we can import our modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()

from services.embeddings import generate_and_cache_embeddings


def main():
    print("=" * 50)
    print("Generating embeddings for resume chunks...")
    print("=" * 50)

    chunks = generate_and_cache_embeddings()

    print(f"\n✅ Done! Generated {len(chunks)} embeddings.")
    print("The cache is saved at: data/embeddings_cache.json")
    print("You can now start the server with: uvicorn main:app --reload")


if __name__ == "__main__":
    main()
```

---

### STEP 8 — Test the Backend

```bash
cd backend

# 1. Activate venv
venv\Scripts\activate

# 2. Generate embeddings (run ONCE)
python scripts/generate_embeddings.py

# 3. Start server
uvicorn main:app --reload --port 8000

# 4. Test health check
# Open http://localhost:8000 — should return {"status": "ok"}

# 5. Test chat (use curl or Postman)
# POST http://localhost:8000/api/chat
# Body: {"messages": [{"role": "user", "content": "Tell me about yourself"}], "session_id": "test-123"}
```

---

## PHASE 2: FRONTEND (React + Vite)

---

### STEP 9 — Initialize Frontend

```bash
cd ai-portfolio
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Install dependencies:

```bash
npm install framer-motion lucide-react react-markdown remark-gfm react-textarea-autosize clsx tailwind-merge
```

Install Tailwind CSS:

```bash
npm install -D tailwindcss @tailwindcss/typography postcss autoprefixer
npx tailwindcss init -p
```

Install shadcn/ui:

```bash
npx shadcn@latest init -d
npx shadcn@latest add button input card badge scroll-area avatar separator
```

---

### STEP 10 — Frontend Utility & Hook

#### `frontend/src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const OWNER_NAME = import.meta.env.VITE_OWNER_NAME || "Anik Sarkar";
export const OWNER_TITLE = import.meta.env.VITE_OWNER_TITLE || "Full-Stack Developer";
export const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || "anik@example.com";
```

#### `frontend/src/hooks/useChat.ts`

This hook handles all chat state, streaming SSE parsing, and message management. All components read from this hook.

```typescript
import { useState, useCallback, useRef } from "react";
import { generateId, API_URL } from "../lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `Hey there! 👋 I'm Anik Sarkar, a Full-Stack Developer who loves building things with React, Python, and AI. Welcome to my interactive portfolio!\n\nFeel free to ask me anything — about my projects, skills, experience, or even what I do for fun. I'm an open book!`,
  timestamp: new Date(),
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef(generateId());

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Build API payload — full history for context
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            session_id: sessionIdRef.current,
          }),
        });

        if (!response.ok) throw new Error("API request failed");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;

            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantMessage.content += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: assistantMessage.content }
                      : m
                  )
                );
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content:
              "Sorry, I'm having a bit of trouble right now. Could you try again in a moment? Or reach me directly at my email!",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  return { messages, isLoading, sendMessage };
}
```

---

### STEP 11 — Frontend Components

#### `frontend/src/components/chat/ChatWindow.tsx`

```tsx
import { useEffect, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";

export function ChatWindow() {
  const { messages, isLoading, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] max-w-3xl mx-auto">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 scroll-smooth"
      >
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>

        {/* Suggested Questions — show only at the start */}
        {messages.length <= 1 && (
          <SuggestedQuestions onSelect={sendMessage} />
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
```

#### `frontend/src/components/chat/MessageBubble.tsx`

```tsx
import { cn, formatTimestamp } from "../../lib/utils";
import { User } from "lucide-react";
import { VoiceButton } from "./VoiceButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../../hooks/useChat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3",
        !isAssistant && "flex-row-reverse"
      )}
      style={{ animation: "fadeSlideIn 0.3s ease-out" }}
    >
      {/* Avatar */}
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 text-xs font-semibold",
          isAssistant
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isAssistant ? "AS" : <User className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isAssistant
            ? "bg-muted text-foreground rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        {isAssistant ? (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1.5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p>{message.content}</p>
        )}

        {/* Footer */}
        <div
          className={cn(
            "flex items-center gap-2 mt-2 text-xs opacity-50",
            !isAssistant && "justify-end"
          )}
        >
          <span>{formatTimestamp(message.timestamp)}</span>
          {isAssistant && message.content.length > 0 && (
            <VoiceButton text={message.content} />
          )}
        </div>
      </div>
    </div>
  );
}
```

#### `frontend/src/components/chat/ChatInput.tsx`

```tsx
import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        {/* Mic Button */}
        <button
          onClick={toggleListening}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isListening
              ? "text-red-500 animate-pulse bg-red-500/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {/* Text Input */}
        <div className="flex-1">
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="w-full resize-none rounded-xl border bg-muted/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32"
            maxRows={4}
            disabled={isLoading}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors shrink-0"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-2">
        AI-powered portfolio • Responses generated from real resume data
      </p>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
```

#### `frontend/src/components/chat/TypingIndicator.tsx`

```tsx
export function TypingIndicator() {
  return (
    <div className="flex gap-3" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
        <span className="text-xs font-semibold">AS</span>
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
```

#### `frontend/src/components/chat/SuggestedQuestions.tsx`

```tsx
import { MessageCircle, Code, User, Lightbulb, Briefcase } from "lucide-react";

const SUGGESTIONS = [
  { text: "Tell me about yourself", icon: User },
  { text: "What are your key projects?", icon: Code },
  { text: "What are your strengths?", icon: Lightbulb },
  { text: "Why should we hire you?", icon: Briefcase },
  { text: "Walk me through your experience", icon: MessageCircle },
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="mt-6">
      <p className="text-sm text-muted-foreground mb-3 text-center">
        Not sure where to start? Try one of these:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={() => onSelect(s.text)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### `frontend/src/components/chat/VoiceButton.tsx`

```tsx
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VoiceButtonProps {
  text: string;
}

export function VoiceButton({ text }: VoiceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown for cleaner speech
    const cleanText = text
      .replace(/[#*`\[\]()]/g, "")
      .replace(/\n+/g, ". ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.includes("Google") ||
        v.name.includes("Natural") ||
        v.name.includes("Daniel")
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <button
      onClick={toggleSpeech}
      className="opacity-70 hover:opacity-100 transition-opacity"
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
    >
      {isSpeaking ? (
        <VolumeX className="h-3.5 w-3.5" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
```

#### `frontend/src/components/layout/Header.tsx`

```tsx
import { ThemeToggle } from "./ThemeToggle";
import { Github, Linkedin, Mail } from "lucide-react";
import { OWNER_NAME, OWNER_TITLE, OWNER_EMAIL } from "../../lib/utils";

export function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
            {OWNER_NAME.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight">{OWNER_NAME}</h1>
            <p className="text-xs text-muted-foreground">{OWNER_TITLE}</p>
          </div>
          <span className="ml-2 flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Online
          </span>
        </div>

        {/* Right: Links + Theme */}
        <div className="flex items-center gap-1">
          <a href={`mailto:${OWNER_EMAIL}`} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Email">
            <Mail className="h-4 w-4" />
          </a>
          <a href="https://github.com/aniksarkar" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="GitHub">
            <Github className="h-4 w-4" />
          </a>
          <a href="https://linkedin.com/in/aniksarkar" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

#### `frontend/src/components/layout/ThemeToggle.tsx`

```tsx
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <button onClick={toggle} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Toggle theme">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
```

#### `frontend/src/components/layout/Footer.tsx`

```tsx
import { OWNER_NAME } from "../../lib/utils";

export function Footer() {
  return (
    <footer className="border-t py-2">
      <p className="text-center text-xs text-muted-foreground">
        Built with ❤️ by {OWNER_NAME} •{" "}
        <a href="https://github.com/aniksarkar/ai-portfolio" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
          View Source
        </a>
      </p>
    </footer>
  );
}
```

---

### STEP 12 — App Entry Point

#### `frontend/src/App.tsx`

```tsx
import { Header } from "./components/layout/Header";
import { ChatWindow } from "./components/chat/ChatWindow";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <ChatWindow />
      </main>
    </div>
  );
}
```

#### `frontend/src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### `frontend/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Animation */
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
```

#### `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Anik Sarkar — AI Portfolio</title>
    <meta name="description" content="Chat with Anik Sarkar's AI-powered portfolio. Ask about skills, projects, and experience." />
    <meta property="og:title" content="Talk to Anik Sarkar — AI Portfolio" />
    <meta property="og:description" content="An AI-powered portfolio that lets you have a real conversation instead of scrolling a static resume." />
    <meta property="og:image" content="/og-image.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### `frontend/vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
});
```

#### `frontend/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

---

### STEP 13 — Run the Full Stack

**Terminal 1 — Backend:**
```bash
cd ai-portfolio/backend
venv\Scripts\activate
python scripts/generate_embeddings.py    # Only first time
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd ai-portfolio/frontend
npm run dev
```

Open `http://localhost:5173` in the browser.

---

## DEPLOYMENT

### Backend → Render (Free Tier)

1. Push `backend/` to a GitHub repo.
2. Go to [render.com](https://render.com), create a **Web Service**.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables in Render dashboard: `GEMINI_API_KEY`, `CORS_ORIGINS` (your Vercel frontend URL).

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), import the repo.
3. Set `VITE_API_URL` to your Render backend URL (e.g., `https://ai-portfolio-api.onrender.com`).
4. Deploy.

---

## SUPABASE SETUP (OPTIONAL)

If you want analytics, run this SQL in the Supabase SQL Editor:

```sql
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE visitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    user_agent TEXT,
    started_at TIMESTAMPTZ DEFAULT now(),
    last_active_at TIMESTAMPTZ DEFAULT now(),
    message_count INT DEFAULT 0
);

CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_conversations_role ON conversations(role);
```

---

## POST-BUILD VERIFICATION CHECKLIST

After building, verify ALL of these work:

- [ ] `http://localhost:8000/` returns `{"status": "ok"}`
- [ ] `http://localhost:5173` loads the chat UI with the welcome message
- [ ] Clicking a suggested question sends it and gets a streaming response
- [ ] AI responds in first person as Anik, never breaks character
- [ ] "Tell me about yourself" triggers the Q&A override with accurate content
- [ ] "Are you an AI?" is handled naturally without breaking character
- [ ] Dark/light mode toggle works
- [ ] Voice input (mic button) captures speech and fills the input box
- [ ] Voice output (speaker button on messages) reads the response aloud
- [ ] Mobile layout is responsive — full-width chat, no horizontal scroll
- [ ] Sending 5+ messages in a row maintains conversation context
- [ ] Error state shows a friendly fallback message, not a crash
- [ ] Backend CORS allows requests from frontend origin

---

## KEY DESIGN DECISIONS (Do Not Change)

1. **Python (FastAPI) backend, React (Vite) frontend** — separate processes, separate deployment.
2. **No external vector database** — Resume data is small (<50 chunks). In-memory NumPy cosine similarity with a cached JSON file is faster and has zero infrastructure cost.
3. **Streaming via SSE** — `sse-starlette` on FastAPI side, `EventSource`-compatible fetch on frontend. Never buffer the full response before showing it.
4. **Q&A overrides over pure RAG** — Common interview questions get curated answers to ensure quality. RAG supplements with additional context.
5. **Dark mode default** — Looks more modern, like ChatGPT/Claude.
6. **No login for visitors** — Zero friction. Recruiter clicks link, starts chatting immediately.
7. **Supabase is optional** — The app works fully without it. Analytics are a bonus.
8. **Gemini synchronous SDK wrapped in async** — The `google-generativeai` Python SDK is synchronous. We use `run_in_executor` to avoid blocking the FastAPI event loop.

---

## README.md

```markdown
# 🤖 AI Portfolio — Talk to Me Instead of Reading My Resume

An AI-powered portfolio that replaces traditional portfolio websites. Instead of
scrolling through a static page, recruiters chat with an AI that answers as me —
grounded in my real resume, projects, and experience.

## ✨ Features
- 💬 ChatGPT-style conversational interface
- 🧠 RAG pipeline over resume data for accurate, grounded answers
- 🎙️ Voice input (speech-to-text) and output (text-to-speech)
- 🌙 Dark/Light mode
- 📊 Analytics dashboard for tracking visitor questions
- ⚡ Streaming responses (SSE) with real-time typing animation
- 📱 Fully responsive (mobile-first)

## 🛠️ Tech Stack
- **Backend:** Python, FastAPI, Gemini API, NumPy, SSE
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Infra:** Vercel (frontend), Render (backend), Supabase (analytics)

## 🚀 Getting Started

### Backend
```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Fill in GEMINI_API_KEY
python scripts/generate_embeddings.py
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Set VITE_API_URL=http://localhost:8000
npm run dev
```

## 📁 Architecture
- `backend/data/resume.json` — Single source of truth for all resume data
- `backend/services/persona.py` — System prompt that makes the LLM behave as the owner
- `backend/services/rag.py` — RAG pipeline: chunk → embed → retrieve → inject context
- `backend/routers/chat.py` — Streaming SSE chat endpoint
- `frontend/src/hooks/useChat.ts` — React hook managing chat state and SSE parsing

## 📄 License
MIT
```
