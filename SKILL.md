---
name: canvas-dock
description: Render a hosted better-design UI page from OpenUI Lang or A2UI and return a shareable URL. Use whenever the user asks for a report, dashboard, summary, page, shareable URL, chart, KPI, table, or structured visual that should live at a URL instead of inline chat.
---

# Canvas Dock — render a better-design UI to a hosted URL

Canvas Dock takes an OpenUI Lang source string or A2UI payload over HTTP,
renders it with vendored better-design components, and serves the result at a
stable URL. POST the payload, get back `{ url }`, hand the URL to the user.

Canvas Dock must not invent UI components. The renderer catalog is restricted
to components backed by the better-design registry.

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
  "kind": "openui",
  "payload": "<OpenUI Lang source>",
  "title": "...",
  "theme": "...",
  "ttlSeconds": 86400
}
```

Response:

```json
{ "slug": "...", "url": "<BASE_URL>/p/...", "expiresAt": "..." | null }
```

---

## 3. OpenUI Lang

`payload` is a single string of source. Each line:

```
id = ComponentName(arg1, arg2, ...)
```

Syntax rules:

- Positional arguments only. Do not use `name: value`.
- A `root = ...` statement is required.
- Every defined id must be reachable from `root`.
- Reference another statement by writing its id bareword.
- One statement per line.

### Better-design component catalog

Only use these components:

| Component | Signature |
|---|---|
| `SectionHeader` | `SectionHeader(title, description?, size?)` where size is `sm`, `md`, or `lg` |
| `Card` | `Card(children, title?, description?)` |
| `Text` | `Text(text, variant?)` where variant is `p`, `lead`, `muted`, `large`, or `small` |
| `Heading` | `Heading(text, level?)` where level is `1`-`4` |
| `Quote` | `Quote(text)` |
| `Code` | `Code(text)` |
| `CodeBlock` | `CodeBlock(code, language?, filename?)` |
| `Button` | `Button(text, variant?, size?, href?, external?)` |
| `Badge` | `Badge(text, variant?, size?)` |
| `Alert` | `Alert(children, title?, variant?)` where variant is `default` or `destructive` |
| `Separator` | `Separator()` |
| `StatCard` | `StatCard(label, value, change?, trend?, description?)` where trend is `up`, `down`, or `neutral` |
| `DataTable` | `DataTable(columns, rows)` where columns are `{key, header, sortable?}` |
| `Chart` | `Chart(type, data, xKey?, yKey?, nameKey?, valueKey?, height?)` where type is `bar`, `line`, or `pie` |
| `Progress` | `Progress(value)` |
| `Empty` | `Empty(title, description?)` |
| `Avatar` | `Avatar(name, src?)` |
| `Kbd` | `Kbd(text)` |
| `Tabs` | `Tabs(items)` where items are `{label, content}` |
| `Accordion` | `Accordion(items)` where items are `{title, content}` |
| `Breadcrumb` | `Breadcrumb(items)` where items are `{text, href?}` |
| `Tooltip` | `Tooltip(text, hint)` |
| `Pagination` | `Pagination(current, total)` |
| `Skeleton` | `Skeleton(width?, height?)` |

Do not use `Stack`, `Grid`, `Container`, `Spacer`, `Hero`, `Image`, `Video`,
`Iframe`, `BulletList`, `NumberList`, `DefinitionList`, `Row`, `Column`, or
`List`. They are not in the better-design-backed catalog.

### Minimal example

```
root = Card([hdr, stat], "Demo", "better-design only")
hdr = SectionHeader("Hello", "Rendered with vendored better-design components", "lg")
stat = StatCard("Visitors", 1024, "+12%", "up")
```

---

## 4. Themes

Pass one as `theme`:

| id | source |
|---|---|
| `linear` | better-design |
| `vercel` | better-design |
| `notion` | better-design |
| `stripe` | better-design |
| `supabase` | better-design |
| `apple` | better-design |

Omit `theme` to use the instance default.

---

## 5. Better-design maintenance

The upstream usage is:

```
npx shadcn@latest add https://www.better-design.com/registry/<design-system>/<component>.json
```

Canvas Dock wraps that with:

```
pnpm install:better-design
```

That command installs the allowed better-design registry components into
`src/themes/<theme>/components/ui`.

---

## 6. Updating, deleting, listing

| Method + path | Purpose |
|---|---|
| `GET    $BASE_URL/api/pages` | list all hosted pages |
| `GET    $BASE_URL/api/pages/<slug>` | fetch a page record |
| `PATCH  $BASE_URL/api/pages/<slug>` body `{ payload }` | replace content in place |
| `DELETE $BASE_URL/api/pages/<slug>` | remove |

---

## 7. Errors

HTTP 400 returns `{ error, issues: [...] }`.

Common failures:

- Used colon syntax in OpenUI args.
- Used a removed Canvas Dock component such as `Stack`, `Grid`, or `Hero`.
- Missing `root = ...`.
- Required argument missing.
