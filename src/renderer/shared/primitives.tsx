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
  Tooltip as RechartsTooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

// Primitive components shared by OpenUI and A2UI renderers.
// Styled via Tailwind + CSS variables; theme switching happens by changing
// the `.theme-<id>` class on the wrapper.

// ---------------------------------------------------------------------------
// Shared scale maps. Tailwind v4 JIT needs literal class names, so we
// pre-build instead of interpolating `gap-${n}` etc.
// ---------------------------------------------------------------------------
const GAP_CLASS: Record<number, string> = {
  0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4",
  5: "gap-5", 6: "gap-6", 7: "gap-7", 8: "gap-8", 10: "gap-10",
  12: "gap-12", 16: "gap-16",
};
const SIZE_H_CLASS: Record<number, string> = {
  0: "h-0", 1: "h-1", 2: "h-2", 3: "h-3", 4: "h-4",
  5: "h-5", 6: "h-6", 8: "h-8", 10: "h-10", 12: "h-12", 16: "h-16",
};
const SIZE_W_CLASS: Record<number, string> = {
  0: "w-0", 1: "w-1", 2: "w-2", 3: "w-3", 4: "w-4",
  5: "w-5", 6: "w-6", 8: "w-8", 10: "w-10", 12: "w-12", 16: "w-16",
};

// ---------------------------------------------------------------------------
// Wrapper used by /p/[slug]
// ---------------------------------------------------------------------------
export const ThemeWrapper: React.FC<{ themeId: string; children: React.ReactNode }> = ({ themeId, children }) => (
  <div className={cn("min-h-screen w-full bg-background text-foreground", `theme-${themeId}`)}>{children}</div>
);

// ===========================================================================
// LAYOUT
// ===========================================================================

export const Stack: React.FC<{
  direction?: "row" | "column";
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  children?: React.ReactNode;
}> = ({ direction = "column", gap = 4, align = "stretch", justify = "start", wrap, children }) => {
  const shouldWrap = wrap ?? direction === "row";
  const gapClass = GAP_CLASS[gap] ?? "gap-4";
  return (
    <div
      className={cn(
        "flex max-w-full",
        direction === "row" ? "flex-row" : "flex-col",
        shouldWrap && "flex-wrap",
        "[&>*]:min-w-0",
        gapClass,
        { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" }[align],
        { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" }[justify],
      )}
    >
      {children}
    </div>
  );
};

const CONTAINER_SIZE: Record<string, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

export const Container: React.FC<{
  size?: keyof typeof CONTAINER_SIZE;
  children?: React.ReactNode;
}> = ({ size = "lg", children }) => (
  <div className={cn("mx-auto w-full px-4 sm:px-6", CONTAINER_SIZE[size] ?? CONTAINER_SIZE.lg)}>{children}</div>
);

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

export const Grid: React.FC<{
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: number;
  children?: React.ReactNode;
}> = ({ columns = 2, gap = 4, children }) => (
  <div className={cn("grid", GRID_COLS[columns] ?? GRID_COLS[2], GAP_CLASS[gap] ?? "gap-4")}>{children}</div>
);

export const Spacer: React.FC<{
  size?: number;
  axis?: "vertical" | "horizontal";
}> = ({ size = 4, axis = "vertical" }) => (
  <div
    aria-hidden
    className={axis === "vertical" ? (SIZE_H_CLASS[size] ?? "h-4") : (SIZE_W_CLASS[size] ?? "w-4")}
  />
);

const ASPECT_RATIO: Record<string, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "3:2": "aspect-[3/2]",
  "21:9": "aspect-[21/9]",
};

export const AspectRatio: React.FC<{
  ratio?: keyof typeof ASPECT_RATIO;
  children?: React.ReactNode;
}> = ({ ratio = "16:9", children }) => (
  <div className={cn("relative w-full overflow-hidden rounded-lg", ASPECT_RATIO[ratio] ?? ASPECT_RATIO["16:9"])}>
    {children}
  </div>
);

export const ScrollArea: React.FC<{
  maxHeight?: number;
  children?: React.ReactNode;
}> = ({ maxHeight = 480, children }) => (
  <div style={{ maxHeight }} className="overflow-y-auto rounded-lg border border-border p-4">
    {children}
  </div>
);

export const Divider: React.FC = () => <hr className="border-border my-2" />;

// ===========================================================================
// TYPOGRAPHY
// ===========================================================================

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

export const Lead: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground">{children}</p>
);

export const Quote: React.FC<{ cite?: string; children?: React.ReactNode }> = ({ cite, children }) => (
  <blockquote className="border-l-4 border-border pl-4 py-1 italic text-foreground">
    <p>{children}</p>
    {cite && <footer className="mt-2 text-xs not-italic text-muted-foreground">— {cite}</footer>}
  </blockquote>
);

