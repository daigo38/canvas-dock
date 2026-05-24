// Inline spec documentation served via MCP resources.
// Kept short so the LLM can pull the full text and still afford the cost.

export const OPENUI_SPEC = `# Canvas Dock — OpenUI Lang component library

Canvas Dock renders OpenUI Lang into a hosted report URL. Use the library below.
Compose with line-oriented assignments: \`id = ComponentName(propA: ..., propB: ...)\`.

## Components

- Stack({direction: "row" | "column" = "column", gap: 0-16 = 4, align, justify, wrap, children: [ids]})
- Heading({level: 1 | 2 | 3 | 4 = 2, text: string})
- Text({text: string, muted: boolean = false})
- Card({title?: string, description?: string, children: [ids]})
- Stat({label: string, value: string | number, delta?: string, trend?: "up" | "down" | "flat"})
- Chart({type: "bar" | "line" | "pie", data: [{...}], xKey?, yKey?: string | string[], nameKey?, valueKey?, height? = 280})
- Table({columns: [{key, label, align?}], rows: [{...}]})
- Divider({})
- Badge({text: string, tone?: "default" | "success" | "warn" | "error"})

## Example

root = Stack(children: [hdr, kpis, sales, table])
hdr = Heading(level: 1, text: "Q2 Sales")
kpis = Stack(direction: "row", gap: 4, children: [s1, s2, s3])
s1 = Stat(label: "Revenue", value: "$1.2M", delta: "+12%", trend: "up")
s2 = Stat(label: "New Customers", value: 312, delta: "+8%", trend: "up")
s3 = Stat(label: "Churn", value: "2.1%", delta: "-0.4pp", trend: "down")
sales = Card(title: "Monthly", children: [chart])
chart = Chart(type: "bar", data: [{name: "Jan", value: 32}, {name: "Feb", value: 41}], xKey: "name", yKey: "value")
table = Table(columns: [{key: "region", label: "Region"}, {key: "amount", label: "Amount", align: "right"}], rows: [{region: "JP", amount: "$420k"}])
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
