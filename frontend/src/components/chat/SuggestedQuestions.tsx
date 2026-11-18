import { useState } from "react";
import { MessageSquare, Code2, Briefcase, Zap, HelpCircle } from "lucide-react";

const CATEGORIES = [
  {
    id: "recruiter",
    label: "Recruiter FAQs",
    icon: Briefcase,
    questions: [
      "Why should we hire you as a Full-Stack Developer?",
      "What are your core strengths and areas of growth?",
      "What is your notice period and current availability?",
      "Tell me about your internship at XYZ Tech Solutions.",
    ],
  },
  {
    id: "technical",
    label: "Technical & Arch",
    icon: Code2,
    questions: [
      "How did you build the RAG pipeline in your AI Portfolio?",
      "Why FastAPI over Django or Node.js for LLM backends?",
      "How do you approach solving LeetCode hard problems?",
      "Explain your experience with PostgreSQL & Redis caching.",
    ],
  },
  {
    id: "projects",
    label: "Deep Projects",
    icon: Zap,
    questions: [
      "Walk me through the E-Commerce platform architecture.",
      "How do you ensure AI streaming responses don't drop on SSE?",
      "What was the most challenging bug you fixed?",
    ],
  },
  {
    id: "culture",
    label: "Culture & Fun",
    icon: HelpCircle,
    questions: [
      "Tell me a fun fact about yourself!",
      "How do you collaborate in cross-functional Agile teams?",
      "What are you learning right now on weekends?",
    ],
  },
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  const [activeTab, setActiveTab] = useState("recruiter");

  const currentCategory =
    CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0];

  return (
    <div className="my-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 text-xs font-mono text-cyan-400">
        <MessageSquare className="w-3.5 h-3.5" />
        <span>RECRUITER INTERVIEW SHORTCUTS</span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-3 border-b border-slate-800 pb-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Question Pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {currentCategory.questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            className="text-left p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 text-xs text-slate-300 hover:text-cyan-200 transition-all flex items-center justify-between group"
          >
            <span className="line-clamp-2">{q}</span>
            <span className="opacity-0 group-hover:opacity-100 text-cyan-400 font-mono text-[10px] ml-2 shrink-0 transition-opacity">
              ASK →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
