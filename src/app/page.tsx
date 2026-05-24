import Link from "next/link";
import { headers } from "next/headers";
import { AppShell } from "@/components/app/AppShell";
import { CopyButton } from "@/components/app/CopyButton";
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

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hosted pages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pages.length} active · {THEMES.length} themes · {projects.length} projects
          </p>
        </div>
        <Link
          href="/settings"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Settings
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center">
          <p className="text-sm text-muted-foreground">No pages yet.</p>
          <p className="text-xs text-muted-foreground mt-2">
            POST to <code className="rounded bg-background px-1.5 py-0.5">/api/pages</code> or call the MCP tool{" "}
            <code className="rounded bg-background px-1.5 py-0.5">render_a2ui</code> /{" "}
            <code className="rounded bg-background px-1.5 py-0.5">render_openui</code>.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Slug</th>
                <th className="px-4 py-2 text-left font-medium">Title</th>
                <th className="px-4 py-2 text-left font-medium">Kind</th>
                <th className="px-4 py-2 text-left font-medium">Theme</th>
                <th className="px-4 py-2 text-left font-medium">Project</th>
                <th className="px-4 py-2 text-left font-medium">Expires</th>
                <th className="px-4 py-2 text-right font-medium">URL</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => {
                const url = `${origin}/p/${p.slug}`;
                return (
                  <tr key={p.slug} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-xs">{p.slug}</td>
                    <td className="px-4 py-2">{p.title ?? <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-2">{p.kind}</td>
                    <td className="px-4 py-2">{p.theme}</td>
                    <td className="px-4 py-2">{p.project ?? <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {p.expiresAt ? new Date(p.expiresAt).toLocaleString() : "never"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/p/${p.slug}`}
                          className="rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-muted"
                        >
                          Open
                        </Link>
                        <CopyButton value={url} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border p-5">
          <h2 className="text-sm font-semibold mb-2">MCP endpoint</h2>
          <code className="block rounded bg-muted px-2 py-1 text-xs">{origin}/api/mcp</code>
          <p className="mt-2 text-xs text-muted-foreground">
            Streamable HTTP transport. Add this URL to your MCP client (Claude Desktop, etc.).
          </p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <h2 className="text-sm font-semibold mb-2">REST</h2>
          <code className="block rounded bg-muted px-2 py-1 text-xs">POST {origin}/api/pages</code>
          <p className="mt-2 text-xs text-muted-foreground">
            Body: {`{ kind: "openui" | "a2ui", payload, theme?, project?, title?, ttlSeconds? }`}
          </p>
        </div>
      </section>
    </AppShell>
  );
}
