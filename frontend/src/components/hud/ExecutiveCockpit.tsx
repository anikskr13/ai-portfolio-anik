import { HolographicAvatar } from "../avatar/HolographicAvatar";
import type { AvatarState } from "../avatar/HolographicAvatar";
import {
  Code2,
  Award,
  Terminal,
  FileText,
  Briefcase,
  Zap,
  Sparkles,
  Mail,
  ExternalLink,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../common/Icons";

interface ExecutiveCockpitProps {
  avatarState: AvatarState;
  isAudioPlaying?: boolean;
  onSelectPrompt: (prompt: string) => void;
  onOpenProjects?: () => void;
  onOpenExperience?: () => void;
  onOpenSkills?: () => void;
  onOpenResume?: () => void;
}

export const ExecutiveCockpit: React.FC<ExecutiveCockpitProps> = ({
  avatarState,
  isAudioPlaying,
  onSelectPrompt,
  onOpenProjects,
  onOpenExperience,
  onOpenSkills,
  onOpenResume,
}) => {
  const modes = [
    {
      id: "recruiter",
      title: "Recruiter Pitch",
      desc: "Strengths, culture & notice",
      icon: Briefcase,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40",
      prompt: "Give me your 60-second elevator pitch: who are you, what makes you unique, and why should our company hire you?",
    },
    {
      id: "tech-lead",
      title: "Tech Lead Dive",
      desc: "FastAPI, React & RAG architecture",
      icon: Terminal,
      color: "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/40",
      prompt: "As a senior engineer interviewing you, explain the exact architecture of your AI Portfolio and how you implemented RAG with Gemini.",
    },
    {
      id: "problem-solving",
      title: "DSA & Problem Solving",
      desc: "500+ LeetCode & algorithms",
      icon: Zap,
      color: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40",
      prompt: "What is your approach to solving hard algorithmic problems and Data Structures? Mention your LeetCode journey.",
    },
  ];

  const metrics = [
    { label: "DSA SOLVED", value: "500+", sub: "LeetCode & GFG" },
    { label: "ACADEMIC GPA", value: "8.5 / 10", sub: "Computer Science" },
    { label: "TECH STACK", value: "Full-Stack", sub: "Python • React • AI" },
    { label: "AVAILABILITY", value: "Immediate", sub: "Full-Time / Remote" },
  ];

  const topSkills = [
    { name: "React / Next.js", level: "90%" },
    { name: "Python / FastAPI", level: "92%" },
    { name: "Gemini / RAG / LLMs", level: "88%" },
    { name: "PostgreSQL & Redis", level: "84%" },
    { name: "Docker & Cloud", level: "80%" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(6,182,212,0.1)]">
      {/* Hologram Avatar Stage */}
      <div className="flex flex-col items-center border-b border-slate-800/80 pb-3">
        <HolographicAvatar
          state={avatarState}
          isAudioPlaying={isAudioPlaying}
        />

        <div className="text-center mt-1">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            Anik Sarkar
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              PRO
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Full-Stack Developer & AI Systems Engineer
          </p>
        </div>

        {/* Quick Social / Connect links */}
        <div className="flex items-center gap-2 mt-2.5">
          <a
            href="https://github.com/aniksarkar"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all text-xs flex items-center gap-1.5"
            title="GitHub"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/aniksarkar"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all text-xs flex items-center gap-1.5"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">LinkedIn</span>
          </a>
          <a
            href="mailto:anik@example.com"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all text-xs flex items-center gap-1.5"
            title="Email"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">Hire Me</span>
          </a>
        </div>
      </div>

      {/* KPI Metrics Dashboard HUD */}
      <div className="grid grid-cols-2 gap-2 my-3">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
          >
            <div className="text-[10px] font-mono text-slate-400 tracking-wider">
              {m.label}
            </div>
            <div className="text-sm font-bold text-slate-100 mt-0.5">
              {m.value}
            </div>
            <div className="text-[10px] text-cyan-400/80 font-mono">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Interactive Interview Presets */}
      <div className="my-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>INSTANT INTERVIEW MODES</span>
        </div>

        <div className="space-y-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectPrompt(mode.prompt)}
                className={`w-full text-left p-2.5 rounded-xl border bg-gradient-to-r transition-all duration-200 group hover:scale-[1.01] ${mode.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 opacity-90 group-hover:rotate-12 transition-transform" />
                    <span className="text-xs font-bold font-mono tracking-wide">
                      {mode.title}
                    </span>
                  </div>
                  <span className="text-[10px] opacity-70 font-mono">ASK →</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 ml-6">
                  {mode.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Technical Matrix */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2.5">
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            CORE CAPABILITIES
          </span>
          {onOpenSkills && (
            <button
              onClick={onOpenSkills}
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {topSkills.map((skill, i) => (
            <div key={i} className="text-xs font-mono">
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>{skill.name}</span>
                <span className="text-cyan-400">{skill.level}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: skill.level }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects Trigger Pills */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>FEATURED PROJECTS</span>
          </span>
          {onOpenProjects && (
            <button
              onClick={onOpenProjects}
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <span>Explore</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              onSelectPrompt(
                "Tell me all about your AI Portfolio project: the architecture, challenges, and tech stack."
              )
            }
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
              AI Portfolio
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              React • FastAPI • RAG
            </div>
          </button>

          <button
            onClick={() =>
              onSelectPrompt(
                "Tell me about the E-Commerce platform you built: the features, Stripe integration, and database schema."
              )
            }
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
              E-Commerce Platform
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Stripe • PostgreSQL
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Experience Timeline CTA */}
      {onOpenExperience && (
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <button
            onClick={onOpenExperience}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                  Career Experience Timeline
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  XYZ Tech Solutions • B.Tech Computer Science
                </div>
              </div>
            </div>
            <span className="text-xs font-mono text-indigo-400">VIEW →</span>
          </button>
        </div>
      )}

      {/* Resume CTA */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex gap-2">
        <button
          onClick={
            onOpenResume
              ? onOpenResume
              : () =>
                  onSelectPrompt(
                    "Can you summarize your full resume in bullet points for a recruiter review?"
                  )
          }
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02]"
        >
          <FileText className="w-3.5 h-3.5" />
          View Full Resume Dossier
        </button>
      </div>
    </div>
  );
};
