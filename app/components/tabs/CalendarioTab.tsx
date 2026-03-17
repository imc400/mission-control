"use client";

import { useState, useEffect } from "react";
import { getScheduledTasks, type ScheduledTask } from "../../lib/queries";
import AgentAvatar from "../AgentAvatar";

function getWeekDays(): { label: string; date: Date; isToday: boolean }[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const days = [];
  const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      label: dayLabels[i],
      date: d,
      isToday: d.toDateString() === now.toDateString(),
    });
  }
  return days;
}

function formatCountdown(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return "pasado";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) {
    const d = Math.floor(h / 24);
    return `en ${d}d`;
  }
  return h > 0 ? `en ${h}h ${m}m` : `en ${m}m`;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

const STATUS_LABEL: Record<string, string> = {
  active: "activo",
  completed: "completado",
  pending: "pendiente",
  idle: "en espera",
};

export default function CalendarioTab() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    getScheduledTasks().then((t) => {
      setTasks(t);
      setLoading(false);
    });
  }, []);

  const weekDays = getWeekDays();

  function tasksForDay(day: Date): ScheduledTask[] {
    return tasks.filter(
      (t) => new Date(t.next_run).toDateString() === day.toDateString()
    );
  }

  const dayToShow = selectedDay || weekDays.find((d) => d.isToday)?.date;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-6 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6 space-y-4">
      {/* Week view */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
          Esta semana
        </h2>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const dayTasks = tasksForDay(day.date);
            const isSelected =
              dayToShow?.toDateString() === day.date.toDateString();
            return (
              <button
                key={day.label}
                onClick={() => setSelectedDay(day.date)}
                className={`flex flex-col items-center gap-0.5 py-2.5 rounded-lg transition-all min-h-[64px] ${
                  isSelected
                    ? "bg-[#7c3aed]/15 border border-[#7c3aed]/30"
                    : day.isToday
                      ? "bg-[#1e2130]/50 border border-[#1e2130]"
                      : "border border-transparent hover:bg-[#1e2130]/30"
                }`}
              >
                <span className="text-[9px] uppercase text-[#64748b] font-medium">
                  {day.label}
                </span>
                <span
                  className={`text-sm font-bold ${
                    day.isToday ? "text-[#7c3aed]" : "text-[#f8fafc]"
                  }`}
                >
                  {day.date.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <div className="flex gap-0.5">
                    {dayTasks.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-[#7c3aed]"
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Day detail */}
        {dayToShow && (
          <div className="mt-3 pt-3 border-t border-[#1e2130]">
            <h3 className="text-sm font-medium text-[#f8fafc] mb-2">
              {dayToShow.toLocaleDateString("es-CL", {
                weekday: "long",
                day: "numeric",
                month: "long",
                timeZone: "America/Santiago",
              })}
            </h3>
            {tasksForDay(dayToShow).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <AgentAvatar name="Mickey" size={28} />
                <p className="text-xs text-[#64748b] mt-1.5">Sin tareas programadas</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {tasksForDay(dayToShow).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#08090e] border border-[#1e2130]"
                  >
                    <span className="text-xs font-mono text-[#f59e0b] whitespace-nowrap">
                      {new Date(t.next_run).toLocaleTimeString("es-CL", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "America/Santiago",
                      })}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#f8fafc] truncate">
                        {t.name}
                      </p>
                      <p className="text-[10px] text-[#64748b]">{t.project}</p>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        t.status === "active"
                          ? "bg-[#10b981]/15 text-[#34d399]"
                          : "bg-[#1e2130] text-[#64748b]"
                      }`}
                    >
                      {STATUS_LABEL[t.status] || t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Próximas tareas */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-2.5">
          Próximas tareas
        </h2>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AgentAvatar name="Josefina" size={28} />
            <p className="text-xs text-[#64748b] mt-1.5">Sin tareas programadas</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2.5 py-2 border-b border-[#1e2130] last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#f8fafc] truncate">{t.name}</p>
                  <p className="text-[10px] text-[#64748b] mt-0.5">
                    {new Date(t.next_run).toLocaleDateString("es-CL", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "America/Santiago",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#f59e0b]">
                    {formatCountdown(t.next_run)}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      t.status === "active"
                        ? "bg-[#10b981]/15 text-[#34d399]"
                        : "bg-[#1e2130] text-[#64748b]"
                    }`}
                  >
                    {STATUS_LABEL[t.status] || t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
