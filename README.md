# Canvas Dock

Receive **OpenUI Lang** or **A2UI v0.8** payloads from a local AI, render them to a hosted web page, hand back the URL.

Use case: a local agent finishes a research task and wants to share the rendered report. It calls one of Canvas Dock's MCP tools and pastes the URL back into chat.

## Status

- ✅ Receives both **OpenUI Lang** (via `@openuidev/react-lang`) and **A2UI v0.8** payloads
- ✅ Hosts each page at `/p/<slug>` with TTL-based expiry
- ✅ MCP server at `/api/mcp` (Streamable HTTP)
- ✅ REST at `/api/pages`
- ✅ Settings UI with global defaults and project overrides
- ✅ 7 themes vendored: `default` (shadcn) plus `linear` / `vercel` / `notion` / `stripe` / `supabase` / `apple` from [better-design](https://github.com/marvkr/better-design). Refresh tokens any time with `pnpm fetch:themes`.
- ⚠️ Auth + tailscale serve: documented but not enforced

## Quickstart

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Visit `http://localhost:3000` for the dashboard. All runtime state lives under `./data/` (gitignored).

### Send a payload (REST)

```bash
curl -X POST http://localhost:3000/api/pages \
  -H 'content-type: application/json' \
  -d '{
    "kind": "a2ui",
    "title": "Demo",
    "theme": "default",
    "payload": {
      "messages": [
        { "type": "createSurface", "surfaceId": "main", "catalogId": "canvas-dock", "root": "root" },
        { "type": "updateComponents", "surfaceId": "main", "components": [
          { "id": "root", "type": "Column", "props": {"gap": 6}, "children": ["h", "s"] },
          { "id": "h", "type": "Heading", "props": {"level": 1, "text": "Hello"} },
          { "id": "s", "type": "Stat", "props": {"label": "Visitors", "value": 1024, "delta": "+12%", "trend": "up"} }
        ]}
      ]
    }
  }'
```

Response: `{ "slug": "...", "url": "http://localhost:3000/p/...", "expiresAt": "..." }`

### Connect from an MCP client

Streamable HTTP transport:

```
http://localhost:3000/api/mcp
```

Tools exposed:

| Tool | Purpose |
|---|---|
| `render_openui` | OpenUI Lang source → hosted URL |
| `render_a2ui` | A2UI v0.8 messages → hosted URL |
| `update_page` | Replace payload on existing slug |
| `delete_page` | Remove a hosted page |
| `list_pages` / `list_themes` / `list_projects` | Discovery |
| `validate_a2ui` | Type-check without storing — for self-correction loops |

Resources:

| URI | Content |
|---|---|
| `openui://spec/lang` | OpenUI Lang component reference |
| `a2ui://spec/v0.8` | A2UI v0.8 payload schema (Canvas Dock catalog) |
| `uihost://themes` | Available themes on this instance |

### Share over Tailscale

Canvas Dock doesn't manage Tailscale — keep that boundary clean. Run yourself:

```bash
tailscale serve --bg 3000
```

(or `tailscale funnel --bg 3000` to expose publicly).

## Project layout

```
src/
  app/
    page.tsx                  # dashboard
    p/[slug]/page.tsx         # hosted pages
    settings/                 # settings UI
    api/
      pages/                  # REST CRUD
      mcp/                    # MCP HTTP endpoint
      settings/               # settings REST
  components/app/             # app shell (shadcn-styled)
  lib/                        # config, store, themes
  renderer/
    openui/                   # @openuidev/react-lang library
    a2ui/                     # A2UI v0.8 renderer + zod schemas
    shared/primitives.tsx     # shared primitives used by both renderers
  mcp/                        # MCP server (specs + tools/resources)
themes/<slug>/theme.css       # vendored better-design tokens (.theme-<slug> scope)
scripts/fetch-themes.ts       # re-pull tokens from better-design.com
data/                         # runtime data — gitignored
```

## License

MIT
