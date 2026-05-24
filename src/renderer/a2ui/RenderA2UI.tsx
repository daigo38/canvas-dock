"use client";

import * as React from "react";
import {
  Stack,
  Heading,
  Text,
  Card,
  Stat,
  Chart,
  DataTable,
  Divider,
  Badge,
} from "@/renderer/shared/primitives";
import {
  A2UIPayload,
  A2UIPayloadSchema,
  A2Component,
  foldMessages,
  resolveValue,
} from "./schema";

function resolveProps(props: Record<string, unknown>, dataModel: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    out[k] = resolveValue(v, dataModel);
  }
  return out;
}

function renderComponent(
  id: string,
  components: Record<string, A2Component>,
  dataModel: unknown,
): React.ReactNode {
  const c = components[id];
  if (!c) {
    return <UnknownComponent reason={`Missing component "${id}"`} />;
  }
  const p = resolveProps(c.props, dataModel);
  const kids = (c.children ?? []).map((cid) => (
    <React.Fragment key={cid}>{renderComponent(cid, components, dataModel)}</React.Fragment>
  ));

  switch (c.type) {
    case "Text":
      return <Text muted={Boolean(p.muted)}>{String(p.text ?? "")}</Text>;
    case "Heading":
      return <Heading level={(p.level as 1 | 2 | 3 | 4) ?? 2}>{String(p.text ?? "")}</Heading>;
    case "Column":
      return (
        <Stack
          direction="column"
          gap={(p.gap as number) ?? 4}
          align={(p.align as "start" | "center" | "end" | "stretch") ?? "stretch"}
          justify={(p.justify as "start" | "center" | "end" | "between") ?? "start"}
        >
          {kids}
        </Stack>
      );
    case "Row":
      return (
        <Stack
          direction="row"
          gap={(p.gap as number) ?? 4}
          align={(p.align as "start" | "center" | "end" | "stretch") ?? "center"}
          justify={(p.justify as "start" | "center" | "end" | "between") ?? "start"}
          wrap={Boolean(p.wrap)}
        >
          {kids}
        </Stack>
      );
    case "Card":
      return (
        <Card title={p.title as string | undefined} description={p.description as string | undefined}>
          {kids}
        </Card>
      );
    case "Stat":
      return (
        <Stat
          label={String(p.label ?? "")}
          value={(p.value as string | number) ?? ""}
          delta={p.delta as string | undefined}
          trend={p.trend as "up" | "down" | "flat" | undefined}
        />
      );
    case "Chart":
      return (
        <Chart
          type={(p.type as "bar" | "line" | "pie") ?? "bar"}
          data={(p.data as Record<string, string | number>[]) ?? []}
          xKey={p.xKey as string | undefined}
          yKey={p.yKey as string | string[] | undefined}
          nameKey={p.nameKey as string | undefined}
          valueKey={p.valueKey as string | undefined}
          height={(p.height as number) ?? 280}
        />
      );
    case "Table":
      return (
        <DataTable
          columns={(p.columns as { key: string; label: string; align?: "left" | "right" | "center" }[]) ?? []}
          rows={(p.rows as Record<string, string | number>[]) ?? []}
        />
      );
    case "Divider":
      return <Divider />;
    case "Badge":
      return <Badge tone={(p.tone as "default" | "success" | "warn" | "error") ?? "default"}>{String(p.text ?? "")}</Badge>;
    case "Image":
      return <img src={String(p.src ?? "")} alt={String(p.alt ?? "")} className="rounded-md max-w-full" />;
    case "List":
      return (
        <ul className="list-disc pl-6 space-y-1 text-sm">
          {kids.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      );
    default:
      return <UnknownComponent reason={`Unknown component type "${c.type}"`} />;
  }
}

function UnknownComponent({ reason }: { reason: string }) {
  return <div className="rounded border border-dashed border-rose-300 bg-rose-50 p-3 text-xs text-rose-700">{reason}</div>;
}

export function RenderA2UI({ payload }: { payload: unknown }) {
  const parsed = A2UIPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return (
      <div className="rounded border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
        Invalid A2UI payload:
        <pre className="mt-2 whitespace-pre-wrap text-xs">{JSON.stringify(parsed.error.issues, null, 2)}</pre>
      </div>
    );
  }
  const state = foldMessages(parsed.data.messages);
  const surfaceIds = Object.keys(state.surfaces);
  if (surfaceIds.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">No surface to render.</div>;
  }
  return (
    <div className="flex flex-col gap-8 p-6 md:p-10">
      {surfaceIds.map((sid) => {
        const surface = state.surfaces[sid];
        const components = state.components[sid] ?? {};
        return (
          <section key={sid}>
            {renderComponent(surface.root, components, surface.dataModel)}
          </section>
        );
      })}
    </div>
  );
}

export type { A2UIPayload };
