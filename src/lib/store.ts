import { promises as fs } from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getPresetPage, PRESET_PAGES } from "./presetPages";

const PAGES_DIR = path.resolve(process.cwd(), "data", "pages");

export const PageKindSchema = z.enum(["openui", "a2ui"]);
export type PageKind = z.infer<typeof PageKindSchema>;

export const PageRecordSchema = z.object({
  slug: z.string().min(1),
  kind: PageKindSchema,
  project: z.string().optional(),
  theme: z.string(),
  title: z.string().optional(),
  payload: z.unknown(),
  createdAt: z.string(),
  expiresAt: z.string().nullable(),
});

export type PageRecord = z.infer<typeof PageRecordSchema>;

async function ensureDir() {
  await fs.mkdir(PAGES_DIR, { recursive: true });
}

function pageFile(slug: string) {
  return path.join(PAGES_DIR, `${slug}.json`);
}

export function generateSlug() {
  return nanoid(10);
}

export async function createPage(input: Omit<PageRecord, "slug" | "createdAt" | "expiresAt"> & { ttlSeconds?: number | null }) {
  await ensureDir();
  const slug = generateSlug();
  const now = new Date();
  const expiresAt =
    input.ttlSeconds === null || input.ttlSeconds === undefined
      ? null
      : new Date(now.getTime() + input.ttlSeconds * 1000).toISOString();
  const record: PageRecord = PageRecordSchema.parse({
    slug,
    kind: input.kind,
    project: input.project,
    theme: input.theme,
    title: input.title,
    payload: input.payload,
    createdAt: now.toISOString(),
    expiresAt,
  });
  await fs.writeFile(pageFile(slug), JSON.stringify(record, null, 2));
  return record;
}

export async function getPage(slug: string): Promise<PageRecord | null> {
  const preset = getPresetPage(slug);
  if (preset) return preset;

  await ensureDir();
  try {
    const raw = await fs.readFile(pageFile(slug), "utf8");
    const rec = PageRecordSchema.parse(JSON.parse(raw));
    if (rec.expiresAt && new Date(rec.expiresAt).getTime() < Date.now()) {
      return null;
    }
    return rec;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function updatePagePayload(slug: string, payload: unknown): Promise<PageRecord | null> {
  if (getPresetPage(slug)) return null;

  const existing = await getPage(slug);
  if (!existing) return null;
  const next = { ...existing, payload };
  await fs.writeFile(pageFile(slug), JSON.stringify(next, null, 2));
  return next;
}

export async function deletePage(slug: string): Promise<boolean> {
  if (getPresetPage(slug)) return false;

  await ensureDir();
  try {
    await fs.rm(pageFile(slug), { force: false });
    return true;
  } catch {
    return false;
  }
}

export async function listPages(): Promise<PageRecord[]> {
  await ensureDir();
  const files = await fs.readdir(PAGES_DIR);
  const out: PageRecord[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(PAGES_DIR, f), "utf8");
      const rec = PageRecordSchema.parse(JSON.parse(raw));
      if (rec.expiresAt && new Date(rec.expiresAt).getTime() < Date.now()) {
        await fs.rm(path.join(PAGES_DIR, f), { force: true });
        continue;
      }
      out.push(rec);
    } catch {
      // skip malformed
    }
  }
  const presets = PRESET_PAGES.filter((preset) => !out.some((page) => page.slug === preset.slug));
  return [...presets, ...out].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
