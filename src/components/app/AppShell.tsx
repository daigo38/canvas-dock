import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span aria-hidden className="text-lg leading-none">🫟</span>
            <span>Canvas Dock</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost">
              <Link href="/">Pages</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/settings">Settings</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
