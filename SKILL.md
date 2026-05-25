---
name: canvas-dock
description: Render a hosted UI page from OpenUI Lang and return a shareable URL. Use whenever the user asks for a report, dashboard, summary, page, shareable URL, chart, KPI, table, or any structured visual that should live at a URL instead of inline chat.
---

# Canvas Dock — render a UI to a hosted URL

Canvas Dock takes an OpenUI Lang source string over HTTP, renders it to React
server-side, and serves the result at a stable URL. POST the payload, get back
`{ url }`, hand the URL to the user.

---

## 1. BASE_URL

Set once at the start of the session.

```
BASE_URL = root URL of the Canvas Dock instance the user is running
```

Ask the user if you don't have it. Every endpoint below is relative to it.

---

## 2. Create a page

```
POST $BASE_URL/api/pages
Content-Type: application/json

{
  "kind": "openui",              // required; default path
  "payload": "<OpenUI Lang source>",
  "title": "...",                // optional; browser tab title
  "theme": "...",                // optional; see §4
  "ttlSeconds": 86400            // optional; null = never expire
}
```

Response:

```json
{ "slug": "...", "url": "<BASE_URL>/p/...", "expiresAt": "..." | null }
```

Hand `url` to the user.

Errors: HTTP 400 → `{ "error": "...", "issues": [...zod issues] }`. See §6.

---

## 3. OpenUI Lang

`payload` is a single string of source. Each line: `id = ComponentName(arg1, arg2, ...)`.

### Syntax rules

- **Positional arguments only.** ✅ `Stack([a, b], "row", 4)` ❌ `Stack(direction: "row", children: [a, b])` (colon syntax silently breaks).
- Trailing optional args may be omitted; pass `null` to skip an optional arg in the middle of the list.
- A `root = ...` statement is required.
- Every defined id must be reachable from `root`; orphans are silently dropped.
- Strings: double-quoted with backslash escapes. Numbers, booleans, `null` are bare.
- Arrays: `[v, v, ...]`. Inline object literals: `{key: value, key: value}`.
- Reference another statement by writing its id bareword (no quotes).
- One statement per line.

### Component reference

39 components organized into 6 groups. Names are case-sensitive. Optional
arguments are followed by `?` in the signature.

Interactive components (Button, Tabs, Accordion, Pagination, Tooltip,
Breadcrumb) render statically — they look correct but don't run client-side
behavior. Form inputs (text fields, checkboxes, selects) are intentionally
omitted because the rendered page is static; for data capture, send the user
to a different tool.

#### Layout (7)

| Component | Signature |
|---|---|
| `Stack` | `Stack(children, direction?, gap?, align?, justify?, wrap?)` — direction ∈ `row`/`column` (default `column`). gap 0–16 (default 4). align ∈ `start`/`center`/`end`/`stretch` (default `stretch`). justify ∈ `start`/`center`/`end`/`between` (default `start`). Row layouts wrap by default on mobile. |
| `Container` | `Container(children, size?)` — centered max-width wrapper. size ∈ `sm`/`md`/`lg`/`xl`/`2xl`/`full` (default `lg`). |
| `Grid` | `Grid(children, columns?, gap?)` — responsive grid. columns 1–6 (default 2). gap 0–16 (default 4). |
| `Spacer` | `Spacer(size?, axis?)` — empty space. size 0–16 (default 4). axis ∈ `vertical`/`horizontal` (default `vertical`). |
| `AspectRatio` | `AspectRatio(children, ratio?)` — ratio ∈ `16:9`/`4:3`/`1:1`/`3:2`/`21:9` (default `16:9`). |
| `ScrollArea` | `ScrollArea(children, maxHeight?)` — scrollable region. maxHeight px (default 480). |
| `Divider` | `Divider()` — horizontal rule. |

#### Typography (8)

| Component | Signature |
|---|---|
| `Heading` | `Heading(text, level?)` — level ∈ `1`/`2`/`3`/`4` (default `2`). |
| `Text` | `Text(text, muted?)` — muted=true → secondary color. |
| `Lead` | `Lead(text)` — larger intro paragraph. |
| `Quote` | `Quote(text, cite?)` — blockquote. |
| `Code` | `Code(text)` — inline code. |
| `CodeBlock` | `CodeBlock(text, language?)` — block code. language is a CSS class hint, no actual highlighting. |
| `Link` | `Link(text, href, external?)` — external=true opens in new tab. |
| `Kbd` | `Kbd(text)` — keyboard key. |

