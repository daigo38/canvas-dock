import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createPage, deletePage, listPages, updatePagePayload } from "@/lib/store";
import { getProject, listProjects, readGlobalConfig } from "@/lib/config";
import { isValidThemeId, THEMES } from "@/lib/themes";
import { A2UIPayloadSchema } from "@/renderer/a2ui/schema";
import { OPENUI_SPEC, A2UI_SPEC } from "./specs";

const RENDER_OPENUI_DESC = `Render OpenUI Lang text into a hosted Canvas Dock page and return a URL.

Use this when an AI agent has finished assembling a report/dashboard as OpenUI Lang
and wants to give the user a shareable URL. OpenUI Lang is a line-oriented format:
\`id = ComponentName(arg1, arg2, ...)\`. A page must have a \`root = ...\`.

Available components are limited to better-design-backed entries such as
SectionHeader, Card, Text, Heading, Button, Badge, Alert, StatCard, DataTable,
Chart, Progress, Empty, Avatar, Tabs, Accordion, Breadcrumb, Tooltip,
Pagination, Skeleton, Input, Field, SimpleTable, ScrollArea, StatusIndicator,
Timeline, Steps, Rating, Notification. Do not use Stack, Grid, Hero, Image,
Video, or Iframe.
Full grammar at resource \`openui://spec/lang\`.`;

const RENDER_A2UI_DESC = `Render an A2UI v0.8 payload into a hosted Canvas Dock page and return a URL.

Payload shape: { messages: [...] } where messages are { type: "createSurface" |
"updateComponents" | "updateDataModel" | "deleteSurface", ... }. Component types
in the canvas-dock catalog are limited to better-design-backed entries:
SectionHeader, Card, Text, Heading, Button, Badge, Alert, StatCard, DataTable,
Chart, Progress, Empty, Avatar, Kbd, Code, CodeBlock, Separator. Props may be literals or binding objects
{ literal: ... } / { path: "/..." }. Full schema at resource \`a2ui://spec/v0.8\`.`;

