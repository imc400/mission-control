"use client";

interface Tab {
  id: string;
  label: string;
  emoji: string;
}

const TABS: Tab[] = [
  { id: "inicio", label: "Inicio", emoji: "🏠" },
  { id: "youtube", label: "YouTube", emoji: "🎬" },
  { id: "calendario", label: "Calendario", emoji: "📅" },
  { id: "agentes", label: "Agentes", emoji: "🤖" },
  { id: "proyectos", label: "Proyectos", emoji: "📊" },
];

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <>
      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0f1117]/95 backdrop-blur-xl border-t border-[#1e2130]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around h-14">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors ${
                activeTab === tab.id
                  ? "text-[#f8fafc]"
                  : "text-[#64748b]"
              }`}
            >
              <span className="text-lg leading-none">{tab.emoji}</span>
              <span className={`text-[10px] font-medium ${
                activeTab === tab.id ? "text-[#7c3aed]" : ""
              }`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#7c3aed] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop top tab bar */}
      <nav className="hidden md:flex items-center gap-1 px-6 py-3 bg-[#0f1117]/80 backdrop-blur-xl border-b border-[#1e2130] sticky top-0 z-50">
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-lg">🎯</span>
          <span className="text-sm font-bold tracking-tight text-[#f8fafc]">MISSION CONTROL</span>
        </div>
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#7c3aed]/15 text-[#f8fafc] border border-[#7c3aed]/30"
                  : "text-[#64748b] hover:text-[#f8fafc] hover:bg-[#1e2130]/50"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
