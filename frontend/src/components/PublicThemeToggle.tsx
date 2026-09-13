"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const publicPaths = new Set(["/", "/login"]);

export function PublicThemeToggle() {
  const pathname = usePathname();

  if (!publicPaths.has(pathname)) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <ThemeToggle />
    </div>
  );
}
