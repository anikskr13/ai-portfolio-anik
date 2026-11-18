import { X, Briefcase, GraduationCap, CheckCircle2, Calendar, MapPin } from "lucide-react";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutExperience: (query: string) => void;
}

export function ExperienceModal({
  isOpen,
  onClose,
  onAskAboutExperience,
}: ExperienceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Briefcase className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Experience & Career Timeline
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  TRACK RECORD
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Hands-on engineering, production deployments & education
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

        {/* Timeline Items */}
        <div className="mt-6 space-y-6">
          {/* Item 1: Internship */}
          <div className="relative pl-6 border-l-2 border-cyan-500/50 pb-2">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-900" />

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  Full-Stack Developer Intern
                  <span className="text-xs font-mono font-normal text-cyan-400">
                    @ XYZ Tech Solutions
                  </span>
                </h3>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  June 2025 - August 2025
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> Remote
                </span>
                <span className="text-emerald-400 font-semibold">
                  Agile Team of 8 Engineers
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Built and shipped a customer dashboard using <strong>React</strong> and <strong>FastAPI</strong> serving 500+ daily active users.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Implemented JWT-based authentication and role-based access control with secure cookie storage.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Reduced API response latency by 40%</strong> through SQL query indexing and Redis caching.
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onAskAboutExperience("Tell me about your internship at XYZ Tech Solutions and how you reduced API response times by 40%.");
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-all"
              >
                Ask AI About This Experience →
              </button>
            </div>
          </div>

          {/* Item 2: Education */}
          <div className="relative pl-6 border-l-2 border-slate-700 pb-2">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900" />

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  Bachelor of Technology in Computer Science
                </h3>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  2021 - 2025
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-3">
                <span className="text-cyan-300 font-bold">GPA: 8.5 / 10.0</span>
                <span>XYZ University</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Data Structures & Algorithms", "Operating Systems", "DBMS", "Machine Learning", "System Design"].map(
                  (c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-indigo-300 border border-slate-800"
                    >
                      {c}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
