import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle, ArrowRight, Target } from "lucide-react";

export default function ImprovementSuggestions({ analysis }) {
  const improvements = analysis.improvements || [];
  const strengths = analysis.strengths || [];

  return (
    <div className="space-y-6">
      {/* Strengths */}
      {strengths.length > 0 && (
        <Card className="shadow-lg border-0 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-green-800">{strength}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <Card className="shadow-lg border-0 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Lightbulb className="w-5 h-5" />
              Improvement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-800">{improvement}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Priority */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Target className="w-5 h-5" />
            Action Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">High Priority</span>
              <Badge className="bg-red-100 text-red-800">
                {improvements.slice(0, 2).length} items
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Medium Priority</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {improvements.slice(2, 4).length} items
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Low Priority</span>
              <Badge className="bg-green-100 text-green-800">
                {improvements.slice(4).length} items
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}