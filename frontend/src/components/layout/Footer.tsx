import { Terminal, ShieldCheck } from "lucide-react";
import { OWNER_NAME } from "../../lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 py-2.5 px-4 text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {OWNER_NAME} • AI Interactive Resume Engine
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Fact-Checked Against Resume
          </span>
          <span className="text-slate-600">|</span>
          <a
            href="https://github.com/aniksarkar/ai-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-300 transition-colors"
          >
            Source Code
          </a>
        </div>
      </div>
    </footer>
  );
}
