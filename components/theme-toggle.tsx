"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center w-14 h-8 rounded-full bg-black/20 dark:bg-black/40 hover:bg-black/30 dark:hover:bg-black/50 transition-colors shadow-inner"
      title="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Background Icons */}
      <div className="absolute w-full flex justify-between px-2 pointer-events-none text-white/40">
        <Sun className="w-4 h-4" />
        <Moon className="w-4 h-4" />
      </div>

      {/* Sliding Thumb */}
      <div 
        className={`absolute left-1 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
          isDark 
            ? "translate-x-6 bg-[#1f2f3e] border border-white/10" 
            : "translate-x-0 bg-white border border-black/5"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </div>
    </button>
  );
}
