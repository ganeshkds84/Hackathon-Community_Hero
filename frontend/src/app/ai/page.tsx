"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  Building2, 
  ShieldAlert, 
  FileText, 
  RefreshCw 
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { issueService, IssueAnalysisResponse } from "@/services/issue.service";

const analyzeSchema = z.object({
  description: z
    .string()
    .min(10, "Please provide a description of at least 10 characters.")
    .max(1000, "Description cannot exceed 1000 characters."),
});

type AnalyzeForm = z.infer<typeof analyzeSchema>;

export default function AIAnalysisPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<IssueAnalysisResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AnalyzeForm>({
    resolver: zodResolver(analyzeSchema),
    defaultValues: {
      description: "",
    },
  });

  const descriptionValue = watch("description");

  const onSubmit = async (data: AnalyzeForm) => {
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage(null);
    setResult(null);

    try {
      // Programmatically create a title from the first 50 chars of the description
      const title =
        data.description.length > 50
          ? data.description.substring(0, 50) + "..."
          : data.description;

      const analysisResult = await issueService.analyzeIssue({
        title,
        description: data.description,
      });

      setResult(analysisResult);
      setStatus("success");
    } catch (error: any) {
      console.error("AI analysis error:", error);
      setStatus("error");
      if (error.response) {
        setErrorMessage(
          error.response.data?.detail || "Server error while performing AI analysis."
        );
      } else if (error.request) {
        setErrorMessage("Network error: Could not reach the server.");
      } else {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    reset();
    setStatus("idle");
    setResult(null);
    setErrorMessage(null);
  };

  // Helper to color code category badge
  const getCategoryBadgeStyle = (category: string | null) => {
    if (!category) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    const cat = category.toLowerCase();
    if (cat.includes("water")) {
      return "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50";
    }
    if (cat.includes("streetlight") || cat.includes("light") || cat.includes("electrical")) {
      return "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50";
    }
    if (cat.includes("waste") || cat.includes("garbage") || cat.includes("trash")) {
      return "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50";
    }
    if (cat.includes("road") || cat.includes("pothole") || cat.includes("street")) {
      return "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50";
    }
    return "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";
  };

  // Helper to color code severity badge
  const getSeverityBadgeStyle = (severity: string | null) => {
    if (!severity) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    const sev = severity.toLowerCase();
    if (sev.includes("high") || sev.includes("critical")) {
      return "bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50";
    }
    if (sev.includes("medium") || sev.includes("moderate")) {
      return "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50";
    }
    return "bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50";
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      {/* Title Header */}
      <div className="flex flex-col items-center justify-center text-center mb-10 space-y-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">AI Issue Analyzer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Enter a description of a local issue to let Gemini classify it, assign a department, and draft a response plan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Input Card */}
        <Card className="shadow-md border border-border">
          <CardHeader>
            <CardTitle>Issue Description</CardTitle>
            <CardDescription>
              Provide details such as the location, type of hazard, and current impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Describe the issue</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., There is a water main break outside 455 Oak Street. Large amounts of water are gushing onto the sidewalk and road, causing traffic issues and freezing risk..."
                  className="min-h-[150px] text-base"
                  disabled={isSubmitting}
                  {...register("description")}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {errors.description ? (
                      <span className="text-destructive font-medium">
                        {errors.description.message}
                      </span>
                    ) : (
                      "Please be as specific as possible."
                    )}
                  </span>
                  <span>{descriptionValue?.length || 0} / 1000 characters</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !descriptionValue?.trim()}
                  className="flex-1 h-12 text-base font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Issue...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Issue
                    </>
                  )}
                </Button>
                {status !== "idle" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    className="h-12"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {status === "error" && errorMessage && (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-semibold">Analysis Failed</h4>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Results Card */}
        {status === "success" && result && (
          <Card className="shadow-lg border border-border animate-in fade-in slide-in-from-bottom-3 duration-300">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Intelligence Assessment
                  </CardTitle>
                  <CardDescription>
                    Automatically generated classification and analysis details.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div className="p-4 rounded-xl border border-border bg-card flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Classification Category
                  </span>
                  <div className="flex items-center pt-1.5">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getCategoryBadgeStyle(
                        result.category
                      )}`}
                    >
                      {result.category || "Uncategorized"}
                    </span>
                  </div>
                </div>

                {/* Severity */}
                <div className="p-4 rounded-xl border border-border bg-card flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Assessed Severity
                  </span>
                  <div className="flex items-center pt-1.5">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getSeverityBadgeStyle(
                        result.severity
                      )}`}
                    >
                      {result.severity || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Department */}
                <div className="p-4 rounded-xl border border-border bg-card flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Responsible Department
                  </span>
                  <div className="flex items-center gap-2 pt-1.5 text-sm font-semibold text-foreground">
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{result.department || "Municipal Operations"}</span>
                  </div>
                </div>
              </div>

              {/* Duplicate Information (Rendered dynamically if returned in backend payload) */}
              {((result as any).possible_duplicate !== undefined || (result as any).existing_issue_id) && (
                <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900/40 text-yellow-800 dark:text-yellow-300 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="space-y-1 text-sm">
                    <h4 className="font-semibold">Possible Duplicate Report Detected</h4>
                    <p>
                      {(result as any).duplicate_message || "Another report describing a similar issue has been identified in this area."}
                    </p>
                    {(result as any).existing_issue_id && (
                      <p className="text-xs opacity-90 mt-1 font-mono">
                        Matching ID: {(result as any).existing_issue_id}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* AI Reasoning Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground font-semibold text-lg border-b pb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Gemini Report & Response Plan</span>
                </div>
                <div className="bg-muted/30 border border-muted-foreground/10 rounded-xl p-6">
                  <div className="whitespace-pre-line text-sm leading-relaxed text-foreground antialiased space-y-3 font-normal">
                    {result.analysis}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
