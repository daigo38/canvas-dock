import Link from "next/link";
import { headers } from "next/headers";
import { AppShell } from "@/components/app/AppShell";
import { CopyButton } from "@/components/app/CopyButton";
import { DeletePageButton } from "@/components/app/DeletePageButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listPages } from "@/lib/store";
import { listProjects } from "@/lib/config";
import { THEMES } from "@/lib/themes";

export const dynamic = "force-dynamic";

async function getOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function Dashboard() {
  const [pages, projects, origin] = await Promise.all([listPages(), listProjects(), getOrigin()]);
  const mcpUrl = `${origin}/api/mcp`;

  return (
    <AppShell>
      <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hosted pages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pages.length} active · {THEMES.length} themes · {projects.length} projects
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="h-9 px-3 font-mono font-normal text-muted-foreground">
            MCP {mcpUrl}
          </Badge>
          <CopyButton value={mcpUrl} label="Copy MCP URL" />
          <Button asChild variant="outline">
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </div>

      {pages.length === 0 ? (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="p-10 text-center">
            <p className="text-sm text-muted-foreground">No pages yet.</p>
            <p className="mt-2 text-xs text-muted-foreground">
              POST to <code className="rounded bg-background px-1.5 py-0.5">/api/pages</code> or call the MCP tool{" "}
              <code className="rounded bg-background px-1.5 py-0.5">render_a2ui</code> /{" "}
              <code className="rounded bg-background px-1.5 py-0.5">render_openui</code>.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {pages.map((p) => {
            const url = `${origin}/p/${p.slug}`;
            return (
              <li key={p.slug}>
                <Card className="transition-colors hover:bg-muted/40">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={`/p/${p.slug}`} className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-muted-foreground">{p.slug}</span>
                        <Badge variant="secondary" className="uppercase tracking-wide text-muted-foreground">
                          {p.kind}
                        </Badge>
                        <Badge variant="secondary" className="uppercase tracking-wide text-muted-foreground">
                          {p.theme}
                        </Badge>
                        {p.project && (
                          <Badge variant="secondary" className="uppercase tracking-wide text-muted-foreground">
                            {p.project}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1.5 truncate text-sm font-medium">
                        {p.title ?? <span className="text-muted-foreground italic">untitled</span>}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        expires: {p.expiresAt ? new Date(p.expiresAt).toLocaleString() : "never"}
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <CopyButton value={url} />
                      {p.project !== "preset" && <DeletePageButton slug={p.slug} />}
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
