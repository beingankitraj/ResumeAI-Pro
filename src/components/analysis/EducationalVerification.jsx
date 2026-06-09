import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle, AlertTriangle, Building } from "lucide-react";

export default function EducationVerification({ analysis }) {
  const education = analysis.education_verification || {};
  
  const getVerificationColor = (status) => {
    if (status?.toLowerCase().includes('verified') || status?.toLowerCase().includes('authentic')) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (status?.toLowerCase().includes('pending') || status?.toLowerCase().includes('review')) {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getVerificationIcon = (status) => {
    if (status?.toLowerCase().includes('verified')) {
      return CheckCircle;
    }
    return AlertTriangle;
  };

  const VerificationIcon = getVerificationIcon(education.verification_status);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          Education Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <VerificationIcon className={`w-5 h-5 ${getVerificationColor(education.verification_status).split(' ')[0]}`} />
            <div>
              <p className="font-medium">Verification Status</p>
              <p className="text-sm text-gray-500">Educational background check</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={getVerificationColor(education.verification_status)}
          >
            {education.verification_status || 'Pending Review'}
          </Badge>
        </div>

        {education.institutions && education.institutions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Educational Institutions</h3>
            </div>
            <div className="space-y-2">
              {education.institutions.map((institution, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg bg-white">
                  <p className="font-medium">{institution}</p>
                  {education.degrees && education.degrees[index] && (
                    <p className="text-sm text-gray-600 mt-1">{education.degrees[index]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.degrees && education.degrees.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Degrees & Certifications</h3>
            <div className="grid gap-2">
              {education.degrees.map((degree, index) => (
                <Badge key={index} variant="outline" className="justify-start p-2">
                  {degree}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {education.institutions?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Institutions</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {education.degrees?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Qualifications</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}