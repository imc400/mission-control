"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface AgentCardProps {
  id: string;
  emoji: string;
  name: string;
  role: string;
  status: "online" | "offline" | "building" | "coming-soon";
  accentColor: string;
  glowColor: string;
  delay?: number;
  onClick?: () => void;
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
  id,
  emoji,
  name,
  role,
  status,
  accentColor,
  glowColor,
  delay = 0,
  onClick,
}: AgentCardProps) {
  const s = statusConfig[status];
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group relative ${onClick ? "cursor-pointer" : ""}`}
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

        {/* Avatar */}
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full overflow-hidden ring-2"
          style={{
            background: `${accentColor}15`,
            boxShadow: `0 0 16px ${accentColor}66, 0 0 32px ${accentColor}33`,
            ["--tw-ring-color" as string]: `${accentColor}80`,
          }}
        >
          {imgError ? (
            <span className="text-3xl">{emoji}</span>
          ) : (
            <Image
              src={`/avatars/${id}.png`}
              alt={name}
              width={64}
              height={64}
              className="rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
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
