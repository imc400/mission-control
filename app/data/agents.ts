export interface AgentActivity {
  id: string;
  icon: string;
  text: string;
  time: string;
  type: "success" | "info" | "working" | "warning";
}

export interface Agent {
  id: string;
  emoji: string;
  name: string;
  role: string;
  description: string;
  status: "online" | "offline" | "building" | "coming-soon";
  currentState: "idle" | "working" | "completed";
  accentColor: string;
  glowColor: string;
  progress?: number;
  lastActive: string;
  activities: AgentActivity[];
}

export const agents: Agent[] = [
  {
    id: "mickey",
    emoji: "🐭",
    name: "Mickey",
    role: "Agente Principal",
    description: "Gestor de proyectos, código, deploys y automatizaciones.",
    status: "online",
    currentState: "completed",
    accentColor: "#8b5cf6",
    glowColor: "#8b5cf6",
    lastActive: "Hace 2 min",
    activities: [
      { id: "m1", icon: "✅", text: "Deploy completado — mission-control-jade-six.vercel.app", time: "Hace 2 min", type: "success" },
      { id: "m2", icon: "📝", text: "Actualizando MEMORY.md con contexto del proyecto", time: "Hace 8 min", type: "info" },
      { id: "m3", icon: "🔍", text: "Buscando tendencias de marketing para Rex", time: "Hace 15 min", type: "info" },
      { id: "m4", icon: "📊", text: "Reporte semanal generado y enviado", time: "Hace 1 hora", type: "success" },
      { id: "m5", icon: "⚙️", text: "Configuración de agentes actualizada", time: "Hace 2 horas", type: "info" },
      { id: "m6", icon: "🚀", text: "Pipeline de CI/CD optimizado — 40% más rápido", time: "Hace 3 horas", type: "success" },
    ],
  },
  {
    id: "cody",
    emoji: "⚙️",
    name: "Cody",
    role: "Agente de Código",
    description: "Construcción de proyectos, commits, deploys y revisión de código.",
    status: "online",
    currentState: "working",
    accentColor: "#10b981",
    glowColor: "#10b981",
    progress: 72,
    lastActive: "Ahora",
    activities: [
      { id: "c1", icon: "⚙️", text: "Compilando proyecto Next.js — Mission Control v2", time: "Ahora", type: "working" },
      { id: "c2", icon: "✅", text: "Build exitoso en 2.2s — 0 errores", time: "Hace 1 min", type: "success" },
      { id: "c3", icon: "📦", text: "Subiendo 22 archivos a GitHub", time: "Hace 3 min", type: "info" },
      { id: "c4", icon: "✅", text: "Tests pasados: 47/47 — cobertura 94%", time: "Hace 5 min", type: "success" },
      { id: "c5", icon: "🔧", text: "Refactorizando componentes del dashboard", time: "Hace 12 min", type: "info" },
      { id: "c6", icon: "✅", text: "PR #42 mergeado — sidebar navigation", time: "Hace 30 min", type: "success" },
    ],
  },
  {
    id: "rex",
    emoji: "🦖",
    name: "Rex",
    role: "Agente de Marketing",
    description: "Análisis de mercado, campañas y estrategias de crecimiento.",
    status: "coming-soon",
    currentState: "idle",
    accentColor: "#f97316",
    glowColor: "#f97316",
    lastActive: "Próximamente",
    activities: [],
  },
  {
    id: "nova",
    emoji: "⚡",
    name: "Nova",
    role: "Agente de Contenido",
    description: "Creación de contenido, copywriting y estrategia editorial.",
    status: "coming-soon",
    currentState: "idle",
    accentColor: "#3b82f6",
    glowColor: "#3b82f6",
    lastActive: "Próximamente",
    activities: [],
  },
  {
    id: "dash",
    emoji: "🚀",
    name: "Dash",
    role: "Agente de Ventas",
    description: "Gestión de leads, propuestas y cierre de ventas.",
    status: "coming-soon",
    currentState: "idle",
    accentColor: "#10b981",
    glowColor: "#10b981",
    lastActive: "Próximamente",
    activities: [],
  },
];

export const recentGlobalActivity: (AgentActivity & { agent: string; agentEmoji: string })[] = [
  { id: "g1", icon: "⚙️", text: "Compilando proyecto Next.js — Mission Control v2", time: "Ahora", type: "working", agent: "Cody", agentEmoji: "⚙️" },
  { id: "g2", icon: "✅", text: "Deploy completado — mission-control-jade-six.vercel.app", time: "Hace 2 min", type: "success", agent: "Mickey", agentEmoji: "🐭" },
  { id: "g3", icon: "📦", text: "Subiendo 22 archivos a GitHub", time: "Hace 3 min", type: "info", agent: "Cody", agentEmoji: "⚙️" },
  { id: "g4", icon: "📝", text: "Actualizando MEMORY.md con contexto del proyecto", time: "Hace 8 min", type: "info", agent: "Mickey", agentEmoji: "🐭" },
  { id: "g5", icon: "✅", text: "Tests pasados: 47/47 — cobertura 94%", time: "Hace 5 min", type: "success", agent: "Cody", agentEmoji: "⚙️" },
];
