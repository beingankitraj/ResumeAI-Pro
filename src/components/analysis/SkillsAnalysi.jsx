import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Code, Briefcase, Zap } from "lucide-react";

export default function SkillsAnalysis({ analysis }) {
  const skills = analysis.skills_extracted || [];
  
  const getSkillsByCategory = () => {
    const categories = {};
    skills.forEach(skill => {
      const category = skill.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(skill);
    });
    return categories;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Technical': Code,
      'Soft Skills': Users,
      'Business': Briefcase,
      'Other': Zap
    };
    return icons[category] || Zap;
  };

  const getProficiencyColor = (proficiency) => {
    const colors = {
      'Expert': 'bg-green-100 text-green-800 border-green-200',
      'Advanced': 'bg-blue-100 text-blue-800 border-blue-200',
      'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Beginner': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[proficiency] || colors['Intermediate'];
  };

  const categorizedSkills = getSkillsByCategory();

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Skills Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
            <p className="text-sm text-gray-600">Total Skills</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {skills.filter(s => s.proficiency === 'Expert').length}
            </div>
            <p className="text-sm text-gray-600">Expert Level</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(categorizedSkills).length}
            </div>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {analysis.analysis_details?.keyword_optimization || 0}%
            </div>
            <p className="text-sm text-gray-600">Keyword Match</p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(categorizedSkills).map(([category, categorySkills]) => {
            const Icon = getCategoryIcon(category);
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <Badge variant="outline" className="ml-auto">
                    {categorySkills.length} skills
                  </Badge>
                </div>
                <div className="grid gap-3">
                  {categorySkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                      <div className="flex-1">
                        <div className="font-medium">{skill.skill}</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getProficiencyColor(skill.proficiency)}
                      >
                        {skill.proficiency}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}