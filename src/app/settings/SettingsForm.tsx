"use client";

import { useState, useTransition } from "react";
import type { GlobalConfig } from "@/lib/config";
import type { ThemeManifest } from "@/lib/themes";

export function SettingsForm({ config, themes }: { config: GlobalConfig; themes: ThemeManifest[] }) {
  const [form, setForm] = useState({
    defaultTheme: config.defaultTheme,
    defaultTtlSeconds: config.defaultTtlSeconds ?? "",
    auth: config.auth,
    authToken: config.authToken ?? "",
  });
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await fetch("/api/settings", {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              defaultTheme: form.defaultTheme,
              defaultTtlSeconds: form.defaultTtlSeconds === "" ? null : Number(form.defaultTtlSeconds),
              auth: form.auth,
              authToken: form.authToken || undefined,
            }),
          });
          setStatus(res.ok ? "saved" : "error");
          setTimeout(() => setStatus("idle"), 1500);
        });
      }}
      className="grid gap-4 rounded-lg border border-border p-5 max-w-xl"
    >
      <label className="grid gap-1">
        <span className="text-xs font-medium text-muted-foreground">Default theme</span>
        <select
          value={form.defaultTheme}
          onChange={(e) => setForm({ ...form, defaultTheme: e.target.value })}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          Default TTL (seconds, blank = never expire)
        </span>
        <input
          type="number"
          min={0}
          value={form.defaultTtlSeconds}
          onChange={(e) => setForm({ ...form, defaultTtlSeconds: e.target.value })}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
          placeholder="604800"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-muted-foreground">Auth mode</span>
        <select
          value={form.auth}
          onChange={(e) => setForm({ ...form, auth: e.target.value as "none" | "token" })}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="none">None (local only)</option>
          <option value="token">Bearer token (in MCP / REST requests)</option>
        </select>
      </label>

      {form.auth === "token" && (
        <label className="grid gap-1">
          <span className="text-xs font-medium text-muted-foreground">Bearer token</span>
          <input
            type="text"
            value={form.authToken}
            onChange={(e) => setForm({ ...form, authToken: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
            placeholder="random-secret"
          />
        </label>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {status === "saved" && <span className="text-xs text-emerald-600">Saved.</span>}
        {status === "error" && <span className="text-xs text-rose-600">Failed.</span>}
      </div>
    </form>
  );
}
