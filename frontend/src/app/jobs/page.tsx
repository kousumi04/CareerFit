"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawText, setRawText] = useState("");

  const fetchJobs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      // Changed to relative path to use the proxy
      const res = await fetch("/api/v1/jobs", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rawText) {
      alert("Title and Job Description text are required.");
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch("http://127.0.0.1:8000/api/v1/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title,
          company,
          raw_text: rawText,
        }),
      });

      if (!res.ok) throw new Error("Failed to save job description");

      // Reset form and refresh list
      setTitle("");
      setCompany("");
      setRawText("");
      fetchJobs();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">My Job Descriptions</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Job</CardTitle>
          <CardDescription>Paste a job description here to analyze against your resumes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveJob} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Senior Frontend Engineer" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input 
                  id="company" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  placeholder="e.g. Acme Corp" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rawText">Job Description *</Label>
              <textarea
                id="rawText"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the full job description here..."
                required
                className="w-full min-h-[200px] p-3 rounded-md border border-slate-200 bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Job Description"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Saved Jobs</h2>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-slate-500">No jobs saved yet.</p>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-slate-500">
                  {job.company ? `${job.company} • ` : ""} 
                  Added on {new Date(job.created_at).toLocaleDateString()}
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