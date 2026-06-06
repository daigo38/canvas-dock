export interface ThemeManifest {
  id: string;
  label: string;
  source: "better-design";
  description: string;
}

export const THEMES: ThemeManifest[] = [
  { id: "linear", label: "Linear", source: "better-design", description: "Dark developer-tool, purple primary." },
  { id: "vercel", label: "Vercel", source: "better-design", description: "Minimal black & white." },
  { id: "notion", label: "Notion", source: "better-design", description: "Document-style, warm neutrals." },
  { id: "stripe", label: "Stripe", source: "better-design", description: "Commercial dashboard, blue primary." },
  { id: "supabase", label: "Supabase", source: "better-design", description: "Developer dashboard, green accents." },
  { id: "apple", label: "Apple", source: "better-design", description: "Bright, rounded, soft shadows." },
];

export type ThemeId = (typeof THEMES)[number]["id"];

export function isValidThemeId(id: string): id is ThemeId {
  return THEMES.some((t) => t.id === id);
}

export function getTheme(id: string): ThemeManifest {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
