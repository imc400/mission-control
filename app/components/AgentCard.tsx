"use client";

import { motion } from "framer-motion";

interface AgentCardProps {
  emoji: string;
  name: string;
  role: string;
  status: "online" | "offline" | "building" | "coming-soon";
  accentColor: string;
  glowColor: string;
  delay?: number;
}

const statusConfig = {
  online: {
    label: "Online",
    dotColor: "bg-emerald-500",
    pingColor: "bg-emerald-400",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
  },
  offline: {
    label: "Offline",
    dotColor: "bg-zinc-500",
    pingColor: "",
    bgColor: "bg-zinc-500/10",
    textColor: "text-zinc-400",
    borderColor: "border-zinc-500/20",
  },
  building: {
    label: "En construcción",
    dotColor: "bg-amber-500",
    pingColor: "bg-amber-400",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
  "coming-soon": {
    label: "Próximamente",
    dotColor: "bg-zinc-600",
    pingColor: "",
    bgColor: "bg-zinc-500/10",
    textColor: "text-zinc-500",
    borderColor: "border-zinc-500/20",
  },
};

export default function AgentCard({
  emoji,
  name,
  role,
  status,
  accentColor,
  glowColor,
  delay = 0,
}: AgentCardProps) {
  const s = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-[1px] rounded-xl opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-60"
        style={{ background: `linear-gradient(135deg, ${glowColor}, transparent)` }}
      />

      {/* Card */}
      <div className="relative rounded-xl border border-[#1e1e2e] bg-[#12121a] p-5 transition-colors duration-300 group-hover:border-opacity-60"
        style={{ ["--hover-border" as string]: glowColor }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-4 right-4 h-[1px] opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />

        {/* Emoji avatar */}
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg text-3xl"
          style={{ background: `${accentColor}15` }}
        >
          {emoji}
        </div>

        {/* Name and role */}
        <h3 className="mb-1 text-lg font-semibold text-white">{name}</h3>
        <p className="mb-3 text-sm text-zinc-500">{role}</p>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full ${s.bgColor} px-2.5 py-0.5 text-[11px] font-medium ${s.textColor} border ${s.borderColor}`}
        >
          <span className="relative flex h-1.5 w-1.5">
            {s.pingColor && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${s.pingColor} opacity-75`}
              />
            )}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${s.dotColor}`} />
          </span>
          {s.label}
        </span>
      </div>
    </motion.div>
  );
}
