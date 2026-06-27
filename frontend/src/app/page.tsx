import { BarChart3, ClipboardList, MapPinned } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

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
    </section>
  );
}
