"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const publicPaths = new Set(["/", "/login"]);

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowedPath, setAllowedPath] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const isPublicPath = publicPaths.has(pathname);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isActive) {
        return;
      }

      if (session && isPublicPath) {
        router.replace("/dashboard");
        return;
      }

      if (!session) {
        if (!isPublicPath) {
          router.replace("/login");
          return;
        }

        setAllowedPath(pathname);
        return;
      }

      setAllowedPath(pathname);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && isPublicPath) {
        router.replace("/dashboard");
        return;
      }

      if (!session && !isPublicPath) {
        router.replace("/login");
        return;
      }

      setAllowedPath(pathname);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (allowedPath !== pathname) {
    return null;
  }

  return <>{children}</>;
}
