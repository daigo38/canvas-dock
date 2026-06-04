import { NextRequest, NextResponse } from "next/server";
import { readGlobalConfig, writeGlobalConfig, GlobalConfigSchema } from "@/lib/config";
import { logger, withApiLogging } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return withApiLogging(req, "GET /api/settings", async () => NextResponse.json(await readGlobalConfig()));
}

export async function PATCH(req: NextRequest) {
  return withApiLogging(req, "PATCH /api/settings", async () => {
    const body = await req.json().catch(() => null);
    const parsed = GlobalConfigSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_body", issues: parsed.error.issues }, { status: 400 });
    }
    const next = await writeGlobalConfig(parsed.data);
    logger.info("Global settings updated");
    return NextResponse.json(next);
  });
}
