import { promises as fs } from "node:fs";
import path from "node:path";
import { customAlphabet } from "nanoid";
import { z } from "zod";

const DATA_DIR = path.resolve(process.cwd(), "data");
const CONFIG_PATH = path.join(DATA_DIR, "config.json");
const PROJECTS_DIR = path.join(DATA_DIR, "projects");
const createProjectId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

export const GlobalConfigSchema = z.object({
  defaultTheme: z.string().default("default"),
  defaultTtlSeconds: z.number().int().positive().nullable().default(60 * 60 * 24 * 7),
  auth: z.enum(["none", "token"]).default("none"),
  authToken: z.string().optional(),
  cleanupIntervalSeconds: z.number().int().positive().default(60 * 60),
});

export type GlobalConfig = z.infer<typeof GlobalConfigSchema>;

export const ProjectConfigSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  theme: z.string().optional(),
  ttlSeconds: z.number().int().positive().nullable().optional(),
  visibility: z.enum(["local", "shareable"]).default("local"),
  createdAt: z.string(),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

export const ProjectConfigInputSchema = ProjectConfigSchema.omit({ id: true, createdAt: true }).extend({
  label: z.string().min(1).optional(),
});

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(PROJECTS_DIR, { recursive: true });
}

export async function readGlobalConfig(): Promise<GlobalConfig> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return GlobalConfigSchema.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      const def = GlobalConfigSchema.parse({});
      await fs.writeFile(CONFIG_PATH, JSON.stringify(def, null, 2));
      return def;
    }
    throw err;
  }
}

export async function writeGlobalConfig(next: Partial<GlobalConfig>): Promise<GlobalConfig> {
  await ensureDirs();
  const current = await readGlobalConfig();
  const merged = GlobalConfigSchema.parse({ ...current, ...next });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(merged, null, 2));
  return merged;
}

export async function listProjects(): Promise<ProjectConfig[]> {
  await ensureDirs();
  const files = await fs.readdir(PROJECTS_DIR);
  const out: ProjectConfig[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(PROJECTS_DIR, f), "utf8");
      out.push(ProjectConfigSchema.parse(JSON.parse(raw)));
    } catch {
      // skip malformed
    }
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

export async function getProject(id: string): Promise<ProjectConfig | null> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(path.join(PROJECTS_DIR, `${id}.json`), "utf8");
    return ProjectConfigSchema.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

async function generateUniqueProjectId(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = createProjectId();
    if (!(await getProject(id))) return id;
  }
  return createProjectId(10);
}

export async function createProject(
  input: z.infer<typeof ProjectConfigInputSchema>,
): Promise<ProjectConfig> {
  const id = await generateUniqueProjectId();
  return upsertProject({
    ...input,
    id,
    label: input.label?.trim() || id,
  });
}

export async function upsertProject(p: Omit<ProjectConfig, "createdAt"> & { createdAt?: string }): Promise<ProjectConfig> {
  await ensureDirs();
  const existing = await getProject(p.id);
  const next = ProjectConfigSchema.parse({
    ...p,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  });
  await fs.writeFile(path.join(PROJECTS_DIR, `${next.id}.json`), JSON.stringify(next, null, 2));
  return next;
}

export async function deleteProject(id: string): Promise<void> {
  await ensureDirs();
  await fs.rm(path.join(PROJECTS_DIR, `${id}.json`), { force: true });
}
