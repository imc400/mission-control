"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Agent } from "../data/agents";

const stateConfig = {
  idle: { label: "Idle", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  working: { label: "Working", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
};

const activityBorderColor = {
  success: "border-l-emerald-500",
  info: "border-l-blue-500",
  working: "border-l-amber-500",
  warning: "border-l-amber-500",
};

interface AgentDetailModalProps {
  agent: Agent | null;
  onClose: () => void;
}

export default function AgentDetailModal({ agent, onClose }: AgentDetailModalProps) {
  return (
    <AnimatePresence>
      {agent && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto border-l border-[#1e1e2e] bg-[#0c0c14]/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0c0c14]/80 backdrop-blur-xl border-b border-[#1e1e2e] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                    style={{ background: `${agent.accentColor}20` }}
                  >
                    {agent.emoji}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
                    <p className="text-xs text-zinc-500">{agent.role}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Status row */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${stateConfig[agent.currentState].color}`}>
                  {agent.currentState === "working" && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                    </span>
                  )}
                  {stateConfig[agent.currentState].label}
                </span>
                <span className="text-xs text-zinc-600">Última actividad: {agent.lastActive}</span>
              </div>

              {/* Progress bar */}
              {agent.currentState === "working" && agent.progress !== undefined && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-zinc-500">Progreso</span>
                    <span className="text-xs font-mono text-zinc-400">{agent.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#1e1e2e] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${agent.accentColor}, ${agent.accentColor}aa)` }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4">
                <p className="text-sm text-zinc-400 leading-relaxed">{agent.description}</p>
              </div>

              {/* Activity Feed */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Actividad Reciente</h3>
                {agent.activities.length === 0 ? (
                  <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6 text-center">
                    <p className="text-sm text-zinc-600">Sin actividad aún</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {agent.activities.map((activity, i) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={`rounded-lg border border-[#1e1e2e] bg-[#12121a] p-3 border-l-2 ${activityBorderColor[activity.type]}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm flex-shrink-0">{activity.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-zinc-300 leading-relaxed">{activity.text}</p>
                            <p className="text-[11px] text-zinc-600 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
