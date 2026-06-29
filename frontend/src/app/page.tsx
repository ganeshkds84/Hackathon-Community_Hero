import { BarChart3, ClipboardList, MapPinned, Sparkles, Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Community Hero
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl">
          Report local issues, track progress, and help your community stay
          informed with an AI-powered civic intelligence platform.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/report">
            <ClipboardList aria-hidden="true" />
            Report Issue
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="/issues">
            <MapPinned aria-hidden="true" />
            View Issues
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
          <Link href="/dashboard">
            <BarChart3 aria-hidden="true" />
            Dashboard
          </Link>
        </Button>
      </div>

      <Card className="mt-8 max-w-xl w-full text-left bg-muted/30 border border-border shadow-md">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          <div className="bg-primary/10 p-3 rounded-full shrink-0">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-xl">AI Issue Analyzer</CardTitle>
            <CardDescription>
              Leverage Gemini to analyze, categorize, and triage municipal reports.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>AI-powered issue categorization</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Severity prediction & impact check</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Automated department routing</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Proactive duplicate detection</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-between items-center rounded-b-xl">
          <span className="text-xs text-muted-foreground font-medium">Powered by Gemini 2.5 Flash</span>
          <Button asChild size="sm">
            <Link href="/ai">
              Try AI Analyzer
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
