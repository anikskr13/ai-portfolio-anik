import { useState } from "react";
import { cn, formatTimestamp } from "../../lib/utils";
import { User, Copy, Check, Sparkles } from "lucide-react";
import { VoiceButton } from "./VoiceButton";
import { InteractiveProjectCards } from "./InteractiveProjectCards";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../../hooks/useChat";

interface MessageBubbleProps {
  message: Message;
  onSpeakingStateChange?: (speaking: boolean) => void;
}

export function MessageBubble({ message, onSpeakingStateChange }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect project mentions in the assistant response to inject interactive visual cards
  const mentionsAiPortfolio =
    isAssistant &&
    (message.content.toLowerCase().includes("ai portfolio") ||
      message.content.toLowerCase().includes("ai-portfolio"));

  const mentionsEcommerce =
    isAssistant &&
    (message.content.toLowerCase().includes("e-commerce") ||
      message.content.toLowerCase().includes("ecommerce"));

  return (
    <div
      className={cn(
        "flex gap-3 my-2 animate-fade-in group",
        !isAssistant && "flex-row-reverse"
      )}
    >
      {/* Avatar Icon */}
      <div
        className={cn(
          "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold transition-transform group-hover:scale-105",
          isAssistant
            ? "bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300/40"
            : "bg-slate-800 text-cyan-300 border border-slate-700 shadow-md"
        )}
      >
        {isAssistant ? (
          <span className="flex items-center gap-0.5 font-mono">
            AS
          </span>
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>

      {/* Bubble Container */}
      <div
        className={cn(
          "max-w-[85%] md:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all",
          isAssistant
            ? "bg-slate-900/90 text-slate-100 rounded-tl-sm border border-cyan-500/25 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-cyan-500/40"
            : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(6,182,212,0.25)] border border-cyan-400/30"
        )}
      >
        {isAssistant && (
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800/80 text-[10px] font-mono text-cyan-400/80">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              ANIK SARKAR • AI CLONE
            </span>
            <span className="text-slate-500">{formatTimestamp(message.timestamp)}</span>
          </div>
        )}

        {isAssistant ? (
          <div className="prose prose-invert prose-sm max-w-none text-slate-200 [&>p]:my-2 [&>ul]:my-2 [&>li]:my-0.5 [&>h3]:text-cyan-300 [&>strong]:text-cyan-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap font-medium">{message.content}</p>
        )}

        {/* Interactive Rich Project Cards if mentioned */}
        {mentionsAiPortfolio && (
          <InteractiveProjectCards projectId="ai-portfolio" />
        )}
        {mentionsEcommerce && (
          <InteractiveProjectCards projectId="ecommerce" />
        )}

        {/* Footer actions for assistant */}
        {isAssistant && message.content.length > 0 && (
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <VoiceButton
                text={message.content}
                onSpeakingStateChange={onSpeakingStateChange}
              />
              <button
                onClick={handleCopy}
                className="opacity-70 hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300"
                title="Copy response"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Verified from Resume Data
            </span>
          </div>
        )}

        {!isAssistant && (
          <div className="text-[10px] font-mono text-cyan-100/70 text-right mt-1">
            {formatTimestamp(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
}
