# Canvas Dock

Receive **OpenUI Lang** or **A2UI v0.8** payloads from a local AI, render them to a hosted web page, hand back the URL.

Use case: a local agent finishes a research task and wants to share the rendered report. It calls one of Canvas Dock's MCP tools and pastes the URL back into chat.

## Status

- ✅ Receives both **OpenUI Lang** (via `@openuidev/react-lang`) and **A2UI v0.8** payloads
- ✅ Hosts each page at `/p/<slug>` with TTL-based expiry
- ✅ MCP server at `/api/mcp` (Streamable HTTP)
- ✅ REST at `/api/pages`
- ✅ Settings UI with global defaults and project overrides
- ✅ 45 better-design themes vendored from the registry catalog. `halo` and `haptic` are excluded because their registry component URLs currently return 404.
- ✅ Render catalog is restricted to better-design-backed components; no Canvas Dock UI fallback.
- ✅ Additional better-design adapters include inputs, fields, table primitives, scroll area, status, timeline, steps, rating, and notifications.
- ✅ Repository preset pages include one component gallery and one gallery for each vendored theme.
- ✅ Refresh better-design components with `pnpm install:better-design`; refresh tokens with `pnpm fetch:themes`.
- ⚠️ Auth + tailscale serve: documented but not enforced

## Quickstart

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Visit `http://localhost:3000` for the dashboard. All runtime state lives under `./data/` (gitignored).

### Preset pages

These pages are bundled in the repository and are available without creating
records under `data/pages`:

| Slug | Page |
|---|---|
| `preset-components` | Component gallery |
| `preset-theme-<theme-id>` | Theme gallery for every vendored better-design theme |

Use `list_themes` or `GET /api/mcp` resources from an MCP client to discover
the current theme IDs. The source of truth is `BETTER_DESIGN_THEMES` in
`src/lib/betterDesignCatalog.ts`.

### Send a payload (REST)

```bash
curl -X POST http://localhost:3000/api/pages \
  -H 'content-type: application/json' \
  -d '{
    "kind": "a2ui",
    "title": "Demo",
    "theme": "vercel",
    "payload": {
      "messages": [
        { "type": "createSurface", "surfaceId": "main", "catalogId": "canvas-dock", "root": "root" },
        { "type": "updateComponents", "surfaceId": "main", "components": [
          { "id": "root", "type": "Card", "props": {"title": "Demo"}, "children": ["h", "s"] },
          { "id": "h", "type": "SectionHeader", "props": {"title": "Hello", "size": "lg"} },
          { "id": "s", "type": "StatCard", "props": {"label": "Visitors", "value": 1024, "change": "+12%", "trend": "up"} }
        ]}
      ]
    }
  }'
```

Response: `{ "slug": "...", "url": "http://localhost:3000/p/...", "expiresAt": "..." }`

### Render the component gallery

`samples/gallery.openui` is a tour of the supported better-design-backed OpenUI
Lang catalog. POST it to your running instance to get a single page that shows
the components in context:

```bash
BASE_URL="http://localhost:3000"

# With jq:
jq -Rs --arg title "Canvas Dock — Component Gallery" \
   '{kind:"openui", title:$title, payload:.}' \
   samples/gallery.openui \
  | curl -X POST "$BASE_URL/api/pages" \
      -H 'content-type: application/json' \
      --data-binary @-

# Or with Node (no jq required):
node -e "console.log(JSON.stringify({kind:'openui',title:'Canvas Dock — Component Gallery',payload:require('fs').readFileSync('samples/gallery.openui','utf8')}))" \
  | curl -X POST "$BASE_URL/api/pages" \
      -H 'content-type: application/json' \
      --data-binary @-
```

The response body has the URL — open it to see every component in context.

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
    shared/themed.tsx         # better-design-only render adapter; no local UI fallback
  mcp/                        # MCP server (specs + tools/resources)
src/themes/<slug>/components/ui/  # vendored better-design TSX components
src/themes/<slug>/theme.css       # vendored better-design tokens (.theme-<slug> scope)
scripts/install-better-design.ts  # run shadcn add against better-design registry URLs
scripts/fetch-themes.ts           # re-pull tokens from better-design.com
data/                         # runtime data — gitignored
```

## License

MIT
