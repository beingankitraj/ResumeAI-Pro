import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Target, Brain } from "lucide-react";

export default function JobSuitability({ analysis }) {
  const suggestedJobs = analysis.suggested_jobs || [];

  const getScoreColor = (score) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    return "bg-yellow-500";
  };
  
  const getScoreTextColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    return "text-yellow-600";
  };

  if (suggestedJobs.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Job Suitability Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-600">No job suggestions available for this resume analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          Job Suitability Analysis
        </CardTitle>
        <p className="text-sm text-gray-500 pt-1">
            Top job roles suggested by AI based on the resume's skills and experience.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {suggestedJobs.map((job, index) => (
          <div key={index} className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <Target className={`w-5 h-5 ${getScoreTextColor(job.match_score)}`} />
                    <h3 className="text-lg font-semibold text-gray-900">{job.job_title}</h3>
                </div>
                <p className="text-sm text-gray-600 pl-8">{job.reasoning}</p>
              </div>
              <div className="w-full md:w-32 text-center flex-shrink-0">
                 <div className={`text-2xl font-bold ${getScoreTextColor(job.match_score)}`}>
                    {job.match_score}%
                 </div>
                 <p className="text-xs text-gray-500 mb-2">Match Score</p>
                 <Progress value={job.match_score} className={`h-1.5 ${getScoreColor(job.match_score).replace('bg-','bg-opacity-20')}`} indicatorClassName={getScoreColor(job.match_score)} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}