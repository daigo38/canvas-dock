import { BETTER_DESIGN_THEMES } from "./betterDesignCatalog";

export interface ThemeManifest {
  id: string;
  label: string;
  source: "better-design";
  description: string;
}

export const THEMES: ThemeManifest[] = BETTER_DESIGN_THEMES.map((theme) => ({
  ...theme,
  source: "better-design",
}));

export type ThemeId = (typeof THEMES)[number]["id"];

export function isValidThemeId(id: string): id is ThemeId {
  return THEMES.some((t) => t.id === id);
}

export function getTheme(id: string): ThemeManifest {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
