"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { agents, type Agent } from "../data/agents";
import { useAgentFeed, TYPE_ICON, type FeedEvent } from "../hooks/useAgentFeed";
import { supabase } from "../lib/supabase";

/* ══════════════════════════════════════════════════════════
   JARVIS — Mission Control Dashboard
   ══════════════════════════════════════════════════════════ */

/* ── Agent accent colors ── */
const AGENT_ACCENT: Record<string, string> = {
  mickey: "#7c3aed",
  cody: "#10b981",
  rex: "#f97316",
  nova: "#00d4ff",
  dash: "#00ff88",
};

const STATUS_CONFIG = {
  online: { label: "ACTIVO", color: "#00ff88", bg: "rgba(0,255,136,0.08)", border: "rgba(0,255,136,0.2)" },
  building: { label: "CONSTRUYENDO", color: "#00d4ff", bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.2)" },
  "coming-soon": { label: "EN ESPERA", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
  offline: { label: "OFFLINE", color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)" },
} as const;

const EVENT_TYPE_COLOR: Record<string, string> = {
  completed: "#00ff88",
  working: "#00d4ff",
  error: "#ff3366",
  idle: "#6b7280",
};

/* ── Supabase Hooks ── */
function useScheduledTasks() {
  const [tasks, setTasks] = useState<Array<{
    id: string; name: string; description: string | null;
    schedule: string | null; next_run: string | null;
    status: "active" | "pending" | "building" | "disabled";
    project: string | null;
  }>>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("scheduled_tasks").select("*").order("status", { ascending: true });
      if (data) setTasks(data);
    })();
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
    (async () => {
      const { data } = await supabase.from("projects").select("*").order("status", { ascending: true });
      if (data) setProjects(data);
    })();
  }, []);

  return projects;
}

function useLiveStats() {
  const [completedToday, setCompletedToday] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    (async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [{ count: todayCount }, { count: total }] = await Promise.all([
        supabase.from("agent_events").select("*", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
        supabase.from("agent_events").select("*", { count: "exact", head: true }),
      ]);

      setCompletedToday(todayCount ?? 0);
      setTotalEvents(total ?? 0);
    })();
  }, []);

  return { completedToday, totalEvents };
}

/* ── Real-time Clock ── */
function SantiagoClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString("es-CL", {
        timeZone: "America/Santiago",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-lg tracking-widest text-[#00d4ff]">
      {time || "--:--:--"}
    </span>
  );
}

/* ── Countdown helper ── */
function Countdown({ targetDate }: { targetDate: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setText("ahora"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setText(`en ${h}h ${m}m`);
    }
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [targetDate]);

  return <span className="text-[#00d4ff] font-mono text-xs">{text}</span>;
}

/* ── Animated Counter ── */
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      n += step;
      if (n >= target) { setCount(target); clearInterval(timer); }
      else setCount(n);
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}</>;
}

/* ══════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ══════════════════════════════════════════════════════════ */

