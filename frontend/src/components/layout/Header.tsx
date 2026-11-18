import { Mail, LayoutGrid, MessageSquare, Layers, Briefcase, Code2, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../common/Icons";

interface HeaderProps {
  viewMode?: "cockpit" | "chat";
  onToggleViewMode?: () => void;
  onOpenProjects?: () => void;
  onOpenExperience?: () => void;
  onOpenSkills?: () => void;
  onOpenResume?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode = "cockpit",
  onToggleViewMode,
  onOpenProjects,
  onOpenExperience,
  onOpenSkills,
  onOpenResume,
}) => {
  return (
    <header className="border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left: Avatar Branding */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-400 to-indigo-600 flex items-center justify-center font-bold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300">
              AS
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-wide text-slate-100 flex items-center gap-1.5">
                Anik Sarkar
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  AI CLONE
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span>Full-Stack Dev</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for Hire
              </span>
            </p>
          </div>
        </div>

        {/* Center: Portfolio Showcase Navigation Pills */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          {onOpenProjects && (
            <button
              onClick={onOpenProjects}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Projects</span>
            </button>
          )}

          {onOpenExperience && (
            <button
              onClick={onOpenExperience}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-all"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Experience</span>
            </button>
          )}

          {onOpenSkills && (
            <button
              onClick={onOpenSkills}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Skills</span>
            </button>
          )}

          {onOpenResume && (
            <button
              onClick={onOpenResume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-900/80 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Resume</span>
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Toggle */}
          {onToggleViewMode && (
            <button
              onClick={onToggleViewMode}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all"
              title="Toggle Layout"
            >
              {viewMode === "cockpit" ? (
                <>
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chat View</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cockpit View</span>
                </>
              )}
            </button>
          )}

          {/* Social Links */}
          <a
            href="https://github.com/aniksarkar"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            title="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/aniksarkar"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          {/* Hire Anik CTA Button */}
          <a
            href="mailto:anik@example.com?subject=Interview%20Invitation%20for%20Anik%20Sarkar"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-semibold shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:scale-105 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hire Anik</span>
          </a>
        </div>
      </div>
    </header>
  );
};
