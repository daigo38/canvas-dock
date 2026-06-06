"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProjectConfig } from "@/lib/config";
import type { ThemeManifest } from "@/lib/themes";
import { formatTtlSeconds, INHERIT_TTL_VALUE, TTL_PRESETS } from "@/lib/ttl";

const INHERIT_THEME = "__inherit";

type ProjectDraft = {
  label: string;
  theme: string;
  ttlSeconds: string;
};

function draftFromProject(project: ProjectConfig): ProjectDraft {
  return {
    label: project.label,
    theme: project.theme ?? INHERIT_THEME,
    ttlSeconds: project.ttlSeconds == null ? INHERIT_TTL_VALUE : String(project.ttlSeconds),
  };
}

function serializeDraft(draft: ProjectDraft) {
  return {
    label: draft.label.trim() || undefined,
    theme: draft.theme === INHERIT_THEME ? null : draft.theme,
    ttlSeconds: draft.ttlSeconds === INHERIT_TTL_VALUE ? null : Number(draft.ttlSeconds),
  };
}

function ttlPayloadValue(value: string) {
  if (value === INHERIT_TTL_VALUE) return undefined;
  return Number(value);
}

function TtlSelect({
  value,
  onValueChange,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={INHERIT_TTL_VALUE}>inherit</SelectItem>
        {TTL_PRESETS.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ProjectsList({ projects, themes }: { projects: ProjectConfig[]; themes: ThemeManifest[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<ProjectDraft>({
    label: "",
    theme: INHERIT_THEME,
    ttlSeconds: INHERIT_TTL_VALUE,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ProjectDraft | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await fetch("/api/settings/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          label: draft.label || undefined,
          theme: draft.theme === INHERIT_THEME ? undefined : draft.theme,
          ttlSeconds: ttlPayloadValue(draft.ttlSeconds),
        }),
      });
      if (res.ok) {
        setDraft({ label: "", theme: INHERIT_THEME, ttlSeconds: INHERIT_TTL_VALUE });
        setAdding(false);
        router.refresh();
      }
    });
  }

  function beginEdit(project: ProjectConfig) {
    setAdding(false);
    setEditingId(project.id);
    setEditDraft(draftFromProject(project));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  function saveEdit(id: string) {
    if (!editDraft) return;
    startTransition(async () => {
      const res = await fetch(`/api/settings/projects/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(serializeDraft(editDraft)),
      });
      if (res.ok) {
        cancelEdit();
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
    <Card>
      {projects.length === 0 ? (
        <CardContent className="px-5 py-8 text-center text-sm text-muted-foreground">
          No projects yet. Projects let you override theme and TTL per AI/use case.
        </CardContent>
      ) : (
        <CardContent className="overflow-x-auto p-0">
          <Table className="min-w-max table-auto">
            <TableHeader className="bg-muted/40 text-xs uppercase tracking-wide">
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>TTL</TableHead>
                <TableHead className="w-px" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  {editingId === p.id && editDraft ? (
                    <>
                      <TableCell>
                        <Input
                          className="w-[16rem] max-w-[32vw]"
                          value={editDraft.label}
                          onChange={(e) => setEditDraft({ ...editDraft, label: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editDraft.theme}
                          onValueChange={(theme) => setEditDraft({ ...editDraft, theme })}
                        >
                          <SelectTrigger className="w-[14rem] max-w-[30vw]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={INHERIT_THEME}>inherit</SelectItem>
                            {themes.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TtlSelect
                          value={editDraft.ttlSeconds}
                          onValueChange={(ttlSeconds) => setEditDraft({ ...editDraft, ttlSeconds })}
                          className="w-[8rem]"
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-nowrap justify-end gap-1">
                          <Button type="button" size="sm" onClick={() => saveEdit(p.id)} disabled={pending}>
                            Save
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={cancelEdit} disabled={pending}>
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="max-w-[18rem] truncate">{p.label}</TableCell>
                      <TableCell>
                        {p.theme ? (
                          <Badge variant="secondary">{p.theme}</Badge>
                        ) : (
                          <Badge variant="outline">inherit</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatTtlSeconds(p.ttlSeconds)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-nowrap justify-end gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8"
                            title="Edit"
                            aria-label={`Edit ${p.label}`}
                            onClick={() => beginEdit(p)}
                            disabled={pending}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="size-8"
                            title="Delete"
                            aria-label={`Delete ${p.label}`}
                            onClick={() => remove(p.id)}
                            disabled={pending}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}

      <CardFooter className="border-t p-4">
        {adding ? (
          <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-[minmax(12rem,1.15fr)_minmax(12rem,1fr)_minmax(10rem,0.75fr)_auto_auto]">
            <Input
              className="min-w-0"
              placeholder="label"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
            <Select value={draft.theme} onValueChange={(theme) => setDraft({ ...draft, theme })}>
              <SelectTrigger className="min-w-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={INHERIT_THEME}>inherit</SelectItem>
                {themes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TtlSelect
              value={draft.ttlSeconds}
              onValueChange={(ttlSeconds) => setDraft({ ...draft, ttlSeconds })}
              className="min-w-0"
            />
            <Button
              type="button"
              onClick={save}
              disabled={pending}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDraft({ label: "", theme: INHERIT_THEME, ttlSeconds: INHERIT_TTL_VALUE });
                setAdding(false);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              cancelEdit();
              setAdding(true);
            }}
          >
            <Plus />
            Add project
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
