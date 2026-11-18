import { X, ExternalLink, Sparkles, Layers, Cpu } from "lucide-react";
import { GithubIcon } from "../common/Icons";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutProject: (projectName: string) => void;
}

export function ProjectsModal({ isOpen, onClose, onAskAboutProject }: ProjectsModalProps) {
  if (!isOpen) return null;

  const projects = [
    {
      id: "ai-portfolio",
      title: "AI Interactive Portfolio (Neural Clone)",
      badge: "FEATURED • PRODUCTION",
      description:
        "A revolutionary AI candidate replacement for traditional static portfolios. Uses RAG over resume data and Gemini Flash to conduct realistic, first-person live recruiter interviews.",
      metrics: "Sub-150ms Latency • Real-time SSE • Web Speech Voice",
      tech: ["FastAPI", "Python", "React", "Gemini API", "RAG", "Tailwind CSS"],
      github: "https://github.com/aniksarkar/ai-portfolio",
      live: "http://localhost:5173",
      highlights: [
        "Vector search engine utilizing cosine similarity and cached Gemini embeddings",
        "Dynamic persona engine achieving natural, grounded first-person interview responses",
        "Two-way conversational voice with Speech-to-Text and SpeechSynthesis",
      ],
    },
    {
      id: "ecommerce",
      title: "Full-Stack High Performance E-Commerce",
      badge: "FULL-STACK • CLOUD",
      description:
        "Modern multi-tenant digital commerce platform with inventory analytics, Stripe checkout webhooks, and sub-second catalog search.",
      metrics: "95+ Lighthouse Score • Stripe Webhooks • Redis Cached",
      tech: ["React", "FastAPI", "Python", "PostgreSQL", "Stripe API", "Redis"],
      github: "https://github.com/aniksarkar/ecommerce",
      highlights: [
        "JWT-based authentication with granular role-based access control",
        "Stripe payment gateway integration with robust webhook error handling",
        "Redis caching layer reducing DB query latency by 40%",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Featured Engineering Projects
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  PORTFOLIO
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Production-grade systems built with Python, React & Cloud
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {p.badge}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors text-xs"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors text-xs"
                      title="GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="my-3 p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] font-mono text-cyan-300">
                  ⚡ {p.metrics}
                </div>

                <div className="space-y-1.5 my-3">
                  {p.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                      <span className="text-cyan-400 font-mono">▹</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80 mb-3">
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mr-1">
                    <Cpu className="w-3 h-3" /> STACK:
                  </span>
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-cyan-300 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onAskAboutProject(`Walk me through the architecture and implementation of your ${p.title} project.`);
                  }}
                  className="w-full py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  Ask AI About This Project →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
