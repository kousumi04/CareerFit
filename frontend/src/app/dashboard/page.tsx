"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const headers = { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}` 
      };

      try {
        // Using relative paths to trigger the Next.js Proxy
        const resumesRes = await fetch("/api/v1/resumes", { headers });
        if (resumesRes.ok) setResumes(await resumesRes.json());
      } catch (err) {
        console.error("Network error fetching resumes:", err);
      }

      try {
        const jobsRes = await fetch("/api/v1/jobs", { headers });
        if (jobsRes.ok) setJobs(await jobsRes.json());
      } catch (err) {
        console.error("Network error fetching jobs:", err);
      }
    };
    
    loadData();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedResume || !selectedJob) {
      alert("Please select both a resume and a job description.");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      };

      // 1. Extract Resume (Relative path)
      const resExtract = await fetch(`/api/v1/extract/resume/${selectedResume}`, { method: "POST", headers });
      if (!resExtract.ok) throw new Error("Resume extraction failed");

      // 2. Extract Job Description (Relative path)
      const jdExtract = await fetch(`/api/v1/extract/job/${selectedJob}`, { method: "POST", headers });
      if (!jdExtract.ok) throw new Error("Job extraction failed");

      // 3. Run Analysis Engine (Relative path)
      const analyzeRes = await fetch(`/api/v1/analyze/${selectedResume}/${selectedJob}`, { headers });
      if (!analyzeRes.ok) throw new Error("Analysis engine failed");

      const data = await analyzeRes.json();
      setResult(data);
    } catch (error: any) {
      alert(`Pipeline Error: ${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">CareerFit Match Engine</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Select Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <select 
              className="w-full p-2 border border-slate-300 rounded-md bg-white text-slate-900"
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
            >
              <option value="">-- Choose a saved resume --</option>
              {resumes.map(r => <option key={r.id} value={r.id}>{r.file_name}</option>)}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Select Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <select 
              className="w-full p-2 border border-slate-300 rounded-md bg-white text-slate-900"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              <option value="">-- Choose a saved job --</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title} {j.company ? `(${j.company})` : ""}</option>)}
            </select>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mb-8">
        <Button size="lg" onClick={handleAnalyze} disabled={analyzing || !selectedResume || !selectedJob} className="w-full md:w-1/3">
          {analyzing ? "Running AI Pipeline..." : "Analyze Fit"}
        </Button>
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-t-4 border-t-indigo-600 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Analysis Report</CardTitle>
              <CardDescription>Overall Match Score: <span className="font-bold text-lg text-indigo-600">{result.match_data.scores.overall_score}%</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 italic mb-6">"{result.explanation.summary}"</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-4 rounded-md border border-emerald-100">
                  <h3 className="font-semibold text-emerald-800 mb-2">Key Strengths</h3>
                  <ul className="list-disc pl-5 text-sm text-emerald-900 space-y-1">
                    {result.explanation.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-rose-50 p-4 rounded-md border border-rose-100">
                  <h3 className="font-semibold text-rose-800 mb-2">Identified Gaps</h3>
                  <ul className="list-disc pl-5 text-sm text-rose-900 space-y-1">
                    {result.explanation.gaps.map((g: string, i: number) => <li key={i}>{g}</li>)}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-md text-center">
                <p className="font-medium text-slate-800">Recommendation: {result.explanation.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}