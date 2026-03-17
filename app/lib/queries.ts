import { supabase } from "./supabase";

export interface ScheduledTask {
  id: string;
  name: string;
  description: string;
  schedule: string;
  next_run: string;
  status: string;
  project: string;
}

export interface Project {
  id: string;
  name: string;
  emoji: string;
  description: string;
  status: string;
  url: string;
  repo: string;
  stats: Record<string, unknown>;
}

export interface AgentEvent {
  id: string;
  created_at: string;
  agent: string;
  emoji: string;
  event_type: "working" | "completed" | "error" | "idle";
  message: string;
}

export async function getScheduledTasks(): Promise<ScheduledTask[]> {
  const { data, error } = await supabase
    .from("scheduled_tasks")
    .select("*")
    .order("next_run", { ascending: true });

  if (error) {
    console.error("Error fetching scheduled_tasks:", error);
    return [];
  }
  return (data as ScheduledTask[]) || [];
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return (data as Project[]) || [];
}

export async function getAgentEvents(
  agent?: string,
  limit = 20
): Promise<AgentEvent[]> {
  let query = supabase
    .from("agent_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (agent) {
    query = query.eq("agent", agent);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching agent_events:", error);
    return [];
  }
  return (data as AgentEvent[]) || [];
}

export interface YouTubeChannelStats {
  subscribers: number;
  total_views: number;
  video_count: number;
  channel_name: string;
}

export interface YouTubeVideoStats {
  video_id: string;
  title: string;
  published_at: string;
  views: number;
  likes: number;
  comments: number;
  thumbnail_url: string;
  url: string;
}

export interface YouTubeStats {
  channel: YouTubeChannelStats;
  videos: YouTubeVideoStats[];
}

export async function getYouTubeStats(): Promise<{ stats: YouTubeStats; updated_at: string } | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("stats, updated_at")
    .eq("id", "mentes-ocultas")
    .single();

  if (error) {
    console.error("Error fetching YouTube stats:", error);
    return null;
  }
  if (!data?.stats) return null;
  return { stats: data.stats as YouTubeStats, updated_at: data.updated_at as string };
}

export function getAgentStatus(
  events: AgentEvent[],
  agentName: string
): "active" | "idle" {
  const agentEvents = events.filter((e) => e.agent === agentName);
  if (agentEvents.length === 0) return "idle";

  const lastEvent = agentEvents[0];
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  return new Date(lastEvent.created_at).getTime() > fiveMinAgo
    ? "active"
    : "idle";
}
