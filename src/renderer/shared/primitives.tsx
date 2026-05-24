"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

// Primitive components shared by OpenUI and A2UI renderers.
// Styled via Tailwind + CSS variables; theme switching happens by changing
// the `.theme-<id>` class on the wrapper, which scopes a different set of
// CSS variables (loaded per-theme).

export const ThemeWrapper: React.FC<{ themeId: string; children: React.ReactNode }> = ({ themeId, children }) => (
  <div className={cn("min-h-screen w-full bg-background text-foreground", `theme-${themeId}`)}>{children}</div>
);

export const Stack: React.FC<{
  direction?: "row" | "column";
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  children?: React.ReactNode;
}> = ({ direction = "column", gap = 4, align = "stretch", justify = "start", wrap = false, children }) => (
  <div
    className={cn(
      "flex",
      direction === "row" ? "flex-row" : "flex-col",
      wrap && "flex-wrap",
      `gap-${gap}`,
      { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" }[align],
      { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" }[justify],
    )}
  >
    {children}
  </div>
);

export const Heading: React.FC<{ level?: 1 | 2 | 3 | 4; children?: React.ReactNode }> = ({ level = 2, children }) => {
  const cls = {
    1: "text-3xl font-bold tracking-tight",
    2: "text-2xl font-semibold tracking-tight",
    3: "text-xl font-semibold",
    4: "text-base font-semibold",
  }[level];
  const Tag = (`h${level}` as unknown) as keyof React.JSX.IntrinsicElements;
  return <Tag className={cls}>{children}</Tag>;
};

export const Text: React.FC<{ muted?: boolean; children?: React.ReactNode }> = ({ muted, children }) => (
  <p className={cn("text-sm leading-relaxed", muted ? "text-muted-foreground" : "text-foreground")}>{children}</p>
);

export const Card: React.FC<{ title?: string; description?: string; children?: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
    {title && <h3 className="text-base font-semibold leading-none tracking-tight mb-1">{title}</h3>}
    {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
    <div className={cn(title || description ? "" : "")}>{children}</div>
  </div>
);

export const Stat: React.FC<{ label: string; value: string | number; delta?: string; trend?: "up" | "down" | "flat" }> = ({
  label,
  value,
  delta,
  trend,
}) => (
  <div className="rounded-lg border border-border bg-card p-5">
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="mt-2 text-3xl font-semibold tabular-nums">{value}</div>
    {delta && (
      <div
        className={cn(
          "mt-1 text-xs font-medium",
          trend === "up" && "text-emerald-600",
          trend === "down" && "text-rose-600",
          (!trend || trend === "flat") && "text-muted-foreground",
        )}
      >
        {delta}
      </div>
    )}
  </div>
);

type ChartDatum = Record<string, string | number>;
const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

export const Chart: React.FC<{
  type: "bar" | "line" | "pie";
  data: ChartDatum[];
  xKey?: string;
  yKey?: string | string[];
  nameKey?: string;
  valueKey?: string;
  height?: number;
}> = ({ type, data, xKey = "name", yKey = "value", nameKey = "name", valueKey = "value", height = 280 }) => {
  const yKeys = Array.isArray(yKey) ? yKey : [yKey];
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={xKey} stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip />
            <Legend />
            {yKeys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        ) : type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={xKey} stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip />
            <Legend />
            {yKeys.map((k, i) => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        ) : (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie data={data} dataKey={valueKey} nameKey={nameKey} outerRadius={100} label>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export const DataTable: React.FC<{
  columns: { key: string; label: string; align?: "left" | "right" | "center" }[];
  rows: Record<string, string | number>[];
}> = ({ columns, rows }) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full text-sm">
      <thead className="bg-muted/40 text-muted-foreground">
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              className={cn(
                "px-4 py-2 text-left font-medium",
                c.align === "right" && "text-right",
                c.align === "center" && "text-center",
              )}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-border">
            {columns.map((c) => (
              <td
                key={c.key}
                className={cn(
                  "px-4 py-2",
                  c.align === "right" && "text-right tabular-nums",
                  c.align === "center" && "text-center",
                )}
              >
                {row[c.key] as React.ReactNode}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Divider: React.FC = () => <hr className="border-border" />;

export const Badge: React.FC<{ children?: React.ReactNode; tone?: "default" | "success" | "warn" | "error" }> = ({
  children,
  tone = "default",
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      tone === "default" && "bg-muted text-muted-foreground",
      tone === "success" && "bg-emerald-100 text-emerald-700",
      tone === "warn" && "bg-amber-100 text-amber-700",
      tone === "error" && "bg-rose-100 text-rose-700",
    )}
  >
    {children}
  </span>
);
