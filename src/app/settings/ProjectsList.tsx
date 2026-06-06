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
    ttlSeconds: project.ttlSeconds == null ? "" : String(project.ttlSeconds),
  };
}

function serializeDraft(draft: ProjectDraft) {
  return {
    label: draft.label.trim() || undefined,
    theme: draft.theme === INHERIT_THEME ? null : draft.theme,
    ttlSeconds: draft.ttlSeconds === "" ? null : Number(draft.ttlSeconds),
  };
}

export function ProjectsList({ projects, themes }: { projects: ProjectConfig[]; themes: ThemeManifest[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<ProjectDraft>({ label: "", theme: INHERIT_THEME, ttlSeconds: "" });
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
          ttlSeconds: draft.ttlSeconds === "" ? undefined : Number(draft.ttlSeconds),
        }),
      });
      if (res.ok) {
        setDraft({ label: "", theme: INHERIT_THEME, ttlSeconds: "" });
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
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40 text-xs uppercase tracking-wide">
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>TTL</TableHead>
                <TableHead className="w-[220px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  {editingId === p.id && editDraft ? (
                    <>
                      <TableCell>
                        <Input
                          value={editDraft.label}
                          onChange={(e) => setEditDraft({ ...editDraft, label: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editDraft.theme}
                          onValueChange={(theme) => setEditDraft({ ...editDraft, theme })}
                        >
                          <SelectTrigger>
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
                        <Input
                          type="number"
                          min={1}
                          placeholder="inherit"
                          value={editDraft.ttlSeconds}
                          onChange={(e) => setEditDraft({ ...editDraft, ttlSeconds: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button type="button" onClick={() => saveEdit(p.id)} disabled={pending}>
                            Save
                          </Button>
                          <Button type="button" variant="outline" onClick={cancelEdit} disabled={pending}>
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{p.label}</TableCell>
                      <TableCell>
                        {p.theme ? (
                          <Badge variant="secondary">{p.theme}</Badge>
                        ) : (
                          <Badge variant="outline">inherit</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.ttlSeconds == null ? "inherit" : `${p.ttlSeconds}s`}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => beginEdit(p)} disabled={pending}>
                            <Pencil />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(p.id)}
                            disabled={pending}
                          >
                            <Trash2 />
                            Delete
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
          <div className="grid w-full gap-2 sm:grid-cols-[1fr_1fr_1fr_auto_auto]">
            <Input
              placeholder="label"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
            <Select value={draft.theme} onValueChange={(theme) => setDraft({ ...draft, theme })}>
              <SelectTrigger>
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
            <Input
              type="number"
              min={1}
              placeholder="TTL seconds (inherit)"
              value={draft.ttlSeconds}
              onChange={(e) => setDraft({ ...draft, ttlSeconds: e.target.value })}
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
                setDraft({ label: "", theme: INHERIT_THEME, ttlSeconds: "" });
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
