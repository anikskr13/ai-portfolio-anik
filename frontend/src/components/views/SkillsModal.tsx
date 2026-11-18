import { X, Code2, Cpu, Database, Cloud, Wrench, Sparkles } from "lucide-react";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskSkill: (skillCategory: string) => void;
}

export function SkillsModal({ isOpen, onClose, onAskSkill }: SkillsModalProps) {
  if (!isOpen) return null;

  const categories = [
    {
      title: "Frontend Engineering",
      icon: Code2,
      color: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40",
      skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "Redux", "Framer Motion"],
    },
    {
      title: "Backend & Systems",
      icon: Cpu,
      color: "text-indigo-400 border-indigo-500/40 bg-indigo-950/40",
      skills: ["Python", "FastAPI", "Node.js", "Express.js", "RESTful APIs", "SSE Streaming", "GraphQL"],
    },
    {
      title: "AI & Machine Learning",
      icon: Sparkles,
      color: "text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-950/40",
      skills: ["Gemini API", "RAG Architecture", "Vector Embeddings", "LangChain", "Prompt Engineering", "OpenAI API"],
    },
    {
      title: "Databases & Storage",
      icon: Database,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
      skills: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Firebase"],
    },
    {
      title: "DevOps & Cloud",
      icon: Cloud,
      color: "text-sky-400 border-sky-500/40 bg-sky-950/40",
      skills: ["Docker", "Git / GitHub", "GitHub Actions", "Vercel", "AWS (Core)", "Linux"],
    },
    {
      title: "Developer Tooling",
      icon: Wrench,
      color: "text-amber-400 border-amber-500/40 bg-amber-950/40",
      skills: ["VS Code", "Postman", "Figma", "Jira", "LeetCode (500+)"],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Code2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Technical Capabilities Matrix
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  FULL-STACK
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Verified skill stack across frontend, backend, AI and infrastructure
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg border ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200">
                      {cat.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onAskSkill(`What is your experience and technical depth in ${cat.title}?`);
                  }}
                  className="mt-4 pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-between transition-colors"
                >
                  <span>Ask AI about depth</span>
                  <span>→</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
