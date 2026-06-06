#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const REGISTRY_BASE = "https://www.better-design.com/registry";

const THEMES = ["linear", "vercel", "notion", "stripe", "supabase", "apple"];

const COMPONENTS = [
  "accordion",
  "alert",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "card",
  "chart",
  "code-block",
  "data-table",
  "empty",
  "kbd",
  "pagination",
  "progress",
  "section-header",
  "separator",
  "skeleton",
  "stat-card",
  "tabs",
  "tooltip",
  "typography",
];

function run(theme: string, component: string) {
  const url = `${REGISTRY_BASE}/${theme}/${component}.json`;
  const target = `src/themes/${theme}/components/ui`;
  const result = spawnSync(
    "pnpm",
    ["exec", "shadcn", "add", "--yes", "--overwrite", "--path", target, url],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    throw new Error(`shadcn add failed: ${theme}/${component}`);
  }
}

for (const theme of THEMES) {
  for (const component of COMPONENTS) {
    run(theme, component);
  }
}
