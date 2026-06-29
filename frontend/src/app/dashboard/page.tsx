"use client";

import { useEffect, useState, useCallback } from "react";
import { issueService, DashboardSummary, CategoryAnalytics } from "@/services/issue.service";
import { Loader2, AlertCircle, Inbox, ArrowLeft, Folder, RefreshCw, CheckCircle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, categoriesRes] = await Promise.all([
        issueService.getDashboardSummary(),
        issueService.getDashboardCategories(),
      ]);
      setSummary(summaryRes);
      setCategoryData(categoriesRes);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Loading dashboard overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] p-6">
        <div className="max-w-md w-full flex flex-col items-center text-center py-16 px-6 bg-destructive/5 border border-destructive/20 rounded-2xl space-y-4">
          <div className="bg-destructive/10 p-3 rounded-full text-destructive">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-destructive">Unable to Load Dashboard</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchDashboardData} variant="outline" className="rounded-xl mt-2">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const hasIssues = summary && summary.total_issues > 0;

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/issues"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Issues</span>
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">
            An overview of civic issues reported in the community.
          </p>
        </div>
      </div>

      {!hasIssues ? (
        <div className="max-w-md mx-auto flex flex-col items-center text-center py-20 px-6 border border-dashed border-muted-foreground/30 rounded-2xl space-y-4 bg-muted/10">
          <div className="bg-muted p-4 rounded-full text-muted-foreground/60 shadow-inner">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">No Issues Reported</h3>
            <p className="text-sm text-muted-foreground">
              There are no reported civic issues in the system yet.
            </p>
          </div>
          <Link href="/report">
            <Button className="rounded-xl font-semibold mt-2">
              Report the First Issue
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Issues Card */}
            <Card className="border border-border/60 bg-card/40 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Issues</CardTitle>
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Folder className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-extrabold tracking-tight">{summary?.total_issues}</div>
                <p className="text-xs text-muted-foreground mt-1">Total reported cases</p>
              </CardContent>
            </Card>

            {/* Open/Reported Issues Card */}
            <Card className="border border-border/60 bg-card/40 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
                <div className="bg-destructive/10 text-destructive p-2 rounded-lg">
                  <Flame className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-extrabold tracking-tight">{summary?.reported}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting attention or review</p>
              </CardContent>
            </Card>

            {/* In Progress Issues Card */}
            <Card className="border border-border/60 bg-card/40 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-extrabold tracking-tight">{summary?.in_progress}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently being addressed</p>
              </CardContent>
            </Card>

            {/* Resolved Issues Card */}
            <Card className="border border-border/60 bg-card/40 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Issues</CardTitle>
                <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-extrabold tracking-tight">{summary?.resolved}</div>
                <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown Section */}
          <Card className="border border-border/60 bg-card/30 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData && Object.keys(categoryData.categories).length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-border/60">
                  <table className="w-full text-sm text-left text-muted-foreground">
                    <thead className="text-xs uppercase bg-muted/40 text-muted-foreground border-b border-border/60">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-semibold text-foreground">Category Name</th>
                        <th scope="col" className="px-6 py-4 font-semibold text-right text-foreground">Number of Issues</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {Object.entries(categoryData.categories).map(([category, count]) => (
                        <tr
                          key={category}
                          className="hover:bg-muted/10 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap capitalize">
                            {category || "Unassigned"}
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-foreground">
                            {count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No category data available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
