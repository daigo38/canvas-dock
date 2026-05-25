"use client";

import { z } from "zod/v4";
import { createLibrary, defineComponent } from "@openuidev/react-lang";
import {
  Stack as StackPrim,
  Heading as HeadingPrim,
  Text as TextPrim,
  Card as CardPrim,
  Stat as StatPrim,
  Chart as ChartPrim,
  DataTable,
  Divider as DividerPrim,
  Badge as BadgePrim,
} from "@/renderer/shared/primitives";

// IMPORTANT: OpenUI Lang uses POSITIONAL arguments. The order in `z.object`
// below IS the call signature. Put `children` first for any container so
// authors can write `Stack([a, b], "row")` and `Card([t], "title")`.

const Stack = defineComponent({
  name: "Stack",
  description:
    "Vertical/horizontal flex container. Signature: Stack(children, direction?, gap?, align?, justify?, wrap?). Use direction='row' for horizontal.",
  props: z.object({
    children: z.array(z.any()).optional(),
    direction: z.enum(["row", "column"]).default("column"),
    gap: z.number().int().min(0).max(16).default(4),
    align: z.enum(["start", "center", "end", "stretch"]).default("stretch"),
    justify: z.enum(["start", "center", "end", "between"]).default("start"),
    // Leave optional so the primitive can default row→wrap (mobile-safe).
    wrap: z.boolean().optional(),
  }),
  component: ({ props, renderNode }) => (
    <StackPrim direction={props.direction} gap={props.gap} align={props.align} justify={props.justify} wrap={props.wrap}>
      {renderNode(props.children)}
    </StackPrim>
  ),
});

const Heading = defineComponent({
  name: "Heading",
  description: "Section heading. Signature: Heading(text, level?). Level 1 (page title) → 4 (small).",
  props: z.object({
    text: z.string(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(2),
  }),
  component: ({ props }) => <HeadingPrim level={props.level}>{props.text}</HeadingPrim>,
});

const Text = defineComponent({
  name: "Text",
  description: "Body paragraph. Signature: Text(text, muted?). Use muted=true for secondary text.",
  props: z.object({
    text: z.string(),
    muted: z.boolean().default(false),
  }),
  component: ({ props }) => <TextPrim muted={props.muted}>{props.text}</TextPrim>,
});

const Card = defineComponent({
  name: "Card",
  description: "Bordered card with optional title/description. Signature: Card(children, title?, description?).",
  props: z.object({
    children: z.array(z.any()).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  component: ({ props, renderNode }) => (
    <CardPrim title={props.title} description={props.description}>
      {renderNode(props.children)}
    </CardPrim>
  ),
});

const Stat = defineComponent({
  name: "Stat",
  description: "KPI tile. Signature: Stat(label, value, delta?, trend?). trend ∈ up|down|flat.",
  props: z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    delta: z.string().optional(),
    trend: z.enum(["up", "down", "flat"]).optional(),
  }),
  component: ({ props }) => <StatPrim label={props.label} value={props.value} delta={props.delta} trend={props.trend} />,
});

const Chart = defineComponent({
  name: "Chart",
  description:
    "Data visualization. Signature: Chart(type, data, xKey?, yKey?, nameKey?, valueKey?, height?). type ∈ bar|line|pie.",
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
    <ChartPrim
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
  description: "Tabular data. Signature: Table(columns, rows). columns=[{key,label,align?}], rows=[{...}].",
  props: z.object({
    columns: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        align: z.enum(["left", "right", "center"]).optional(),
      }),
    ),
    rows: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
  }),
  component: ({ props }) => <DataTable columns={props.columns} rows={props.rows} />,
});

const Divider = defineComponent({
  name: "Divider",
  description: "Horizontal rule between sections. Signature: Divider().",
  props: z.object({}),
  component: () => <DividerPrim />,
});

const Badge = defineComponent({
  name: "Badge",
  description: "Inline status pill. Signature: Badge(text, tone?). tone ∈ default|success|warn|error.",
  props: z.object({
    text: z.string(),
    tone: z.enum(["default", "success", "warn", "error"]).default("default"),
  }),
  component: ({ props }) => <BadgePrim tone={props.tone}>{props.text}</BadgePrim>,
});

export const canvasDockLibrary = createLibrary({
  components: [Stack, Heading, Text, Card, Stat, Chart, Table, Divider, Badge],
});
