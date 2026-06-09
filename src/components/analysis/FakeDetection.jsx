import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

export default function FakeDetection({ analysis }) {
  const fakeScore = analysis.fake_detection_score || 0;
  const authenticity = 100 - fakeScore;
  
  const getStatus = () => {
    if (fakeScore <= 20) return { text: "Authentic", color: "green", icon: CheckCircle };
    if (fakeScore <= 50) return { text: "Low Risk", color: "yellow", icon: Shield };
    return { text: "High Risk", color: "red", icon: AlertTriangle };
  };

  const status = getStatus();

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Authenticity Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{authenticity}%</div>
            <p className="text-sm text-gray-500">Authenticity Score</p>
          </div>
          <Badge 
            variant="outline" 
            className={`px-3 py-1 text-sm ${
              status.color === 'green' ? 'border-green-200 bg-green-50 text-green-700' :
              status.color === 'yellow' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
              'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            <status.icon className="w-4 h-4 mr-1" />
            {status.text}
          </Badge>
        </div>

        {analysis.red_flags && analysis.red_flags.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Red Flags Detected:</strong>
              <ul className="mt-2 space-y-1">
                {analysis.red_flags.slice(0, 3).map((flag, index) => (
                  <li key={index} className="text-sm">• {flag}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold mb-1">
              {analysis.analysis_details?.format_quality || 0}%
            </div>
            <p className="text-sm text-gray-600">Format Quality</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold mb-1">
              {analysis.analysis_details?.content_depth || 0}%
            </div>
            <p className="text-sm text-gray-600">Content Depth</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}