"use client";

/* eslint-disable react-hooks/static-components */

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

// Better Design rendering layer. This file intentionally does not import
// `./primitives`: if a theme does not provide a component from better-design,
// rendering should fail visibly instead of falling back to Canvas Dock UI.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComp = React.ComponentType<any>;

export interface ThemeSet {
  Button?: AnyComp;
  Card?: AnyComp;
  CardHeader?: AnyComp;
  CardTitle?: AnyComp;
  CardDescription?: AnyComp;
  CardContent?: AnyComp;
  Badge?: AnyComp;
  Alert?: AnyComp;
  AlertTitle?: AnyComp;
  AlertDescription?: AnyComp;
  Separator?: AnyComp;
  StatCard?: AnyComp;
  DataTable?: AnyComp;
  Progress?: AnyComp;
  Empty?: AnyComp;
  SectionHeader?: AnyComp;
  CodeBlock?: AnyComp;
  Avatar?: AnyComp;
  AvatarImage?: AnyComp;
  AvatarFallback?: AnyComp;
  Kbd?: AnyComp;
  H1?: AnyComp;
  H2?: AnyComp;
  H3?: AnyComp;
  H4?: AnyComp;
  P?: AnyComp;
  Lead?: AnyComp;
  Large?: AnyComp;
  Small?: AnyComp;
  Muted?: AnyComp;
  Blockquote?: AnyComp;
  Code?: AnyComp;
  InlineCode?: AnyComp;
  Tabs?: AnyComp;
  TabsList?: AnyComp;
  TabsTrigger?: AnyComp;
  TabsContent?: AnyComp;
  Accordion?: AnyComp;
  AccordionItem?: AnyComp;
  AccordionTrigger?: AnyComp;
  AccordionContent?: AnyComp;
  Breadcrumb?: AnyComp;
  BreadcrumbList?: AnyComp;
  BreadcrumbItem?: AnyComp;
  BreadcrumbLink?: AnyComp;
  BreadcrumbPage?: AnyComp;
  BreadcrumbSeparator?: AnyComp;
  Tooltip?: AnyComp;
  TooltipTrigger?: AnyComp;
  TooltipContent?: AnyComp;
  TooltipProvider?: AnyComp;
  Pagination?: AnyComp;
  PaginationContent?: AnyComp;
  PaginationItem?: AnyComp;
  PaginationLink?: AnyComp;
  PaginationNext?: AnyComp;
  PaginationPrevious?: AnyComp;
  PaginationEllipsis?: AnyComp;
  Skeleton?: AnyComp;
  ChartContainer?: AnyComp;
  ChartTooltip?: AnyComp;
  ChartTooltipContent?: AnyComp;
  ChartLegend?: AnyComp;
  ChartLegendContent?: AnyComp;
}

const ThemeSetContext = React.createContext<ThemeSet>({});
export const ThemeSetProvider = ThemeSetContext.Provider;
const useTheme = () => React.useContext(ThemeSetContext);

function MissingBetterDesignComponent({ name }: { name: string }) {
  return (
    <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
      Missing better-design component: {name}
    </div>
  );
}

function requireComponent(theme: ThemeSet, name: keyof ThemeSet): AnyComp | null {
  return theme[name] ?? null;
}

export function SectionHeader({
  title,
  description,
  size = "md",
}: {
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}) {
  const t = useTheme();
  const C = requireComponent(t, "SectionHeader");
  return C ? <C title={title} description={description} size={size} /> : <MissingBetterDesignComponent name="section-header" />;
}

