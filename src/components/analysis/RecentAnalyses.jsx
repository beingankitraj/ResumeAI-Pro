import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FileText, User, ExternalLink } from "lucide-react";

export default function RecentAnalyses({ analyses, selectedAnalysis, onSelectAnalysis }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          Recent Analyses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analyses.slice(0, 10).map((analysis) => (
          <div 
            key={analysis.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedAnalysis?.id === analysis.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => onSelectAnalysis(analysis)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-sm">{analysis.candidate_name}</span>
              </div>
              <Badge 
                className={`text-xs ${getScoreColor(analysis.overall_score || 0)}`}
              >
                {analysis.overall_score || 0}
              </Badge>
            </div>
            
            <p className="text-xs text-gray-500 mb-2">
              {format(new Date(analysis.created_date), "MMM d, yyyy 'at' h:mm a")}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="text-xs">
                  <span className="text-gray-500">ATS:</span>
                  <span className="font-medium ml-1">{analysis.ats_compatibility || 0}%</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Auth:</span>
                  <span className="font-medium ml-1">
                    {100 - (analysis.fake_detection_score || 0)}%
                  </span>
                </div>
              </div>
              
              {analysis.file_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(analysis.file_url, '_blank');
                  }}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}