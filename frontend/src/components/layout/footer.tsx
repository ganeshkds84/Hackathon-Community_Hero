export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-center text-sm text-muted-foreground md:flex-row md:text-left">
        <p>&copy; {new Date().getFullYear()} Community Hero. All rights reserved.</p>
        <p>AI-powered Community Intelligence Platform</p>
      </div>
    </footer>
  );
}
