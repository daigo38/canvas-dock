import { NextRequest, NextResponse } from "next/server";
import { listProjects, upsertProject, ProjectConfigSchema } from "@/lib/config";
import { logger, withApiLogging } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return withApiLogging(req, "GET /api/settings/projects", async () => NextResponse.json(await listProjects()));
}

export async function POST(req: NextRequest) {
  return withApiLogging(req, "POST /api/settings/projects", async () => {
    const body = await req.json().catch(() => null);
    const parsed = ProjectConfigSchema.omit({ createdAt: true }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_body", issues: parsed.error.issues }, { status: 400 });
    }
    const saved = await upsertProject(parsed.data);
    logger.info("Project created", { projectId: saved.id });
    return NextResponse.json(saved);
  });
}
