---
name: canvas-dock
description: Render a hosted report/dashboard/visualization page from OpenUI Lang (default) or A2UI v0.8 by POSTing to a local Canvas Dock instance, and return a shareable URL. Use whenever the user asks for a "report", "dashboard", "page", "shareable URL", visual summary, chart, KPI tile, or anything that should live at a URL instead of inline chat. Requires a running Canvas Dock instance.
---

# Canvas Dock — render a UI to a hosted URL

Canvas Dock is a tiny local web app that accepts a UI payload over plain HTTP,
renders it server-side to React, and serves the result at a stable URL like
`<BASE_URL>/p/<slug>`. Hand the URL back to the user — they open it in any
browser (or it auto-installs as a PWA on phone).

Two payload formats are supported: **OpenUI Lang** (default — terse,
line-oriented) and **A2UI v0.8** (JSON message stream — choose when you need
data binding or incremental updates).

---

## 1. Define `BASE_URL` first

Every endpoint in this skill is rooted at one host. **Set this once at the
start of your session and reuse it for every request.**

```bash
# Local default:
BASE_URL="http://localhost:10003"

# Or a tailscale hostname the user gave you, e.g.:
# BASE_URL="https://mac-mini.example.ts.net:10003"
```

If you don't know which to use, ask the user. From here on every example
references `$BASE_URL` — substitute the configured value, never hardcode
`localhost:10003`.

Quick reachability check before doing real work:

```bash
curl -fsS "$BASE_URL/api/pages" > /dev/null && echo "ok"
```

---

## 2. POST a page

```
POST $BASE_URL/api/pages
Content-Type: application/json
```

### Request body

```ts
{
  kind: "openui" | "a2ui",      // default: "openui"
  payload: string | object,      // OpenUI Lang source (string) or A2UI envelope (object)
  title?: string,                // shown in browser tab
  theme?: string,                // see "Themes" below; defaults to instance default
  project?: string,              // optional project id (inherits theme/TTL)
  ttlSeconds?: number | null     // expiry seconds; null = never
}
```

### Response

```json
{
  "slug": "u8QmLZMfSj",
  "url": "<BASE_URL>/p/u8QmLZMfSj",
  "expiresAt": "2026-06-01T11:01:54Z"
}
```

Give the user `url`. That's it.

---

## 3. Default path: OpenUI Lang

Set `kind: "openui"`. `payload` is a single string of OpenUI Lang source.

### ⚠️ Critical syntax rule

OpenUI Lang uses **positional arguments only**. Each component's signature
specifies the order — trailing optional args may be omitted.

✅ `Stack([hdr, body], "row", 4)`
❌ `Stack(direction: "row", children: [hdr, body])` — **colon syntax silently breaks**

Other rules:
- Each line: `id = ComponentName(arg1, arg2, ...)` (whitespace around `=`)
- Must have a `root = ...` line; that's where the page renders from
- Every defined `id` must be referenced from somewhere reachable by `root` — orphans are silently dropped
- Strings use double quotes. Arrays use `[...]`. Inline object literals use `{key: value, ...}` (commas separate fields)
- Reference another statement by writing its id bareword — no quotes

### Component library

| Component | Signature | Notes |
|---|---|---|
| `Stack` | `Stack(children, direction?, gap?, align?, justify?, wrap?)` | container. direction ∈ `row`/`column` (default column). gap 0–16. row layouts wrap by default on mobile |
| `Heading` | `Heading(text, level?)` | level 1–4, default 2 |
| `Text` | `Text(text, muted?)` | muted=true → secondary color |
| `Card` | `Card(children, title?, description?)` | bordered tile |
| `Stat` | `Stat(label, value, delta?, trend?)` | KPI. trend ∈ `up`/`down`/`flat` |
| `Chart` | `Chart(type, data, xKey?, yKey?, nameKey?, valueKey?, height?)` | type ∈ `bar`/`line`/`pie` |
| `Table` | `Table(columns, rows)` | columns=[{key,label,align?}], rows=[{...}] |
| `Divider` | `Divider()` | hr |
| `Badge` | `Badge(text, tone?)` | tone ∈ `default`/`success`/`warn`/`error` |

### Example 1 — minimal page

```bash
curl -X POST "$BASE_URL/api/pages" \
  -H 'content-type: application/json' \
  -d '{
    "kind": "openui",
    "title": "Hello",
    "payload": "root = Heading(\"Hello, world\", 1)"
  }'
```

### Example 2 — KPI dashboard

Source:

```
root = Stack([h, kpis, byRegion], "column", 6)
h = Heading("Q2 Sales", 1)
kpis = Stack([s1, s2, s3], "row", 4)
s1 = Stat("Revenue", "$1.24M", "+12%", "up")
s2 = Stat("New customers", 312, "+8%", "up")
s3 = Stat("Churn", "2.1%", "-0.4pp", "down")
byRegion = Card([chart], "By region")
chart = Chart("bar", [{name: "JP", value: 420}, {name: "US", value: 510}, {name: "EU", value: 310}], "name", "value")
```

POSTed:

