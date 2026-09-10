"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | undefined>("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to login if no active session
        router.push("/login");
      } else {
        setUserEmail(session.user.email);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
        <p className="text-slate-600">Logged in as: <strong>{userEmail}</strong></p>
        <p className="mt-4 text-sm text-slate-500">
          We will build the resume upload and analysis features here in the next phases.
        </p>
      </div>
    </div>
  );
}