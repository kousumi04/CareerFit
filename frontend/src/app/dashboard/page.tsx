"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnalysisReport, { type AnalysisData } from "@/components/AnalysisReport";

type ResumeOption = {
  id: string;
  file_name: string;
};

type JobOption = {
  id: string;
  title?: string | null;
  role_name?: string | null;
};

export default function MatchEnginePage() {
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [jobs, setJobs] = useState<JobOption[]>([]);
  
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);

  // Fetch user's resumes and jobs on load
  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        // Fetch resumes
        const resResumes = await fetch("/api/v1/resumes", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (resResumes.ok) {
          const data = await resResumes.json();
          setResumes(data);
          if (data.length > 0) setSelectedResumeId(data[0].id);
        }

        // Fetch jobs (Adjust endpoint if your jobs route is different)
        const resJobs = await fetch("/api/v1/jobs", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (resJobs.ok) {
          const data = await resJobs.json();
          setJobs(data);
          if (data.length > 0) setSelectedJobId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };

    fetchData();
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId || !selectedJobId) {
      alert("Please select both a resume and a job description.");
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setAnalyzing(false);
      return;
    }

    try {
      // Call your analysis endpoint (Adjust URL if your analysis route differs)
      const res = await fetch("/api/v1/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          resume_id: selectedResumeId,
          job_id: selectedJobId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      } else {
        const errText = await res.text();
        alert(`Analysis failed: ${errText}`);
      }
    } catch (error) {
      console.error("Error during analysis:", error);
      alert("Network error during analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-5xl text-neutral-200 space-y-8">
      <h1 className="text-3xl font-bold text-white text-center">CareerFit Match Engine</h1>
      
      {/* Selection Form Card */}
      <Card className="border-neutral-900 bg-[#121212]">
        <CardContent className="pt-6">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Resume Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">1. Select Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  {resumes.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.file_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">2. Select Job Description</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title || job.role_name || `Job #${job.id}`}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <Button 
              type="submit" 
              disabled={analyzing || !selectedResumeId || !selectedJobId}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3"
            >
              {analyzing ? "Analyzing Evidence & Match..." : "Analyze Fit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Render the New Explainable Analysis Report Component */}
      {analysisResult && (
        <div className="mt-12 bg-[#121212] border border-neutral-900 p-8 rounded-xl shadow-2xl">
          <AnalysisReport data={analysisResult} />
        </div>
      )}
    </div>
  );
}
