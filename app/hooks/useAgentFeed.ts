"use client";

import { useState, useEffect, useCallback } from "react";

export interface FeedEvent {
  id: string;
  timestamp: Date;
  agent: string;
  emoji: string;
  type: "working" | "completed" | "error" | "idle";
  msg: string;
}

const MOCK_EVENTS: Omit<FeedEvent, "id" | "timestamp">[] = [
  { agent: "Mickey", emoji: "🐭", type: "completed", msg: "Pipeline Mentes Ocultas ejecutado — video subido a YouTube" },
  { agent: "Cody", emoji: "⚙️", type: "working", msg: "Compilando nuevo componente React..." },
  { agent: "Mickey", emoji: "🐭", type: "working", msg: "Generando guión para mañana — tema: sesgos cognitivos" },
  { agent: "Mickey", emoji: "🐭", type: "completed", msg: "Tendencias analizadas: 5 temas identificados" },
  { agent: "Cody", emoji: "⚙️", type: "completed", msg: "Deploy exitoso en Vercel — mission-control-jade-six.vercel.app" },
  { agent: "Mickey", emoji: "🐭", type: "working", msg: "Descargando métricas de YouTube Analytics..." },
  { agent: "Cody", emoji: "⚙️", type: "completed", msg: "Tests pasados: 52/52 — cobertura 96%" },
  { agent: "Mickey", emoji: "🐭", type: "completed", msg: "Thumbnail generado con IA para próximo video" },
  { agent: "Cody", emoji: "⚙️", type: "working", msg: "Optimizando bundle — tree-shaking en progreso" },
  { agent: "Mickey", emoji: "🐭", type: "completed", msg: "Reporte semanal generado — engagement +12%" },
  { agent: "Cody", emoji: "⚙️", type: "completed", msg: "PR #47 mergeado — real-time dashboard" },
  { agent: "Mickey", emoji: "🐭", type: "working", msg: "Analizando comentarios del último video..." },
  { agent: "Cody", emoji: "⚙️", type: "error", msg: "Build warning: unused import en utils.ts — auto-fix aplicado" },
  { agent: "Mickey", emoji: "🐭", type: "completed", msg: "SEO optimizado: títulos y descripciones actualizados" },
  { agent: "Cody", emoji: "⚙️", type: "working", msg: "Ejecutando lighthouse audit..." },
  { agent: "Mickey", emoji: "🐭", type: "completed", msg: "Script de video revisado — duración estimada: 8:42" },
  { agent: "Mickey", emoji: "🐭", type: "working", msg: "Conectando con API de Telegram para notificaciones" },
  { agent: "Cody", emoji: "⚙️", type: "completed", msg: "Migración de DB completada — 0 errores" },
];

const TYPE_COLORS = {
  working: "text-amber-400",
  completed: "text-emerald-400",
  error: "text-red-400",
  idle: "text-zinc-500",
} as const;

const TYPE_BORDER = {
  working: "border-l-amber-500",
  completed: "border-l-emerald-500",
  error: "border-l-red-500",
  idle: "border-l-zinc-600",
} as const;

const TYPE_ICON = {
  working: "⏳",
  completed: "✅",
  error: "⚠️",
  idle: "💤",
} as const;

export { TYPE_COLORS, TYPE_BORDER, TYPE_ICON };

export function useAgentFeed(intervalMs = 4000, maxEvents = 30) {
  const [events, setEvents] = useState<FeedEvent[]>(() => {
    // Seed with 5 initial events
    const now = Date.now();
    return MOCK_EVENTS.slice(0, 5).map((e, i) => ({
      ...e,
      id: `seed-${i}`,
      timestamp: new Date(now - (5 - i) * 60000),
    }));
  });

  const [eventIndex, setEventIndex] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setEventIndex((prev) => {
        const idx = prev % MOCK_EVENTS.length;
        const template = MOCK_EVENTS[idx];
        const newEvent: FeedEvent = {
          ...template,
          id: `live-${Date.now()}`,
          timestamp: new Date(),
        };
        setEvents((curr) => [newEvent, ...curr].slice(0, maxEvents));
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, maxEvents]);

  const getAgentEvents = useCallback(
    (agentName: string) => events.filter((e) => e.agent === agentName),
    [events]
  );

  return { events, getAgentEvents };
}