export function Card({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const t = useTheme();
  const TCard = requireComponent(t, "Card");
  const THeader = requireComponent(t, "CardHeader");
  const TTitle = requireComponent(t, "CardTitle");
  const TDesc = requireComponent(t, "CardDescription");
  const TContent = requireComponent(t, "CardContent");
  if (!TCard || !TContent) return <MissingBetterDesignComponent name="card" />;
  return (
    <TCard>
      {(title || description) && THeader && (
        <THeader>
          {title && TTitle && <TTitle>{title}</TTitle>}
          {description && TDesc && <TDesc>{description}</TDesc>}
        </THeader>
      )}
      <TContent className={cn("flex flex-col gap-4", !title && !description && "pt-6")}>{children}</TContent>
    </TCard>
  );
}

export function StatCard({
  label,
  value,
  change,
  trend,
  description,
}: {
  label: string;
  value: string | number;
  change?: string | number;
  trend?: "up" | "down" | "neutral";
  description?: string;
}) {
  const t = useTheme();
  const C = requireComponent(t, "StatCard");
  if (!C) return <MissingBetterDesignComponent name="stat-card" />;
  return (
    <C
      label={label}
      value={value}
      change={change ? { value: change, trend: trend ?? "neutral" } : undefined}
      description={description}
    />
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; header: string; sortable?: boolean }[];
  rows: Record<string, unknown>[];
}) {
  const t = useTheme();
  const C = requireComponent(t, "DataTable");
  return C ? <C columns={columns} data={rows} /> : <MissingBetterDesignComponent name="data-table" />;
}

export function Text({ children, variant = "p" }: { children?: React.ReactNode; variant?: "p" | "lead" | "muted" | "large" | "small" }) {
  const t = useTheme();
  const map: Record<string, keyof ThemeSet> = { p: "P", lead: "Lead", muted: "Muted", large: "Large", small: "Small" };
  const C = requireComponent(t, map[variant]);
  return C ? <C>{children}</C> : <MissingBetterDesignComponent name="typography" />;
}

export function Heading({ level = 2, children }: { level?: 1 | 2 | 3 | 4; children?: React.ReactNode }) {
  const t = useTheme();
  const C = requireComponent(t, ({ 1: "H1", 2: "H2", 3: "H3", 4: "H4" } as const)[level]);
  return C ? <C>{children}</C> : <MissingBetterDesignComponent name="typography" />;
}

export function Quote({ children }: { children?: React.ReactNode }) {
  const t = useTheme();
  const C = requireComponent(t, "Blockquote");
  return C ? <C>{children}</C> : <MissingBetterDesignComponent name="typography" />;
}

export function Code({ children }: { children?: React.ReactNode }) {
  const t = useTheme();
  const C = requireComponent(t, "InlineCode");
  return C ? <C>{children}</C> : <MissingBetterDesignComponent name="typography" />;
}

export function CodeBlock({ code, language, filename }: { code: string; language?: string; filename?: string }) {
  const t = useTheme();
  const C = requireComponent(t, "CodeBlock");
  return C ? <C code={code} language={language} filename={filename} /> : <MissingBetterDesignComponent name="code-block" />;
}

export function Button({
  text,
  variant = "default",
  size = "default",
  href,
  external,
}: {
  text: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "default" | "lg";
  href?: string;
  external?: boolean;
}) {
  const t = useTheme();
  const C = requireComponent(t, "Button");
  if (!C) return <MissingBetterDesignComponent name="button" />;
  if (href) {
    return (
      <C asChild variant={variant} size={size}>
        <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined}>
          {text}
        </a>
      </C>
    );
  }
  return <C variant={variant} size={size}>{text}</C>;
}

export function Badge({
  text,
  variant = "default",
  size = "default",
}: {
  text: string;
  variant?: string;
  size?: "sm" | "default" | "lg";
}) {
  const t = useTheme();
  const C = requireComponent(t, "Badge");
  return C ? <C variant={variant} size={size}>{text}</C> : <MissingBetterDesignComponent name="badge" />;
}

export function Alert({
  title,
  variant = "default",
  children,
}: {
  title?: string;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
}) {
  const t = useTheme();
  const TAlert = requireComponent(t, "Alert");
  const TTitle = requireComponent(t, "AlertTitle");
  const TDesc = requireComponent(t, "AlertDescription");
  if (!TAlert) return <MissingBetterDesignComponent name="alert" />;
  return (
    <TAlert variant={variant}>
      {title && TTitle && <TTitle>{title}</TTitle>}
      {children && TDesc && <TDesc>{children}</TDesc>}
    </TAlert>
  );
}

