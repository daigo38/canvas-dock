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

const Stack = defineComponent({
  name: "Stack",
  description:
    "Vertical/horizontal flex container. Use direction='row' for horizontal. Wraps children with consistent gap.",
  props: z.object({
    direction: z.enum(["row", "column"]).default("column"),
    gap: z.number().int().min(0).max(16).default(4),
    align: z.enum(["start", "center", "end", "stretch"]).default("stretch"),
    justify: z.enum(["start", "center", "end", "between"]).default("start"),
    wrap: z.boolean().default(false),
    children: z.array(z.any()).optional(),
  }),
  component: ({ props, renderNode }) => (
    <StackPrim direction={props.direction} gap={props.gap} align={props.align} justify={props.justify} wrap={props.wrap}>
      {(props.children ?? []).map((c, i) => (
        <div key={i}>{renderNode(c)}</div>
      ))}
    </StackPrim>
  ),
});

const Heading = defineComponent({
  name: "Heading",
  description: "Section heading. Level 1 (page title) → 4 (small).",
  props: z.object({
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(2),
    text: z.string(),
  }),
  component: ({ props }) => <HeadingPrim level={props.level}>{props.text}</HeadingPrim>,
});

const Text = defineComponent({
  name: "Text",
  description: "Body paragraph. Use muted=true for secondary text.",
  props: z.object({
    text: z.string(),
    muted: z.boolean().default(false),
  }),
  component: ({ props }) => <TextPrim muted={props.muted}>{props.text}</TextPrim>,
});

const Card = defineComponent({
  name: "Card",
  description: "Bordered card with optional title/description and slot for children.",
  props: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    children: z.array(z.any()).optional(),
  }),
  component: ({ props, renderNode }) => (
    <CardPrim title={props.title} description={props.description}>
      {(props.children ?? []).map((c, i) => (
        <div key={i}>{renderNode(c)}</div>
      ))}
    </CardPrim>
  ),
});

const Stat = defineComponent({
  name: "Stat",
  description: "KPI tile with label, big numeric value, optional delta and trend indicator.",
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
    "Data visualization. type=bar|line|pie. For bar/line: provide xKey + yKey (string or array of strings). For pie: provide nameKey + valueKey.",
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
  description: "Tabular data. columns: array of {key,label,align?}. rows: array of objects keyed by column.key.",
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
  description: "Horizontal rule between sections.",
  props: z.object({}),
  component: () => <DividerPrim />,
});

const Badge = defineComponent({
  name: "Badge",
  description: "Inline status pill.",
  props: z.object({
    text: z.string(),
    tone: z.enum(["default", "success", "warn", "error"]).default("default"),
  }),
  component: ({ props }) => <BadgePrim tone={props.tone}>{props.text}</BadgePrim>,
});

export const canvasDockLibrary = createLibrary({
  components: [Stack, Heading, Text, Card, Stat, Chart, Table, Divider, Badge],
});
