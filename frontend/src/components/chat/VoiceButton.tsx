import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Radio } from "lucide-react";

interface VoiceButtonProps {
  text: string;
  onSpeakingStateChange?: (speaking: boolean) => void;
}

export function VoiceButton({ text, onSpeakingStateChange }: VoiceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Pre-load and cache voices properly
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const available = window.speechSynthesis.getVoices();
        // Strictly filter to English language voices only
        voicesRef.current = available.filter(
          (v) => v.lang && v.lang.toLowerCase().startsWith("en")
        );
      }
    };

    updateVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const getBestEnglishVoice = (): SpeechSynthesisVoice | null => {
    const englishVoices = voicesRef.current.length > 0 
      ? voicesRef.current 
      : window.speechSynthesis.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));

    if (englishVoices.length === 0) return null;

    // High priority: Natural young/professional male or crisp English voices
    const priorityNames = [
      "Microsoft Christopher Online (Natural)",
      "Microsoft Guy Online (Natural)",
      "Google US English",
      "Microsoft Eric Online (Natural)",
      "Microsoft David Desktop",
      "Daniel",
      "Samantha",
      "Google UK English Male",
      "en-US",
    ];

    for (const name of priorityNames) {
      const match = englishVoices.find((v) =>
        v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }

    // Secondary priority: Any en-US voice
    const usVoice = englishVoices.find(
      (v) => v.lang.toLowerCase() === "en-us" || v.lang.toLowerCase() === "en_us"
    );
    if (usVoice) return usVoice;

    // Fallback: The first strictly English voice
    return englishVoices[0];
  };

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onSpeakingStateChange?.(false);
      return;
    }

    // Cancel any previous speech immediately
    window.speechSynthesis.cancel();

    // Clean text: strip markdown symbols, URLs, asterisks, brackets
    const cleanText = text
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Links -> text
      .replace(/[#*`_>~]/g, "") // Markdown characters
      .replace(/https?:\/\/\S+/g, "") // Raw URLs
      .replace(/\n+/g, ". ")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    const bestVoice = getBestEnglishVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakingStateChange?.(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakingStateChange?.(false);
    };

    utterance.onerror = (e) => {
      // Don't show error if it was manually cancelled
      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.warn("Speech synthesis error:", e);
      }
      setIsSpeaking(false);
      onSpeakingStateChange?.(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={toggleSpeech}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono transition-all ${
        isSpeaking
          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse shadow-sm"
          : "opacity-70 hover:opacity-100 hover:bg-slate-800 text-slate-400 hover:text-cyan-300"
      }`}
      title={isSpeaking ? "Mute audio" : "Listen in English"}
    >
      {isSpeaking ? (
        <>
          <Radio className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
          <span>Speaking...</span>
          <VolumeX className="h-3.5 w-3.5 text-rose-400 ml-1" />
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5" />
          <span>Voice</span>
        </>
      )}
    </button>
  );
}
