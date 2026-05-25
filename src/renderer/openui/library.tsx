"use client";

import { z } from "zod/v4";
import { createLibrary, defineComponent } from "@openuidev/react-lang";
import * as P from "@/renderer/shared/themed";

// IMPORTANT: OpenUI Lang uses POSITIONAL arguments only. The order of fields
// in `z.object` below IS the call signature. For containers, put `children`
// first so authors can write `Stack([a, b], "row")` naturally.

// ---------------------------------------------------------------------------
// LAYOUT
// ---------------------------------------------------------------------------

const Stack = defineComponent({
  name: "Stack",
  description:
    "Flex container. Signature: Stack(children, direction?, gap?, align?, justify?, wrap?). direction ∈ row|column.",
  props: z.object({
    children: z.array(z.any()).optional(),
    direction: z.enum(["row", "column"]).default("column"),
    gap: z.number().int().min(0).max(16).default(4),
    align: z.enum(["start", "center", "end", "stretch"]).default("stretch"),
    justify: z.enum(["start", "center", "end", "between"]).default("start"),
    wrap: z.boolean().optional(),
  }),
  component: ({ props, renderNode }) => (
    <P.Stack
      direction={props.direction}
      gap={props.gap}
      align={props.align}
      justify={props.justify}
      wrap={props.wrap}
    >
      {renderNode(props.children)}
    </P.Stack>
  ),
});

const Container = defineComponent({
  name: "Container",
  description: "Centered max-width wrapper. Signature: Container(children, size?). size ∈ sm|md|lg|xl|2xl|full.",
  props: z.object({
    children: z.array(z.any()).optional(),
    size: z.enum(["sm", "md", "lg", "xl", "2xl", "full"]).default("lg"),
  }),
  component: ({ props, renderNode }) => (
    <P.Container size={props.size}>{renderNode(props.children)}</P.Container>
  ),
});

const Grid = defineComponent({
  name: "Grid",
  description: "Responsive grid. Signature: Grid(children, columns?, gap?). columns 1–6.",
  props: z.object({
    children: z.array(z.any()).optional(),
    columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]).default(2),
    gap: z.number().int().min(0).max(16).default(4),
  }),
  component: ({ props, renderNode }) => (
    <P.Grid columns={props.columns} gap={props.gap}>{renderNode(props.children)}</P.Grid>
  ),
});

const Spacer = defineComponent({
  name: "Spacer",
  description: "Empty space. Signature: Spacer(size?, axis?). size 0–16. axis ∈ vertical|horizontal.",
  props: z.object({
    size: z.number().int().min(0).max(16).default(4),
    axis: z.enum(["vertical", "horizontal"]).default("vertical"),
  }),
  component: ({ props }) => <P.Spacer size={props.size} axis={props.axis} />,
});

const AspectRatio = defineComponent({
  name: "AspectRatio",
  description: "Aspect-ratio box. Signature: AspectRatio(children, ratio?). ratio ∈ 16:9|4:3|1:1|3:2|21:9.",
  props: z.object({
    children: z.array(z.any()).optional(),
    ratio: z.enum(["16:9", "4:3", "1:1", "3:2", "21:9"]).default("16:9"),
  }),
  component: ({ props, renderNode }) => (
    <P.AspectRatio ratio={props.ratio}>{renderNode(props.children)}</P.AspectRatio>
  ),
});

const ScrollArea = defineComponent({
  name: "ScrollArea",
  description: "Scrollable container. Signature: ScrollArea(children, maxHeight?). maxHeight in pixels.",
  props: z.object({
    children: z.array(z.any()).optional(),
    maxHeight: z.number().int().min(80).default(480),
  }),
  component: ({ props, renderNode }) => (
    <P.ScrollArea maxHeight={props.maxHeight}>{renderNode(props.children)}</P.ScrollArea>
  ),
});

const Divider = defineComponent({
  name: "Divider",
  description: "Horizontal rule. Signature: Divider().",
  props: z.object({}),
  component: () => <P.Divider />,
});

// ---------------------------------------------------------------------------
// TYPOGRAPHY
// ---------------------------------------------------------------------------

