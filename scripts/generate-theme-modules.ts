#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { BETTER_DESIGN_THEMES } from "../src/lib/betterDesignCatalog.ts";

const PUBLIC_MODULES = [
  ["button", "button", ["Button"]],
  ["card", "card", ["Card", "CardHeader", "CardTitle", "CardDescription", "CardContent"]],
  ["badge", "badge", ["Badge"]],
  ["alert", "alert", ["Alert", "AlertTitle", "AlertDescription"]],
  ["separator", "separator", ["Separator"]],
  ["statCard", "stat-card", ["StatCard"]],
  ["dataTable", "data-table", ["DataTable"]],
  ["progress", "progress", ["Progress"]],
  ["empty", "empty", ["Empty"]],
  ["sectionHeader", "section-header", ["SectionHeader"]],
  ["codeBlock", "code-block", ["CodeBlock"]],
  ["avatar", "avatar", ["Avatar", "AvatarImage", "AvatarFallback"]],
  ["kbd", "kbd", ["Kbd"]],
  ["typography", "typography", ["H1", "H2", "H3", "H4", "P", "Lead", "Large", "Small", "Muted", "Blockquote", "Code", "InlineCode"]],
  ["tabs", "tabs", ["Tabs", "TabsList", "TabsTrigger", "TabsContent"]],
  ["accordion", "accordion", ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"]],
  ["breadcrumb", "breadcrumb", ["Breadcrumb", "BreadcrumbList", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbPage", "BreadcrumbSeparator"]],
  ["tooltip", "tooltip", ["Tooltip", "TooltipTrigger", "TooltipContent", "TooltipProvider"]],
  ["pagination", "pagination", ["Pagination", "PaginationContent", "PaginationItem", "PaginationLink", "PaginationNext", "PaginationPrevious", "PaginationEllipsis"]],
  ["skeleton", "skeleton", ["Skeleton"]],
  ["chart", "chart", ["ChartContainer", "ChartTooltip", "ChartTooltipContent", "ChartLegend", "ChartLegendContent"]],
  ["input", "input", ["Input"]],
  ["textarea", "textarea", ["Textarea"]],
  ["field", "field", ["Field"]],
  ["table", "table", ["Table", "TableHeader", "TableBody", "TableHead", "TableRow", "TableCell", "TableCaption"]],
  ["scrollArea", "scroll-area", ["ScrollArea"]],
  ["statusIndicator", "status-indicator", ["StatusIndicator"]],
  ["spinner", "spinner", ["Spinner"]],
  ["timeline", "timeline", ["Timeline"]],
  ["steps", "steps", ["Steps"]],
  ["rating", "rating", ["Rating"]],
  ["notification", "notification", ["Notification"]],
] as const;

function indexSource() {
  const imports = [
    `import type { ThemeSet } from "@/renderer/shared/themed";`,
    ...PUBLIC_MODULES.map(
    ([name, file]) => `import * as ${name} from "./components/ui/${file}";`,
    ),
  ].join("\n");
  const moduleRecords = PUBLIC_MODULES.map(([name]) => `const ${name}Set = ${name} as Partial<ThemeSet>;`).join("\n");
  const entries = PUBLIC_MODULES.flatMap(([name, , exports]) =>
    exports.map((exportName) => `  ${exportName}: ${name}Set.${exportName},`),
  ).join("\n");

  return `${imports}

${moduleRecords}

export const set: ThemeSet = {
${entries}
};
`;
}

function setName(slug: string) {
  return `${slug
    .split("-")
    .map((part, index) => (index === 0 ? part : `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`))
    .join("")}Set`;
}

async function main() {
  const root = process.cwd();

  for (const theme of BETTER_DESIGN_THEMES) {
    const dir = path.join(root, "src", "themes", theme.id);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "index.ts"), indexSource());
  }

  const imports = BETTER_DESIGN_THEMES.map(
    (theme) => `import { set as ${setName(theme.id)} } from "@/themes/${theme.id}";`,
  ).join("\n");
  const entries = BETTER_DESIGN_THEMES.map((theme) => `  "${theme.id}": ${setName(theme.id)},`).join("\n");
  await fs.writeFile(
    path.join(root, "src", "renderer", "shared", "ThemedShell.tsx"),
    `"use client";

import * as React from "react";
import { ThemeSetProvider, type ThemeSet } from "./themed";
${imports}

const THEME_SETS: Record<string, ThemeSet> = {
${entries}
};

export function ThemedShell({ theme, children }: { theme: string; children: React.ReactNode }) {
  return <ThemeSetProvider value={THEME_SETS[theme] ?? {}}>{children}</ThemeSetProvider>;
}
`,
  );

  console.log(`wrote ${BETTER_DESIGN_THEMES.length} theme modules`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
