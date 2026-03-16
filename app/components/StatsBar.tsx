"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "1", label: "Agente Activo", color: "text-emerald-400" },
  { value: "3", label: "En construcción", color: "text-amber-400" },
  { value: "∞", label: "Posibilidades", color: "text-violet-400" },
];

export default function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="grid w-full grid-cols-3 gap-3 sm:gap-4"
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center rounded-xl border border-[#1e1e2e] bg-[#12121a] px-4 py-5 sm:py-6"
        >
          <span className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
            {stat.value}
          </span>
          <span className="mt-1 text-[11px] sm:text-xs text-zinc-500 text-center">
            {stat.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
