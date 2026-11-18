import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Sparkles } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "../../lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onListeningChange?: (listening: boolean) => void;
}

export function ChatInput({ onSend, isLoading, onListeningChange }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      onListeningChange?.(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      onListeningChange?.(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      onListeningChange?.(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    onListeningChange?.(true);
  };

  return (
    <div className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-3 md:p-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={cn(
            "p-3 rounded-xl transition-all border shrink-0",
            isListening
              ? "text-emerald-400 bg-emerald-950/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse"
              : "text-slate-400 bg-slate-900 border-slate-800 hover:text-cyan-400 hover:border-cyan-500/40"
          )}
          title={isListening ? "Listening... (Click to stop)" : "Speak via Voice Input"}
        >
          {isListening ? (
            <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
              <MicOff className="h-4 w-4" />
              <span className="hidden sm:inline">Listening</span>
            </div>
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>

        {/* Text Area */}
        <div className="flex-1 relative">
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Listening to your voice..."
                : "Ask Anik anything (e.g., 'What are your strengths?', 'Explain your RAG project')..."
            }
            className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/50 max-h-32 transition-all shadow-inner"
            maxRows={4}
            disabled={isLoading}
          />
          {input.trim() && !isLoading && (
            <span className="hidden md:block absolute right-3 bottom-3 text-[10px] font-mono text-slate-500 pointer-events-none">
              Press Enter ↵
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white disabled:opacity-30 hover:from-cyan-500 hover:to-blue-500 transition-all shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 disabled:hover:scale-100"
          title="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-2 text-[11px] font-mono text-slate-500">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Live Gemini RAG AI • Speaking directly on behalf of Anik Sarkar</span>
      </div>
    </div>
  );
}
