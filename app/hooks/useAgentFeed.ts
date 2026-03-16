"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface FeedEvent {
  id: string;
  timestamp: Date;
  agent: string;
  emoji: string;
  type: "working" | "completed" | "error" | "idle";
  msg: string;
}

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

function toFeedEvent(row: Record<string, unknown>): FeedEvent {
  return {
    id: String(row.id),
    timestamp: new Date(row.created_at as string),
    agent: row.agent as string,
    emoji: (row.emoji as string) || "",
    type: (row.event_type as FeedEvent["type"]) || "idle",
    msg: row.message as string,
  };
}

export function useAgentFeed(_intervalMs = 4000, maxEvents = 30) {
  const [events, setEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    // Initial load: last N events
    async function fetchInitial() {
      const { data } = await supabase
        .from("agent_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(maxEvents);

      if (data) {
        setEvents(data.map(toFeedEvent));
      }
    }

    fetchInitial();

    // Realtime subscription
    const channel = supabase
      .channel("agent-events-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "agent_events" },
        (payload) => {
          const newEvent = toFeedEvent(payload.new);
          setEvents((prev) => [newEvent, ...prev].slice(0, maxEvents));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [maxEvents]);

  const getAgentEvents = useCallback(
    (agentName: string) => events.filter((e) => e.agent === agentName),
    [events]
  );

  return { events, getAgentEvents };
}