```json
{
  "kind": "openui",
  "title": "Q2 Sales",
  "theme": "stripe",
  "payload": "root = Stack([h, kpis, byRegion], \"column\", 6)\nh = Heading(\"Q2 Sales\", 1)\nkpis = Stack([s1, s2, s3], \"row\", 4)\ns1 = Stat(\"Revenue\", \"$1.24M\", \"+12%\", \"up\")\ns2 = Stat(\"New customers\", 312, \"+8%\", \"up\")\ns3 = Stat(\"Churn\", \"2.1%\", \"-0.4pp\", \"down\")\nbyRegion = Card([chart], \"By region\")\nchart = Chart(\"bar\", [{name: \"JP\", value: 420}, {name: \"US\", value: 510}, {name: \"EU\", value: 310}], \"name\", \"value\")"
}
```

### Example 3 — report with table

```
root = Stack([h, intro, t, foot], "column", 6)
h = Heading("Vendor scorecard", 1)
intro = Text("Top 5 suppliers, ranked by on-time delivery rate over the last 90 days.", true)
t = Table([{key: "name", label: "Vendor"}, {key: "onTime", label: "On-time %", align: "right"}, {key: "incidents", label: "Incidents", align: "right"}], [{name: "Acme", onTime: "98%", incidents: 2}, {name: "Globex", onTime: "94%", incidents: 5}, {name: "Initech", onTime: "91%", incidents: 7}, {name: "Soylent", onTime: "88%", incidents: 9}, {name: "Umbrella", onTime: "76%", incidents: 18}])
foot = Text("Source: shipments table, query run 2026-05-25.", true)
```

---

## 4. Alternative: A2UI v0.8

Use when you need fine-grained data binding (JSON Pointer references), or
plan to push incremental updates to the same page over time.

Set `kind: "a2ui"`. `payload` is an object:

```bash
curl -X POST "$BASE_URL/api/pages" \
  -H 'content-type: application/json' \
  -d '{
    "kind": "a2ui",
    "title": "Q2 Sales",
    "payload": {
      "messages": [
        { "type": "createSurface", "surfaceId": "main", "catalogId": "canvas-dock", "root": "root" },
        { "type": "updateDataModel", "surfaceId": "main", "value": { "revenue": "$1.24M" } },
        { "type": "updateComponents", "surfaceId": "main", "components": [
          { "id": "root", "type": "Column", "props": {"gap": 6}, "children": ["h", "rev"] },
          { "id": "h", "type": "Heading", "props": {"level": 1, "text": "Q2 Sales"} },
          { "id": "rev", "type": "Stat", "props": {"label": "Revenue", "value": {"path": "/revenue"}} }
        ]}
      ]
    }
  }'
```

Component types: `Text`, `Heading`, `Row`, `Column`, `List`, `Card`, `Stat`,
`Chart`, `Table`, `Divider`, `Badge`, `Image`.

Any prop value may be a literal or a binding object:
- `{ "literal": ... }` — explicit literal
- `{ "path": "/foo/bar" }` — JSON Pointer into the data model

Incremental update later: `PATCH $BASE_URL/api/pages/<slug>` body
`{ payload: <new messages> }`.

---

## 5. Themes

Pass one as `theme`:

| id | look |
|---|---|
| `default` | shadcn light |
| `linear` | dark, purple primary |
| `vercel` | mono dark |
| `notion` | warm light |
| `stripe` | blue light |
| `supabase` | dark, green accents |
| `apple` | bright, rounded |

Omit `theme` to use the instance default (settable in the dashboard).

---

## 6. Projects

If the user organizes work into "projects" (e.g. one per agent or use case),
pass `project: "<id>"` and Canvas Dock will inherit that project's theme +
TTL overrides. Discover them with `GET $BASE_URL/api/settings/projects`.

---

## 7. Other endpoints

All relative to `$BASE_URL`.

| Method + path | Purpose |
|---|---|
| `GET /api/pages` | list all hosted pages |
| `GET /api/pages/<slug>` | fetch a page record (payload + metadata) |
| `PATCH /api/pages/<slug>` body `{ payload }` | replace content in place; URL stays |
| `DELETE /api/pages/<slug>` | remove now |
| `GET /api/settings` | read instance global config (default theme, TTL, auth) |
| `GET /api/settings/projects` | list projects |

---

## 8. Self-correction

On `HTTP 400` the response body is `{ error, issues: [...] }` where `issues`
is a Zod issue array. Common causes:

- **OpenUI Lang colon syntax** — rewrite as positional
- **Unknown component name** — check the table above; matches are case-sensitive
- **Missing `root`** — OpenUI Lang needs `root = ...`
- **`children` field is not an array of ids** — wrap in `[id1, id2]`
- **A2UI: surface/component id mismatch** — every `children: ["x"]` must reference a component with `id: "x"`

Try once with corrections; if it still fails, hand the error back to the user.

---

## Quick checklist before posting

- [ ] `BASE_URL` is set
- [ ] `kind: "openui"` unless the user explicitly wants A2UI
- [ ] OpenUI Lang uses positional args, has a `root = ...` line, every id is referenced
- [ ] `title` set so the browser tab is meaningful
- [ ] (Optional) `theme` chosen to match the content tone
- [ ] (Optional) `ttlSeconds` set if the page should outlive the default 7 days

Then `POST $BASE_URL/api/pages` and hand the returned `url` to the user.
