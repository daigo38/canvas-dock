"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProjectConfig } from "@/lib/config";
import type { ThemeManifest } from "@/lib/themes";

export function ProjectsList({ projects, themes }: { projects: ProjectConfig[]; themes: ThemeManifest[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: "", theme: "" });
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await fetch("/api/settings/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          label: draft.label || undefined,
          theme: draft.theme || undefined,
        }),
      });
      if (res.ok) {
        setDraft({ label: "", theme: "" });
        setAdding(false);
        router.refresh();
      }
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await fetch(`/api/settings/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-border">
      {projects.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
          No projects yet. Projects let you override theme and TTL per AI/use case.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Label</th>
              <th className="px-4 py-2 text-left font-medium">Theme</th>
              <th className="px-4 py-2 text-left font-medium">TTL</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-2">{p.label}</td>
                <td className="px-4 py-2">{p.theme ?? <span className="text-muted-foreground">inherit</span>}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">
                  {p.ttlSeconds == null ? "inherit" : `${p.ttlSeconds}s`}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => remove(p.id)}
                    className="rounded-md border border-border px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="border-t border-border p-4">
        {adding ? (
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
            <input
              placeholder="label"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
            <select
              value={draft.theme}
              onChange={(e) => setDraft({ ...draft, theme: e.target.value })}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            >
              <option value="">inherit</option>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              onClick={save}
              disabled={pending}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => setAdding(false)}
              className="rounded-md border border-border px-3 py-1 text-xs"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-muted"
          >
            + Add project
          </button>
        )}
      </div>
    </div>
  );
}
