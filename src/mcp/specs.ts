// Inline spec documentation served via MCP resources.
// Kept short so the LLM can pull the full text and still afford the cost.

export const OPENUI_SPEC = `# Canvas Dock — OpenUI Lang component library

Canvas Dock renders OpenUI Lang into a hosted report URL. Use the library below.
Compose with line-oriented assignments: \`id = ComponentName(arg1, arg2, ...)\`.

CRITICAL: OpenUI Lang uses POSITIONAL arguments only. Do NOT use \`name: value\`
colon syntax — it silently breaks. Each component's signature below shows the
positional order; trailing optional args may be omitted.

## Components

- Stack(children, direction?, gap?, align?, justify?, wrap?)
  - children: [id, id, ...]
  - direction: "row" | "column" (default "column")
  - gap: 0..16 (default 4)
  - align: "start" | "center" | "end" | "stretch" (default "stretch")
  - justify: "start" | "center" | "end" | "between" (default "start")
  - wrap: boolean (row layouts wrap by default)
- Heading(text, level?)            level ∈ 1|2|3|4 (default 2)
- Text(text, muted?)               muted: boolean
- Card(children, title?, description?)
- Stat(label, value, delta?, trend?)    trend ∈ "up"|"down"|"flat"
- Chart(type, data, xKey?, yKey?, nameKey?, valueKey?, height?)
  - type ∈ "bar"|"line"|"pie"; data=[{...}]; yKey is string or [string,...]
- Table(columns, rows)             columns=[{key,label,align?}], rows=[{...}]
- Divider()
- Badge(text, tone?)               tone ∈ "default"|"success"|"warn"|"error"

## Example

root = Stack([hdr, kpis, sales, table], "column", 6)
hdr = Heading("Q2 Sales", 1)
kpis = Stack([s1, s2, s3], "row", 4)
s1 = Stat("Revenue", "$1.2M", "+12%", "up")
s2 = Stat("New Customers", 312, "+8%", "up")
s3 = Stat("Churn", "2.1%", "-0.4pp", "down")
sales = Card([chart], "Monthly")
chart = Chart("bar", [{name: "Jan", value: 32}, {name: "Feb", value: 41}], "name", "value")
table = Table([{key: "region", label: "Region"}, {key: "amount", label: "Amount", align: "right"}], [{region: "JP", amount: "$420k"}])
`;

export const A2UI_SPEC = `# Canvas Dock — A2UI v0.8 payload

A2UI payload is { messages: [...] }. Send messages in order. Surface ids are arbitrary strings.

## Messages

- { type: "createSurface", surfaceId: "main", catalogId: "canvas-dock", root: "<rootComponentId>" }
- { type: "updateComponents", surfaceId: "main", components: [{id, type, props, children?: [ids]}] }
- { type: "updateDataModel", surfaceId: "main", path: "/", value: {...} }      // path defaults to "/"
- { type: "deleteSurface", surfaceId: "main" }

## Component types (Canvas Dock catalog "canvas-dock")

- Text({text, muted?})
- Heading({level: 1|2|3|4, text})
- Column({gap?, align?, justify?})            — children stack vertically
- Row({gap?, align?, justify?, wrap?})         — children stack horizontally
- List({})                                     — children rendered as bullet list
- Card({title?, description?})
- Stat({label, value, delta?, trend?})
- Chart({type: "bar"|"line"|"pie", data, xKey?, yKey?, nameKey?, valueKey?, height?})
- Table({columns: [{key,label,align?}], rows: [{...}]})
- Divider({})
- Badge({text, tone?})
- Image({src, alt?})

Any prop value may be either a literal, or a binding object:
  { literal: ... }   — explicit literal value
  { path: "/foo/bar" } — JSON Pointer into the data model

## Example

{
  "messages": [
    { "type": "createSurface", "surfaceId": "main", "catalogId": "canvas-dock", "root": "root" },
    { "type": "updateDataModel", "surfaceId": "main", "value": { "revenue": "$1.2M" } },
    { "type": "updateComponents", "surfaceId": "main", "components": [
      { "id": "root", "type": "Column", "props": {"gap": 6}, "children": ["title", "rev"] },
      { "id": "title", "type": "Heading", "props": {"level": 1, "text": "Q2 Sales"} },
      { "id": "rev", "type": "Stat", "props": {"label": "Revenue", "value": {"path": "/revenue"}} }
    ]}
  ]
}
`;