#### Surfaces (6)

| Component | Signature |
|---|---|
| `Card` | `Card(children, title?, description?)` — bordered tile. |
| `Alert` | `Alert(children, title?, variant?)` — variant ∈ `info`/`warn`/`error`/`success` (default `info`). |
| `Badge` | `Badge(text, tone?)` — tone ∈ `default`/`success`/`warn`/`error` (default `default`). |
| `Avatar` | `Avatar(name, src?, size?)` — initials fallback if no src. size ∈ `sm`/`md`/`lg` (default `md`). |
| `Hero` | `Hero(title, subtitle?, children?)` — large header block. |
| `EmptyState` | `EmptyState(title, description?, icon?, children?)` — icon is an emoji string. |

#### Data display (8)

| Component | Signature |
|---|---|
| `Stat` | `Stat(label, value, delta?, trend?)` — KPI tile. value: string or number. trend ∈ `up`/`down`/`flat`. |
| `Chart` | `Chart(type, data, xKey?, yKey?, nameKey?, valueKey?, height?)` — type ∈ `bar`/`line`/`pie`. data=[{...}]. yKey: string or [string,...] for multi-series. nameKey/valueKey: pie only. height 120–720 (default 280). |
| `Table` | `Table(columns, rows)` — columns=[{key, label, align?}] (align ∈ `left`/`right`/`center`). rows=[{[k]:v}]. |
| `BulletList` | `BulletList(items)` — items: array of strings. |
| `NumberList` | `NumberList(items)` — items: array of strings. |
| `DefinitionList` | `DefinitionList(items)` — items=[{term, definition}]. |
| `Progress` | `Progress(value, label?)` — value 0–100. |
| `Timeline` | `Timeline(items)` — items=[{date, title, description?}]. |

#### Interactive — statically rendered (7)

| Component | Signature |
|---|---|
| `Button` | `Button(text, variant?, size?, href?, external?)` — variant ∈ `default`/`secondary`/`outline`/`ghost`/`destructive`/`link`. size ∈ `sm`/`md`/`lg`. href→renders as anchor. |
| `Tabs` | `Tabs(items)` — items=[{label, content}]. content is a component id reference. Only the first tab's content is shown. |
| `Accordion` | `Accordion(items, defaultOpen?)` — items=[{title, content}]. content is a component id reference. Uses native `<details>`; defaultOpen (default true). |
| `Breadcrumb` | `Breadcrumb(items)` — items=[{text, href?}]. |
| `Tooltip` | `Tooltip(text, hint)` — text with browser-native hover hint. |
| `Pagination` | `Pagination(current, total)` — static page numbers. |
| `Skeleton` | `Skeleton(width?, height?, count?)` — loading placeholder bars. |

#### Media (3)

| Component | Signature |
|---|---|
| `Image` | `Image(src, alt?, rounded?, width?, height?)` — rounded default true. |
| `Video` | `Video(src, poster?, autoplay?, loop?)` — always rendered with controls. |
| `Iframe` | `Iframe(src, title?, height?)` — external embed. height in pixels (default 400). |

### Minimal example

```json
{
  "kind": "openui",
  "title": "Hi",
  "payload": "root = Stack([h, b], \"column\", 4)\nh = Heading(\"Hello\", 1)\nb = Text(\"World\")"
}
```

---

## 4. Themes

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

Omit `theme` to use the instance default.

---

## 5. Updating, deleting, listing

| Method + path | Purpose |
|---|---|
| `GET    $BASE_URL/api/pages` | list all hosted pages |
| `GET    $BASE_URL/api/pages/<slug>` | fetch a page record (full payload + metadata) |
| `PATCH  $BASE_URL/api/pages/<slug>` body `{ payload }` | replace content in place; URL stays |
| `DELETE $BASE_URL/api/pages/<slug>` | remove |

---

## 6. Errors

HTTP 400 → response body is `{ error, issues: [...] }` (Zod issue array).
Common failures:

- Used colon syntax (`name: value` in component args) — rewrite as positional.
- Unknown component name — must match the reference above exactly (case-sensitive).
- Missing `root = ...` line.
- `children` is not an array of ids — wrap in `[id1, id2]`.
- Required arg missing — check the signature.

Fix once and retry; if it still fails, hand the error back to the user.
