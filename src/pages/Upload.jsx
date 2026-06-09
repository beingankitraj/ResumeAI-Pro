
import React, { useState } from "react";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "@/integrations/Core";
import { ResumeAnalysis } from "@/entities/ResumeAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Upload as UploadIcon, 
  FileText, 
  Brain, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2 
} from "lucide-react";

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload a PDF or image file only");
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type === "application/pdf" || droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a PDF or image file only");
      }
    }
  };

  const analyzeResume = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);
    setCurrentStep("Uploading resume...");

    try {
      // Upload file
      const { file_url } = await UploadFile({ file });
      setProgress(25);
      setCurrentStep("Extracting resume data...");

      // Extract basic resume data
      const extractionResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            candidate_name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            experience: { type: "array", items: {
              type: "object",
              properties: {
                company: { type: "string" },
                position: { type: "string" },
                duration: { type: "string" },
                description: { type: "string" }
              }
            }},
            education: { type: "array", items: {
              type: "object",
              properties: {
                institution: { type: "string" },
                degree: { type: "string" },
                year: { type: "string" }
              }
            }}
          }
        }
      });

      if (extractionResult.status !== "success") {
        throw new Error("Failed to extract resume data");
      }

      setProgress(50);
      setCurrentStep("Analyzing with AI...");

      // Comprehensive AI analysis
      const analysisResult = await InvokeLLM({
        prompt: `Analyze this resume comprehensively. Provide detailed analysis including:

1. FAKE DETECTION: Analyze for signs of fabrication, inconsistencies, unrealistic claims, suspicious patterns
2. OVERALL SCORING: Rate the resume quality, professionalism, completeness (0-100)
3. ATS COMPATIBILITY: Assess formatting, keywords, structure for ATS systems
4. SKILLS ANALYSIS: Categorize and rate skills by proficiency level
5. EXPERIENCE VERIFICATION: Check for logical career progression, realistic timelines, job responsibilities alignment
6. EDUCATION VALIDATION: Verify degree-job alignment, institution credibility indicators
7. RED FLAGS: Identify any concerning elements (gaps, inconsistencies, over-qualifications, etc.)
8. STRENGTHS: List top positive aspects
9. IMPROVEMENTS: Specific actionable recommendations
10. JOB SUITABILITY: Based on the skills and experience, suggest 3-5 specific job titles that would be a good fit, with a brief reasoning and a match score (0-100) for each.

Resume Data: ${JSON.stringify(extractionResult.output, null, 2)}

Be thorough and professional in your analysis.`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            fake_detection_score: { type: "number" },
            ats_compatibility: { type: "number" },
            skills_extracted: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  skill: { type: "string" },
                  proficiency: { type: "string" },
                  category: { type: "string" }
                }
              }
            },
            experience_analysis: {
              type: "object",
              properties: {
                total_years: { type: "number" },
                career_progression: { type: "string" },
                job_gaps: { type: "array", items: { type: "string" } },
                consistency_score: { type: "number" }
              }
            },
            education_verification: {
              type: "object",
              properties: {
                institutions: { type: "array", items: { type: "string" } },
                degrees: { type: "array", items: { type: "string" } },
                verification_status: { type: "string" }
              }
            },
            red_flags: { type: "array", items: { type: "string" } },
            strengths: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            analysis_details: {
              type: "object",
              properties: {
                format_quality: { type: "number" },
                content_depth: { type: "number" },
                keyword_optimization: { type: "number" },
                readability: { type: "number" }
              }
            },
            suggested_jobs: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        job_title: { type: "string" },
                        reasoning: { type: "string" },
                        match_score: { type: "number" }
                    }
                }
            }
          }
        }
      });

      setProgress(90);
      setCurrentStep("Saving analysis...");

      // Save analysis to database
      const analysis = await ResumeAnalysis.create({
        candidate_name: extractionResult.output.candidate_name || "Unknown Candidate",
        file_url: file_url,
        ...analysisResult
      });

      setProgress(100);
      setCurrentStep("Complete!");

      // Navigate to results
      setTimeout(() => {
        navigate(createPageUrl("Dashboard") + `?analysis=${analysis.id}`);
      }, 1000);

    } catch (error) {
      console.error("Analysis error:", error);
      setError("Failed to analyze resume. Please try again.");
      setIsProcessing(false);
      setProgress(0);
      setCurrentStep("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Resume Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload any resume to get comprehensive analysis including fake detection, 
            skills assessment, and ATS optimization recommendations.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
              Upload Resume for Analysis
            </CardTitle>
            <p className="text-gray-500">Supports PDF and image files</p>
          </CardHeader>
          <CardContent>
            {!isProcessing ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors bg-blue-50/50"
              >
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UploadIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </h3>
                  <p className="text-gray-500 mb-6">PDF, PNG, JPG files supported</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                    Select Resume File
                  </Button>
                </label>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{currentStep}</h3>
                <Progress value={progress} className="max-w-md mx-auto mb-4" />
                <p className="text-gray-500">{progress}% Complete</p>
              </div>
            )}
          </CardContent>
        </Card>

        {file && !isProcessing && (
          <div className="text-center">
            <Button 
              onClick={analyzeResume}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-4 text-lg font-semibold shadow-lg"
            >
              <Brain className="w-5 h-5 mr-2" />
              Start AI Analysis
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Fake Detection</h3>
            <p className="text-gray-600">Advanced AI identifies fabricated information and inconsistencies</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">ATS Optimization</h3>
            <p className="text-gray-600">Ensure resumes pass through applicant tracking systems</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Comprehensive Scoring</h3>
            <p className="text-gray-600">Detailed analysis with actionable improvement recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