export function Separator() {
  const t = useTheme();
  const C = requireComponent(t, "Separator");
  return C ? <C /> : <MissingBetterDesignComponent name="separator" />;
}

export function Progress({ value }: { value: number }) {
  const t = useTheme();
  const C = requireComponent(t, "Progress");
  return C ? <C value={Math.max(0, Math.min(100, value))} /> : <MissingBetterDesignComponent name="progress" />;
}

export function Empty({ title, description }: { title: string; description?: string }) {
  const t = useTheme();
  const C = requireComponent(t, "Empty");
  return C ? <C title={title} description={description} /> : <MissingBetterDesignComponent name="empty" />;
}

export function Avatar({ name, src }: { name: string; src?: string }) {
  const t = useTheme();
  const TAvatar = requireComponent(t, "Avatar");
  const TImage = requireComponent(t, "AvatarImage");
  const TFallback = requireComponent(t, "AvatarFallback");
  if (!TAvatar || !TFallback) return <MissingBetterDesignComponent name="avatar" />;
  const initials = name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return (
    <TAvatar aria-label={name}>
      {src && TImage && <TImage src={src} alt={name} />}
      <TFallback>{initials}</TFallback>
    </TAvatar>
  );
}

export function Kbd({ children }: { children?: React.ReactNode }) {
  const t = useTheme();
  const C = requireComponent(t, "Kbd");
  return C ? <C>{children}</C> : <MissingBetterDesignComponent name="kbd" />;
}

export function Tabs({ items }: { items: { label: string; content: React.ReactNode }[] }) {
  const t = useTheme();
  const TTabs = requireComponent(t, "Tabs");
  const TList = requireComponent(t, "TabsList");
  const TTrigger = requireComponent(t, "TabsTrigger");
  const TContent = requireComponent(t, "TabsContent");
  if (!TTabs || !TList || !TTrigger || !TContent) return <MissingBetterDesignComponent name="tabs" />;
  const first = items[0]?.label ?? "tab-0";
  return (
    <TTabs defaultValue={first}>
      <TList>
        {items.map((item) => <TTrigger key={item.label} value={item.label}>{item.label}</TTrigger>)}
      </TList>
      {items.map((item) => <TContent key={item.label} value={item.label}>{item.content}</TContent>)}
    </TTabs>
  );
}

export function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const t = useTheme();
  const TAccordion = requireComponent(t, "Accordion");
  const TItem = requireComponent(t, "AccordionItem");
  const TTrigger = requireComponent(t, "AccordionTrigger");
  const TContent = requireComponent(t, "AccordionContent");
  if (!TAccordion || !TItem || !TTrigger || !TContent) return <MissingBetterDesignComponent name="accordion" />;
  return (
    <TAccordion type="single" collapsible defaultValue="item-0">
      {items.map((item, index) => (
        <TItem key={index} value={`item-${index}`}>
          <TTrigger>{item.title}</TTrigger>
          <TContent>{item.content}</TContent>
        </TItem>
      ))}
    </TAccordion>
  );
}

export function Breadcrumb({ items }: { items: { text: string; href?: string }[] }) {
  const t = useTheme();
  const TBreadcrumb = requireComponent(t, "Breadcrumb");
  const TList = requireComponent(t, "BreadcrumbList");
  const TItem = requireComponent(t, "BreadcrumbItem");
  const TLink = requireComponent(t, "BreadcrumbLink");
  const TPage = requireComponent(t, "BreadcrumbPage");
  const TSep = requireComponent(t, "BreadcrumbSeparator");
  if (!TBreadcrumb || !TList || !TItem || !TLink || !TPage || !TSep) return <MissingBetterDesignComponent name="breadcrumb" />;
  return (
    <TBreadcrumb>
      <TList>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <React.Fragment key={`${item.text}-${index}`}>
              <TItem>{item.href && !last ? <TLink href={item.href}>{item.text}</TLink> : <TPage>{item.text}</TPage>}</TItem>
              {!last && <TSep />}
            </React.Fragment>
          );
        })}
      </TList>
    </TBreadcrumb>
  );
}

