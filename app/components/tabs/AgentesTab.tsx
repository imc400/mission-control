"use client";

import { useState } from "react";
import { useAgentFeed, TYPE_COLORS, TYPE_ICON } from "../../hooks/useAgentFeed";

interface AgentDef {
  name: string;
  emoji: string;
  role: string;
  connections?: string[];
  projects?: string[];
  comingSoon?: boolean;
}

const AGENTS: AgentDef[] = [
  {
    name: "Mickey",
    emoji: "🐭",
    role: "Orquestador Principal",
    connections: ["Telegram ✅", "GitHub ✅", "YouTube ✅", "Vercel ✅", "Supabase ✅"],
  },
  {
    name: "Cody",
    emoji: "⚙️",
    role: "Agente de Código",
    projects: ["mission-control", "mentes-ocultas"],
  },
  {
    name: "Rex",
    emoji: "🦖",
    role: "Agente de Marketing",
    comingSoon: true,
  },
  {
    name: "Nova",
    emoji: "⚡",
    role: "Agente de Contenido",
    comingSoon: true,
  },
  {
    name: "Dash",
    emoji: "🚀",
    role: "Agente de Ventas",
    comingSoon: true,
  },
];

export default function AgentesTab() {
  const { events, getAgentEvents } = useAgentFeed(4000, 50);
  const [expanded, setExpanded] = useState<string | null>(null);

  function getStatus(agentName: string): "active" | "idle" {
    const agentEvts = events.filter((e) => e.agent === agentName);
    if (agentEvts.length === 0) return "idle";
    return Date.now() - agentEvts[0].timestamp.getTime() < 5 * 60 * 1000
      ? "active"
      : "idle";
  }

  function getLastTask(agentName: string): string | null {
    const agentEvts = events.filter((e) => e.agent === agentName);
    return agentEvts.length > 0 ? agentEvts[0].msg : null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xs uppercase tracking-widest text-[#64748b] font-medium">
        Agentes
      </h1>

      {AGENTS.map((agent) => {
        const isExpanded = expanded === agent.name;
        const status = agent.comingSoon ? null : getStatus(agent.name);
        const lastTask = agent.comingSoon ? null : getLastTask(agent.name);
        const agentEvents = agent.comingSoon
          ? []
          : getAgentEvents(agent.name).slice(0, 10);

        return (
          <div
            key={agent.name}
            className={`bg-[#0f1117] border rounded-xl overflow-hidden transition-all ${
              agent.comingSoon
                ? "border-[#1e2130] opacity-50"
                : agent.name === "Mickey"
                  ? "border-[#7c3aed]/30"
                  : "border-[#1e2130]"
            }`}
          >
            <button
              onClick={() =>
                !agent.comingSoon &&
                setExpanded(isExpanded ? null : agent.name)
              }
              className="w-full p-4 flex items-center gap-4 text-left"
              disabled={agent.comingSoon}
            >
              <span
                className={`text-3xl ${agent.name === "Mickey" ? "animate-float" : ""}`}
              >
                {agent.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#f8fafc]">
                    {agent.name}
                  </span>
                  {agent.comingSoon ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#1e2130] text-[#64748b]">
                      En construcción
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        status === "active"
                          ? "bg-[#10b981]/15 text-[#34d399]"
                          : "bg-[#f59e0b]/15 text-[#fbbf24]"
                      }`}
                    >
                      {status === "active" ? "Activo" : "En espera"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748b] mt-0.5">{agent.role}</p>
                {lastTask && (
                  <p className="text-xs text-[#a78bfa] mt-1 truncate">
                    {lastTask}
                  </p>
                )}
              </div>
              {!agent.comingSoon && (
                <span
                  className={`text-[#64748b] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              )}
            </button>

            {isExpanded && !agent.comingSoon && (
              <div className="px-4 pb-4 space-y-3 border-t border-[#1e2130]">
                {/* Connections */}
                {agent.connections && (
                  <div className="pt-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#64748b] mb-2">
                      Conexiones
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.connections.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-1 rounded-md text-xs bg-[#08090e] border border-[#1e2130] text-[#f8fafc]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {agent.projects && (
                  <div className="pt-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#64748b] mb-2">
                      Proyectos
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.projects.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-1 rounded-md text-xs bg-[#08090e] border border-[#1e2130] text-[#f8fafc] font-mono"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent events */}
                {agentEvents.length > 0 && (
                  <div className="pt-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#64748b] mb-2">
                      Últimos eventos
                    </p>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto feed-scroll">
                      {agentEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex items-start gap-2 py-1.5"
                        >
                          <span className="text-xs leading-none mt-0.5">
                            {ev.emoji || TYPE_ICON[ev.type]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#f8fafc] truncate">
                              {ev.msg}
                            </p>
                            <span
                              className={`text-[10px] ${TYPE_COLORS[ev.type]}`}
                            >
                              {ev.type}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#64748b]">
                            {ev.timestamp.toLocaleTimeString("es-CL", {
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "America/Santiago",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
