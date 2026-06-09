import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, TrendingUp, AlertCircle, Calendar } from "lucide-react";

export default function ExperienceBreakdown({ analysis }) {
  const experience = analysis.experience_analysis || {};
  
  const getProgressionColor = (progression) => {
    if (progression?.toLowerCase().includes('excellent') || progression?.toLowerCase().includes('strong')) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (progression?.toLowerCase().includes('moderate') || progression?.toLowerCase().includes('good')) {
      return 'text-blue-600 bg-blue-50 border-blue-200';
    }
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Experience Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {experience.total_years || 0}
            </div>
            <p className="text-sm text-gray-600">Years Experience</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {experience.consistency_score || 0}%
            </div>
            <p className="text-sm text-gray-600">Consistency Score</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {experience.job_gaps?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Employment Gaps</p>
          </div>
        </div>

        {experience.career_progression && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Career Progression</h3>
            </div>
            <Badge 
              variant="outline" 
              className={`px-3 py-2 text-sm ${getProgressionColor(experience.career_progression)}`}
            >
              {experience.career_progression}
            </Badge>
          </div>
        )}

        {experience.job_gaps && experience.job_gaps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold">Employment Gaps</h3>
            </div>
            <div className="space-y-2">
              {experience.job_gaps.map((gap, index) => (
                <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-800">{gap}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Overall Experience Rating</span>
            <span className="text-sm text-gray-500">{experience.consistency_score || 0}/100</span>
          </div>
          <Progress value={experience.consistency_score || 0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}