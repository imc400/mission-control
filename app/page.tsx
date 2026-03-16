import MickeyCard from "./components/MickeyCard";
import AgentCard from "./components/AgentCard";
import NewAgentCard from "./components/NewAgentCard";
import MissionBanner from "./components/MissionBanner";
import StatsBar from "./components/StatsBar";

const agents = [
  {
    emoji: "🦖",
    name: "Rex",
    role: "Agente de Marketing",
    status: "coming-soon" as const,
    accentColor: "#f97316",
    glowColor: "#f97316",
    delay: 0.2,
  },
  {
    emoji: "⚡",
    name: "Nova",
    role: "Agente de Contenido",
    status: "coming-soon" as const,
    accentColor: "#3b82f6",
    glowColor: "#3b82f6",
    delay: 0.3,
  },
  {
    emoji: "🚀",
    name: "Dash",
    role: "Agente de Ventas",
    status: "coming-soon" as const,
    accentColor: "#10b981",
    glowColor: "#10b981",
    delay: 0.4,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Subtle background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-600/[0.04] blur-3xl" />

      <main className="relative mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <header className="mb-10 sm:mb-14 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-violet-500/60 mb-3">
            Mission Control
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            Centro de Comando
          </h1>
          <p className="text-sm sm:text-base text-zinc-500">
            Los agentes inteligentes de Nacho
          </p>
        </header>

        {/* Mickey — Main Agent */}
        <section className="mb-10 sm:mb-14">
          <MickeyCard />
        </section>

        {/* Agents Grid */}
        <section className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-semibold text-white">Agentes</h2>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
              {agents.length + 1}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.name} {...agent} />
            ))}
            <NewAgentCard delay={0.5} />
          </div>
        </section>

        {/* Mission Banner */}
        <section className="mb-10 sm:mb-14">
          <MissionBanner />
        </section>

        {/* Stats Bar */}
        <section className="mb-10 sm:mb-14">
          <StatsBar />
        </section>

        {/* Footer */}
        <footer className="text-center pt-6 border-t border-[#1e1e2e]">
          <p className="text-xs text-zinc-600">
            Mission Control &middot; Nacho &middot; 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
