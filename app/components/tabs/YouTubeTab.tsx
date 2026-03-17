"use client";

import { useState, useEffect } from "react";
import { useAgentFeed, TYPE_COLORS } from "../../hooks/useAgentFeed";
import {
  getScheduledTasks,
  getAgentEvents as fetchAgentEvents,
  getYouTubeStats,
  type ScheduledTask,
  type AgentEvent,
  type YouTubeStats,
} from "../../lib/queries";
import AgentAvatar from "../AgentAvatar";

const PIPELINE_STEPS = [
  { name: "Tendencias", icon: "1" },
  { name: "Guión", icon: "2" },
  { name: "Voz", icon: "3" },
  { name: "Imágenes", icon: "4" },
  { name: "Video", icon: "5" },
  { name: "YouTube", icon: "6" },
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

function Countdown({ targetDate }: { targetDate: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setText("ahora");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setText(h > 0 ? `en ${h}h ${m}m` : `en ${m}m`);
    }
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, [targetDate]);

  return <span className="font-mono text-[#f59e0b] text-xs">{text}</span>;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      {active && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#10b981] animate-status-pulse" />
      )}
      <span
        className={`relative inline-flex rounded-full h-2 w-2 ${
          active ? "bg-[#10b981]" : "bg-[#64748b]"
        }`}
      />
    </span>
  );
}

const TYPE_LABEL: Record<string, string> = {
  working: "trabajando",
  completed: "completado",
  error: "error",
  idle: "en espera",
};

export default function YouTubeTab() {
  const { events } = useAgentFeed(4000, 50);
  const [pipelineTask, setPipelineTask] = useState<ScheduledTask | null>(null);
  const [channelEvents, setChannelEvents] = useState<AgentEvent[]>([]);
  const [ytStats, setYtStats] = useState<YouTubeStats | null>(null);
  const [statsUpdatedAt, setStatsUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [tasks, mickeyEvts, codyEvts, ytData] = await Promise.all([
        getScheduledTasks(),
        fetchAgentEvents("Mickey", 10),
        fetchAgentEvents("Cody", 10),
        getYouTubeStats(),
      ]);

      if (ytData) {
        setYtStats(ytData.stats);
        setStatsUpdatedAt(ytData.updated_at);
      }

      const mentesTask = tasks.find(
        (t) =>
          t.id === "mentes-ocultas-daily" ||
          t.project?.toLowerCase().includes("mentes")
      );
      setPipelineTask(mentesTask || null);

      const merged = [...mickeyEvts, ...codyEvts].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setChannelEvents(merged.slice(0, 10));
      setLoading(false);
    }
    load();
  }, []);

  const liveChannelEvents = events.filter(
    (e) => e.agent === "Mickey" || e.agent === "Cody"
  );

  const mickeyActive = liveChannelEvents.some(
    (e) =>
      e.agent === "Mickey" &&
      Date.now() - e.timestamp.getTime() < 5 * 60 * 1000
  );

  const codyActive = liveChannelEvents.some(
    (e) =>
      e.agent === "Cody" &&
      Date.now() - e.timestamp.getTime() < 5 * 60 * 1000
  );

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-6 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6 space-y-4">
      {/* Channel Header */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#f8fafc]">
              {ytStats?.channel?.channel_name || "Mentes Ocultas"}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs text-[#64748b]">
                {ytStats?.channel?.video_count ?? "–"} videos
              </span>
              <span className="text-[#1e2130]">·</span>
              <span className="text-xs text-[#64748b]">
                {ytStats?.channel?.subscribers?.toLocaleString() ?? "–"} suscriptores
              </span>
              <span className="text-[#1e2130]">·</span>
              <span className="text-xs text-[#64748b]">
                {ytStats?.channel?.total_views?.toLocaleString() ?? "–"} vistas
              </span>
            </div>
            {statsUpdatedAt && (
              <p className="text-[9px] text-[#64748b] mt-1">
                Actualizado {relativeTime(new Date(statsUpdatedAt))}
              </p>
            )}
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/20">
            <StatusDot active /> Activo
          </span>
        </div>
        <a
          href="https://www.youtube.com/@MentesOcultas44"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-[#ef4444]/10 text-[#ef4444] text-xs font-medium border border-[#ef4444]/20 hover:bg-[#ef4444]/20 transition-colors"
        >
          Abrir canal
        </a>
      </div>

      {/* Agentes del canal */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-2.5">
          Agentes del canal
        </h2>
        <div className="space-y-2">
          {[
            { name: "Mickey", role: "Orquestador", active: mickeyActive },
            { name: "Cody", role: "Generación de código", active: codyActive },
          ].map((agent) => (
            <div key={agent.name} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <AgentAvatar name={agent.name} size={40} active={agent.active} />
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <StatusDot active={agent.active} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f8fafc]">{agent.name}</p>
                  <p className="text-[10px] text-[#64748b]">{agent.role}</p>
                </div>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                  agent.active
                    ? "bg-[#10b981]/15 text-[#34d399]"
                    : "bg-[#1e2130] text-[#64748b]"
                }`}
              >
                {agent.active ? "Activo" : "En espera"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Videos publicados */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-2.5">
          Videos publicados
        </h2>
        <div className="p-2.5 rounded-lg bg-[#08090e] border border-[#1e2130]">
          <p className="text-xs text-[#f8fafc] leading-snug">
            ¿Puedo Leer Tu Mente? La Psicología Secreta Detrás de Tus
            Pensamientos Más Ocultos
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#34d399]">
              <StatusDot active /> Publicado
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline programado */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-2.5">
          Pipeline programado
        </h2>

        {pipelineTask ? (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#f8fafc]">
              Próximo:{" "}
              {new Date(pipelineTask.next_run).toLocaleDateString("es-CL", {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Santiago",
              })}
            </span>
            <Countdown targetDate={pipelineTask.next_run} />
          </div>
        ) : (
          <div className="text-xs text-[#64748b] mb-3">
            Sin pipeline programado
          </div>
        )}

        {/* Pipeline steps */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.name} className="flex items-center">
              <div className="flex flex-col items-center gap-0.5 min-w-[48px]">
                <div className="w-8 h-8 rounded-lg bg-[#08090e] border border-[#1e2130] flex items-center justify-center text-[10px] font-bold text-[#7c3aed]">
                  {step.icon}
                </div>
                <span className="text-[8px] text-[#64748b] text-center leading-tight">
                  {step.name}
                </span>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="w-2.5 h-px bg-[#1e2130] mx-0.5 mt-[-10px]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actividad del canal */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-2.5">
          Actividad del canal
        </h2>

        {channelEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AgentAvatar name="Mickey" size={28} />
            <p className="text-xs text-[#64748b] mt-1.5">Sin actividad</p>
          </div>
        ) : (
          <div className="space-y-1">
            {channelEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-2 py-1.5"
              >
                <AgentAvatar
                  name={ev.agent}
                  size={24}
                  active={ev.event_type === "working"}
                />
                <span className="text-[10px] font-medium text-[#a78bfa] shrink-0">
                  {ev.agent}
                </span>
                <p className="text-[11px] text-[#f8fafc] truncate flex-1 min-w-0">
                  {ev.message}
                </p>
                <span className="text-[9px] font-mono text-[#64748b] whitespace-nowrap shrink-0">
                  {relativeTime(new Date(ev.created_at))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
