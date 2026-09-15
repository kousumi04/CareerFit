import React from "react";
import { Progress } from "@/components/ui/progress";

interface MatchScores {
  overall: number;
  skills: number;
  experience: number;
  tools: number;
  education: number;
  responsibilities: number;
}

interface Requirement {
  requirement: string;
  importance: string;
  status: string;
  evidence: string;
}

export interface AnalysisData {
  scores: MatchScores;
  skill_analysis: {
    strong_matches: string[];
    partial_matches: string[];
    missing: string[];
  };
  requirements: Requirement[];
  top_strengths: { name: string; description: string }[];
  top_gaps: { name: string; priority: string; description: string }[];
  resume_improvements: string[];
  interview_prep: string[];
}

export default function AnalysisReport({ data }: { data: AnalysisData }) {
  if (!data) return null;

  const scores = data.scores ?? {
    overall: 0,
    skills: 0,
    experience: 0,
    tools: 0,
    education: 0,
    responsibilities: 0,
  };
  const skillAnalysis = data.skill_analysis ?? {
    strong_matches: [],
    partial_matches: [],
    missing: [],
  };
  const requirements = data.requirements ?? [];
  const topStrengths = data.top_strengths ?? [];
  const topGaps = data.top_gaps ?? [];
  const resumeImprovements = data.resume_improvements ?? [];
  const interviewPrep = data.interview_prep ?? [];

  return (
    <div className="max-w-4xl mx-auto text-neutral-200 font-mono space-y-12">
      <section className="text-center space-y-4">
        <h2 className="text-sm tracking-widest text-neutral-500 font-bold uppercase">Overall Fit</h2>
        <div className="flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-purple-400">{scores.overall}%</span>
          <span className="text-lg text-white mt-2">
            {scores.overall >= 75 ? "Strong Candidate Fit" : scores.overall >= 50 ? "Moderate Candidate Fit" : "Weak Candidate Fit"}
          </span>
        </div>
        <div className="flex justify-center gap-12 mt-6 text-sm">
          <div className="flex flex-col"><span className="text-neutral-500">Skills</span><span className="font-bold">{scores.skills}%</span></div>
          <div className="flex flex-col"><span className="text-neutral-500">Experience</span><span className="font-bold">{scores.experience}%</span></div>
          <div className="flex flex-col"><span className="text-neutral-500">Tools</span><span className="font-bold">{scores.tools}%</span></div>
        </div>
      </section>

      <hr className="border-neutral-800" />

      <section>
        <h2 className="text-sm tracking-widest text-neutral-500 font-bold uppercase mb-6">Match Breakdown</h2>
        <div className="space-y-4">
          {[
            { label: "Skills", val: scores.skills },
            { label: "Experience", val: scores.experience },
            { label: "Tools", val: scores.tools },
            { label: "Education", val: scores.education },
            { label: "Responsibilities", val: scores.responsibilities },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="w-40 text-sm text-neutral-300">{item.label}</span>
              <Progress className="h-3 bg-neutral-900 flex-1 indicator-purple" value={item.val} />
              <span className="w-10 text-right text-sm font-bold text-white">{item.val}%</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-neutral-800" />

      <section>
        <h2 className="text-sm tracking-widest text-neutral-500 font-bold uppercase mb-6">Skill Analysis</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm text-emerald-400 mb-2">Strong Matches</h3>
            <ul className="list-disc list-outside space-y-2 pl-5 text-sm text-emerald-300">
              {skillAnalysis.strong_matches.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm text-amber-400 mb-2">Partial Matches</h3>
            <ul className="list-disc list-outside space-y-2 pl-5 text-sm text-amber-300">
              {skillAnalysis.partial_matches.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm text-rose-400 mb-2">Missing</h3>
            <ul className="list-disc list-outside space-y-2 pl-5 text-sm text-rose-300">
              {skillAnalysis.missing.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <hr className="border-neutral-800" />

      <section>
        <h2 className="text-sm tracking-widest text-neutral-500 font-bold uppercase mb-6">Requirement Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500">
                <th className="py-3 px-4 font-medium">Requirement</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Evidence</th>
                <th className="py-3 px-4 font-medium">Importance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {requirements.map((req, i) => (
                <tr key={i} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="py-3 px-4 text-white">{req.requirement}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        req.status.includes("Strong")
                          ? "text-emerald-400 bg-emerald-400/10"
                          : req.status.includes("Partial")
                            ? "text-amber-400 bg-amber-400/10"
                            : "text-rose-400 bg-rose-400/10"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-400 text-xs max-w-xs truncate">{req.evidence}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs ${req.importance === "Required" ? "text-purple-400" : "text-neutral-500"}`}>
                      {req.importance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-neutral-800" />

      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm tracking-widest text-neutral-500 font-bold uppercase mb-6">Top Strengths</h2>
          <ul className="space-y-4">
            {topStrengths.map((strength, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-emerald-500">+</span>
                <div>
                  <p className="font-bold text-white text-sm">{strength.name}</p>
                  <p className="text-xs text-neutral-400 mt-1">{strength.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm tracking-widest text-neutral-500 font-bold uppercase mb-6">Top Gaps</h2>
          <ul className="space-y-4">
            {topGaps.map((gap, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-rose-500">x</span>
                <div>
                  <p className="font-bold text-white text-sm">
                    {gap.name} <span className={`text-xs ml-2 ${gap.priority === "High" ? "text-rose-400" : "text-amber-400"}`}>- {gap.priority}</span>
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">{gap.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className="border-neutral-800" />

      <section>
        <h2 className="text-sm tracking-widest text-neutral-500 font-bold uppercase mb-6">How to Improve Your Resume</h2>
        <ol className="list-decimal list-inside space-y-3 text-sm text-neutral-300">
          {resumeImprovements.map((action, i) => (
            <li key={i} className="pl-2">{action}</li>
          ))}
        </ol>
      </section>

      <hr className="border-neutral-800" />

      <section>
        <h2 className="text-sm tracking-widest text-neutral-500 font-bold uppercase mb-6">Interview Preparation</h2>
        <p className="text-sm text-neutral-400 mb-3">Likely focus areas based on your gaps and role requirements:</p>
        <ul className="list-disc list-outside space-y-2 pl-5 text-sm text-purple-300">
          {interviewPrep.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
