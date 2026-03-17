"use client";

import { useState, useEffect } from "react";
import {
  getProjects,
  getScheduledTasks,
  type Project,
  type ScheduledTask,
} from "../../lib/queries";
import AgentAvatar from "../AgentAvatar";

interface ProjectDisplay {
  name: string;
  emoji: string;
  status: string;
  platform: string;
  detail: string;
  nextAction: string;
  link?: string;
}

const FALLBACK_PROJECTS: ProjectDisplay[] = [
  {
    name: "Mentes Ocultas",
    emoji: "🧠",
    status: "ACTIVO",
    platform: "YouTube",
    detail: "3 videos publicados",
    nextAction: "Pipeline mañana 10 AM",
    link: "https://www.youtube.com/@MentesOcultas44",
  },
  {
    name: "Mission Control",
    emoji: "🎯",
    status: "ACTIVO",
    platform: "Vercel",
    detail: "Dashboard en producción",
    nextAction: "Deploy continuo",
  },
  {
    name: "Agencia Marketing",
    emoji: "📊",
    status: "EN CONSTRUCCIÓN",
    platform: "Google Drive",
    detail: "3 clientes",
    nextAction: "Conectar Drive + grillas de contenido",
  },
];

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

function StatusDot({ status }: { status: string }) {
  const isActive = status === "ACTIVO";
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {isActive && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#10b981] animate-status-pulse" />
      )}
      <span
        className={`relative inline-flex rounded-full h-2 w-2 ${
          isActive
            ? "bg-[#10b981]"
            : status === "EN CONSTRUCCIÓN"
              ? "bg-[#f59e0b]"
              : "bg-[#64748b]"
        }`}
      />
    </span>
  );
}

const statusColor: Record<string, string> = {
  ACTIVO: "bg-[#10b981]/15 text-[#34d399] border-[#10b981]/20",
  "EN CONSTRUCCIÓN":
    "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/20",
  PAUSADO: "bg-[#64748b]/15 text-[#94a3b8] border-[#64748b]/20",
};

export default function ProyectosTab() {
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getScheduledTasks()]).then(([p, t]) => {
      setDbProjects(p);
      setTasks(t);
      setLoading(false);
    });
  }, []);

  const projects: ProjectDisplay[] =
    dbProjects.length > 0
      ? dbProjects.map((p) => {
          const projectTasks = tasks.filter((t) =>
            t.project?.toLowerCase().includes(p.name.toLowerCase())
          );
          const nextTask = projectTasks[0];
          return {
            name: p.name,
            emoji: p.emoji || "📦",
            status: p.status || "ACTIVO",
            platform:
              (p.stats as Record<string, string>)?.platform || "",
            detail: p.description || "",
            nextAction: nextTask
              ? `${nextTask.name} — ${new Date(
                  nextTask.next_run
                ).toLocaleDateString("es-CL", {
                  weekday: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "America/Santiago",
                })}`
              : "Sin tareas próximas",
            link: p.url || undefined,
          };
        })
      : FALLBACK_PROJECTS;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-6 space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6 space-y-3">
      <h1 className="text-xs uppercase tracking-widest text-[#64748b] font-medium">
        Proyectos
      </h1>

      {projects.length === 0 ? (
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-6 flex flex-col items-center text-center">
          <AgentAvatar name="Josefina" size={36} />
          <p className="text-sm text-[#64748b] mt-2">Sin proyectos</p>
        </div>
      ) : (
        projects.map((proj) => (
          <div
            key={proj.name}
            className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-3 md:p-5 card-glow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{proj.emoji}</span>
                <div>
                  <h2 className="text-sm font-bold text-[#f8fafc]">
                    {proj.name}
                  </h2>
                  {proj.platform && (
                    <p className="text-[10px] text-[#64748b]">
                      {proj.platform}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                  statusColor[proj.status] ||
                  "bg-[#1e2130] text-[#64748b] border-[#1e2130]"
                }`}
              >
                <StatusDot status={proj.status} />
                {proj.status}
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#64748b]">Estado:</span>
                <span className="text-[10px] text-[#f8fafc]">
                  {proj.detail}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#64748b]">Próximo:</span>
                <span className="text-[10px] text-[#f59e0b]">
                  {proj.nextAction}
                </span>
              </div>
            </div>

            {proj.link && (
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2.5 text-[10px] text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
              >
                Abrir ↗
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}
