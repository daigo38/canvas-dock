import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deleteProject, getProject, TtlSecondsSchema, upsertProject } from "@/lib/config";
import { logger, withApiLogging } from "@/lib/logger";

export const runtime = "nodejs";

const ProjectUpdateSchema = z.object({
  label: z.string().trim().min(1).optional(),
  theme: z.string().nullable().optional(),
  ttlSeconds: TtlSecondsSchema.nullable().optional(),
  visibility: z.enum(["local", "shareable"]).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiLogging(_req, "GET /api/settings/projects/[id]", async () => {
    const { id } = await params;
    const p = await getProject(id);
    if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(p);
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiLogging(_req, "DELETE /api/settings/projects/[id]", async () => {
    const { id } = await params;
    await deleteProject(id);
    logger.info("Project deleted", { projectId: id });
    return NextResponse.json({ ok: true });
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiLogging(req, "PATCH /api/settings/projects/[id]", async () => {
    const { id } = await params;
    const existing = await getProject(id);
    if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    const parsed = ProjectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_body", issues: parsed.error.issues }, { status: 400 });
    }

    const saved = await upsertProject({
      ...existing,
      ...parsed.data,
      id,
      label: parsed.data.label ?? existing.label,
      theme: parsed.data.theme === null ? undefined : parsed.data.theme ?? existing.theme,
    });
    logger.info("Project updated", { projectId: saved.id });
    return NextResponse.json(saved);
  });
}
