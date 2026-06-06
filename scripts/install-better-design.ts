#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { BETTER_DESIGN_COMPONENTS, BETTER_DESIGN_THEMES } from "../src/lib/betterDesignCatalog.ts";

const REGISTRY_BASE = "https://www.better-design.com/registry";
const force = process.argv.includes("--force") || process.env.BETTER_DESIGN_FORCE === "1";
const fromArg = process.argv.find((arg) => arg.startsWith("--from="))?.slice("--from=".length);
const themeArg = process.argv.find((arg) => arg.startsWith("--theme="))?.slice("--theme=".length);

async function registryHas(url: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url);
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
  const missingComponents = BETTER_DESIGN_COMPONENTS.filter((component) => force || !hasLocalComponent(theme, component));
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
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = spawnSync(
      "pnpm",
      ["exec", "shadcn", "add", "--yes", "--overwrite", "--path", target, ...urls],
      { env: { ...process.env, npm_config_store_dir: ".pnpm-store/v10" }, stdio: "inherit" },
    );
    if (result.status === 0) return;
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  throw new Error(`shadcn add failed: ${theme}`);
}

const startIndex = fromArg ? BETTER_DESIGN_THEMES.findIndex((theme) => theme.id === fromArg) : 0;
const themes = themeArg
  ? BETTER_DESIGN_THEMES.filter((theme) => theme.id === themeArg)
  : startIndex > 0
    ? BETTER_DESIGN_THEMES.slice(startIndex)
    : BETTER_DESIGN_THEMES;

for (const theme of themes) {
  await run(theme.id);
}
