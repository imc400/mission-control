"use client";

import JarvisDashboard from "./components/JarvisDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050508] jarvis-grid relative">
      {/* Ambient gradient orbs */}
      <div className="fixed top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-[#00d4ff]/[0.02] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#7c3aed]/[0.02] blur-[120px] pointer-events-none" />
      <JarvisDashboard />
    </div>
  );
}
