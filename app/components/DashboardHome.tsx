"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, CheckCircle, Film, Zap, ExternalLink, Github, MessageCircle, Calendar, Clock, ChevronRight } from "lucide-react";
import { agents, type Agent } from "../data/agents";
import { useAgentFeed, TYPE_BORDER, TYPE_ICON, type FeedEvent } from "../hooks/useAgentFeed";
import { supabase } from "../lib/supabase";
import type { NavPage } from "./Sidebar";
import Image from "next/image";
import { useState, useEffect } from "react";

/* ── Animated Counter ── */
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
}

/* ── Hooks for Supabase data ── */
function useScheduledTasks() {
  const [tasks, setTasks] = useState<Array<{
    id: string; name: string; description: string | null;
    schedule: string | null; next_run: string | null;
    status: "active" | "pending" | "building" | "disabled";
    project: string | null;
  }>>([]);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("scheduled_tasks")
        .select("*")
        .order("status", { ascending: true });
      if (data) setTasks(data);
    }
    fetch();
  }, []);

  return tasks;
}

function useProjects() {
  const [projects, setProjects] = useState<Array<{
    id: string; name: string; emoji: string | null;
    description: string | null; status: string;
    url: string | null; repo: string | null;
    stats: Record<string, unknown>;
  }>>([]);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("status", { ascending: true });
      if (data) setProjects(data);
    }
    fetch();
  }, []);

  return projects;
}

function useLiveStats() {
  const [completedToday, setCompletedToday] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    async function fetch() {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: todayCount } = await supabase
        .from("agent_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "completed")
        .gte("created_at", todayStart.toISOString());

      const { count: total } = await supabase
        .from("agent_events")
        .select("*", { count: "exact", head: true });

      setCompletedToday(todayCount ?? 0);
      setTotalEvents(total ?? 0);
    }
    fetch();
  }, []);

  return { completedToday, totalEvents };
}

/* ── Task status helpers ── */
const taskStatusBadge = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  building: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  disabled: "bg-red-500/10 text-red-500 border-red-500/20",
};
const taskStatusLabel: Record<string, string> = {
  active: "Activo",
  pending: "Pendiente",
  building: "Construyendo",
  disabled: "Desactivado",
};
const taskStatusIcon: Record<string, string> = {
  active: "✅",
  pending: "⏳",
  building: "🔨",
  disabled: "⛔",
};

