"use client";

import { z } from "zod/v4";
import { createLibrary, defineComponent } from "@openuidev/react-lang";
import * as BD from "@/renderer/shared/themed";

// Canvas Dock exposes only components backed by better-design registry slugs.
// OpenUI Lang uses positional arguments; the z.object field order below is the
// component call signature.

const SectionHeader = defineComponent({
  name: "SectionHeader",
  description: "better-design section-header. Signature: SectionHeader(title, description?, size?).",
  props: z.object({
    title: z.string(),
    description: z.string().optional(),
    size: z.enum(["sm", "md", "lg"]).default("md"),
  }),
  component: ({ props }) => <BD.SectionHeader title={props.title} description={props.description} size={props.size} />,
});

const Card = defineComponent({
  name: "Card",
  description: "better-design card. Signature: Card(children, title?, description?).",
  props: z.object({
    children: z.array(z.any()).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  component: ({ props, renderNode }) => (
    <BD.Card title={props.title} description={props.description}>{renderNode(props.children)}</BD.Card>
  ),
});

const Text = defineComponent({
  name: "Text",
  description: "better-design typography text. Signature: Text(text, variant?). variant ∈ p|lead|muted|large|small.",
  props: z.object({
    text: z.string(),
    variant: z.enum(["p", "lead", "muted", "large", "small"]).default("p"),
  }),
  component: ({ props }) => <BD.Text variant={props.variant}>{props.text}</BD.Text>,
});

const Heading = defineComponent({
  name: "Heading",
  description: "better-design typography heading. Signature: Heading(text, level?). level ∈ 1|2|3|4.",
  props: z.object({
    text: z.string(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(2),
  }),
  component: ({ props }) => <BD.Heading level={props.level}>{props.text}</BD.Heading>,
});

const Quote = defineComponent({
  name: "Quote",
  description: "better-design typography blockquote. Signature: Quote(text).",
  props: z.object({ text: z.string() }),
  component: ({ props }) => <BD.Quote>{props.text}</BD.Quote>,
});

const Code = defineComponent({
  name: "Code",
  description: "better-design inline code. Signature: Code(text).",
  props: z.object({ text: z.string() }),
  component: ({ props }) => <BD.Code>{props.text}</BD.Code>,
});

const CodeBlock = defineComponent({
  name: "CodeBlock",
  description: "better-design code-block. Signature: CodeBlock(code, language?, filename?).",
  props: z.object({
    code: z.string(),
    language: z.string().optional(),
    filename: z.string().optional(),
  }),
  component: ({ props }) => <BD.CodeBlock code={props.code} language={props.language} filename={props.filename} />,
});

const Button = defineComponent({
  name: "Button",
  description: "better-design button. Signature: Button(text, variant?, size?, href?, external?).",
  props: z.object({
    text: z.string(),
    variant: z.enum(["default", "secondary", "outline", "ghost", "destructive", "link"]).default("default"),
    size: z.enum(["sm", "default", "lg"]).default("default"),
    href: z.string().optional(),
    external: z.boolean().default(false),
  }),
  component: ({ props }) => (
    <BD.Button text={props.text} variant={props.variant} size={props.size} href={props.href} external={props.external} />
  ),
});

const Badge = defineComponent({
  name: "Badge",
  description: "better-design badge. Signature: Badge(text, variant?, size?).",
  props: z.object({
    text: z.string(),
    variant: z.string().default("default"),
    size: z.enum(["sm", "default", "lg"]).default("default"),
  }),
  component: ({ props }) => <BD.Badge text={props.text} variant={props.variant} size={props.size} />,
});

const Alert = defineComponent({
  name: "Alert",
  description: "better-design alert. Signature: Alert(children, title?, variant?). variant ∈ default|destructive.",
  props: z.object({
    children: z.array(z.any()).optional(),
    title: z.string().optional(),
    variant: z.enum(["default", "destructive"]).default("default"),
  }),
  component: ({ props, renderNode }) => (
    <BD.Alert title={props.title} variant={props.variant}>{renderNode(props.children)}</BD.Alert>
  ),
});

const Separator = defineComponent({
  name: "Separator",
  description: "better-design separator. Signature: Separator().",
  props: z.object({}),
  component: () => <BD.Separator />,
});

const StatCard = defineComponent({
  name: "StatCard",
  description: "better-design stat-card. Signature: StatCard(label, value, change?, trend?, description?).",
  props: z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    change: z.union([z.string(), z.number()]).optional(),
    trend: z.enum(["up", "down", "neutral"]).default("neutral"),
    description: z.string().optional(),
  }),
  component: ({ props }) => (
    <BD.StatCard label={props.label} value={props.value} change={props.change} trend={props.trend} description={props.description} />
  ),
});

const DataTable = defineComponent({
  name: "DataTable",
  description: "better-design data-table. Signature: DataTable(columns, rows). columns=[{key, header, sortable?}].",
  props: z.object({
    columns: z.array(z.object({ key: z.string(), header: z.string(), sortable: z.boolean().optional() })),
    rows: z.array(z.record(z.string(), z.unknown())),
  }),
  component: ({ props }) => <BD.DataTable columns={props.columns} rows={props.rows} />,
});

const Chart = defineComponent({
  name: "Chart",
  description: "better-design chart primitives. Signature: Chart(type, data, xKey?, yKey?, nameKey?, valueKey?, height?).",
  props: z.object({
    type: z.enum(["bar", "line", "pie"]).default("bar"),
    data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
    xKey: z.string().default("name"),
    yKey: z.union([z.string(), z.array(z.string())]).default("value"),
    nameKey: z.string().default("name"),
    valueKey: z.string().default("value"),
    height: z.number().int().min(120).max(720).default(280),
  }),
  component: ({ props }) => (
    <BD.Chart
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

const Progress = defineComponent({
  name: "Progress",
  description: "better-design progress. Signature: Progress(value).",
  props: z.object({ value: z.number().min(0).max(100) }),
  component: ({ props }) => <BD.Progress value={props.value} />,
});

const Empty = defineComponent({
  name: "Empty",
  description: "better-design empty. Signature: Empty(title, description?).",
  props: z.object({ title: z.string(), description: z.string().optional() }),
  component: ({ props }) => <BD.Empty title={props.title} description={props.description} />,
});

const Avatar = defineComponent({
  name: "Avatar",
  description: "better-design avatar. Signature: Avatar(name, src?).",
  props: z.object({ name: z.string(), src: z.string().optional() }),
  component: ({ props }) => <BD.Avatar name={props.name} src={props.src} />,
});

const Kbd = defineComponent({
  name: "Kbd",
  description: "better-design kbd. Signature: Kbd(text).",
  props: z.object({ text: z.string() }),
  component: ({ props }) => <BD.Kbd>{props.text}</BD.Kbd>,
});

const Tabs = defineComponent({
  name: "Tabs",
  description: "better-design tabs. Signature: Tabs(items). items=[{label, content}].",
  props: z.object({
    items: z.array(z.object({ label: z.string(), content: z.any() })),
  }),
  component: ({ props, renderNode }) => (
    <BD.Tabs items={props.items.map((item) => ({ label: item.label, content: renderNode(item.content) }))} />
  ),
});

const Accordion = defineComponent({
  name: "Accordion",
  description: "better-design accordion. Signature: Accordion(items). items=[{title, content}].",
  props: z.object({
    items: z.array(z.object({ title: z.string(), content: z.any() })),
  }),
  component: ({ props, renderNode }) => (
    <BD.Accordion items={props.items.map((item) => ({ title: item.title, content: renderNode(item.content) }))} />
  ),
});

const Breadcrumb = defineComponent({
  name: "Breadcrumb",
  description: "better-design breadcrumb. Signature: Breadcrumb(items). items=[{text, href?}].",
  props: z.object({
    items: z.array(z.object({ text: z.string(), href: z.string().optional() })),
  }),
  component: ({ props }) => <BD.Breadcrumb items={props.items} />,
});

const Tooltip = defineComponent({
  name: "Tooltip",
  description: "better-design tooltip. Signature: Tooltip(text, hint).",
  props: z.object({ text: z.string(), hint: z.string() }),
  component: ({ props }) => <BD.Tooltip text={props.text} hint={props.hint} />,
});

const Pagination = defineComponent({
  name: "Pagination",
  description: "better-design pagination. Signature: Pagination(current, total).",
  props: z.object({ current: z.number().int().min(1), total: z.number().int().min(1) }),
  component: ({ props }) => <BD.Pagination current={props.current} total={props.total} />,
});

const Skeleton = defineComponent({
  name: "Skeleton",
  description: "better-design skeleton. Signature: Skeleton(width?, height?).",
  props: z.object({ width: z.string().default("100%"), height: z.number().int().min(1).default(24) }),
  component: ({ props }) => <BD.Skeleton width={props.width} height={props.height} />,
});

export const canvasDockLibrary = createLibrary({
  components: [
    SectionHeader,
    Card,
    Text,
    Heading,
    Quote,
    Code,
    CodeBlock,
    Button,
    Badge,
    Alert,
    Separator,
    StatCard,
    DataTable,
    Chart,
    Progress,
    Empty,
    Avatar,
    Kbd,
    Tabs,
    Accordion,
    Breadcrumb,
    Tooltip,
    Pagination,
    Skeleton,
  ],
});
