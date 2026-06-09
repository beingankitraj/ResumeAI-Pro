import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InvokeLLM } from "@/integrations/Core";
import { ClipboardPaste, Sparkles, Loader2, ThumbsUp, ThumbsDown, Search } from "lucide-react";

export default function JobMatchAnalyzer({ analysis }) {
    const [jobDescription, setJobDescription] = useState("");
    const [matchResult, setMatchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalysis = async () => {
        if (!jobDescription) {
            setError("Please paste a job description to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setMatchResult(null);

        try {
            const result = await InvokeLLM({
                prompt: `You are an expert HR recruitment analyst. Given the following structured resume data and a specific job description, perform a detailed match analysis.

                Resume Data: ${JSON.stringify(analysis, null, 2)}
                
                Job Description: "${jobDescription}"
                
                Provide a JSON response with:
                - match_score (a score from 0 to 100 representing how well the resume matches the job)
                - summary (a brief paragraph explaining the overall suitability)
                - strengths (an array of strings listing specific points where the resume strongly aligns with the job)
                - weaknesses (an array of strings listing gaps or areas where the resume is weak against the job requirements)
                - missing_keywords (an array of important keywords from the job description not found in the resume)`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        match_score: { type: "number" },
                        summary: { type: "string" },
                        strengths: { type: "array", items: { type: "string" } },
                        weaknesses: { type: "array", items: { type: "string" } },
                        missing_keywords: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setMatchResult(result);
        } catch (e) {
            console.error(e);
            setError("Failed to perform analysis. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ClipboardPaste className="w-5 h-5 text-blue-600" />
                    Direct Job Match Analyzer
                </CardTitle>
                <p className="text-sm text-gray-500 pt-1">
                    Paste a job description to get an instant AI-powered match analysis for this candidate.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Textarea
                        placeholder="Paste the full job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="h-40 bg-gray-50"
                        disabled={isLoading}
                    />
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </div>
                <Button onClick={handleAnalysis} disabled={isLoading || !jobDescription} className="w-full bg-blue-600 hover:bg-blue-700">
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Analyze Match
                        </>
                    )}
                </Button>

                {matchResult && (
                    <div className="space-y-6 pt-6 border-t">
                        <div className="text-center space-y-2">
                            <div className={`text-5xl font-bold ${getScoreColor(matchResult.match_score)}`}>{matchResult.match_score}</div>
                            <p className="font-semibold text-lg text-gray-700">Overall Match Score</p>
                            <p className="text-sm text-gray-600 max-w-2xl mx-auto">{matchResult.summary}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-green-50/50 border-green-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-base text-green-800 gap-2">
                                        <ThumbsUp className="w-5 h-5"/>
                                        Strengths
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 list-disc pl-5 text-sm text-green-900">
                                        {matchResult.strengths.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="bg-red-50/50 border-red-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-base text-red-800 gap-2">
                                        <ThumbsDown className="w-5 h-5"/>
                                        Weaknesses / Gaps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 list-disc pl-5 text-sm text-red-900">
                                        {matchResult.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {matchResult.missing_keywords && matchResult.missing_keywords.length > 0 && (
                             <Card className="bg-yellow-50/50 border-yellow-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-base text-yellow-800 gap-2">
                                        <Search className="w-5 h-5"/>
                                        Missing Keywords
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {matchResult.missing_keywords.map((keyword, i) => (
                                        <div key={i} className="px-2 py-1 bg-yellow-100 text-yellow-900 border border-yellow-200 text-xs rounded-md">{keyword}</div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}