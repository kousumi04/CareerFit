"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      // Switched to 127.0.0.1 to avoid IPv6 localhost resolution issues
      const res = await fetch("http://127.0.0.1:8000/api/v1/resumes", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (err) {
      console.error("Failed to fetch resumes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const user = session.user;
      // 1. Upload to Supabase Storage (path: user_id/filename_timestamp.pdf)
      const storagePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: storageError } = await supabase.storage
        .from("resumes")
        .upload(storagePath, file);

      if (storageError) throw storageError;

      // 2. Notify FastAPI Backend (Switched to 127.0.0.1)
      const res = await fetch("http://127.0.0.1:8000/api/v1/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          file_name: file.name,
          storage_path: storagePath,
        }),
      });

      if (!res.ok) throw new Error("Failed to save resume record");

      // Refresh list
      fetchResumes();
      e.target.value = ''; // Reset input
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">My Resumes</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload New Resume</CardTitle>
          <CardDescription>Upload your resume as a PDF file.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileUpload} 
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-slate-500 mt-2">Uploading...</p>}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Saved Resumes</h2>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : resumes.length === 0 ? (
          <p className="text-slate-500">No resumes uploaded yet.</p>
        ) : (
          resumes.map((resume) => (
            <Card key={resume.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{resume.file_name}</p>
                <p className="text-sm text-slate-500">
                  Uploaded on {new Date(resume.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}