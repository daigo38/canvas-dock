"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GlobalConfig } from "@/lib/config";
import type { ThemeManifest } from "@/lib/themes";
import { TTL_PRESETS } from "@/lib/ttl";

export function SettingsForm({ config, themes }: { config: GlobalConfig; themes: ThemeManifest[] }) {
  const [form, setForm] = useState({
    defaultTheme: config.defaultTheme,
    defaultTtlSeconds: String(config.defaultTtlSeconds),
    auth: config.auth,
    authToken: config.authToken ?? "",
  });
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [pending, startTransition] = useTransition();

  return (
    <Card className="max-w-xl">
      <CardContent className="p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(async () => {
              const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  defaultTheme: form.defaultTheme,
                  defaultTtlSeconds: Number(form.defaultTtlSeconds),
                  auth: form.auth,
                  authToken: form.authToken || undefined,
                }),
              });
              setStatus(res.ok ? "saved" : "error");
              setTimeout(() => setStatus("idle"), 1500);
            });
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="default-theme" className="text-xs text-muted-foreground">
              Default theme
            </Label>
            <Select value={form.defaultTheme} onValueChange={(defaultTheme) => setForm({ ...form, defaultTheme })}>
              <SelectTrigger id="default-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="default-ttl" className="text-xs text-muted-foreground">
              Default TTL
            </Label>
            <Select
              value={form.defaultTtlSeconds}
              onValueChange={(defaultTtlSeconds) => setForm({ ...form, defaultTtlSeconds })}
            >
              <SelectTrigger id="default-ttl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TTL_PRESETS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="auth-mode" className="text-xs text-muted-foreground">
              Auth mode
            </Label>
            <Select
              value={form.auth}
              onValueChange={(auth) => setForm({ ...form, auth: auth as "none" | "token" })}
            >
              <SelectTrigger id="auth-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (local only)</SelectItem>
                <SelectItem value="token">Bearer token (in MCP / REST requests)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.auth === "token" && (
            <div className="grid gap-2">
              <Label htmlFor="auth-token" className="text-xs text-muted-foreground">
                Bearer token
              </Label>
              <Input
                id="auth-token"
                type="text"
                value={form.authToken}
                onChange={(e) => setForm({ ...form, authToken: e.target.value })}
                className="font-mono"
                placeholder="random-secret"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
            {status === "saved" && <Badge className="bg-emerald-600 text-white">Saved</Badge>}
            {status === "error" && <Badge variant="destructive">Failed</Badge>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