/* ── Project status helpers ── */
const projectStatusMap: Record<string, { label: string; color: string }> = {
  active: { label: "ACTIVO", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  building: { label: "EN CONSTRUCCIÓN", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  planned: { label: "PLANIFICADO", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
};

/* ── Main Component ── */
interface DashboardHomeProps {
  onNavigate: (page: NavPage) => void;
  onSelectAgent: (agent: Agent) => void;
}

export default function DashboardHome({ onNavigate, onSelectAgent }: DashboardHomeProps) {
  const { events } = useAgentFeed(4000, 30);
  const scheduledTasks = useScheduledTasks();
  const projects = useProjects();
  const { completedToday, totalEvents } = useLiveStats();
  const [imgError, setImgError] = useState(false);
  const mickey = agents.find((a) => a.id === "mickey")!;

  const liveStats = [
    { label: "Agentes Activos", value: 2, icon: Bot, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Tareas Completadas Hoy", value: completedToday, icon: CheckCircle, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { label: "Eventos Totales", value: totalEvents, icon: Film, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Sistema Operativo", value: 99.9, icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", suffix: "%" },
  ];

  return (
    <div className="space-y-6">
      {/* ═══ Mickey Command Center Header ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative cursor-pointer"
        onClick={() => onSelectAgent(mickey)}
      >
        {/* Outer glow */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 opacity-60 blur-sm animate-pulse-glow" />

        <div className="relative rounded-2xl border border-violet-500/30 bg-[#12121a] p-5 sm:p-6 overflow-hidden">
          {/* Background orbs */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-violet-500/20 blur-md" />
                <div
                  className="relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-800 shadow-lg overflow-hidden ring-2 ring-violet-500/50"
                  style={{ boxShadow: "0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)" }}
                >
                  {imgError ? (
                    <span className="text-4xl sm:text-5xl">🐭</span>
                  ) : (
                    <Image src="/avatars/mickey.png" alt="Mickey" width={80} height={80} className="rounded-full object-cover" onError={() => setImgError(true)} />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Mickey</h2>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  EN LÍNEA
                </span>
              </div>
              <p className="text-sm text-violet-400 mb-1.5">Coordinando pipeline de Mentes Ocultas</p>
              {/* Quick actions */}
              <div className="flex flex-wrap gap-2">
                <a href="https://www.youtube.com/@MentesOcultas-yt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-[11px] font-medium text-red-400 hover:bg-red-500/20 transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Film size={12} /> Ver Canal YT
                </a>
                <a href="https://github.com/nachoblancodev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-[#1e1e2e] px-3 py-1.5 text-[11px] font-medium text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Github size={12} /> Ver Código
                </a>
                <button className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-[11px] font-medium text-violet-400 hover:bg-violet-500/20 transition-colors" onClick={(e) => e.stopPropagation()}>
                  <MessageCircle size={12} /> Abrir Chat
                </button>
              </div>
            </div>

            {/* Label */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-500/60">Main Agent</span>
              <span className="text-[10px] font-mono text-zinc-600">v3.0</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ Live Stats Bar ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {liveStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
              className={`rounded-xl border ${stat.border} bg-[#12121a] p-4`}
            >
              <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon size={16} className={stat.color} />
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.suffix ? (
                  <><AnimatedCounter target={Math.floor(stat.value)} />{stat.suffix}</>
                ) : (
                  <AnimatedCounter target={stat.value} />
                )}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ Two-column: Feed + Scheduled ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Real-time Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-3 rounded-xl border border-[#1e1e2e] bg-[#12121a] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <h3 className="text-sm font-semibold text-white">Actividad en Tiempo Real</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-600">{events.length} eventos</span>
          </div>
          <div className="max-h-[360px] overflow-y-auto feed-scroll">
            {events.length === 0 ? (
              <div className="px-4 py-8 text-center text-zinc-600 text-sm">
                Conectando con Supabase...
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {events.map((event, i) => (
                  <EventRow key={event.id} event={event} isNew={i === 0} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Scheduled Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 rounded-xl border border-[#1e1e2e] bg-[#12121a] overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e2e]">
            <Calendar size={14} className="text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Tareas Programadas</h3>
          </div>
          <div className="divide-y divide-[#1e1e2e]">
            {scheduledTasks.length === 0 ? (
              <div className="px-4 py-6 text-center text-zinc-600 text-sm">Cargando tareas...</div>
            ) : (
              scheduledTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                  className="px-4 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-sm mt-0.5">{taskStatusIcon[task.status] || "📋"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 font-medium truncate">{task.name}</p>
                      <p className="text-[11px] text-zinc-600 mt-0.5">
                        {task.schedule || "Por configurar"}
                      </p>
                      {task.next_run && (
                        <p className="text-[10px] text-zinc-700 mt-0.5">
                          Próxima: {new Date(task.next_run).toLocaleString("es-CL", {
                            weekday: "short", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium border ${taskStatusBadge[task.status] || taskStatusBadge.pending}`}>
                      {taskStatusLabel[task.status] || task.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* ═══ Projects Overview ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-white mb-3">Proyectos Activos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.length === 0 ? (
            <div className="col-span-full text-center text-zinc-600 text-sm py-6">Cargando proyectos...</div>
          ) : (
            projects.map((project, i) => {
              const statusInfo = projectStatusMap[project.status] || projectStatusMap.active;
              const statsStr = project.stats
                ? Object.entries(project.stats).map(([k, v]) => `${k}: ${v}`).join(" · ")
                : "";
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.55 + i * 0.08 }}
                  className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4 hover:border-[#2e2e3e] transition-colors group"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-lg">{project.emoji || "📁"}</span>
                    <h3 className="text-sm font-semibold text-white">{project.name}</h3>
                  </div>
                  <p className="text-[12px] text-zinc-500 mb-2">{project.description}</p>
                  {statsStr && <p className="text-[11px] text-zinc-600 mb-3">{statsStr}</p>}
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* ═══ Agents Overview Row ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Agentes</h2>
          <button
            onClick={() => onNavigate("agentes")}
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {agents.filter(a => a.id !== "mickey").slice(0, 4).map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.65 + i * 0.06 }}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4 cursor-pointer hover:border-[#2e2e3e] transition-colors group"
              onClick={() => onSelectAgent(agent)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{agent.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-white">{agent.name}</p>
                  <p className="text-[10px] text-zinc-600">{agent.role}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  agent.status === "online"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                }`}
              >
                {agent.status === "online" && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                )}
                {agent.status === "online" ? "Online" : "Próximamente"}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Feed Event Row ── */
function EventRow({ event, isNew }: { event: FeedEvent; isNew: boolean }) {
  const timeStr = event.timestamp.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -20, height: 0 } : false}
      animate={{ opacity: 1, x: 0, height: "auto" }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 px-4 py-2.5 border-l-2 ${TYPE_BORDER[event.type]} hover:bg-white/[0.02] transition-colors`}
    >
      <span className="text-xs mt-0.5 flex-shrink-0">{TYPE_ICON[event.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-zinc-300 leading-snug">{event.msg}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-zinc-600">{event.emoji} {event.agent}</span>
          <span className="text-[10px] text-zinc-700">·</span>
          <span className="text-[10px] font-mono text-zinc-700">{timeStr}</span>
        </div>
      </div>
      {isNew && (
        <span className="flex-shrink-0 rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[9px] font-medium text-violet-400">
          NUEVO
        </span>
      )}
    </motion.div>
  );
}
