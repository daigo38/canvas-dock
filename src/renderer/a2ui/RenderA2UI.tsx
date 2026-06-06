"use client";

import * as React from "react";
import {
  Heading,
  Text,
  Card,
  StatCard,
  Chart,
  DataTable,
  Separator,
  Badge,
  Alert,
  Button,
  SectionHeader,
  Progress,
  Empty,
  Avatar,
  Kbd,
  Code,
  CodeBlock,
  Quote,
} from "@/renderer/shared/themed";
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
    case "SectionHeader":
      return (
        <SectionHeader
          title={String(p.title ?? "")}
          description={p.description as string | undefined}
          size={(p.size as "sm" | "md" | "lg") ?? "md"}
        />
      );
    case "Text":
      return <Text variant={(p.variant as "p" | "lead" | "muted" | "large" | "small") ?? "p"}>{String(p.text ?? "")}</Text>;
    case "Heading":
      return <Heading level={(p.level as 1 | 2 | 3 | 4) ?? 2}>{String(p.text ?? "")}</Heading>;
    case "Quote":
      return <Quote>{String(p.text ?? "")}</Quote>;
    case "Code":
      return <Code>{String(p.text ?? "")}</Code>;
    case "CodeBlock":
      return <CodeBlock code={String(p.code ?? "")} language={p.language as string | undefined} filename={p.filename as string | undefined} />;
    case "Card":
      return (
        <Card title={p.title as string | undefined} description={p.description as string | undefined}>
          {kids}
        </Card>
      );
    case "Alert":
      return (
        <Alert title={p.title as string | undefined} variant={(p.variant as "default" | "destructive") ?? "default"}>
          {kids}
        </Alert>
      );
    case "Button":
      return (
        <Button
          text={String(p.text ?? "")}
          variant={(p.variant as "default" | "secondary" | "outline" | "ghost" | "destructive" | "link") ?? "default"}
          size={(p.size as "sm" | "default" | "lg") ?? "default"}
          href={p.href as string | undefined}
          external={Boolean(p.external)}
        />
      );
    case "StatCard":
      return (
        <StatCard
          label={String(p.label ?? "")}
          value={(p.value as string | number) ?? ""}
          change={p.change as string | number | undefined}
          trend={(p.trend as "up" | "down" | "neutral") ?? "neutral"}
          description={p.description as string | undefined}
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
    case "DataTable":
      return (
        <DataTable
          columns={(p.columns as { key: string; header: string; sortable?: boolean }[]) ?? []}
          rows={(p.rows as Record<string, unknown>[]) ?? []}
        />
      );
    case "Separator":
      return <Separator />;
    case "Badge":
      return <Badge variant={(p.variant as string) ?? "default"} size={(p.size as "sm" | "default" | "lg") ?? "default"} text={String(p.text ?? "")} />;
    case "Progress":
      return <Progress value={(p.value as number) ?? 0} />;
    case "Empty":
      return <Empty title={String(p.title ?? "")} description={p.description as string | undefined} />;
    case "Avatar":
      return <Avatar name={String(p.name ?? "")} src={p.src as string | undefined} />;
    case "Kbd":
      return <Kbd>{String(p.text ?? "")}</Kbd>;
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
    <div className="flex flex-col gap-8 w-full max-w-full overflow-x-clip">
      {surfaceIds.map((sid) => {
        const surface = state.surfaces[sid];
        const components = state.components[sid] ?? {};
        return (
          <section key={sid} className="w-full min-w-0">
            {renderComponent(surface.root, components, surface.dataModel)}
          </section>
        );
      })}
    </div>
  );
}

export type { A2UIPayload };
