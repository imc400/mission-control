"use client";

import { useState } from "react";
import { useAgentFeed, TYPE_COLORS } from "../../hooks/useAgentFeed";
import AgentAvatar, { AGENT_AVATARS } from "../AgentAvatar";

interface AgentDef {
  name: string;
  role: string;
  connections?: string[];
  projects?: string[];
  comingSoon?: boolean;
}

const AGENTS: AgentDef[] = [
  {
    name: "Mickey",
    role: "Orquestador Principal",
    connections: ["Telegram", "GitHub", "YouTube", "Vercel", "Supabase"],
  },
  {
    name: "Cody",
    role: "Agente de Código",
    projects: ["mission-control", "mentes-ocultas"],
  },
  {
    name: "Josefina",
    role: "Agente de Diseño UX/UI",
    projects: ["mission-control", "mentes-ocultas", "agencia-marketing"],
  },
  {
    name: "Rex",
    role: "Agente de Marketing",
    comingSoon: true,
  },
  {
    name: "Nova",
    role: "Agente de Contenido",
    comingSoon: true,
  },
  {
    name: "Dash",
    role: "Agente de Ventas",
    comingSoon: true,
  },
];

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

function StatusDot({ status }: { status: "active" | "idle" | null }) {
  if (!status) return null;
  const isActive = status === "active";
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      {isActive && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#10b981] animate-status-pulse" />
      )}
      <span
        className={`relative inline-flex rounded-full h-2.5 w-2.5 ring-2 ring-[#0f1117] ${
          isActive ? "bg-[#10b981]" : "bg-[#f59e0b]"
        }`}
      />
    </span>
  );
}

const STATUS_LABEL: Record<string, string> = {
  active: "activo",
  idle: "en espera",
};

const TYPE_LABEL: Record<string, string> = {
  working: "trabajando",
  completed: "completado",
  error: "error",
  idle: "en espera",
};

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
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 space-y-4">
      <h1 className="text-xs uppercase tracking-widest text-[#64748b] font-medium">
        Agentes
      </h1>

      {/* Desktop: 2-column grid / Mobile: stacked */}
      <div className="md:grid md:grid-cols-2 md:gap-3 space-y-3 md:space-y-0">
        {AGENTS.map((agent) => {
          const isExpanded = expanded === agent.name;
          const status = agent.comingSoon ? null : getStatus(agent.name);
          const lastTask = agent.comingSoon ? null : getLastTask(agent.name);
          const agentEvents = agent.comingSoon
            ? []
            : getAgentEvents(agent.name).slice(0, 10);
          const agentColor = AGENT_AVATARS[agent.name]?.color || "#64748b";
          const isActive = status === "active";

          return (
            <div
              key={agent.name}
              className={`bg-[#0f1117] border rounded-xl overflow-hidden transition-all card-glow ${
                agent.comingSoon ? "border-[#1e2130] opacity-50" : ""
              }`}
              style={
                !agent.comingSoon
                  ? { borderColor: `${agentColor}30` }
                  : undefined
              }
            >
              <button
                onClick={() =>
                  !agent.comingSoon &&
                  setExpanded(isExpanded ? null : agent.name)
                }
                className="w-full p-3 flex items-center gap-3 text-left"
                disabled={agent.comingSoon}
              >
                {/* Avatar — 56x56 on mobile */}
                <div className="relative shrink-0">
                  <AgentAvatar
                    name={agent.name}
                    size={56}
                    active={isActive}
                  />
                  {/* Status dot overlay */}
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <StatusDot status={status} />
                  </div>
                </div>

                {/* Info right */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#f8fafc]">
                      {agent.name}
                    </span>
                    {agent.comingSoon ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#1e2130] text-[#64748b]">
                        En construcción
                      </span>
                    ) : (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          isActive
                            ? "bg-[#10b981]/15 text-[#34d399]"
                            : "bg-[#f59e0b]/15 text-[#fbbf24]"
                        }`}
                      >
                        {STATUS_LABEL[status!] || status}
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
                    className={`text-[#64748b] transition-transform text-xs ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                )}
              </button>

              {isExpanded && !agent.comingSoon && (
                <div className="px-3 pb-3 space-y-2.5 border-t border-[#1e2130]">
                  {/* Connections */}
                  {agent.connections && (
                    <div className="pt-2.5">
                      <p className="text-[10px] uppercase tracking-widest text-[#64748b] mb-1.5">
                        Conexiones
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {agent.connections.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-[#08090e] border border-[#1e2130] text-[#f8fafc]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {agent.projects && (
                    <div className="pt-2.5">
                      <p className="text-[10px] uppercase tracking-widest text-[#64748b] mb-1.5">
                        Proyectos
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {agent.projects.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-[#08090e] border border-[#1e2130] text-[#f8fafc] font-mono"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent events */}
                  {agentEvents.length > 0 && (
                    <div className="pt-2.5">
                      <p className="text-[10px] uppercase tracking-widest text-[#64748b] mb-1.5">
                        Últimos eventos
                      </p>
                      <div className="space-y-1 max-h-48 overflow-y-auto feed-scroll">
                        {agentEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className="flex items-center gap-2 py-1"
                          >
                            <AgentAvatar name={ev.agent} size={18} />
                            <p className="text-[11px] text-[#f8fafc] truncate flex-1 min-w-0">
                              {ev.msg}
                            </p>
                            <span
                              className={`text-[9px] shrink-0 ${TYPE_COLORS[ev.type]}`}
                            >
                              {TYPE_LABEL[ev.type] || ev.type}
                            </span>
                            <span className="text-[9px] font-mono text-[#64748b] shrink-0">
                              {relativeTime(ev.timestamp)}
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
    </div>
  );
}
