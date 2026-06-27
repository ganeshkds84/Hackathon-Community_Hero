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
          <span className="text-muted-foreground">Report</span>
          <span className="text-muted-foreground">Issues</span>
          <span className="text-muted-foreground">Dashboard</span>
        </nav>
      </div>
    </header>
  );
}
