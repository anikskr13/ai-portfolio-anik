import { ExternalLink, Sparkles, Layers, Cpu } from "lucide-react";
import { GithubIcon } from "../common/Icons";

interface ProjectData {
  title: string;
  badge: string;
  desc: string;
  tech: string[];
  github: string;
  live?: string;
  highlights: string[];
}

const PROJECTS: Record<string, ProjectData> = {
  "ai-portfolio": {
    title: "AI Interactive Portfolio (Neural Clone)",
    badge: "FEATURED • PRODUCTION",
    desc: "A revolutionary AI candidate replacement for traditional portfolios. Uses RAG over real resume data and Gemini Flash to conduct realistic, first-person live recruiter interviews.",
    tech: ["FastAPI", "Python", "React", "Gemini API", "RAG", "Tailwind CSS", "SSE"],
    github: "https://github.com/aniksarkar/ai-portfolio",
    live: "http://localhost:5173",
    highlights: [
      "Custom RAG vector search with cosine similarity",
      "Real-time SSE token streaming & Web Speech voice engine",
      "Dynamic prompt engineering with first-person interview grounding",
    ],
  },
  "ecommerce": {
    title: "Full-Stack High Performance E-Commerce",
    badge: "FULL-STACK • CLOUD",
    desc: "Modern multi-tenant digital commerce platform with inventory analytics, Stripe checkout webhooks, and sub-second catalog search.",
    tech: ["React", "FastAPI", "Python", "PostgreSQL", "Stripe API", "Redis"],
    github: "https://github.com/aniksarkar/ecommerce",
    highlights: [
      "JWT authentication & granular role-based access control",
      "Stripe webhook payments with automated inventory decrement",
      "Redis caching layer reducing DB query latency by 40%",
    ],
  },
};

export const InteractiveProjectCards: React.FC<{ projectId: "ai-portfolio" | "ecommerce" }> = ({
  projectId,
}) => {
  const project = PROJECTS[projectId];
  if (!project) return null;

  return (
    <div className="my-3 p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.15)] group hover:border-cyan-400/60 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          {project.badge}
        </span>
        <div className="flex items-center gap-2">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors text-xs flex items-center gap-1"
              title="Live Demo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors text-xs flex items-center gap-1"
            title="GitHub Repository"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
        <Layers className="w-4 h-4 text-cyan-400" />
        {project.title}
      </h4>

      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{project.desc}</p>

      {/* Highlights */}
      <div className="my-2.5 space-y-1">
        {project.highlights.map((h, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400">
            <span className="text-cyan-400 font-mono">▹</span>
            <span>{h}</span>
          </div>
        ))}
      </div>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mr-1">
          <Cpu className="w-3 h-3" /> STACK:
        </span>
        {project.tech.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/80 text-cyan-300 border border-slate-700/60"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};
