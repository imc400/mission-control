"use client";

import { useState, useEffect } from "react";
import { useAgentFeed, TYPE_COLORS } from "../../hooks/useAgentFeed";
import { getScheduledTasks, type ScheduledTask } from "../../lib/queries";
import AgentAvatar from "../AgentAvatar";

function getGreeting(): string {
  const hour = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Santiago" })
  ).getHours();
  if (hour >= 6 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

function formatDateSpanish(): string {
  const now = new Date();
  return now.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Santiago",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  });
}

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

  return <span className="text-xs font-mono text-[#64748b]">{text}</span>;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {active && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#10b981] animate-status-pulse" />
      )}
      <span
        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
          active ? "bg-[#10b981]" : "bg-[#64748b]"
        }`}
      />
    </span>
  );
}

const STATUS_LABEL: Record<string, string> = {
  active: "activo",
  completed: "completado",
  pending: "pendiente",
  idle: "en espera",
  working: "trabajando",
  error: "error",
};

const TYPE_LABEL: Record<string, string> = {
  working: "trabajando",
  completed: "completado",
  error: "error",
  idle: "en espera",
};

export default function InicioTab() {
  const { events } = useAgentFeed(4000, 30);
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScheduledTasks().then((t) => {
      setTasks(t);
      setLoading(false);
    });
  }, []);

  const activeAgents = new Set(
    events
      .filter(
        (e) =>
          Date.now() - e.timestamp.getTime() < 5 * 60 * 1000 &&
          e.type !== "idle"
      )
      .map((e) => e.agent)
  ).size;

  const todayTasks = tasks.filter((t) => {
    const taskDate = new Date(t.next_run);
    const now = new Date();
    return taskDate.toDateString() === now.toDateString();
  });

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const recentEvents = events.slice(0, 8);

  const next24h = tasks.filter((t) => {
    const taskTime = new Date(t.next_run).getTime();
    const now = Date.now();
    return taskTime > now && taskTime < now + 24 * 3600000;
  });

  // Skeleton loading
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-4">
      {/* Daily Summary Card */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
        <div className="flex items-center gap-3">
          <AgentAvatar name="Mickey" size={40} active />
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#f8fafc]">
              {getGreeting()}, Nacho
            </h1>
            <p className="text-xs md:text-sm text-[#64748b] mt-0.5">
              {formatDateSpanish()}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/20">
            <StatusDot active={activeAgents > 0} />
            {activeAgents} agente{activeAgents !== 1 ? "s" : ""} activo{activeAgents !== 1 ? "s" : ""}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/20">
            {todayTasks.length} tarea{todayTasks.length !== 1 ? "s" : ""} hoy
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/20">
            {pendingTasks.length} pendiente{pendingTasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Desktop 3-column layout / Mobile stacked */}
      <div className="md:grid md:grid-cols-3 md:gap-4 space-y-4 md:space-y-0">
        {/* LEFT: Timeline — horizontal scroll on mobile */}
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
          <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
            Próximas 24 horas
          </h2>

          {next24h.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AgentAvatar name="Mickey" size={32} />
              <p className="text-sm text-[#64748b] mt-2">Sin tareas programadas</p>
            </div>
          ) : (
            <>
              {/* Mobile: horizontal scroll */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 md:hidden">
                {next24h.map((task) => (
                  <div
                    key={task.id}
                    className="flex-shrink-0 w-40 p-2.5 rounded-lg bg-[#08090e] border border-[#1e2130]"
                  >
                    <span className="text-xs font-mono text-[#f59e0b] block">
                      {formatTime(task.next_run)}
                    </span>
                    <p className="text-xs text-[#f8fafc] mt-1 line-clamp-2">
                      {task.name}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-[#64748b]">{task.project}</span>
                      <Countdown targetDate={task.next_run} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: vertical timeline */}
              <div className="hidden md:block relative pl-6 space-y-3 border-l border-[#1e2130]">
                {next24h.map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#7c3aed] mt-1.5 -ml-[17px]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#f59e0b]">
                          {formatTime(task.next_run)}
                        </span>
                        <Countdown targetDate={task.next_run} />
                      </div>
                      <p className="text-sm text-[#f8fafc] truncate">{task.name}</p>
                      <p className="text-xs text-[#64748b]">{task.project}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        task.status === "active"
                          ? "bg-[#10b981]/15 text-[#34d399]"
                          : "bg-[#1e2130] text-[#64748b]"
                      }`}
                    >
                      {STATUS_LABEL[task.status] || task.status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CENTER: Activity feed */}
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
          <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
            Actividad reciente
          </h2>

          {recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AgentAvatar name="Cody" size={32} />
              <p className="text-sm text-[#64748b] mt-2">Sin actividad reciente</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-2 py-1.5"
                >
                  <AgentAvatar name={ev.agent} size={24} active={ev.type === "working"} />
                  <span className="text-xs font-medium text-[#a78bfa] shrink-0">
                    {ev.agent}
                  </span>
                  <p className="text-xs text-[#f8fafc] truncate flex-1 min-w-0">
                    {ev.msg}
                  </p>
                  <span className="text-[10px] font-mono text-[#64748b] whitespace-nowrap shrink-0">
                    {relativeTime(ev.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Quick stats */}
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
          <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
            Resumen
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#08090e] border border-[#1e2130]">
              <span className="text-xs text-[#64748b]">Agentes activos</span>
              <span className="text-sm font-bold text-[#a78bfa]">
                {activeAgents.toLocaleString("es-CL")}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#08090e] border border-[#1e2130]">
              <span className="text-xs text-[#64748b]">Tareas hoy</span>
              <span className="text-sm font-bold text-[#fbbf24]">
                {todayTasks.length.toLocaleString("es-CL")}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#08090e] border border-[#1e2130]">
              <span className="text-xs text-[#64748b]">Pendientes</span>
              <span className="text-sm font-bold text-[#34d399]">
                {pendingTasks.length.toLocaleString("es-CL")}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#08090e] border border-[#1e2130]">
              <span className="text-xs text-[#64748b]">Eventos hoy</span>
              <span className="text-sm font-bold text-[#f8fafc]">
                {events.length.toLocaleString("es-CL")}
              </span>
            </div>
          </div>

          {/* Notas rápidas */}
          <div className="mt-4 pt-3 border-t border-[#1e2130]">
            <h3 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-2">
              Notas rápidas
            </h3>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#08090e] border border-[#1e2130] text-xs text-[#64748b]">
              Añadir nota...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
