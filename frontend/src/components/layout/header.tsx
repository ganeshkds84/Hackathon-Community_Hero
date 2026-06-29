import Link from "next/link";
import { MapPin } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>Community Hero</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/report" className="text-muted-foreground hover:text-foreground transition-colors">
            Report
          </Link>
          <Link href="/issues" className="text-muted-foreground hover:text-foreground transition-colors">
            Issues
          </Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/ai" className="text-muted-foreground hover:text-foreground transition-colors">
            AI Analyzer
          </Link>
        </nav>
      </div>
    </header>
  );
}
