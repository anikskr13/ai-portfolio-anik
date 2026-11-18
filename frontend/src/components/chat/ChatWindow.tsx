import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import type { Message } from "../../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { ExecutiveCockpit } from "../hud/ExecutiveCockpit";
import type { AvatarState } from "../avatar/HolographicAvatar";
import { RefreshCw, Terminal, Flame } from "lucide-react";

interface ChatWindowProps {
  viewMode?: "cockpit" | "chat";
  messages?: Message[];
  isLoading?: boolean;
  sendMessage?: (message: string) => Promise<void>;
  onOpenProjects?: () => void;
  onOpenExperience?: () => void;
  onOpenSkills?: () => void;
  onOpenResume?: () => void;
}

export function ChatWindow({
  viewMode = "cockpit",
  messages: propsMessages,
  isLoading: propsIsLoading,
  sendMessage: propsSendMessage,
  onOpenProjects,
  onOpenExperience,
  onOpenSkills,
  onOpenResume,
}: ChatWindowProps) {
  const internalChat = useChat();
  const messages = propsMessages ?? internalChat.messages;
  const isLoading = propsIsLoading ?? internalChat.isLoading;
  const sendMessage = propsSendMessage ?? internalChat.sendMessage;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);

  // Compute live avatar state
  let avatarState: AvatarState = "idle";
  if (isVoiceListening) {
    avatarState = "listening";
  } else if (isLoading) {
    avatarState = "thinking";
  } else if (isAudioSpeaking) {
    avatarState = "speaking";
  }

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleResetChat = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4.2rem)] p-2 sm:p-4 flex flex-col lg:flex-row gap-4 overflow-hidden">
      {/* Left Column: Executive Hologram HUD */}
      {(viewMode === "cockpit" || window.innerWidth >= 1024) && (
        <div className="w-full lg:w-[380px] shrink-0 h-full overflow-hidden flex flex-col">
          <ExecutiveCockpit
            avatarState={avatarState}
            isAudioPlaying={isAudioSpeaking}
            onSelectPrompt={sendMessage}
            onOpenProjects={onOpenProjects}
            onOpenExperience={onOpenExperience}
            onOpenSkills={onOpenSkills}
            onOpenResume={onOpenResume}
          />
        </div>
      )}

      {/* Right Column: Cyberpunk Neural Chat Terminal */}
      <div className="flex-1 flex flex-col h-full bg-slate-950/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.08)]">
        {/* Terminal Header Bar */}
        <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-cyan-300">
              SYNAPSE INTERVIEW TERMINAL
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 text-[11px]">RAG v2.5</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct Candidate Connection
            </span>
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px]"
              title="Reset Conversation"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Messages Feed Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 sm:p-5 scroll-smooth custom-scrollbar"
        >
          {/* Welcome Banner Card */}
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 border border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0 mt-0.5">
                <Flame className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  Welcome to my Live AI Candidate Clone
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    INTERACTIVE
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  I represent <strong>Anik Sarkar</strong>. I answer in real time, first person, grounded completely in Anik&apos;s engineering experience, projects, skills, and resume. You can speak to me with your microphone or type any question!
                </p>
              </div>
            </div>
          </div>

          {/* Chat Message List */}
          <div className="space-y-4 pb-2">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onSpeakingStateChange={setIsAudioSpeaking}
              />
            ))}
            {isLoading && <TypingIndicator />}
          </div>

          {/* Suggested Quick Questions (When conversation is fresh) */}
          {messages.length <= 2 && (
            <SuggestedQuestions onSelect={sendMessage} />
          )}
        </div>

        {/* Chat Input Bar */}
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          onListeningChange={setIsVoiceListening}
        />
      </div>
    </div>
  );
}
