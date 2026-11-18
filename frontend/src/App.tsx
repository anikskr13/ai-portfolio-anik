import { useState } from "react";
import { Header } from "./components/layout/Header";
import { ChatWindow } from "./components/chat/ChatWindow";
import { Footer } from "./components/layout/Footer";
import { ProjectsModal } from "./components/views/ProjectsModal";
import { ExperienceModal } from "./components/views/ExperienceModal";
import { SkillsModal } from "./components/views/SkillsModal";
import { ResumeModal } from "./components/views/ResumeModal";
import { useChat } from "./hooks/useChat";

export default function App() {
  const [viewMode, setViewMode] = useState<"cockpit" | "chat">("cockpit");
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Centralized chat state so all visual modals can directly trigger conversations
  const { messages, isLoading, sendMessage } = useChat();

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "cockpit" ? "chat" : "cockpit"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050713] text-slate-100 cyber-grid relative selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Dynamic Ambient Background Aurora */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Header
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenExperience={() => setIsExperienceOpen(true)}
        onOpenSkills={() => setIsSkillsOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      <main className="flex-1 overflow-hidden">
        <ChatWindow
          viewMode={viewMode}
          messages={messages}
          isLoading={isLoading}
          sendMessage={sendMessage}
          onOpenProjects={() => setIsProjectsOpen(true)}
          onOpenExperience={() => setIsExperienceOpen(true)}
          onOpenSkills={() => setIsSkillsOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
        />
      </main>

      <Footer />

      {/* Visual Modals & Showcases */}
      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        onAskAboutProject={(prompt) => {
          setIsProjectsOpen(false);
          sendMessage(prompt);
        }}
      />

      <ExperienceModal
        isOpen={isExperienceOpen}
        onClose={() => setIsExperienceOpen(false)}
        onAskAboutExperience={(prompt) => {
          setIsExperienceOpen(false);
          sendMessage(prompt);
        }}
      />

      <SkillsModal
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
        onAskSkill={(prompt) => {
          setIsSkillsOpen(false);
          sendMessage(prompt);
        }}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
