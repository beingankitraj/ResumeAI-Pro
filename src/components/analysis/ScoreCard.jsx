import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ScoreCard({ title, score, icon: Icon, color, subtitle }) {
  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
      green: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' }
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses(color);

  return (
    <Card className="relative overflow-hidden shadow-lg border-0 bg-white">
      <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${colorClasses.bg} rounded-full opacity-5`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="text-3xl font-bold mt-1">{score}</div>
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-xl ${colorClasses.light}`}>
            <Icon className={`w-6 h-6 ${colorClasses.text}`} />
          </div>
        </div>
        <Progress 
          value={score} 
          className={`h-2 ${colorClasses.light}`}
        />
      </CardContent>
    </Card>
  );
}