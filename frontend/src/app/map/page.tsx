"use client";

import { useEffect, useState } from "react";
import { issueService, Issue } from "@/services/issue.service";
import { Loader2, AlertCircle, Inbox, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

  // Nearby search states
  const [latInput, setLatInput] = useState<string>("");
  const [lngInput, setLngInput] = useState<string>("");
  const [radiusInput, setRadiusInput] = useState<string>("1000");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearched, setIsSearched] = useState(false);

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

  const handleSearch = async () => {
    setSearchError(null);
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    const radius = parseFloat(radiusInput);

    if (latInput.trim() === "" || isNaN(lat) || lat < -90 || lat > 90) {
      setSearchError("Please enter a valid latitude between -90 and 90.");
      return;
    }
    if (lngInput.trim() === "" || isNaN(lng) || lng < -180 || lng > 180) {
      setSearchError("Please enter a valid longitude between -180 and 180.");
      return;
    }
    if (radiusInput.trim() === "" || isNaN(radius) || radius <= 0) {
      setSearchError("Please enter a valid positive radius in meters.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await issueService.getNearbyIssues(lat, lng, radius);
      setIssues(data);
      setIsSearched(true);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load nearby issues. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setLatInput("");
    setLngInput("");
    setRadiusInput("1000");
    setSearchError(null);
    setIsSearched(false);
    await fetchIssues();
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

      {/* Nearby Issues Search Panel */}
      <Card className="mb-6 border-border/60 bg-card/50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g. 37.7749"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g. -122.4194"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius">Radius (meters)</Label>
              <Input
                id="radius"
                type="number"
                min="1"
                placeholder="1000"
                value={radiusInput}
                onChange={(e) => setRadiusInput(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1 font-semibold" disabled={isLoading}>
                Find Nearby
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1 font-semibold" disabled={isLoading}>
                Reset
              </Button>
            </div>
          </div>
          {searchError && (
            <p className="text-destructive text-sm mt-2 font-medium">{searchError}</p>
          )}
        </CardContent>
      </Card>

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
          <Button onClick={isSearched ? handleSearch : fetchIssues} variant="outline" className="rounded-xl mt-2">
            Retry Connection
          </Button>
        </div>
      ) : issues.length === 0 ? (
        isSearched ? (
          <div className="max-w-md mx-auto flex flex-col items-center text-center py-20 px-6 border border-dashed border-muted-foreground/30 rounded-2xl space-y-4 bg-muted/10">
            <div className="bg-muted p-4 rounded-full text-muted-foreground/60 shadow-inner">
              <Inbox className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">No Nearby Issues Found</h3>
              <p className="text-sm text-muted-foreground">
                There are no reported issues within {radiusInput} meters of the coordinates ({latInput}, {lngInput}).
              </p>
            </div>
            <Button onClick={handleReset} variant="outline" className="rounded-xl mt-2">
              Clear Search & Show All
            </Button>
          </div>
        ) : (
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
        )
      ) : (
        <div className="w-full h-[65vh] md:h-[70vh] rounded-2xl overflow-hidden border border-border/60 shadow-sm relative z-0">
          <IssueMap issues={issues} />
        </div>
      )}
    </div>
  );
}