export default function JarvisDashboard() {
  const { events } = useAgentFeed(4000, 50);
  const scheduledTasks = useScheduledTasks();
  const projects = useProjects();
  const { completedToday, totalEvents } = useLiveStats();
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const activeTasks = scheduledTasks.filter((t) => t.status === "active");
  const nextTask = useMemo(() => {
    const withRun = scheduledTasks.filter((t) => t.next_run);
    withRun.sort((a, b) => new Date(a.next_run!).getTime() - new Date(b.next_run!).getTime());
    return withRun[0] || null;
  }, [scheduledTasks]);

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* ═══════ TOP BAR ═══════ */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050508]/80 border-b border-[#00d4ff]/10">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
          {/* Left */}
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-sm sm:text-base font-bold tracking-[0.2em] text-white uppercase">
              Mission Control
            </h1>
            <span className="hidden sm:inline text-[10px] text-[#7c3aed]/60 font-mono">by Mickey 🐭</span>
          </div>

          {/* Center — Clock */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <SantiagoClock />
          </div>

          {/* Right — System Status */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75 animate-live-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff88]" />
            </span>
            <span className="hidden sm:inline text-[11px] font-mono text-[#00ff88]/80 tracking-wide">
              SISTEMA OPERATIVO
            </span>
            <span className="text-[10px] font-mono text-zinc-600 hidden md:inline">99.9% uptime</span>
          </div>
        </div>
      </header>

      {/* ═══════ MAIN 3-COLUMN GRID ═══════ */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-6 lg:p-6 max-w-[1600px] mx-auto w-full">

        {/* ── COLUMN 1: Agent Roster ── */}
        <section className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 bg-gradient-to-r from-[#7c3aed]/30 to-transparent" />
            <h2 className="text-[11px] font-mono font-bold tracking-[0.15em] text-[#7c3aed] uppercase">Agentes</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-[#7c3aed]/30 to-transparent" />
          </div>

          {agents.map((agent, i) => (
            <AgentRosterCard
              key={agent.id}
              agent={agent}
              events={events.filter((e) => e.agent === agent.name)}
              expanded={expandedAgent === agent.id}
              onToggle={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
              delay={i * 0.08}
            />
          ))}
        </section>

        {/* ── COLUMN 2: Live Activity Feed ── */}
        <section className="lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff3366] opacity-75 animate-live-pulse" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff3366]" />
                </span>
                <span className="text-[10px] font-mono font-bold text-[#ff3366] tracking-wider">LIVE</span>
              </div>
              <h2 className="text-[11px] font-mono font-bold tracking-[0.15em] text-zinc-400 uppercase">
                Transmisiones en Vivo
              </h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-700">{events.length} eventos</span>
          </div>

          <div className="flex-1 rounded-xl border border-[#00d4ff]/10 bg-[#0a0b10]/80 backdrop-blur-sm overflow-hidden animate-border-glow-blue relative">
            {/* Scan line effect */}
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/20 to-transparent pointer-events-none" style={{ animation: "scan-line 4s linear infinite" }} />

            <div className="h-full max-h-[calc(100vh-220px)] overflow-y-auto feed-scroll">
              {events.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-sm font-mono text-zinc-700">Sin actividad reciente — sistema en espera</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {events.map((event, i) => (
                    <LiveEventRow key={event.id} event={event} isNew={i === 0} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </section>

        {/* ── COLUMN 3: Operations Panel ── */}
        <section className="lg:col-span-4 space-y-4">
          {/* Misiones Activas */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-[#00d4ff]/30 to-transparent" />
              <h2 className="text-[11px] font-mono font-bold tracking-[0.15em] text-[#00d4ff] uppercase">
                Misiones Activas
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-[#00d4ff]/30 to-transparent" />
            </div>

            <div className="space-y-2">
              {projects.length === 0 ? (
                <div className="rounded-xl border border-[#141822] bg-[#0a0b10] p-6 text-center">
                  <p className="text-xs font-mono text-zinc-700">Cargando misiones...</p>
                </div>
              ) : (
                projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} delay={i * 0.06} />
                ))
              )}
            </div>
          </div>

          {/* Tareas Programadas */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-[#7c3aed]/30 to-transparent" />
              <h2 className="text-[11px] font-mono font-bold tracking-[0.15em] text-[#7c3aed] uppercase">
                Tareas Programadas
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-[#7c3aed]/30 to-transparent" />
            </div>

            <div className="rounded-xl border border-[#141822] bg-[#0a0b10]/80 divide-y divide-[#141822] overflow-hidden">
              {scheduledTasks.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-xs font-mono text-zinc-700">Cargando tareas...</p>
                </div>
              ) : (
                scheduledTasks.map((task, i) => (
                  <ScheduledTaskRow key={task.id} task={task} delay={i * 0.05} />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ═══════ BOTTOM STATS BAR ═══════ */}
      <footer className="border-t border-[#00d4ff]/10 bg-[#050508]/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 sm:px-6 lg:px-8 py-4">
          <StatCard label="Eventos hoy" value={completedToday} color="#00d4ff" />
          <StatCard label="Tareas activas" value={activeTasks.length} color="#00ff88" />
          <StatCard label="Videos publicados" value={3} color="#7c3aed" />
          <div className="rounded-lg border border-[#141822] bg-[#0a0b10] px-4 py-3">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Proxima mision</p>
            {nextTask ? (
              <div className="flex items-center gap-2">
                <Countdown targetDate={nextTask.next_run!} />
                <span className="text-[10px] text-zinc-500 truncate">{nextTask.name}</span>
              </div>
            ) : (
              <span className="text-xs font-mono text-zinc-700">—</span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════ */

/* ── Agent Roster Card ── */
function AgentRosterCard({ agent, events, expanded, onToggle, delay }: {
  agent: Agent;
  events: FeedEvent[];
  expanded: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const [imgError, setImgError] = useState(false);
  const accent = AGENT_ACCENT[agent.id] || "#00d4ff";
  const status = STATUS_CONFIG[agent.status] || STATUS_CONFIG.offline;
  const lastEvents = events.slice(0, 5);
  const currentTask = events[0]?.msg || null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border bg-[#0a0b10]/80 backdrop-blur-sm overflow-hidden transition-all duration-300"
      style={{ borderColor: `${accent}15` }}
    >
      <div className="p-3 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={onToggle}>
        <div className="flex items-center gap-3">
          {/* Avatar with glow */}
          <div className="relative flex-shrink-0">
            <div
              className="absolute -inset-1.5 rounded-full blur-md"
              style={{ background: `${accent}20` }}
            />
            <div
              className="relative flex h-12 w-12 items-center justify-center rounded-full overflow-hidden ring-1"
              style={{
                background: `linear-gradient(135deg, ${accent}40, ${accent}10)`,
                boxShadow: `0 0 15px ${accent}30, inset 0 0 0 1px ${accent}40`,
              }}
            >
              {imgError ? (
                <span className="text-2xl">{agent.emoji}</span>
              ) : (
                <Image
                  src={`/avatars/${agent.id}.png`}
                  alt={agent.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            {/* Status dot */}
            {agent.status === "online" && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: status.color }} />
                <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: status.color }} />
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{agent.name}</span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider"
                style={{
                  color: status.color,
                  background: status.bg,
                  border: `1px solid ${status.border}`,
                }}
              >
                {status.label}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">{agent.role}</p>
          </div>

          {/* Expand indicator */}
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            className="text-zinc-600 text-xs"
          >
            ▶
          </motion.span>
        </div>

        {/* Current task */}
        {currentTask && (
          <p className="mt-2 text-[11px] font-mono text-zinc-500 truncate pl-15">
            → {currentTask}
          </p>
        )}
      </div>

      {/* Expanded: last 5 events */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t px-3 pb-3 pt-2 space-y-1.5" style={{ borderColor: `${accent}10` }}>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Actividad reciente</p>
              {lastEvents.length === 0 ? (
                <p className="text-[11px] text-zinc-700 font-mono">Sin actividad registrada</p>
              ) : (
                lastEvents.map((e) => (
                  <div key={e.id} className="flex items-start gap-2">
                    <span className="text-[10px] mt-0.5">{TYPE_ICON[e.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-zinc-400 truncate">{e.msg}</p>
                      <p className="text-[9px] font-mono text-zinc-700">
                        {e.timestamp.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Live Event Row ── */
function LiveEventRow({ event, isNew }: { event: FeedEvent; isNew: boolean }) {
  const timeStr = event.timestamp.toLocaleTimeString("es-CL", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const color = EVENT_TYPE_COLOR[event.type] || "#6b7280";

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: -20, height: 0 } : false}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 px-4 py-2.5 border-l-2 hover:bg-white/[0.015] transition-colors"
      style={{ borderLeftColor: color }}
    >
      <span className="font-mono text-[11px] text-zinc-600 mt-0.5 flex-shrink-0 w-16">{timeStr}</span>
      <span className="text-sm flex-shrink-0">{event.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold" style={{ color }}>{event.agent}</span>
        </div>
        <p className="text-[12px] text-zinc-400 leading-snug mt-0.5">{event.msg}</p>
      </div>
      {isNew && (
        <span className="flex-shrink-0 rounded px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/20">
          NEW
        </span>
      )}
    </motion.div>
  );
}

/* ── Project Card ── */
function ProjectCard({ project, delay }: {
  project: { id: string; name: string; emoji: string | null; description: string | null; status: string; url: string | null; stats: Record<string, unknown> };
  delay: number;
}) {
  const statusColors: Record<string, { color: string; label: string }> = {
    active: { color: "#00ff88", label: "ACTIVO" },
    building: { color: "#fbbf24", label: "EN CONSTRUCCION" },
    planned: { color: "#00d4ff", label: "PLANIFICADO" },
  };
  const s = statusColors[project.status] || statusColors.active;
  const statsArr = project.stats ? Object.entries(project.stats) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl border border-[#141822] bg-[#0a0b10]/80 p-3 hover:border-[#1e2433] transition-all group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{project.emoji || "📁"}</span>
          <span className="text-sm font-semibold text-white">{project.name}</span>
        </div>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider"
          style={{
            color: s.color,
            background: `${s.color}12`,
            border: `1px solid ${s.color}25`,
          }}
        >
          {s.label}
        </span>
      </div>

      {project.description && (
        <p className="text-[11px] text-zinc-600 mb-2">{project.description}</p>
      )}

      {statsArr.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {statsArr.map(([k, v]) => (
            <span key={k} className="text-[10px] font-mono text-zinc-500">
              <span className="text-zinc-600">{k}:</span> <span className="text-[#00d4ff]">{String(v)}</span>
            </span>
          ))}
        </div>
      )}

      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[10px] font-mono text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors truncate max-w-full"
        >
          ↗ {project.url.replace(/^https?:\/\//, "")}
        </a>
      )}
    </motion.div>
  );
}

/* ── Scheduled Task Row ── */
function ScheduledTaskRow({ task, delay }: {
  task: { id: string; name: string; schedule: string | null; next_run: string | null; status: string; project: string | null };
  delay: number;
}) {
  const isYouTubePipeline = task.name.toLowerCase().includes("youtube") || task.name.toLowerCase().includes("video");
  const statusColor = task.status === "active" ? "#00ff88" : task.status === "building" ? "#00d4ff" : task.status === "disabled" ? "#ff3366" : "#6b7280";

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay }}
      className="px-3 py-2.5 hover:bg-white/[0.015] transition-colors"
      style={isYouTubePipeline ? { borderLeft: "2px solid #7c3aed" } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-zinc-300 font-medium truncate">{task.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {task.schedule && (
              <span className="text-[10px] font-mono text-zinc-600">{task.schedule}</span>
            )}
            {task.next_run && (
              <Countdown targetDate={task.next_run} />
            )}
          </div>
        </div>
        <span
          className="flex-shrink-0 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold"
          style={{
            color: statusColor,
            background: `${statusColor}12`,
            border: `1px solid ${statusColor}25`,
          }}
        >
          {task.status.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Bottom Stat Card ── */
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-[#141822] bg-[#0a0b10] px-4 py-3">
      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-bold font-mono" style={{ color }}>
        <AnimatedCounter target={value} />
      </p>
    </div>
  );
}
