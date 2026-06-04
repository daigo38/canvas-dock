import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPage, listPages, PageKindSchema } from "@/lib/store";
import { readGlobalConfig, getProject } from "@/lib/config";
import { isValidThemeId } from "@/lib/themes";
import { logger, withApiLogging } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  kind: PageKindSchema,
  project: z.string().optional(),
  theme: z.string().optional(),
  title: z.string().optional(),
  payload: z.unknown(),
  ttlSeconds: z.number().int().positive().nullable().optional(),
});

export async function GET(req: NextRequest) {
  return withApiLogging(req, "GET /api/pages", async () => {
    const pages = await listPages();
    return NextResponse.json({ pages });
  });
}

export async function POST(req: NextRequest) {
  return withApiLogging(req, "POST /api/pages", async () => {
    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_body", issues: parsed.error.issues }, { status: 400 });
    }
    const { kind, project, theme, title, payload, ttlSeconds } = parsed.data;

    const config = await readGlobalConfig();
    const projectCfg = project ? await getProject(project) : null;

    const resolvedTheme = theme ?? projectCfg?.theme ?? config.defaultTheme;
    if (!isValidThemeId(resolvedTheme)) {
      return NextResponse.json({ error: "unknown_theme", theme: resolvedTheme }, { status: 400 });
    }

    const resolvedTtl = ttlSeconds ?? projectCfg?.ttlSeconds ?? config.defaultTtlSeconds;

    const rec = await createPage({
      kind,
      project,
      theme: resolvedTheme,
      title,
      payload,
      ttlSeconds: resolvedTtl,
    });

    logger.info("Page created", { slug: rec.slug, kind, project, theme: resolvedTheme });
    const url = new URL(`/p/${rec.slug}`, req.nextUrl.origin).toString();
    return NextResponse.json({ slug: rec.slug, url, expiresAt: rec.expiresAt });
  });
}
