"use client";

import * as React from "react";
import { ThemeSetProvider, type ThemeSet } from "./themed";
import { set as linearSet } from "@/themes/linear";
import { set as vercelSet } from "@/themes/vercel";
import { set as notionSet } from "@/themes/notion";
import { set as stripeSet } from "@/themes/stripe";
import { set as supabaseSet } from "@/themes/supabase";
import { set as appleSet } from "@/themes/apple";

const THEME_SETS: Record<string, ThemeSet> = {
  linear: linearSet,
  vercel: vercelSet,
  notion: notionSet,
  stripe: stripeSet,
  supabase: supabaseSet,
  apple: appleSet,
};

export function ThemedShell({ theme, children }: { theme: string; children: React.ReactNode }) {
  return <ThemeSetProvider value={THEME_SETS[theme] ?? {}}>{children}</ThemeSetProvider>;
}
