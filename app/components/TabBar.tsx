"use client";

import Image from "next/image";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: "inicio", label: "Inicio", icon: "/icons/tab-inicio.png" },
  { id: "youtube", label: "YouTube", icon: "/icons/tab-youtube.png" },
  { id: "calendario", label: "Calendario", icon: "/icons/tab-calendario.png" },
  { id: "agentes", label: "Agentes", icon: "/icons/tab-agentes.png" },
  { id: "proyectos", label: "Proyectos", icon: "/icons/tab-proyectos.png" },
];

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <>
      {/* Mobile bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0f1117]/95 backdrop-blur-xl border-t border-[#1e2130]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-around h-14">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-all ${
                  isActive ? "text-[#f8fafc]" : "text-[#64748b]"
                }`}
              >
                <div
                  className="rounded-full overflow-hidden transition-all"
                  style={{
                    width: 28,
                    height: 28,
                    border: isActive
                      ? "2px solid #7c3aed"
                      : "2px solid #1e2130",
                    filter: isActive ? "brightness(1.3)" : "brightness(0.7)",
                    boxShadow: isActive ? "0 0 12px #7c3aed60" : "none",
                  }}
                >
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-[#a78bfa]" : ""
                  }`}
                >
                  {tab.label}
                </span>
                {/* Glowing underline */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full animate-glow-underline"
                    style={{
                      width: 24,
                      backgroundColor: "#7c3aed",
                      color: "#7c3aed",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop left sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-56 z-50 bg-[#0f1117]/90 backdrop-blur-xl border-r border-[#1e2130]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1e2130]">
          <div
            className="rounded-full overflow-hidden shrink-0"
            style={{
              width: 32,
              height: 32,
              border: "2px solid #7c3aed60",
            }}
          >
            <Image
              src="/avatars/mickey.png"
              alt="Mission Control"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-bold tracking-tight text-[#f8fafc] block">
              MISSION CONTROL
            </span>
            <span className="text-[10px] text-[#64748b]">Centro de comando</span>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col gap-1 px-3 py-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#7c3aed]/15 text-[#f8fafc] border border-[#7c3aed]/30"
                    : "text-[#64748b] hover:text-[#f8fafc] hover:bg-[#1e2130]/50 border border-transparent"
                }`}
              >
                <div
                  className="rounded-full overflow-hidden shrink-0 transition-all"
                  style={{
                    width: 24,
                    height: 24,
                    border: isActive
                      ? "1.5px solid #7c3aed"
                      : "1.5px solid transparent",
                    filter: isActive ? "brightness(1.3)" : "brightness(0.6)",
                  }}
                >
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                </div>
                <span>{tab.label}</span>
                {/* Active glow bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full animate-glow-underline"
                    style={{ backgroundColor: "#7c3aed", color: "#7c3aed" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
