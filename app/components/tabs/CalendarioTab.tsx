"use client";

import { useState, useEffect } from "react";
import { getScheduledTasks, type ScheduledTask } from "../../lib/queries";

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Week view */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-4">
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
                className={`flex flex-col items-center gap-1 py-3 rounded-lg transition-all min-h-[76px] ${
                  isSelected
                    ? "bg-[#7c3aed]/15 border border-[#7c3aed]/30"
                    : day.isToday
                      ? "bg-[#1e2130]/50 border border-[#1e2130]"
                      : "border border-transparent hover:bg-[#1e2130]/30"
                }`}
              >
                <span className="text-[10px] uppercase text-[#64748b] font-medium">
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
          <div className="mt-4 pt-4 border-t border-[#1e2130]">
            <h3 className="text-sm font-medium text-[#f8fafc] mb-3">
              {dayToShow.toLocaleDateString("es-CL", {
                weekday: "long",
                day: "numeric",
                month: "long",
                timeZone: "America/Santiago",
              })}
            </h3>
            {tasksForDay(dayToShow).length === 0 ? (
              <p className="text-sm text-[#64748b]">Sin tareas programadas</p>
            ) : (
              <div className="space-y-2">
                {tasksForDay(dayToShow).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#08090e] border border-[#1e2130]"
                  >
                    <span className="text-xs font-mono text-[#f59e0b] whitespace-nowrap">
                      {new Date(t.next_run).toLocaleTimeString("es-CL", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "America/Santiago",
                      })}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#f8fafc] truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-[#64748b]">{t.project}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        t.status === "active"
                          ? "bg-[#10b981]/15 text-[#34d399]"
                          : "bg-[#1e2130] text-[#64748b]"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Próximas tareas */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
          Próximas tareas
        </h2>
        {loading ? (
          <div className="text-sm text-[#64748b]">Cargando...</div>
        ) : tasks.length === 0 ? (
          <div className="text-sm text-[#64748b]">Sin tareas programadas</div>
        ) : (
          <div className="space-y-2">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 py-3 border-b border-[#1e2130] last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#f8fafc] truncate">{t.name}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">
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
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#f59e0b]">
                    {formatCountdown(t.next_run)}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      t.status === "active"
                        ? "bg-[#10b981]/15 text-[#34d399]"
                        : "bg-[#1e2130] text-[#64748b]"
                    }`}
                  >
                    {t.status}
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
