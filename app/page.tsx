"use client";

import { useState } from "react";
import Sidebar, { type NavPage } from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import MickeyCard from "./components/MickeyCard";
import AgentCard from "./components/AgentCard";
import NewAgentCard from "./components/NewAgentCard";
import MissionBanner from "./components/MissionBanner";
import StatsBar from "./components/StatsBar";
import AgentDetailModal from "./components/AgentDetailModal";
import { agents, type Agent } from "./data/agents";

export default function Home() {
  const [activePage, setActivePage] = useState<NavPage>("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Subtle background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-600/[0.04] blur-3xl pointer-events-none" />

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile hamburger — separate from Sidebar to avoid event issues */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-zinc-400 hover:text-white transition-colors"
        style={{ display: mobileOpen ? "none" : undefined }}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <main className="relative flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          {activePage === "inicio" && (
            <DashboardHome onNavigate={setActivePage} />
          )}

          {activePage === "agentes" && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Agentes</h1>
                <p className="text-sm text-zinc-500">Tu equipo de agentes inteligentes</p>
              </div>

              {/* Mickey — Main Agent */}
              <section
                className="cursor-pointer"
                onClick={() => setSelectedAgent(agents.find((a) => a.id === "mickey") ?? null)}
              >
                <MickeyCard />
              </section>

              {/* Other Agents Grid */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-white">Todos los Agentes</h2>
                  <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
                    {agents.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {agents.filter((a) => a.id !== "mickey").map((agent, i) => (
                    <AgentCard
                      key={agent.id}
                      id={agent.id}
                      emoji={agent.emoji}
                      name={agent.name}
                      role={agent.role}
                      status={agent.status}
                      accentColor={agent.accentColor}
                      glowColor={agent.glowColor}
                      delay={i * 0.1}
                      onClick={() => setSelectedAgent(agent)}
                    />
                  ))}
                  <NewAgentCard delay={0.4} />
                </div>
              </section>

              {/* Mission Banner */}
              <section>
                <MissionBanner />
              </section>

              {/* Stats Bar */}
              <section>
                <StatsBar />
              </section>
            </div>
          )}

          {activePage === "actividad" && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Actividad</h1>
              <p className="text-sm text-zinc-500">Historial de actividad de todos los agentes</p>
              <div className="mt-8 rounded-xl border border-[#1e1e2e] bg-[#12121a] p-8 text-center">
                <p className="text-sm text-zinc-500">Próximamente — Vista completa de actividad</p>
              </div>
            </div>
          )}

          {activePage === "tareas" && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Tareas</h1>
              <p className="text-sm text-zinc-500">Gestiona las tareas de tus agentes</p>
              <div className="mt-8 rounded-xl border border-[#1e1e2e] bg-[#12121a] p-8 text-center">
                <p className="text-sm text-zinc-500">Próximamente — Gestión de tareas</p>
              </div>
            </div>
          )}

          {activePage === "configuracion" && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Configuración</h1>
              <p className="text-sm text-zinc-500">Ajustes del sistema y agentes</p>
              <div className="mt-8 rounded-xl border border-[#1e1e2e] bg-[#12121a] p-8 text-center">
                <p className="text-sm text-zinc-500">Próximamente — Panel de configuración</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="text-center pt-10 mt-10 border-t border-[#1e1e2e]">
            <p className="text-xs text-zinc-600">
              Mission Control &middot; Nacho &middot; 2026
            </p>
          </footer>
        </div>
      </main>

      {/* Agent Detail Modal */}
      <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}