const Heading = defineComponent({
  name: "Heading",
  description: "Section heading. Signature: Heading(text, level?). level ∈ 1|2|3|4.",
  props: z.object({
    text: z.string(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(2),
  }),
  component: ({ props }) => <P.Heading level={props.level}>{props.text}</P.Heading>,
});

const Text = defineComponent({
  name: "Text",
  description: "Body text. Signature: Text(text, muted?).",
  props: z.object({ text: z.string(), muted: z.boolean().default(false) }),
  component: ({ props }) => <P.Text muted={props.muted}>{props.text}</P.Text>,
});

const Lead = defineComponent({
  name: "Lead",
  description: "Large lead paragraph (intro text). Signature: Lead(text).",
  props: z.object({ text: z.string() }),
  component: ({ props }) => <P.Lead>{props.text}</P.Lead>,
});

const Quote = defineComponent({
  name: "Quote",
  description: "Blockquote. Signature: Quote(text, cite?).",
  props: z.object({ text: z.string(), cite: z.string().optional() }),
  component: ({ props }) => <P.Quote cite={props.cite}>{props.text}</P.Quote>,
});

const Code = defineComponent({
  name: "Code",
  description: "Inline code. Signature: Code(text).",
  props: z.object({ text: z.string() }),
  component: ({ props }) => <P.Code>{props.text}</P.Code>,
});

const CodeBlock = defineComponent({
  name: "CodeBlock",
  description: "Multi-line code block. Signature: CodeBlock(text, language?).",
  props: z.object({ text: z.string(), language: z.string().optional() }),
  component: ({ props }) => <P.CodeBlock language={props.language}>{props.text}</P.CodeBlock>,
});

const Link = defineComponent({
  name: "Link",
  description: "Hyperlink. Signature: Link(text, href, external?). external=true opens in new tab.",
  props: z.object({
    text: z.string(),
    href: z.string(),
    external: z.boolean().default(false),
  }),
  component: ({ props }) => <P.Link href={props.href} external={props.external}>{props.text}</P.Link>,
});

const Kbd = defineComponent({
  name: "Kbd",
  description: "Keyboard key. Signature: Kbd(text).",
  props: z.object({ text: z.string() }),
  component: ({ props }) => <P.Kbd>{props.text}</P.Kbd>,
});

// ---------------------------------------------------------------------------
// SURFACES
// ---------------------------------------------------------------------------

const Card = defineComponent({
  name: "Card",
  description: "Bordered tile. Signature: Card(children, title?, description?).",
  props: z.object({
    children: z.array(z.any()).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  component: ({ props, renderNode }) => (
    <P.Card title={props.title} description={props.description}>{renderNode(props.children)}</P.Card>
  ),
});

const Alert = defineComponent({
  name: "Alert",
  description: "Notice block. Signature: Alert(children, title?, variant?). variant ∈ info|warn|error|success.",
  props: z.object({
    children: z.array(z.any()).optional(),
    title: z.string().optional(),
    variant: z.enum(["info", "warn", "error", "success"]).default("info"),
  }),
  component: ({ props, renderNode }) => (
    <P.Alert title={props.title} variant={props.variant}>{renderNode(props.children)}</P.Alert>
  ),
});

const Badge = defineComponent({
  name: "Badge",
  description: "Inline pill. Signature: Badge(text, tone?). tone ∈ default|success|warn|error.",
  props: z.object({
    text: z.string(),
    tone: z.enum(["default", "success", "warn", "error"]).default("default"),
  }),
  component: ({ props }) => <P.Badge tone={props.tone}>{props.text}</P.Badge>,
});

const Avatar = defineComponent({
  name: "Avatar",
  description: "Circular avatar with initials fallback. Signature: Avatar(name, src?, size?). size ∈ sm|md|lg.",
  props: z.object({
    name: z.string(),
    src: z.string().optional(),
    size: z.enum(["sm", "md", "lg"]).default("md"),
  }),
  component: ({ props }) => <P.Avatar name={props.name} src={props.src} size={props.size} />,
});

const Hero = defineComponent({
  name: "Hero",
  description: "Large header block. Signature: Hero(title, subtitle?, children?).",
  props: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    children: z.array(z.any()).optional(),
  }),
  component: ({ props, renderNode }) => (
    <P.Hero title={props.title} subtitle={props.subtitle}>{renderNode(props.children)}</P.Hero>
  ),
});

const EmptyState = defineComponent({
  name: "EmptyState",
  description: "Empty placeholder. Signature: EmptyState(title, description?, icon?, children?). icon is an emoji string.",
  props: z.object({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    children: z.array(z.any()).optional(),
  }),
  component: ({ props, renderNode }) => (
    <P.EmptyState title={props.title} description={props.description} icon={props.icon}>
      {renderNode(props.children)}
    </P.EmptyState>
  ),
});

// ---------------------------------------------------------------------------
// DATA DISPLAY
// ---------------------------------------------------------------------------

const Stat = defineComponent({
  name: "Stat",
  description: "KPI tile. Signature: Stat(label, value, delta?, trend?). trend ∈ up|down|flat.",
  props: z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    delta: z.string().optional(),
    trend: z.enum(["up", "down", "flat"]).optional(),
  }),
  component: ({ props }) => (
    <P.Stat label={props.label} value={props.value} delta={props.delta} trend={props.trend} />
  ),
});

