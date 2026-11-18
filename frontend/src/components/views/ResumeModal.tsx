import { X, Printer, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../common/Icons";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(6,182,212,0.25)]">
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              OFFICIAL RESUME DOSSIER
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Content Sheet */}
        <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-6 sm:p-8 text-slate-200 font-sans space-y-6">
          {/* Header */}
          <div className="border-b border-slate-800 pb-5">
            <h1 className="text-2xl font-bold text-slate-100">Anik Sarkar</h1>
            <p className="text-cyan-400 font-mono text-sm mt-0.5 font-semibold">
              Full-Stack Developer & AI Systems Engineer
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 mt-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                anik@example.com
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                India (Remote Ready)
              </span>
              <a
                href="https://github.com/aniksarkar"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-cyan-300"
              >
                <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
                github.com/aniksarkar
              </a>
              <a
                href="https://linkedin.com/in/aniksarkar"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-cyan-300"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-cyan-400" />
                linkedin.com/in/aniksarkar
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase mb-2">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Passionate Full-Stack Developer with hands-on experience building production-grade web applications using React, Next.js, Node.js, and Python. Strong foundation in data structures, algorithms (500+ LeetCode), and system design. Enthusiastic about AI/ML integration and cloud-native architectures.
            </p>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase mb-2">
              Technical Skills
            </h2>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div>
                <strong className="text-slate-100 font-mono">Languages: </strong>
                JavaScript, TypeScript, Python, Java, C++, SQL
              </div>
              <div>
                <strong className="text-slate-100 font-mono">Frontend: </strong>
                React.js, Next.js, Tailwind CSS, HTML5, CSS3, Redux, Framer Motion
              </div>
              <div>
                <strong className="text-slate-100 font-mono">Backend: </strong>
                Python, FastAPI, Node.js, Express.js, REST APIs, GraphQL
              </div>
              <div>
                <strong className="text-slate-100 font-mono">Databases & AI: </strong>
                PostgreSQL, MongoDB, Redis, Supabase, LangChain, RAG, Gemini API
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-slate-100">
                    Full-Stack Developer Intern —{" "}
                    <span className="text-cyan-400 font-normal">XYZ Tech Solutions</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    June 2025 – August 2025
                  </span>
                </div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-slate-300 leading-relaxed">
                  <li>Built customer dashboard using React and Python/FastAPI serving 500+ daily active users</li>
                  <li>Implemented JWT-based authentication and role-based access control</li>
                  <li>Reduced API response time by 40% through query optimization and Redis caching</li>
                  <li>Collaborated in daily standups and sprint planning in an Agile team of 8</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Projects */}
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase mb-3">
              Key Projects
            </h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-slate-100">
                    AI Interactive Portfolio (Neural Clone)
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400">
                    React • FastAPI • Gemini RAG
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Engineered an AI-powered replacement for traditional portfolios. Recruiters chat with an AI clone that answers questions in first person using RAG vector search over resume embeddings with real-time SSE streaming and voice synthesis.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-slate-100">
                    High-Performance E-Commerce Platform
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400">
                    React • FastAPI • Stripe • PostgreSQL
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Built a full-stack digital commerce platform with inventory management, Stripe payment webhooks, sub-second product search, and 95+ Lighthouse score.
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase mb-2">
              Education & Certifications
            </h2>
            <div className="flex justify-between items-baseline text-xs">
              <div>
                <strong className="text-slate-100">Bachelor of Technology in Computer Science</strong>
                <div className="text-slate-400">XYZ University • GPA: 8.5/10</div>
              </div>
              <span className="text-[11px] font-mono text-slate-400">2021 – 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