export function Tooltip({ text, hint }: { text: string; hint: string }) {
  const t = useTheme();
  const TProvider = requireComponent(t, "TooltipProvider");
  const TTooltip = requireComponent(t, "Tooltip");
  const TTrigger = requireComponent(t, "TooltipTrigger");
  const TContent = requireComponent(t, "TooltipContent");
  if (!TProvider || !TTooltip || !TTrigger || !TContent) return <MissingBetterDesignComponent name="tooltip" />;
  return (
    <TProvider>
      <TTooltip>
        <TTrigger asChild><span className="underline decoration-dotted underline-offset-4">{text}</span></TTrigger>
        <TContent>{hint}</TContent>
      </TTooltip>
    </TProvider>
  );
}

export function Pagination({ current, total }: { current: number; total: number }) {
  const t = useTheme();
  const TPagination = requireComponent(t, "Pagination");
  const TContent = requireComponent(t, "PaginationContent");
  const TItem = requireComponent(t, "PaginationItem");
  const TLink = requireComponent(t, "PaginationLink");
  const TPrev = requireComponent(t, "PaginationPrevious");
  const TNext = requireComponent(t, "PaginationNext");
  const TEllipsis = requireComponent(t, "PaginationEllipsis");
  if (!TPagination || !TContent || !TItem || !TLink || !TPrev || !TNext || !TEllipsis) {
    return <MissingBetterDesignComponent name="pagination" />;
  }
  const pages = Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1);
  return (
    <TPagination>
      <TContent>
        <TItem><TPrev href="#" /></TItem>
        {pages.map((page) => <TItem key={page}><TLink href="#" isActive={page === current}>{page}</TLink></TItem>)}
        {total > 5 && <TItem><TEllipsis /></TItem>}
        <TItem><TNext href="#" /></TItem>
      </TContent>
    </TPagination>
  );
}

export function Skeleton({ width = "100%", height = 24 }: { width?: string; height?: number }) {
  const t = useTheme();
  const C = requireComponent(t, "Skeleton");
  return C ? <C style={{ width, height }} /> : <MissingBetterDesignComponent name="skeleton" />;
}

type ChartDatum = Record<string, string | number>;
const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

export function Chart({
  type,
  data,
  xKey = "name",
  yKey = "value",
  nameKey = "name",
  valueKey = "value",
  height = 280,
}: {
  type: "bar" | "line" | "pie";
  data: ChartDatum[];
  xKey?: string;
  yKey?: string | string[];
  nameKey?: string;
  valueKey?: string;
  height?: number;
}) {
  const t = useTheme();
  const Container = requireComponent(t, "ChartContainer");
  const Tooltip = requireComponent(t, "ChartTooltip");
  const LegendComp = requireComponent(t, "ChartLegend");
  const Loading = requireComponent(t, "Skeleton");
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!Container || !Tooltip || !LegendComp) return <MissingBetterDesignComponent name="chart" />;
  if (!mounted) {
    return Loading ? <Loading style={{ height, width: "100%" }} /> : <MissingBetterDesignComponent name="skeleton" />;
  }
  const yKeys = Array.isArray(yKey) ? yKey : [yKey];
  const config = Object.fromEntries(yKeys.map((key, index) => [key, { label: key, color: CHART_COLORS[index % CHART_COLORS.length] }]));
  return (
    <Container config={config} style={{ height }} className="w-full">
      {type === "bar" ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => <Bar key={key} dataKey={key} fill={CHART_COLORS[index % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />)}
        </BarChart>
      ) : type === "line" ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={2} />)}
        </LineChart>
      ) : (
        <PieChart>
          <Tooltip />
          <LegendComp />
          <Pie data={data} dataKey={valueKey} nameKey={nameKey} outerRadius={100} label>
            {data.map((_, index) => <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
          </Pie>
        </PieChart>
      )}
    </Container>
  );
}
