"use client";

import { motion } from "framer-motion";

export default function MissionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative w-full overflow-hidden rounded-xl border border-[#1e1e2e] bg-[#0d0d14] px-6 py-10 sm:px-10 sm:py-14 text-center"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-purple-600/5 blur-3xl" />

      <p className="relative text-xs font-mono uppercase tracking-[0.3em] text-violet-500/60 mb-4">
        Nuestra misión
      </p>
      <h2 className="relative text-xl sm:text-2xl md:text-3xl font-bold leading-tight bg-gradient-to-r from-violet-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
        Reemplazar tareas manuales con agentes inteligentes
      </h2>
    </motion.div>
  );
}
