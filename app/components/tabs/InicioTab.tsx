"use client";

import { useState, useEffect } from "react";
import { useAgentFeed, TYPE_COLORS, TYPE_ICON } from "../../hooks/useAgentFeed";
import { getScheduledTasks, type ScheduledTask } from "../../lib/queries";

function getGreeting(): string {
  const hour = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Santiago" })
  ).getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 20) return "Buenas tardes";
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
  const recentEvents = events.slice(0, 5);

  // Next 24h tasks for timeline
  const next24h = tasks.filter((t) => {
    const taskTime = new Date(t.next_run).getTime();
    const now = Date.now();
    return taskTime > now && taskTime < now + 24 * 3600000;
  });

  const nowHour = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Santiago" })
  ).getHours();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Daily Summary Card */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h1 className="text-xl font-bold tracking-tight text-[#f8fafc]">
          {getGreeting()}, Nacho 👋
        </h1>
        <p className="text-sm text-[#64748b] mt-1 capitalize">
          {formatDateSpanish()}
        </p>

        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/20">
            {activeAgents} agente{activeAgents !== 1 ? "s" : ""} activo{activeAgents !== 1 ? "s" : ""}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/20">
            {todayTasks.length} tarea{todayTasks.length !== 1 ? "s" : ""} hoy
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/20">
            {pendingTasks.length} pendiente{pendingTasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Próximas 24h — Timeline */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-4">
          Próximas 24 horas
        </h2>

        {loading ? (
          <div className="text-sm text-[#64748b]">Cargando...</div>
        ) : next24h.length === 0 ? (
          <div className="text-sm text-[#64748b]">Sin tareas programadas</div>
        ) : (
          <div className="relative pl-6 space-y-4 border-l border-[#1e2130]">
            {/* AHORA indicator */}
            <div
              className="absolute left-0 flex items-center gap-2 -translate-x-[5px]"
              style={{ top: `${Math.min((nowHour / 24) * 100, 95)}%` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] animate-live-pulse" />
              <span className="text-[10px] font-mono text-[#7c3aed] font-bold uppercase">
                Ahora
              </span>
            </div>

            {next24h.map((task) => (
              <div key={task.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#1e2130] mt-1.5 -ml-[17px]" />
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
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actividad reciente */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
          Actividad reciente
        </h2>

        {recentEvents.length === 0 ? (
          <div className="text-sm text-[#64748b]">Sin actividad reciente</div>
        ) : (
          <div className="space-y-2">
            {recentEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-start gap-3 py-2 border-b border-[#1e2130] last:border-0"
              >
                <span className="text-base leading-none mt-0.5">
                  {ev.emoji || TYPE_ICON[ev.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#f8fafc] truncate">{ev.msg}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#64748b]">{ev.agent}</span>
                    <span className={`text-xs ${TYPE_COLORS[ev.type]}`}>
                      {ev.type}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#64748b] whitespace-nowrap">
                  {ev.timestamp.toLocaleTimeString("es-CL", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/Santiago",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notas rápidas */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
          Notas rápidas
        </h2>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#08090e] border border-[#1e2130] text-sm text-[#64748b]">
          <span>📝</span>
          <span>Añadir nota...</span>
        </div>
      </div>
    </div>
  );
}
