"use client";

import { useState } from "react";
import TabBar from "./TabBar";
import InicioTab from "./tabs/InicioTab";
import YouTubeTab from "./tabs/YouTubeTab";
import CalendarioTab from "./tabs/CalendarioTab";
import AgentesTab from "./tabs/AgentesTab";
import ProyectosTab from "./tabs/ProyectosTab";

export default function MissionControlApp() {
  const [activeTab, setActiveTab] = useState("inicio");

  return (
    <div
      className="min-h-screen bg-[#08090e]"
      style={{
        backgroundImage: "url(/bg-grid.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-20 md:pb-0 md:pl-56">
        {activeTab === "inicio" && <InicioTab />}
        {activeTab === "youtube" && <YouTubeTab />}
        {activeTab === "calendario" && <CalendarioTab />}
        {activeTab === "agentes" && <AgentesTab />}
        {activeTab === "proyectos" && <ProyectosTab />}
      </main>
    </div>
  );
}
