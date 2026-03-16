"use client";

import { motion } from "framer-motion";

export default function MickeyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full"
    >
      {/* Outer glow */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 opacity-75 blur-sm animate-pulse-glow" />

      {/* Card */}
      <div className="relative rounded-2xl border border-violet-500/30 bg-[#12121a] p-6 sm:p-8 overflow-hidden">
        {/* Background gradient orb */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-violet-500/20 blur-md" />
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-800 text-5xl sm:text-6xl shadow-lg shadow-violet-500/25">
                🐭
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Mickey</h2>
              {/* Online status */}
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Online
              </span>
            </div>
            <p className="text-sm font-medium text-violet-400 mb-2">Tu agente principal</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Gestor de proyectos, código, deploys y automatizaciones.
            </p>
          </div>

          {/* Decorative label */}
          <div className="hidden sm:flex flex-col items-end gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-violet-500/60">
              Main Agent
            </span>
            <span className="text-[10px] font-mono text-zinc-600">v1.0</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
