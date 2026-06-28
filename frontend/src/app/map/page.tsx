"use client";

import { useEffect, useState } from "react";
import { issueService, Issue } from "@/services/issue.service";
import { Loader2, AlertCircle, Inbox, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import IssueMap dynamically to disable SSR (essential for Leaflet map renderer)
const IssueMap = dynamic(
  () => import("@/components/map/IssueMap").then((mod) => mod.IssueMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[60vh] bg-muted/20 border border-border/40 rounded-2xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Initializing interactive map...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await issueService.getIssues();
      setIssues(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load community issues for the map. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

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
              <span>Back to List</span>
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Interactive Map</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Visualize and explore reported civic issues in your neighborhood.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading issues...</p>
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto flex flex-col items-center text-center py-16 px-6 bg-destructive/5 border border-destructive/20 rounded-2xl space-y-4">
          <div className="bg-destructive/10 p-3 rounded-full text-destructive">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-destructive">Unable to Load Map Data</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchIssues} variant="outline" className="rounded-xl mt-2">
            Retry Connection
          </Button>
        </div>
      ) : issues.length === 0 ? (
        <div className="max-w-md mx-auto flex flex-col items-center text-center py-20 px-6 border border-dashed border-muted-foreground/30 rounded-2xl space-y-4 bg-muted/10">
          <div className="bg-muted p-4 rounded-full text-muted-foreground/60 shadow-inner">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">No Issues Found</h3>
            <p className="text-sm text-muted-foreground">
              There are no reported issues to display on the map at the moment.
            </p>
          </div>
          <Link href="/report">
            <Button className="rounded-xl font-semibold mt-2">
              Report the First Issue
            </Button>
          </Link>
        </div>
      ) : (
        <div className="w-full h-[65vh] md:h-[70vh] rounded-2xl overflow-hidden border border-border/60 shadow-sm relative z-0">
          <IssueMap issues={issues} />
        </div>
      )}
    </div>
  );
}
