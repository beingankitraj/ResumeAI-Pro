
import React, { useState, useEffect, useCallback } from "react";
import { ResumeAnalysis } from "@/entities/ResumeAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  FileText, 
  Users,
  Brain,
  Target // Added ClipboardPaste icon
} from "lucide-react";

import ScoreCard from "../components/analysis/ScoreCard";
import FakeDetection from "../components/analysis/FakeDetection";
import SkillsAnalysis from "../components/analysis/SkillsAnalysis";
import ExperienceBreakdown from "../components/analysis/ExperienceBreakdown";
import EducationVerification from "../components/analysis/EducationVerification";
import ImprovementSuggestions from "../components/analysis/ImprovementSuggestions";
import RecentAnalyses from "../components/analysis/RecentAnalyses";
import JobSuitability from "../components/analysis/JobSuitability"; // Added JobSuitability component import
import JobMatchAnalyzer from "../components/analysis/JobMatchAnalyzer"; // Added JobMatchAnalyzer component import

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalyses = useCallback(async () => {
    setIsLoading(true);
    const data = await ResumeAnalysis.list("-created_date", 20);
    setAnalyses(data);
    setIsLoading(false);
    return data; // Return data for use in useEffect
  }, []); // Empty dependency array to ensure this function is stable

  const loadSpecificAnalysis = useCallback(async (id) => {
    try {
      setIsLoading(true); // Set loading state when fetching specific analysis
      const analysis = await ResumeAnalysis.filter({ id }, "-created_date", 1);
      if (analysis.length > 0) {
        setSelectedAnalysis(analysis[0]);
      }
    } catch (error) {
      console.error("Error loading specific analysis:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }, []); // Empty dependency array to ensure this function is stable

  useEffect(() => {
    const initializeDashboard = async () => {
      // First, load all analyses
      const data = await loadAnalyses();
      
      // Check for specific analysis ID in URL
      const urlParams = new URLSearchParams(window.location.search);
      const analysisId = urlParams.get('analysis');
      
      if (analysisId) {
        // If an ID is in the URL, load that specific analysis
        await loadSpecificAnalysis(analysisId);
      } else if (data.length > 0) {
        // Otherwise, if there are analyses, select the first one
        setSelectedAnalysis(data[0]);
      }
      // If no analyses and no ID, isLoading remains false, and the "No Analyses Yet" message will show.
    };

    initializeDashboard();
  }, [loadAnalyses, loadSpecificAnalysis]); // Include callbacks in dependency array, though they are stable with []

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Analyses Yet</h2>
          <p className="text-gray-500 mb-8">Upload your first resume to start the AI analysis process.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analysis Dashboard</h1>
            <p className="text-gray-500 mt-1">Comprehensive resume analysis results and insights</p>
          </div>
        </div>

        {selectedAnalysis && (
          <>
            {/* Overview Cards */}
            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              <ScoreCard 
                title="Overall Score"
                score={selectedAnalysis.overall_score || 0}
                icon={Target}
                color="blue"
                subtitle="Resume Quality"
              />
              <ScoreCard 
                title="Authenticity"
                score={100 - (selectedAnalysis.fake_detection_score || 0)}
                icon={Shield}
                color="green"
                subtitle="Verification Status"
              />
              <ScoreCard 
                title="ATS Compatible"
                score={selectedAnalysis.ats_compatibility || 0}
                icon={FileText}
                color="purple"
                subtitle="System Friendly"
              />
              <ScoreCard 
                title="Skills Match"
                score={selectedAnalysis.analysis_details?.keyword_optimization || 0}
                icon={Users}
                color="orange"
                subtitle="Keyword Optimization"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs defaultValue="analysis" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm"> {/* Changed grid-cols-5 to grid-cols-6 and added new tab */}
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="jobs">Job Fit</TabsTrigger>
                    <TabsTrigger value="direct_match">Direct Match</TabsTrigger> {/* Added Direct Match tab */}
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="analysis" className="space-y-6">
                    <FakeDetection analysis={selectedAnalysis} />
                    <ImprovementSuggestions analysis={selectedAnalysis} />
                  </TabsContent>
                  
                  <TabsContent value="jobs"> {/* Added new TabsContent for Job Suitability */}
                    <JobSuitability analysis={selectedAnalysis} />
                  </TabsContent>

                  <TabsContent value="direct_match"> {/* Added new TabsContent for Job Match Analyzer */}
                    <JobMatchAnalyzer analysis={selectedAnalysis} />
                  </TabsContent>

                  <TabsContent value="skills">
                    <SkillsAnalysis analysis={selectedAnalysis} />
                  </TabsContent>
                  
                  <TabsContent value="experience">
                    <ExperienceBreakdown analysis={selectedAnalysis} />
                  </TabsContent>
                  
                  <TabsContent value="education">
                    <EducationVerification analysis={selectedAnalysis} />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <RecentAnalyses 
                  analyses={analyses} 
                  selectedAnalysis={selectedAnalysis}
                  onSelectAnalysis={setSelectedAnalysis}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
