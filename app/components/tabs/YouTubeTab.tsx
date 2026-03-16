"use client";

import { useState, useEffect } from "react";
import { useAgentFeed, TYPE_COLORS, TYPE_ICON } from "../../hooks/useAgentFeed";
import {
  getScheduledTasks,
  getAgentEvents as fetchAgentEvents,
  type ScheduledTask,
  type AgentEvent,
} from "../../lib/queries";

const PIPELINE_STEPS = [
  { name: "Tendencias", emoji: "📈" },
  { name: "Guión", emoji: "✍️" },
  { name: "Voz", emoji: "🎙️" },
  { name: "Imágenes", emoji: "🖼️" },
  { name: "Video", emoji: "🎬" },
  { name: "YouTube", emoji: "▶️" },
];

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

  return <span className="font-mono text-[#f59e0b]">{text}</span>;
}

export default function YouTubeTab() {
  const { events } = useAgentFeed(4000, 50);
  const [pipelineTask, setPipelineTask] = useState<ScheduledTask | null>(null);
  const [channelEvents, setChannelEvents] = useState<AgentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [tasks, mickeyEvts, codyEvts] = await Promise.all([
        getScheduledTasks(),
        fetchAgentEvents("Mickey", 10),
        fetchAgentEvents("Cody", 10),
      ]);

      const mentesTask = tasks.find(
        (t) =>
          t.id === "mentes-ocultas-daily" ||
          t.project?.toLowerCase().includes("mentes")
      );
      setPipelineTask(mentesTask || null);

      // Merge and sort events
      const merged = [...mickeyEvts, ...codyEvts].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setChannelEvents(merged.slice(0, 10));
      setLoading(false);
    }
    load();
  }, []);

  // Real-time channel events from feed
  const liveChannelEvents = events.filter(
    (e) => e.agent === "Mickey" || e.agent === "Cody"
  );

  const mickeyStatus =
    liveChannelEvents.find(
      (e) =>
        e.agent === "Mickey" &&
        Date.now() - e.timestamp.getTime() < 5 * 60 * 1000
    )
      ? "ACTIVO"
      : "EN ESPERA";

  const codyStatus =
    liveChannelEvents.find(
      (e) =>
        e.agent === "Cody" &&
        Date.now() - e.timestamp.getTime() < 5 * 60 * 1000
    )
      ? "ACTIVO"
      : "EN ESPERA";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Channel Header */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#f8fafc]">
              Mentes Ocultas 🧠
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs text-[#64748b]">3 videos</span>
              <span className="text-[#1e2130]">·</span>
              <span className="text-xs text-[#64748b]">0 suscriptores</span>
              <span className="text-[#1e2130]">·</span>
              <span className="text-xs text-[#10b981]">En crecimiento 🌱</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/20">
            Activo
          </span>
        </div>
        <a
          href="https://www.youtube.com/@MentesOcultas44"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg bg-[#ef4444]/10 text-[#ef4444] text-sm font-medium border border-[#ef4444]/20 hover:bg-[#ef4444]/20 transition-colors"
        >
          ▶️ Abrir canal ↗
        </a>
      </div>

      {/* Agentes de este canal */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
          Agentes del canal
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐭</span>
              <div>
                <p className="text-sm font-medium text-[#f8fafc]">Mickey</p>
                <p className="text-xs text-[#64748b]">Orquestador</p>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                mickeyStatus === "ACTIVO"
                  ? "bg-[#10b981]/15 text-[#34d399]"
                  : "bg-[#1e2130] text-[#64748b]"
              }`}
            >
              {mickeyStatus}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-[#1e2130]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="text-sm font-medium text-[#f8fafc]">Cody</p>
                <p className="text-xs text-[#64748b]">Generación de código</p>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                codyStatus === "ACTIVO"
                  ? "bg-[#10b981]/15 text-[#34d399]"
                  : "bg-[#1e2130] text-[#64748b]"
              }`}
            >
              {codyStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Videos publicados */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
          Videos publicados
        </h2>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-[#08090e] border border-[#1e2130]">
            <p className="text-sm text-[#f8fafc] leading-snug">
              ¿Puedo Leer Tu Mente? La Psicología Secreta Detrás de Tus
              Pensamientos Más Ocultos
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#34d399]">
                Publicado
              </span>
              <span className="text-[10px] text-[#64748b]">🔗 Ver video</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline programado */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
          Pipeline programado
        </h2>

        {pipelineTask ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#f8fafc]">
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
          </>
        ) : loading ? (
          <div className="text-sm text-[#64748b] mb-4">Cargando...</div>
        ) : (
          <div className="text-sm text-[#64748b] mb-4">
            Sin pipeline programado
          </div>
        )}

        {/* Pipeline steps visual */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.name} className="flex items-center">
              <div className="flex flex-col items-center gap-1 min-w-[56px]">
                <div className="w-9 h-9 rounded-lg bg-[#08090e] border border-[#1e2130] flex items-center justify-center text-base">
                  {step.emoji}
                </div>
                <span className="text-[9px] text-[#64748b] text-center leading-tight">
                  {step.name}
                </span>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="w-3 h-px bg-[#1e2130] mx-0.5 mt-[-12px]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actividad del canal */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-xs uppercase tracking-widest text-[#64748b] font-medium mb-3">
          Actividad del canal
        </h2>

        {channelEvents.length === 0 && !loading ? (
          <div className="text-sm text-[#64748b]">Sin actividad</div>
        ) : loading ? (
          <div className="text-sm text-[#64748b]">Cargando...</div>
        ) : (
          <div className="space-y-2">
            {channelEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-start gap-3 py-2 border-b border-[#1e2130] last:border-0"
              >
                <span className="text-sm leading-none mt-0.5">
                  {ev.emoji || TYPE_ICON[ev.event_type] || "📌"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#f8fafc] truncate">
                    {ev.message}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#64748b]">{ev.agent}</span>
                    <span
                      className={`text-xs ${TYPE_COLORS[ev.event_type] || "text-[#64748b]"}`}
                    >
                      {ev.event_type}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#64748b] whitespace-nowrap">
                  {new Date(ev.created_at).toLocaleTimeString("es-CL", {
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
    </div>
  );
}