export const Code: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>
);

export const CodeBlock: React.FC<{ language?: string; children?: React.ReactNode }> = ({ language, children }) => (
  <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-sm">
    <code className={cn("font-mono", language && `language-${language}`)}>{children}</code>
  </pre>
);

export const Link: React.FC<{ href: string; external?: boolean; children?: React.ReactNode }> = ({
  href, external, children,
}) => (
  <a
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noreferrer noopener" : undefined}
    className="text-primary underline underline-offset-4 hover:opacity-80"
  >
    {children}
  </a>
);

export const Kbd: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <kbd className="inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
    {children}
  </kbd>
);

// ===========================================================================
// SURFACES
// ===========================================================================

export const Card: React.FC<{ title?: string; description?: string; children?: React.ReactNode }> = ({
  title, description, children,
}) => (
  <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
    {title && <h3 className="text-base font-semibold leading-none tracking-tight mb-1">{title}</h3>}
    {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
    <div>{children}</div>
  </div>
);

const ALERT_STYLE: Record<string, string> = {
  info: "border-blue-300 bg-blue-50 text-blue-900",
  warn: "border-amber-300 bg-amber-50 text-amber-900",
  error: "border-rose-300 bg-rose-50 text-rose-900",
  success: "border-emerald-300 bg-emerald-50 text-emerald-900",
};

export const Alert: React.FC<{
  variant?: keyof typeof ALERT_STYLE;
  title?: string;
  children?: React.ReactNode;
}> = ({ variant = "info", title, children }) => (
  <div className={cn("rounded-lg border p-4", ALERT_STYLE[variant] ?? ALERT_STYLE.info)}>
    {title && <div className="font-semibold mb-1">{title}</div>}
    {children && <div className="text-sm">{children}</div>}
  </div>
);

export const Badge: React.FC<{ tone?: "default" | "success" | "warn" | "error"; children?: React.ReactNode }> = ({
  tone = "default", children,
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

const AVATAR_SIZE: Record<string, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export const Avatar: React.FC<{ name: string; src?: string; size?: keyof typeof AVATAR_SIZE }> = ({
  name, src, size = "md",
}) => {
  const initials = name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground",
        AVATAR_SIZE[size] ?? AVATAR_SIZE.md,
      )}
      aria-label={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

export const Hero: React.FC<{ title: string; subtitle?: string; children?: React.ReactNode }> = ({
  title, subtitle, children,
}) => (
  <header className="rounded-xl border border-border bg-card text-card-foreground p-8 md:p-12">
    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
    {subtitle && <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>}
    {children && <div className="mt-6">{children}</div>}
  </header>
);

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  icon?: string;
  children?: React.ReactNode;
}> = ({ title, description, icon, children }) => (
  <div className="rounded-lg border border-dashed border-border bg-muted/20 p-10 text-center">
    {icon && <div className="text-4xl mb-3">{icon}</div>}
    <h3 className="text-base font-semibold">{title}</h3>
    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    {children && <div className="mt-4 flex justify-center">{children}</div>}
  </div>
);

// ===========================================================================
// DATA DISPLAY
// ===========================================================================

export const Stat: React.FC<{ label: string; value: string | number; delta?: string; trend?: "up" | "down" | "flat" }> = ({
  label, value, delta, trend,
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
            <RechartsTooltip />
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
            <RechartsTooltip />
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
            <RechartsTooltip />
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

export const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc pl-6 space-y-1 text-sm">
    {items.map((it, i) => (<li key={i}>{it}</li>))}
  </ul>
);

export const NumberList: React.FC<{ items: string[] }> = ({ items }) => (
  <ol className="list-decimal pl-6 space-y-1 text-sm">
    {items.map((it, i) => (<li key={i}>{it}</li>))}
  </ol>
);

export const DefinitionList: React.FC<{ items: { term: string; definition: string }[] }> = ({ items }) => (
  <dl className="divide-y divide-border rounded-lg border border-border">
    {items.map((item, i) => (
      <div key={i} className="grid gap-1 px-4 py-3 sm:grid-cols-[200px_1fr] sm:gap-4">
        <dt className="text-sm font-medium text-muted-foreground">{item.term}</dt>
        <dd className="text-sm">{item.definition}</dd>
      </div>
    ))}
  </dl>
);

export const Progress: React.FC<{ value: number; label?: string }> = ({ value, label }) => {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span className="font-mono tabular-nums">{v}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
};

export const Timeline: React.FC<{ items: { date: string; title: string; description?: string }[] }> = ({ items }) => (
  <ol className="relative ml-3 border-l-2 border-border">
    {items.map((item, i) => (
      <li key={i} className="ml-6 pb-6 last:pb-0">
        <span className="absolute -left-[7px] flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
        <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">{item.date}</div>
        <div className="mt-0.5 text-sm font-semibold">{item.title}</div>
        {item.description && <div className="mt-1 text-sm text-muted-foreground">{item.description}</div>}
      </li>
    ))}
  </ol>
);

// ===========================================================================
// INTERACTIVE (statically rendered — no client state)
// ===========================================================================

const BTN_VARIANT: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-background text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
  destructive: "bg-rose-600 text-white hover:bg-rose-700",
  link: "text-primary underline underline-offset-4 hover:opacity-80 px-0 h-auto",
};
const BTN_SIZE: Record<string, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-6 text-sm",
};

export const Button: React.FC<{
  text: string;
  variant?: keyof typeof BTN_VARIANT;
  size?: keyof typeof BTN_SIZE;
  href?: string;
  external?: boolean;
}> = ({ text, variant = "default", size = "md", href, external }) => {
  const cls = cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors",
    BTN_VARIANT[variant] ?? BTN_VARIANT.default,
    variant !== "link" && (BTN_SIZE[size] ?? BTN_SIZE.md),
  );
  if (href) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined} className={cls}>
        {text}
      </a>
    );
  }
  return <button type="button" className={cls}>{text}</button>;
};

