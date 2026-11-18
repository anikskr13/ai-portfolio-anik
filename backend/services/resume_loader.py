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
