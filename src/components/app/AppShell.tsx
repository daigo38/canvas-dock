import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Canvas Dock
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Pages
            </Link>
            <Link href="/settings" className="hover:text-foreground">
              Settings
            </Link>
            <Link
              href="/api/mcp"
              className="rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-muted"
            >
              MCP endpoint
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
