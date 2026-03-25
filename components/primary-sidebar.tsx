"use client";

import { LayoutGrid, Image as ImageIcon, StickyNote, Type } from "lucide-react";

interface PrimarySidebarProps {
  activeTab: "eras" | "notes" | "images" | "text";
  onChangeTab: (tab: "eras" | "notes" | "images" | "text") => void;
}

export function PrimarySidebar({ activeTab, onChangeTab }: PrimarySidebarProps) {
  const tabs = [
    { id: "eras", label: "Eras", icon: LayoutGrid },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "text", label: "Text", icon: Type },
  ] as const;

  return (
    <div className="w-[80px] h-full bg-[#2c4251] dark:bg-card flex flex-col items-center py-6 border-r border-[#1a2730] dark:border-border z-20 shrink-0 transition-colors">
      <div className="flex-1 flex flex-col gap-3 w-full px-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`w-full aspect-square flex flex-col items-center justify-center gap-1.5 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300 relative group ${
                isActive
                  ? "text-[#6b95ab] bg-[#6b95ab]/20 shadow-[inset_0_0_0_1px_rgba(107,149,171,0.3)]"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#6b95ab]" : "text-white/40 group-hover:text-white/80"}`} strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