export const Tabs: React.FC<{ items: { label: string; content: React.ReactNode }[] }> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1 border-b border-border">
        {items.map((it, i) => (
          <div
            key={i}
            className={cn(
              "px-3 py-2 text-sm font-medium -mb-px border-b-2",
              i === 0 ? "border-primary text-foreground" : "border-transparent text-muted-foreground",
            )}
          >
            {it.label}
          </div>
        ))}
      </div>
      <div>{items[0].content}</div>
    </div>
  );
};

export const Accordion: React.FC<{
  items: { title: string; content: React.ReactNode }[];
  defaultOpen?: boolean;
}> = ({ items, defaultOpen = true }) => (
  <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
    {items.map((it, i) => (
      <details key={i} className="group" open={defaultOpen}>
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between hover:bg-muted/40">
          <span className="text-sm font-medium">{it.title}</span>
          <span className="text-muted-foreground transition-transform group-open:rotate-90">›</span>
        </summary>
        <div className="px-4 pb-4 text-sm">{it.content}</div>
      </details>
    ))}
  </div>
);

export const Breadcrumb: React.FC<{ items: { text: string; href?: string }[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
    <ol className="flex flex-wrap items-center gap-1.5">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <li key={i} className="flex items-center gap-1.5">
            {it.href && !last ? (
              <a href={it.href} className="hover:text-foreground hover:underline">{it.text}</a>
            ) : (
              <span className={cn(last && "text-foreground font-medium")}>{it.text}</span>
            )}
            {!last && <span className="text-muted-foreground/60">/</span>}
          </li>
        );
      })}
    </ol>
  </nav>
);

export const Tooltip: React.FC<{ hint: string; children?: React.ReactNode }> = ({ hint, children }) => (
  <span title={hint} className="border-b border-dashed border-muted-foreground/40 cursor-help">{children}</span>
);

export const Pagination: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const pages: (number | "…")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }
  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      {pages.map((p, i) => (
        <span
          key={i}
          className={cn(
            "inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md border border-border text-sm",
            p === current ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground",
            p === "…" && "border-transparent",
          )}
        >
          {p}
        </span>
      ))}
    </nav>
  );
};

export const Skeleton: React.FC<{ width?: string; height?: string; count?: number }> = ({
  width = "100%", height = "1rem", count = 1,
}) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse rounded bg-muted" style={{ width, height }} />
    ))}
  </div>
);

// ===========================================================================
// MEDIA
// ===========================================================================

export const Image: React.FC<{
  src: string;
  alt?: string;
  rounded?: boolean;
  width?: number;
  height?: number;
}> = ({ src, alt = "", rounded = true, width, height }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={cn("max-w-full h-auto", rounded && "rounded-lg")}
  />
);

export const Video: React.FC<{
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
}> = ({ src, poster, autoplay = false, loop = false }) => (
  <video
    src={src}
    poster={poster}
    autoPlay={autoplay}
    loop={loop}
    muted={autoplay}
    controls
    className="w-full rounded-lg"
  />
);

export const Iframe: React.FC<{
  src: string;
  title?: string;
  height?: number;
}> = ({ src, title = "embed", height = 400 }) => (
  <iframe
    src={src}
    title={title}
    style={{ height }}
    className="w-full rounded-lg border border-border"
    allowFullScreen
  />
);
