import { NextRequest, NextResponse } from "next/server";
import { readGlobalConfig, writeGlobalConfig, GlobalConfigSchema } from "@/lib/config";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await readGlobalConfig());
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = GlobalConfigSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", issues: parsed.error.issues }, { status: 400 });
  }
  const next = await writeGlobalConfig(parsed.data);
  return NextResponse.json(next);
}
