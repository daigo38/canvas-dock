"use client";

import * as React from "react";
import * as P from "./primitives";

// Themed primitive layer. Re-exports every name from `./primitives` so callers
// (OpenUI library, A2UI renderer) can swap a single import and get the new
// behavior. Components that have a per-theme equivalent in
// `src/themes/<slug>/components/ui/` use a React context to look up the
// theme-specific implementation; everything else falls through to the
// hand-written primitives.

// ---------------------------------------------------------------------------
// Theme context
// ---------------------------------------------------------------------------

/**
 * The subset of shadcn primitives a theme can override.
 * Each theme has its own narrower prop types (cva-derived literal unions etc.)
 * — keeping the slots `any` here avoids cross-theme type incompatibility.
 */
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
}

const ThemeSetContext = React.createContext<ThemeSet>({});
export const ThemeSetProvider = ThemeSetContext.Provider;
const useTheme = () => React.useContext(ThemeSetContext);

// ---------------------------------------------------------------------------
// Pass-through re-exports (no per-theme variant exists)
// ---------------------------------------------------------------------------
export {
  ThemeWrapper, Stack, Container, Grid, Spacer, AspectRatio, ScrollArea,
  Heading, Text, Lead, Quote, Code, CodeBlock, Link, Kbd,
  Stat, Chart, DataTable, BulletList, NumberList, DefinitionList, Progress, Timeline,
  Avatar, Hero, EmptyState,
  Tabs, Accordion, Breadcrumb, Tooltip, Pagination, Skeleton,
  Image, Video, Iframe,
} from "./primitives";

// ---------------------------------------------------------------------------
// Themable overrides
// ---------------------------------------------------------------------------

const mapSize = (s?: string): string => (s === "md" ? "default" : (s ?? "default"));

export const Button: typeof P.Button = (props) => {
  const t = useTheme();
  if (!t.Button) return <P.Button {...props} />;
  const { text, variant, size, href, external } = props;
  const v = (variant ?? "default") as string;
  const s = mapSize(size);
  if (href) {
    return (
      <t.Button asChild variant={v} size={s}>
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
        >
          {text}
        </a>
      </t.Button>
    );
  }
  return (
    <t.Button variant={v} size={s}>
      {text}
    </t.Button>
  );
};

export const Card: typeof P.Card = ({ title, description, children }) => {
  const t = useTheme();
  if (!t.Card || !t.CardContent) {
    return <P.Card title={title} description={description}>{children}</P.Card>;
  }
  const TCard = t.Card;
  const THeader = t.CardHeader;
  const TTitle = t.CardTitle;
  const TDesc = t.CardDescription;
  const TContent = t.CardContent;
  return (
    <TCard>
      {(title || description) && THeader && (
        <THeader>
          {title && TTitle && <TTitle>{title}</TTitle>}
          {description && TDesc && <TDesc>{description}</TDesc>}
        </THeader>
      )}
      <TContent>{children}</TContent>
    </TCard>
  );
};

const TONE_TO_VARIANT: Record<string, string> = {
  default: "default",
  success: "default",
  warn: "secondary",
  error: "destructive",
};

export const Badge: typeof P.Badge = ({ tone, children }) => {
  const t = useTheme();
  if (!t.Badge) return <P.Badge tone={tone}>{children}</P.Badge>;
  const TBadge = t.Badge;
  return <TBadge variant={TONE_TO_VARIANT[tone ?? "default"]}>{children}</TBadge>;
};

export const Alert: typeof P.Alert = ({ variant, title, children }) => {
  const t = useTheme();
  if (!t.Alert) return <P.Alert variant={variant} title={title}>{children}</P.Alert>;
  const TAlert = t.Alert;
  const TTitle = t.AlertTitle;
  const TDesc = t.AlertDescription;
  const v = variant === "error" ? "destructive" : "default";
  return (
    <TAlert variant={v}>
      {title && TTitle && <TTitle>{title}</TTitle>}
      {children && TDesc && <TDesc>{children}</TDesc>}
    </TAlert>
  );
};

export const Divider: typeof P.Divider = () => {
  const t = useTheme();
  if (!t.Separator) return <P.Divider />;
  const TSeparator = t.Separator;
  return <TSeparator className="my-2" />;
};
