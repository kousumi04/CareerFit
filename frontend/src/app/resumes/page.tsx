"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function to convert the file into a Base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // The result includes a prefix like "data:application/pdf;base64,...", we just want the raw string
      const encoded = reader.result?.toString() || "";
      const base64Str = encoded.split(",")[1];
      resolve(base64Str);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const res = await fetch("/api/v1/resumes", {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}` 
        },
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setUploading(false);
      return;
    }

    try {
      // 1. Convert the PDF to Base64
      const base64Data = await fileToBase64(selectedFile);

      // 2. Send it as a standard JSON payload
      const res = await fetch("/api/v1/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          file_name: selectedFile.name,
          file_data: base64Data,
        }),
      });

      if (res.ok) {
        setSelectedFile(null);
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        await fetchResumes(); 
      } else {
        // Safely handle non-JSON responses (like 500 Internal Server Error)
        const errorText = await res.text();
        try {
          const errData = JSON.parse(errorText);
          console.error("FastAPI Error Details:", errData);
          alert(`Upload failed: ${JSON.stringify(errData)}`);
        } catch (parseError) {
          console.error("Server crashed with plain text:", errorText);
          alert(`Server Error: ${res.status} - ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Network error during upload:", error);
      alert("Network error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const res = await fetch(`/api/v1/resumes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        await fetchResumes();
      }
    } catch (error) {
      console.error("Failed to delete resume", error);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl text-neutral-200">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Resumes</h1>
      
      <Card className="mb-10 border-neutral-900 bg-[#121212]">
        <CardHeader>
          <CardTitle className="text-white">Upload New Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-4">
            <input 
              id="file-upload"
              type="file" 
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600/10 file:text-purple-400 hover:file:bg-purple-600/20 file:cursor-pointer"
            />
            <Button 
              type="submit" 
              disabled={!selectedFile || uploading}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white"
            >
              {uploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </form>
          <p className="text-xs text-neutral-500 mt-4">
            * Note: Uploading a new resume when you already have 5 will automatically replace your oldest upload.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold text-white mb-4">Your Saved Resumes</h2>
      
      {loading ? (
        <p className="text-neutral-400">Loading resumes...</p>
      ) : resumes.length === 0 ? (
        <p className="text-neutral-400">No resumes uploaded yet.</p>
      ) : (
        <div className="grid gap-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="border-neutral-900 bg-[#121212]">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-white">{resume.file_name}</p>
                  <p className="text-xs text-neutral-500">
                    Uploaded: {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(resume.id)}
                  className="bg-rose-900/50 hover:bg-rose-900 text-rose-200 border-none transition-colors"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}