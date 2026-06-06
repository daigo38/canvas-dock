import type { PageRecord } from "./store";

const CREATED_AT = "2026-06-06T00:00:00.000Z";

const themeShowcasePayload = (themeName: string) => `root = Card([hdr, lead, metrics, status, formCard, process, events, notice], "${themeName} Theme Gallery", "Preset page rendered with the ${themeName} better-design theme")
hdr = SectionHeader("${themeName}", "Buttons, cards, data, forms, process, and feedback in one compact view.", "lg")
lead = Text("This page is stored in the repository as a Canvas Dock preset, not generated into data/pages.", "muted")
metrics = Card([stat1, stat2, progress], "Metrics")
stat1 = StatCard("Activation", "84%", "+9%", "up", "last 30 days")
stat2 = StatCard("Latency", "128ms", "-16ms", "down", "p95 response")
progress = Progress(68)
status = Card([online, rating], "Signals")
online = StatusIndicator("online", true, "md", true)
rating = Rating(4, 5, "md")
formCard = Card([field, textarea], "Inputs")
field = Field([email], "Email", "Static better-design input inside a better-design field.")
email = Input("team@example.com", "", "email", false)
textarea = Textarea("Notes", "Everything visible here is backed by better-design components.", 4, false)
process = Card([steps], "Workflow")
steps = Steps([{title: "Load preset", description: "Read from repository"}, {title: "Apply theme", description: "Use ${themeName}"}, {title: "Render page", description: "No local fallback UI"}], 1, "horizontal")
events = Card([timeline], "Timeline")
timeline = Timeline([{title: "Preset loaded", date: "09:00", variant: "success"}, {title: "Theme applied", date: "09:01", variant: "default"}, {title: "Verified", date: "09:02", variant: "success"}])
notice = Notification("Theme preset", "This gallery uses the ${themeName} theme and explicit better-design adapters.", "success", true)
`;

const componentGalleryPayload = `root = Card([hdr, intro, stats, controls, formCard, tableCard, chartCard, processCard, feedbackCard, textCard], "Component Gallery", "Repository preset for supported better-design adapters")
hdr = SectionHeader("Component Gallery", "Friendly OpenUI signatures mapped to better-design components.", "lg")
intro = Text("This preset intentionally shows only explicit adapters. Compound components are added only after their usage is made safe.", "muted")
stats = Card([stat1, stat2, progress, status], "Metrics and Status")
stat1 = StatCard("Supported adapters", "35", "+11", "up", "explicit signatures")
stat2 = StatCard("Fallbacks", "0", "policy", "neutral", "missing components fail visibly")
progress = Progress(76)
status = StatusIndicator("online", true, "md", true)
controls = Card([button, badge, tip, spinner], "Actions")
button = Button("Open registry", "default", "default", "https://www.better-design.com", true)
badge = Badge("better-design", "primary", "default")
tip = Tooltip("Policy", "Only better-design-backed adapters are exposed.")
spinner = Spinner("sm")
formCard = Card([field, textarea], "Forms")
field = Field([email], "Email", "Input and Field are better-design components.")
email = Input("Email", "", "email", false)
textarea = Textarea("Notes", "Textarea is rendered from better-design.", 4, false)
tableCard = Card([table], "Table")
table = SimpleTable([{key: "component", header: "Component"}, {key: "source", header: "Source"}], [{component: "Input", source: "better-design/input"}, {component: "Timeline", source: "better-design/timeline"}, {component: "Notification", source: "better-design/notification"}], "Explicit adapter coverage")
chartCard = Card([chart], "Chart")
chart = Chart("bar", [{name: "Card", value: 8}, {name: "Data", value: 7}, {name: "Input", value: 5}], "name", "value")
processCard = Card([steps, timeline], "Process")
steps = Steps([{title: "Import", description: "Bring component from better-design"}, {title: "Adapt", description: "Define safe signature"}, {title: "Verify", description: "Lint, build, render"}], 1, "horizontal")
timeline = Timeline([{title: "Theme sets loaded", date: "Step 1", variant: "success"}, {title: "Adapters rendered", date: "Step 2", variant: "default"}])
feedbackCard = Card([rating, notification], "Feedback")
rating = Rating(4, 5, "md")
notification = Notification("Adapter ready", "The component uses a declared signature and no custom visual fallback.", "success", true)
textCard = Card([h, quote, code, codeBlock, empty], "Typography")
h = Heading("Typography", 2)
quote = Quote("Expose components only when the calling shape is clear.")
code = Code("Field wraps an Input child")
codeBlock = CodeBlock("input = Input('Email', '', 'email', false)", "openui", "component.openui")
empty = Empty("No more components", "Add more adapters intentionally.")
`;

const themePresets = [
  ["preset-theme-linear", "linear", "Linear Theme Gallery", "Linear"],
  ["preset-theme-vercel", "vercel", "Vercel Theme Gallery", "Vercel"],
  ["preset-theme-notion", "notion", "Notion Theme Gallery", "Notion"],
  ["preset-theme-stripe", "stripe", "Stripe Theme Gallery", "Stripe"],
  ["preset-theme-supabase", "supabase", "Supabase Theme Gallery", "Supabase"],
  ["preset-theme-apple", "apple", "Apple Theme Gallery", "Apple"],
] as const;

export const PRESET_PAGES: PageRecord[] = [
  {
    slug: "preset-components",
    kind: "openui",
    project: "preset",
    theme: "vercel",
    title: "Component Gallery",
    payload: componentGalleryPayload,
    createdAt: CREATED_AT,
    expiresAt: null,
  },
  ...themePresets.map(([slug, theme, title, label]) => ({
    slug,
    kind: "openui" as const,
    project: "preset",
    theme,
    title,
    payload: themeShowcasePayload(label),
    createdAt: CREATED_AT,
    expiresAt: null,
  })),
];

export function getPresetPage(slug: string) {
  return PRESET_PAGES.find((page) => page.slug === slug) ?? null;
}
