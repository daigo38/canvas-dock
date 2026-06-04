import { NextRequest, NextResponse } from "next/server";
import { deleteProject, getProject } from "@/lib/config";
import { logger, withApiLogging } from "@/lib/logger";

export const runtime = "nodejs";

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
