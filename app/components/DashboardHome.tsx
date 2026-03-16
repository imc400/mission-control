"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle, Rocket, Clock } from "lucide-react";
import { agents, recentGlobalActivity } from "../data/agents";
import type { NavPage } from "./Sidebar";

const activityBorderColor = {
  success: "border-l-emerald-500",
  info: "border-l-blue-500",
  working: "border-l-amber-500",
  warning: "border-l-amber-500",
};

const summaryCards = [
  { label: "Agentes Activos", value: agents.filter((a) => a.status === "online").length.toString(), icon: Bot, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Tareas Hoy", value: "12", icon: CheckCircle, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Deploys", value: "3", icon: Rocket, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Uptime", value: "99.9%", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
];

interface DashboardHomeProps {
  onNavigate: (page: NavPage) => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Bienvenido, Nacho 👋
        </h1>
        <p className="text-sm text-zinc-500">
          Aquí tienes un resumen de tus agentes y actividad reciente.
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4 sm:p-5"
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}>
                <Icon size={18} className={card.color} />
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Actividad Reciente</h2>
          <button
            onClick={() => onNavigate("actividad")}
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Ver todo →
          </button>
        </div>
        <div className="space-y-2">
          {recentGlobalActivity.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
              className={`rounded-lg border border-[#1e1e2e] bg-[#12121a] p-3 border-l-2 ${activityBorderColor[activity.type]}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-sm flex-shrink-0">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300">{activity.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-zinc-600">{activity.agentEmoji} {activity.agent}</span>
                    <span className="text-[11px] text-zinc-700">·</span>
                    <span className="text-[11px] text-zinc-600">{activity.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="flex gap-3"
      >
        <button
          onClick={() => onNavigate("agentes")}
          className="flex items-center gap-2 rounded-lg bg-violet-600/15 border border-violet-500/20 px-4 py-2.5 text-sm font-medium text-violet-400 hover:bg-violet-600/25 transition-colors"
        >
          <Bot size={16} />
          Ver Agentes
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-[#1e1e2e] px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors">
          <CheckCircle size={16} />
          Nueva Tarea
        </button>
      </motion.div>
    </div>
  );
}
