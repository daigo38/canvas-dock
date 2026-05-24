import { NextRequest, NextResponse } from "next/server";
import { listProjects, upsertProject, ProjectConfigSchema } from "@/lib/config";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await listProjects());
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = ProjectConfigSchema.omit({ createdAt: true }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", issues: parsed.error.issues }, { status: 400 });
  }
  const saved = await upsertProject(parsed.data);
  return NextResponse.json(saved);
}
