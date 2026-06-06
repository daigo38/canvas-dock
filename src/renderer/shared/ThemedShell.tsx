"use client";

import * as React from "react";
import { ThemeSetProvider, type ThemeSet } from "./themed";
import { set as airbnbSet } from "@/themes/airbnb";
import { set as appleSet } from "@/themes/apple";
import { set as beamLibSet } from "@/themes/beam-lib";
import { set as carbonSet } from "@/themes/carbon";
import { set as cinematicDarkSet } from "@/themes/cinematic-dark";
import { set as clickySet } from "@/themes/clicky";
import { set as corporateFintechSet } from "@/themes/corporate-fintech";
import { set as darkOrangeSet } from "@/themes/dark-orange";
import { set as editorialDarkSet } from "@/themes/editorial-dark";
import { set as editorialWarmSet } from "@/themes/editorial-warm";
import { set as figmaSet } from "@/themes/figma";
import { set as glassmorphicDarkSet } from "@/themes/glassmorphic-dark";
import { set as insetDarkSet } from "@/themes/inset-dark";
import { set as lightMarketplaceSet } from "@/themes/light-marketplace";
import { set as linearSet } from "@/themes/linear";
import { set as linearQualitySet } from "@/themes/linear-quality";
import { set as lumenDarkSet } from "@/themes/lumen-dark";
import { set as metalFxChromaticSet } from "@/themes/metal-fx-chromatic";
import { set as metalFxGoldSet } from "@/themes/metal-fx-gold";
import { set as metalFxSilverSet } from "@/themes/metal-fx-silver";
import { set as midnightGlassSet } from "@/themes/midnight-glass";
import { set as minimalLightSet } from "@/themes/minimal-light";
import { set as monochromeIndustrialSet } from "@/themes/monochrome-industrial";
import { set as neutralMonochromeSet } from "@/themes/neutral-monochrome";
import { set as notionSet } from "@/themes/notion";
import { set as pebbleSet } from "@/themes/pebble";
import { set as pillowLightSet } from "@/themes/pillow-light";
import { set as precisionLightSet } from "@/themes/precision-light";
import { set as romanesqueSet } from "@/themes/romanesque";
import { set as skeuoNextSet } from "@/themes/skeuo-next";
import { set as sonicAirySet } from "@/themes/sonic-airy";
import { set as sonicBrightSet } from "@/themes/sonic-bright";
import { set as sonicGlassySet } from "@/themes/sonic-glassy";
import { set as sonicLofiSet } from "@/themes/sonic-lofi";
import { set as sonicMetallicSet } from "@/themes/sonic-metallic";
import { set as sonicOrganicSet } from "@/themes/sonic-organic";
import { set as sonicPunchySet } from "@/themes/sonic-punchy";
import { set as sonicRetroSet } from "@/themes/sonic-retro";
import { set as sonicWarmSet } from "@/themes/sonic-warm";
import { set as squircleSet } from "@/themes/squircle";
import { set as stripeSet } from "@/themes/stripe";
import { set as supabaseSet } from "@/themes/supabase";
import { set as tvStyleSet } from "@/themes/tv-style";
import { set as vercelSet } from "@/themes/vercel";
import { set as vibrantDarkSet } from "@/themes/vibrant-dark";

const THEME_SETS: Record<string, ThemeSet> = {
  "airbnb": airbnbSet,
  "apple": appleSet,
  "beam-lib": beamLibSet,
  "carbon": carbonSet,
  "cinematic-dark": cinematicDarkSet,
  "clicky": clickySet,
  "corporate-fintech": corporateFintechSet,
  "dark-orange": darkOrangeSet,
  "editorial-dark": editorialDarkSet,
  "editorial-warm": editorialWarmSet,
  "figma": figmaSet,
  "glassmorphic-dark": glassmorphicDarkSet,
  "inset-dark": insetDarkSet,
  "light-marketplace": lightMarketplaceSet,
  "linear": linearSet,
  "linear-quality": linearQualitySet,
  "lumen-dark": lumenDarkSet,
  "metal-fx-chromatic": metalFxChromaticSet,
  "metal-fx-gold": metalFxGoldSet,
  "metal-fx-silver": metalFxSilverSet,
  "midnight-glass": midnightGlassSet,
  "minimal-light": minimalLightSet,
  "monochrome-industrial": monochromeIndustrialSet,
  "neutral-monochrome": neutralMonochromeSet,
  "notion": notionSet,
  "pebble": pebbleSet,
  "pillow-light": pillowLightSet,
  "precision-light": precisionLightSet,
  "romanesque": romanesqueSet,
  "skeuo-next": skeuoNextSet,
  "sonic-airy": sonicAirySet,
  "sonic-bright": sonicBrightSet,
  "sonic-glassy": sonicGlassySet,
  "sonic-lofi": sonicLofiSet,
  "sonic-metallic": sonicMetallicSet,
  "sonic-organic": sonicOrganicSet,
  "sonic-punchy": sonicPunchySet,
  "sonic-retro": sonicRetroSet,
  "sonic-warm": sonicWarmSet,
  "squircle": squircleSet,
  "stripe": stripeSet,
  "supabase": supabaseSet,
  "tv-style": tvStyleSet,
  "vercel": vercelSet,
  "vibrant-dark": vibrantDarkSet,
};

export function ThemedShell({ theme, children }: { theme: string; children: React.ReactNode }) {
  return <ThemeSetProvider value={THEME_SETS[theme] ?? {}}>{children}</ThemeSetProvider>;
}
