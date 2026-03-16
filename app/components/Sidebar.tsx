"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Home, Bot, Activity, ClipboardList, Settings, X } from "lucide-react";

export type NavPage = "inicio" | "agentes" | "actividad" | "tareas" | "configuracion";

const navItems: { id: NavPage; label: string; emoji: string; icon: typeof Home }[] = [
  { id: "inicio", label: "Inicio", emoji: "🏠", icon: Home },
  { id: "agentes", label: "Agentes", emoji: "🤖", icon: Bot },
  { id: "actividad", label: "Actividad", emoji: "📊", icon: Activity },
  { id: "tareas", label: "Tareas", emoji: "📋", icon: ClipboardList },
  { id: "configuracion", label: "Configuración", emoji: "⚙️", icon: Settings },
];

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ activePage, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0c0c14] border-r border-[#1e1e2e]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1e1e2e]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-lg">
          🐭
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white tracking-tight">Mission Control</h1>
          <p className="text-[10px] text-zinc-600 font-mono">v2.0</p>
        </div>
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onMobileClose();
              }}
              className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-violet-600/15 text-violet-400"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
              }`}
            >
              <Icon
                size={18}
                className={`transition-colors ${isActive ? "text-violet-400" : "text-zinc-600 group-hover:text-zinc-400"}`}
              />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#1e1e2e]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs text-zinc-500">Mickey v1.0 — Online</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[240px] lg:flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[240px] lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
