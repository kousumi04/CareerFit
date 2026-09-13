"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-slate-300 bg-white p-1 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <span
        className={`absolute flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm transition-transform dark:bg-white dark:text-slate-950 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
    </button>
  );
}