const Chart = defineComponent({
  name: "Chart",
  description:
    "Data viz. Signature: Chart(type, data, xKey?, yKey?, nameKey?, valueKey?, height?). type ∈ bar|line|pie.",
  props: z.object({
    type: z.enum(["bar", "line", "pie"]),
    data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
    xKey: z.string().optional(),
    yKey: z.union([z.string(), z.array(z.string())]).optional(),
    nameKey: z.string().optional(),
    valueKey: z.string().optional(),
    height: z.number().int().min(120).max(720).default(280),
  }),
  component: ({ props }) => (
    <P.Chart
      type={props.type}
      data={props.data}
      xKey={props.xKey}
      yKey={props.yKey}
      nameKey={props.nameKey}
      valueKey={props.valueKey}
      height={props.height}
    />
  ),
});

const Table = defineComponent({
  name: "Table",
  description: "Tabular data. Signature: Table(columns, rows). columns=[{key,label,align?}], rows=[{[k]:v}].",
  props: z.object({
    columns: z.array(z.object({
      key: z.string(),
      label: z.string(),
      align: z.enum(["left", "right", "center"]).optional(),
    })),
    rows: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
  }),
  component: ({ props }) => <P.DataTable columns={props.columns} rows={props.rows} />,
});

const BulletList = defineComponent({
  name: "BulletList",
  description: "Unordered list of strings. Signature: BulletList(items).",
  props: z.object({ items: z.array(z.string()) }),
  component: ({ props }) => <P.BulletList items={props.items} />,
});

const NumberList = defineComponent({
  name: "NumberList",
  description: "Ordered list of strings. Signature: NumberList(items).",
  props: z.object({ items: z.array(z.string()) }),
  component: ({ props }) => <P.NumberList items={props.items} />,
});

const DefinitionList = defineComponent({
  name: "DefinitionList",
  description: "Key-value pairs. Signature: DefinitionList(items). items=[{term, definition}].",
  props: z.object({
    items: z.array(z.object({ term: z.string(), definition: z.string() })),
  }),
  component: ({ props }) => <P.DefinitionList items={props.items} />,
});

const Progress = defineComponent({
  name: "Progress",
  description: "Linear progress bar. Signature: Progress(value, label?). value 0–100.",
  props: z.object({
    value: z.number().min(0).max(100),
    label: z.string().optional(),
  }),
  component: ({ props }) => <P.Progress value={props.value} label={props.label} />,
});

const Timeline = defineComponent({
  name: "Timeline",
  description: "Vertical timeline. Signature: Timeline(items). items=[{date, title, description?}].",
  props: z.object({
    items: z.array(z.object({
      date: z.string(),
      title: z.string(),
      description: z.string().optional(),
    })),
  }),
  component: ({ props }) => <P.Timeline items={props.items} />,
});

// ---------------------------------------------------------------------------
// INTERACTIVE (statically rendered)
// ---------------------------------------------------------------------------

const Button = defineComponent({
  name: "Button",
  description:
    "Button or link. Signature: Button(text, variant?, size?, href?, external?). variant ∈ default|secondary|outline|ghost|destructive|link. size ∈ sm|md|lg. href→anchor.",
  props: z.object({
    text: z.string(),
    variant: z.enum(["default", "secondary", "outline", "ghost", "destructive", "link"]).default("default"),
    size: z.enum(["sm", "md", "lg"]).default("md"),
    href: z.string().optional(),
    external: z.boolean().default(false),
  }),
  component: ({ props }) => (
    <P.Button text={props.text} variant={props.variant} size={props.size} href={props.href} external={props.external} />
  ),
});

