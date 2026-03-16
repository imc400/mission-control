"use client";

import { motion } from "framer-motion";

export default function NewAgentCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative cursor-pointer"
    >
      <div className="relative flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#1e1e2e] bg-[#0d0d14] p-5 transition-all duration-300 group-hover:border-violet-500/30 group-hover:bg-[#12121a]">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-violet-500/5 text-3xl text-violet-500/40 transition-colors group-hover:bg-violet-500/10 group-hover:text-violet-400/60">
          +
        </div>
        <p className="text-sm font-medium text-zinc-600 transition-colors group-hover:text-zinc-400">
          Nuevo Agente
        </p>
      </div>
    </motion.div>
  );
}
