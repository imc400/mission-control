"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Clock, Activity, Wifi } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { Agent } from "../data/agents";
import { useAgentFeed, TYPE_BORDER, TYPE_ICON } from "../hooks/useAgentFeed";

const stateConfig = {
  idle: { label: "Idle", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  working: { label: "Working", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
};

const AGENT_META: Record<string, { connections?: { name: string; ok: boolean }[]; projects?: string[] }> = {
  mickey: {
    connections: [
      { name: "Telegram", ok: true },
      { name: "GitHub", ok: true },
      { name: "YouTube", ok: true },
      { name: "Vercel", ok: true },
    ],
  },
  cody: {
    projects: ["mission-control", "mentes-ocultas"],
  },
};

interface AgentDetailModalProps {
  agent: Agent | null;
  onClose: () => void;
}

/* ── Animated Progress Bar ── */
function AnimatedProgress({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="h-2 w-full rounded-full bg-[#1e1e2e] overflow-hidden">
      <motion.div
        className="h-full rounded-full animate-progress-pulse"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)`, width: `${width}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
}

export default function AgentDetailModal({ agent, onClose }: AgentDetailModalProps) {
  const { getAgentEvents } = useAgentFeed(4000, 30);
  const [imgError, setImgError] = useState(false);

  // Reset image error when agent changes
  useEffect(() => { setImgError(false); }, [agent?.id]);

  const liveEvents = agent ? getAgentEvents(agent.name).slice(0, 10) : [];
  const meta = agent ? AGENT_META[agent.id] : undefined;

  // Simulated stats
  const tasksToday = agent?.id === "mickey" ? 23 : agent?.id === "cody" ? 18 : 0;
  const uptime = agent?.status === "online" ? "12h 34m" : "—";

  return (
    <AnimatePresence>
      {agent && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto border-l border-[#1e1e2e] bg-[#0c0c14]/95 backdrop-blur-xl feed-scroll"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0c0c14]/80 backdrop-blur-xl border-b border-[#1e1e2e] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden"
                    style={{ background: `${agent.accentColor}20` }}
                  >
                    {imgError ? (
                      <span className="text-2xl">{agent.emoji}</span>
                    ) : (
                      <Image
                        src={`/avatars/${agent.id}.png`}
                        alt={agent.name}
                        width={48}
                        height={48}
                        className="rounded-xl object-cover"
                        onError={() => setImgError(true)}
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
                    <p className="text-xs text-zinc-500">{agent.role}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Status + Current Task */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${stateConfig[agent.currentState].color}`}>
                  {agent.currentState === "working" && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                    </span>
                  )}
                  {stateConfig[agent.currentState].label}
                </span>
                <span className="text-xs text-zinc-600">Última actividad: {agent.lastActive}</span>
              </div>

              {/* Progress bar (animated) */}
              {agent.currentState === "working" && agent.progress !== undefined && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-500">Progreso de tarea actual</span>
                    <span className="text-xs font-mono text-zinc-400">{agent.progress}%</span>
                  </div>
                  <AnimatedProgress value={agent.progress} color={agent.accentColor} />
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-3 text-center">
                  <CheckCircle size={14} className="text-emerald-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{tasksToday}</p>
                  <p className="text-[10px] text-zinc-600">Tareas hoy</p>
                </div>
                <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-3 text-center">
                  <Clock size={14} className="text-violet-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{uptime}</p>
                  <p className="text-[10px] text-zinc-600">Uptime</p>
                </div>
                <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-3 text-center">
                  <Activity size={14} className="text-amber-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{agent.lastActive}</p>
                  <p className="text-[10px] text-zinc-600">Last active</p>
                </div>
              </div>

              {/* Connections (Mickey) */}
              {meta?.connections && (
                <div>
                  <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Wifi size={14} className="text-violet-400" /> Canales conectados
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {meta.connections.map((c) => (
                      <div key={c.name} className="flex items-center gap-2 rounded-lg border border-[#1e1e2e] bg-[#12121a] px-3 py-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${c.ok ? "bg-emerald-500" : "bg-red-500"}`} />
                        <span className="text-xs text-zinc-300">{c.name}</span>
                        <span className="ml-auto text-[10px] text-zinc-600">{c.ok ? "✅" : "❌"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects (Cody) */}
              {meta?.projects && (
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Proyectos</h3>
                  <div className="flex flex-wrap gap-2">
                    {meta.projects.map((p) => (
                      <span key={p} className="rounded-lg border border-[#1e1e2e] bg-[#12121a] px-3 py-1.5 text-xs text-zinc-300 font-mono">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4">
                <p className="text-sm text-zinc-400 leading-relaxed">{agent.description}</p>
              </div>

              {/* Live Activity Feed */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Actividad Reciente
                </h3>
                {liveEvents.length === 0 && agent.activities.length === 0 ? (
                  <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6 text-center">
                    <p className="text-sm text-zinc-600">Sin actividad aún</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {/* Live events from the feed */}
                    {liveEvents.map((event, i) => {
                      const timeStr = event.timestamp.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.03 }}
                          className={`rounded-lg border border-[#1e1e2e] bg-[#12121a] p-2.5 border-l-2 ${TYPE_BORDER[event.type]}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs flex-shrink-0">{TYPE_ICON[event.type]}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-zinc-300 leading-snug">{event.msg}</p>
                              <p className="text-[10px] font-mono text-zinc-700 mt-0.5">{timeStr}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    {/* Fallback to static activities if no live events */}
                    {liveEvents.length === 0 && agent.activities.map((activity, i) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={`rounded-lg border border-[#1e1e2e] bg-[#12121a] p-2.5 border-l-2 ${
                          activity.type === "success" ? "border-l-emerald-500" :
                          activity.type === "working" ? "border-l-amber-500" :
                          activity.type === "warning" ? "border-l-amber-500" :
                          "border-l-blue-500"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xs flex-shrink-0">{activity.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-zinc-300 leading-snug">{activity.text}</p>
                            <p className="text-[10px] text-zinc-700 mt-0.5">{activity.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