const Tabs = defineComponent({
  name: "Tabs",
  description:
    "Tabbed sections — only the first tab content is shown. Signature: Tabs(items). items=[{label, content}]; content is any component reference.",
  props: z.object({
    items: z.array(z.object({
      label: z.string(),
      content: z.any(),
    })),
  }),
  component: ({ props, renderNode }) => (
    <P.Tabs items={props.items.map((it) => ({ label: it.label, content: renderNode(it.content) }))} />
  ),
});

const Accordion = defineComponent({
  name: "Accordion",
  description:
    "Collapsible sections (open by default). Signature: Accordion(items, defaultOpen?). items=[{title, content}]; content is any component reference.",
  props: z.object({
    items: z.array(z.object({
      title: z.string(),
      content: z.any(),
    })),
    defaultOpen: z.boolean().default(true),
  }),
  component: ({ props, renderNode }) => (
    <P.Accordion
      defaultOpen={props.defaultOpen}
      items={props.items.map((it) => ({ title: it.title, content: renderNode(it.content) }))}
    />
  ),
});

const Breadcrumb = defineComponent({
  name: "Breadcrumb",
  description: "Navigation trail. Signature: Breadcrumb(items). items=[{text, href?}].",
  props: z.object({
    items: z.array(z.object({
      text: z.string(),
      href: z.string().optional(),
    })),
  }),
  component: ({ props }) => <P.Breadcrumb items={props.items} />,
});

const Tooltip = defineComponent({
  name: "Tooltip",
  description: "Text with browser-native hover hint. Signature: Tooltip(text, hint).",
  props: z.object({ text: z.string(), hint: z.string() }),
  component: ({ props }) => <P.Tooltip hint={props.hint}>{props.text}</P.Tooltip>,
});

const Pagination = defineComponent({
  name: "Pagination",
  description: "Static page numbers. Signature: Pagination(current, total).",
  props: z.object({
    current: z.number().int().min(1),
    total: z.number().int().min(1),
  }),
  component: ({ props }) => <P.Pagination current={props.current} total={props.total} />,
});

const Skeleton = defineComponent({
  name: "Skeleton",
  description: "Loading placeholder bars. Signature: Skeleton(width?, height?, count?).",
  props: z.object({
    width: z.string().default("100%"),
    height: z.string().default("1rem"),
    count: z.number().int().min(1).max(20).default(1),
  }),
  component: ({ props }) => <P.Skeleton width={props.width} height={props.height} count={props.count} />,
});

// ---------------------------------------------------------------------------
// MEDIA
// ---------------------------------------------------------------------------

const Image = defineComponent({
  name: "Image",
  description: "Image. Signature: Image(src, alt?, rounded?, width?, height?).",
  props: z.object({
    src: z.string(),
    alt: z.string().default(""),
    rounded: z.boolean().default(true),
    width: z.number().int().optional(),
    height: z.number().int().optional(),
  }),
  component: ({ props }) => (
    <P.Image src={props.src} alt={props.alt} rounded={props.rounded} width={props.width} height={props.height} />
  ),
});

const Video = defineComponent({
  name: "Video",
  description: "Video with controls. Signature: Video(src, poster?, autoplay?, loop?).",
  props: z.object({
    src: z.string(),
    poster: z.string().optional(),
    autoplay: z.boolean().default(false),
    loop: z.boolean().default(false),
  }),
  component: ({ props }) => (
    <P.Video src={props.src} poster={props.poster} autoplay={props.autoplay} loop={props.loop} />
  ),
});

const Iframe = defineComponent({
  name: "Iframe",
  description: "External embed. Signature: Iframe(src, title?, height?). height in pixels.",
  props: z.object({
    src: z.string(),
    title: z.string().default("embed"),
    height: z.number().int().min(80).default(400),
  }),
  component: ({ props }) => <P.Iframe src={props.src} title={props.title} height={props.height} />,
});

export const canvasDockLibrary = createLibrary({
  components: [
    // Layout
    Stack, Container, Grid, Spacer, AspectRatio, ScrollArea, Divider,
    // Typography
    Heading, Text, Lead, Quote, Code, CodeBlock, Link, Kbd,
    // Surfaces
    Card, Alert, Badge, Avatar, Hero, EmptyState,
    // Data display
    Stat, Chart, Table, BulletList, NumberList, DefinitionList, Progress, Timeline,
    // Interactive (statically rendered)
    Button, Tabs, Accordion, Breadcrumb, Tooltip, Pagination, Skeleton,
    // Media
    Image, Video, Iframe,
  ],
});
