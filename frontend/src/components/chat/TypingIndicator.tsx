import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 my-2 animate-fade-in items-start">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 text-slate-950 font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300/40">
        AS
      </div>
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg flex items-center gap-3">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-cyan-300">
          Synthesizing response...
        </span>
        <div className="flex gap-1.5 ml-1">
          <span
            className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
