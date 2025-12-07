export const SECTION_TYPES = [
  { id: "hero", label: "Hero" },
  { id: "feature", label: "Feature grid" },
  { id: "cta", label: "Call to action" },
  { id: "testimonials", label: "Testimonials" },
] as const;

export const LAYOUT_OPTIONS = [
  { id: "full-span", label: "Full span" },
  { id: "split", label: "Split" },
  { id: "bento", label: "Bento" },
  { id: "sidebar", label: "Sidebar" },
] as const;

export const PRESENTATION_SHELLS = [
  { id: "browser", label: "Browser chrome" },
  { id: "card", label: "Card" },
  { id: "fullscreen", label: "Fullscreen" },
] as const;

export const STYLE_FAMILIES = [
  { id: "minimal", label: "Minimal" },
  { id: "glass", label: "Glassmorphism" },
  { id: "liquid", label: "Liquid gradient" },
  { id: "dark", label: "Dark tech" },
] as const;

export const TYPOGRAPHY_PRESETS = [
  { id: "geist", label: "Geist / Geist Mono" },
  { id: "instrument", label: "Instrument Serif / sans" },
  { id: "jakarta", label: "Plus Jakarta Sans" },
  { id: "newsreader", label: "Newsreader / Space Grotesk" },
] as const;

export type SectionType = (typeof SECTION_TYPES)[number]["id"];
export type LayoutOption = (typeof LAYOUT_OPTIONS)[number]["id"];
export type PresentationShell = (typeof PRESENTATION_SHELLS)[number]["id"];
export type StyleFamily = (typeof STYLE_FAMILIES)[number]["id"];
export type TypographyPreset = (typeof TYPOGRAPHY_PRESETS)[number]["id"];

export const DEFAULT_PROMPT_SELECTIONS = {
  sectionType: SECTION_TYPES[0].id,
  layout: LAYOUT_OPTIONS[0].id,
  presentation: PRESENTATION_SHELLS[0].id,
  style: STYLE_FAMILIES[0].id,
  typography: TYPOGRAPHY_PRESETS[0].id,
};
