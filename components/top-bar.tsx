"use client";

import { Download, Loader2 } from "lucide-react";
import { Era } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopBarProps {
  activeEra: Era | null;
  itemsCount: number;
  onDownload: () => void;
  isDownloading: boolean;
}

export function TopBar({ activeEra, itemsCount, onDownload, isDownloading }: TopBarProps) {
  return (
    <div className="h-[60px] bg-[#2c4251] dark:bg-card text-white flex items-center justify-between px-6 border-b border-[#1a2730] dark:border-border shrink-0 z-30 transition-colors">
      <div className="flex items-center gap-3 w-[260px]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 text-white font-bold text-sm border border-white/20 shadow-sm">
          E
        </div>
        <span className="font-semibold tracking-tight text-white">Era Board</span>
      </div>

      <div className="flex-1 flex justify-center items-center gap-2">
        {activeEra ? (
          <>
            <div
              className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-white/20"
              style={{ backgroundColor: activeEra.color }}
            />
            <h2 className="text-sm font-semibold tracking-tight">{activeEra.name}</h2>
            <span className="text-[10px] text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full font-medium border border-white/10">
              {itemsCount} {itemsCount === 1 ? "item" : "items"}
            </span>
          </>
        ) : (
          <span className="text-sm text-white/60 font-medium">No era selected</span>
        )}
      </div>

      <div className="flex items-center justify-end w-[260px] gap-3">
        <ThemeToggle />
        <button
          onClick={onDownload}
          disabled={isDownloading || !activeEra || itemsCount === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#6b95ab] text-white hover:bg-[#5b8397] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-[#6b95ab]/20"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export
        </button>
      </div>
    </div>
  );
}
