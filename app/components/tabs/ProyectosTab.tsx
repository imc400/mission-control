"use client";

import { useState, useEffect } from "react";
import { getProjects, getScheduledTasks, type Project, type ScheduledTask } from "../../lib/queries";

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

  // Use DB projects if available, otherwise fallback
  const projects: ProjectDisplay[] =
    dbProjects.length > 0
      ? dbProjects.map((p) => {
          const projectTasks = tasks.filter(
            (t) =>
              t.project?.toLowerCase().includes(p.name.toLowerCase())
          );
          const nextTask = projectTasks[0];
          return {
            name: p.name,
            emoji: p.emoji || "📦",
            status: p.status || "ACTIVO",
            platform: (p.stats as Record<string, string>)?.platform || "",
            detail: p.description || "",
            nextAction: nextTask
              ? `${nextTask.name} — ${new Date(nextTask.next_run).toLocaleDateString("es-CL", {
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

  const statusColor: Record<string, string> = {
    ACTIVO: "bg-[#10b981]/15 text-[#34d399] border-[#10b981]/20",
    "EN CONSTRUCCIÓN": "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/20",
    PAUSADO: "bg-[#64748b]/15 text-[#94a3b8] border-[#64748b]/20",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xs uppercase tracking-widest text-[#64748b] font-medium">
        Proyectos
      </h1>

      {loading ? (
        <div className="text-sm text-[#64748b]">Cargando...</div>
      ) : (
        projects.map((proj) => (
          <div
            key={proj.name}
            className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{proj.emoji}</span>
                <div>
                  <h2 className="text-base font-bold text-[#f8fafc]">
                    {proj.name}
                  </h2>
                  {proj.platform && (
                    <p className="text-xs text-[#64748b]">{proj.platform}</p>
                  )}
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                  statusColor[proj.status] ||
                  "bg-[#1e2130] text-[#64748b] border-[#1e2130]"
                }`}
              >
                {proj.status}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748b]">Estado:</span>
                <span className="text-xs text-[#f8fafc]">{proj.detail}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748b]">Próximo:</span>
                <span className="text-xs text-[#f59e0b]">
                  {proj.nextAction}
                </span>
              </div>
            </div>

            {proj.link && (
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
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