export function buildMcpServer(origin: string) {
  const server = new McpServer({
    name: "canvas-dock",
    version: "0.1.0",
  });

  // --- Tools -------------------------------------------------------------

  server.registerTool(
    "render_openui",
    {
      title: "Render OpenUI Lang",
      description: RENDER_OPENUI_DESC,
      inputSchema: {
        source: z.string().describe("OpenUI Lang code. Must define a `root = ...` line."),
        project: z.string().optional().describe("Project id to inherit theme/TTL from."),
        theme: z.string().optional().describe("Theme id override (see list_themes)."),
        title: z.string().optional(),
        ttlSeconds: z.number().int().positive().nullable().optional(),
      },
    },
    async ({ source, project, theme, title, ttlSeconds }) => {
      const url = await renderAndStore("openui", source, { project, theme, title, ttlSeconds }, origin);
      return { content: [{ type: "text", text: url }] };
    },
  );

  server.registerTool(
    "render_a2ui",
    {
      title: "Render A2UI v0.8",
      description: RENDER_A2UI_DESC,
      inputSchema: {
        payload: z.unknown().describe("A2UI payload: { messages: [...] }."),
        project: z.string().optional(),
        theme: z.string().optional(),
        title: z.string().optional(),
        ttlSeconds: z.number().int().positive().nullable().optional(),
      },
    },
    async ({ payload, project, theme, title, ttlSeconds }) => {
      const parsed = A2UIPayloadSchema.safeParse(payload);
      if (!parsed.success) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Invalid A2UI payload:\n${JSON.stringify(parsed.error.issues, null, 2)}`,
            },
          ],
        };
      }
      const url = await renderAndStore("a2ui", parsed.data, { project, theme, title, ttlSeconds }, origin);
      return { content: [{ type: "text", text: url }] };
    },
  );

  server.registerTool(
    "update_page",
    {
      title: "Update hosted page payload",
      description: "Replace the payload of an existing slug. Returns the URL (unchanged).",
      inputSchema: {
        slug: z.string(),
        payload: z.unknown(),
      },
    },
    async ({ slug, payload }) => {
      const rec = await updatePagePayload(slug, payload);
      if (!rec) {
        return { isError: true, content: [{ type: "text", text: `Not found: ${slug}` }] };
      }
      return { content: [{ type: "text", text: `${origin}/p/${slug}` }] };
    },
  );

  server.registerTool(
    "delete_page",
    {
      title: "Delete hosted page",
      description: "Remove a hosted page by slug.",
      inputSchema: { slug: z.string() },
    },
    async ({ slug }) => {
      const ok = await deletePage(slug);
      return { content: [{ type: "text", text: ok ? "ok" : "not_found" }] };
    },
  );

  server.registerTool(
    "list_themes",
    {
      title: "List available themes",
      description: "Return the themes this Canvas Dock instance can render with.",
      inputSchema: {},
    },
    async () => ({
      content: [{ type: "text", text: JSON.stringify(THEMES, null, 2) }],
    }),
  );

  server.registerTool(
    "list_projects",
    {
      title: "List projects",
      description: "Return all configured projects (theme/TTL overrides).",
      inputSchema: {},
    },
    async () => ({
      content: [{ type: "text", text: JSON.stringify(await listProjects(), null, 2) }],
    }),
  );

  server.registerTool(
    "list_pages",
    {
      title: "List hosted pages",
      description: "Return all currently hosted page records.",
      inputSchema: {},
    },
    async () => {
      const pages = await listPages();
      const summary = pages.map((p) => ({
        slug: p.slug,
        kind: p.kind,
        theme: p.theme,
        title: p.title,
        url: `${origin}/p/${p.slug}`,
        createdAt: p.createdAt,
        expiresAt: p.expiresAt,
      }));
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    },
  );

  server.registerTool(
    "validate_a2ui",
    {
      title: "Validate A2UI payload",
      description: "Type-check an A2UI payload without storing it. Returns ok or zod issues for self-correction.",
      inputSchema: { payload: z.unknown() },
    },
    async ({ payload }) => {
      const parsed = A2UIPayloadSchema.safeParse(payload);
      if (parsed.success) {
        return { content: [{ type: "text", text: JSON.stringify({ ok: true }) }] };
      }
      return { content: [{ type: "text", text: JSON.stringify({ ok: false, issues: parsed.error.issues }, null, 2) }] };
    },
  );

  // --- Resources ---------------------------------------------------------

  server.registerResource(
    "openui-spec-lang",
    "openui://spec/lang",
    { title: "OpenUI Lang component reference", mimeType: "text/markdown" },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: OPENUI_SPEC }] }),
  );

  server.registerResource(
    "a2ui-spec-v08",
    "a2ui://spec/v0.8",
    { title: "A2UI v0.8 — Canvas Dock catalog", mimeType: "text/markdown" },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: A2UI_SPEC }] }),
  );

  server.registerResource(
    "canvas-dock-themes",
    "uihost://themes",
    { title: "Available themes", mimeType: "application/json" },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(THEMES, null, 2) }],
    }),
  );

  return server;
}

async function renderAndStore(
  kind: "openui" | "a2ui",
  payload: unknown,
  opts: { project?: string; theme?: string; title?: string; ttlSeconds?: number | null },
  origin: string,
): Promise<string> {
  const config = await readGlobalConfig();
  const projectCfg = opts.project ? await getProject(opts.project) : null;
  const resolvedTheme = opts.theme ?? projectCfg?.theme ?? config.defaultTheme;
  if (!isValidThemeId(resolvedTheme)) {
    throw new Error(`unknown_theme: ${resolvedTheme}`);
  }
  const ttl = opts.ttlSeconds ?? projectCfg?.ttlSeconds ?? config.defaultTtlSeconds;
  const rec = await createPage({
    kind,
    project: opts.project,
    theme: resolvedTheme,
    title: opts.title,
    payload,
    ttlSeconds: ttl,
  });
  return `${origin}/p/${rec.slug}`;
}
