import { NextRequest, NextResponse } from "next/server";
import { deleteProject, getProject } from "@/lib/config";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProject(id);
  if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(p);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
