// Inline spec documentation served via MCP resources.
// The catalog intentionally mirrors better-design registry component slugs.

export const OPENUI_SPEC = `# Canvas Dock — Better Design OpenUI catalog

Canvas Dock renders OpenUI Lang into a hosted report URL. The renderer only
accepts components backed by better-design registry entries. Do not invent
layout or display components such as Stack, Grid, Hero, Image, Video, or Iframe.

OpenUI Lang is line-oriented:
\`id = ComponentName(arg1, arg2, ...)\`

CRITICAL: OpenUI Lang uses POSITIONAL arguments only. Do NOT use \`name: value\`
colon syntax. A page must define \`root = ...\`.

## Components

- SectionHeader(title, description?, size?)        // better-design section-header; size: sm|md|lg
- Card(children, title?, description?)            // better-design card
- Text(text, variant?)                            // better-design typography; variant: p|lead|muted|large|small
- Heading(text, level?)                           // better-design typography; level: 1|2|3|4
- Quote(text)
- Code(text)
- CodeBlock(code, language?, filename?)
- Button(text, variant?, size?, href?, external?) // variant: default|secondary|outline|ghost|destructive|link; size: sm|default|lg
- Badge(text, variant?, size?)                    // better-design badge variants, e.g. default|primary|success|warning|destructive|outline
- Alert(children, title?, variant?)               // variant: default|destructive
- Separator()
- StatCard(label, value, change?, trend?, description?) // trend: up|down|neutral
- DataTable(columns, rows)                        // columns=[{key, header, sortable?}], rows=[{...}]
- Chart(type, data, xKey?, yKey?, nameKey?, valueKey?, height?) // type: bar|line|pie
- Progress(value)
- Empty(title, description?)
- Avatar(name, src?)
- Kbd(text)
- Tabs(items)                                     // items=[{label, content}]
- Accordion(items)                                // items=[{title, content}]
- Breadcrumb(items)                               // items=[{text, href?}]
- Tooltip(text, hint)
- Pagination(current, total)
- Skeleton(width?, height?)

## Example

root = Card([hdr, summary, revenue, chart, table], "Q2 Sales", "better-design only")
hdr = SectionHeader("Q2 Sales", "A compact report rendered with vendored better-design components", "lg")
summary = Text("All visible components come from the selected better-design theme.", "muted")
revenue = StatCard("Revenue", "$1.2M", "+12%", "up", "vs previous quarter")
chart = Chart("bar", [{name: "Jan", value: 32}, {name: "Feb", value: 41}], "name", "value")
table = DataTable([{key: "region", header: "Region", sortable: true}, {key: "amount", header: "Amount"}], [{region: "JP", amount: "$420k"}])
`;

export const A2UI_SPEC = `# Canvas Dock — Better Design A2UI catalog

A2UI payload is { messages: [...] }. Canvas Dock only accepts component types
backed by better-design registry entries. Do not send Row, Column, Stack, Grid,
List, Hero, Image, Video, Iframe, or other Canvas Dock invented components.

## Messages

- { type: "createSurface", surfaceId: "main", catalogId: "canvas-dock", root: "<rootComponentId>" }
- { type: "updateComponents", surfaceId: "main", components: [{id, type, props, children?: [ids]}] }
- { type: "updateDataModel", surfaceId: "main", path: "/", value: {...} }
- { type: "deleteSurface", surfaceId: "main" }

## Component types

- SectionHeader({title, description?, size?})
- Card({title?, description?})                    // children allowed
- Text({text, variant?})
- Heading({text, level?})
- Quote({text})
- Code({text})
- CodeBlock({code, language?, filename?})
- Button({text, variant?, size?, href?, external?})
- Badge({text, variant?, size?})
- Alert({title?, variant?})                       // children allowed
- Separator({})
- StatCard({label, value, change?, trend?, description?})
- Chart({type, data, xKey?, yKey?, nameKey?, valueKey?, height?})
- DataTable({columns, rows})
- Progress({value})
- Empty({title, description?})
- Avatar({name, src?})
- Kbd({text})

Any prop value may be either a literal, or a binding object:
  { literal: ... }      // explicit literal value
  { path: "/foo/bar" }  // JSON Pointer into the data model

## Example

{
  "messages": [
    { "type": "createSurface", "surfaceId": "main", "catalogId": "canvas-dock", "root": "root" },
    { "type": "updateComponents", "surfaceId": "main", "components": [
      { "id": "root", "type": "Card", "props": {"title": "Q2 Sales"}, "children": ["hdr", "rev"] },
      { "id": "hdr", "type": "SectionHeader", "props": {"title": "Q2 Sales", "size": "lg"} },
      { "id": "rev", "type": "StatCard", "props": {"label": "Revenue", "value": "$1.2M", "change": "+12%", "trend": "up"} }
    ]}
  ]
}
`;
