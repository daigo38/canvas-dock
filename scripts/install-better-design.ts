#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { BETTER_DESIGN_COMPONENTS, BETTER_DESIGN_THEMES } from "../src/lib/betterDesignCatalog.ts";

const REGISTRY_BASE = "https://www.better-design.com/registry";

async function registryHas(url: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  return false;
}

function hasLocalComponent(theme: string, component: string) {
  const target = `src/themes/${theme}/components/ui/${component}`;
  return existsSync(`${target}.tsx`) || existsSync(`${target}.ts`);
}

async function availableUrls(theme: string) {
  const missingComponents = BETTER_DESIGN_COMPONENTS.filter((component) => !hasLocalComponent(theme, component));
  if (missingComponents.length === 0) return [];

  const entries = await Promise.all(
    missingComponents.map(async (component) => {
      const url = `${REGISTRY_BASE}/${theme}/${component}.json`;
      return (await registryHas(url)) ? url : null;
    }),
  );
  return entries.filter((url): url is string => Boolean(url));
}

async function run(theme: string) {
  const urls = await availableUrls(theme);
  if (urls.length === 0) return;

  const target = `src/themes/${theme}/components/ui`;
  const result = spawnSync(
    "pnpm",
    ["exec", "shadcn", "add", "--yes", "--overwrite", "--path", target, ...urls],
    { env: { ...process.env, npm_config_store_dir: ".pnpm-store/v10" }, stdio: "inherit" },
  );
  if (result.status !== 0) {
    throw new Error(`shadcn add failed: ${theme}`);
  }
}

for (const theme of BETTER_DESIGN_THEMES) {
  await run(theme.id);
}
