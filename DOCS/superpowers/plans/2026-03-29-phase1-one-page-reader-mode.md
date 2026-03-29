# Phase 1: One-Page Portfolio + Reader Mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 14-route portfolio into a single-page scrolling experience with admin-switchable modes (one-page / multi-page / reader) and a Firefox-style reader mode.

**Architecture:** Extract each route's content into reusable `*Section.svelte` components under `src/lib/sections/`. Build a `OnePageView.svelte` that composes all sections with scroll spy, lazy loading, and parallax transitions. Mode switching is driven by a Convex `siteConfig` table, toggled from admin. Reader mode applies a CSS class + Svelte context flag that strips all visual noise.

**Tech Stack:** SvelteKit 2 + Svelte 5 (traditional reactive, not runes — matches codebase), Convex for siteConfig persistence, IntersectionObserver for scroll spy + lazy loading, CSS transforms for parallax.

**Post-implementation:** Run Validator agent then Minifier agent serially until both return "All clean."

---

## File Structure

### New Files
```
src/lib/sections/
├── index.ts                    ← Section metadata registry + re-exports
├── HeroSection.svelte          ← From src/routes/+page.svelte
├── WorksSection.svelte         ← From src/routes/works/+page.svelte
├── TalksSection.svelte         ← From src/routes/talks/+page.svelte
├── CvSection.svelte            ← From src/routes/cv/+page.svelte
├── TerminalSection.svelte      ← From src/routes/terminal/+page.svelte
├── AcademiaSection.svelte      ← From src/routes/academia/+page.svelte
├── BlogSection.svelte          ← From src/routes/blog/+page.svelte
├── ProcessSection.svelte       ← From src/routes/process/+page.svelte
├── GallerySection.svelte       ← From src/routes/gallery/+page.svelte
├── LikesSection.svelte         ← From src/routes/likes/+page.svelte
├── MinorSection.svelte         ← From src/routes/minor/+page.svelte
├── GiftsSection.svelte         ← From src/routes/gifts/+page.svelte
└── OsSection.svelte            ← From src/routes/os/+page.svelte

src/lib/components/
├── OnePageView.svelte          ← Composes all sections, scroll spy, parallax
└── ReaderToggle.svelte         ← Reader mode toggle button (optional, for nav)

src/lib/stores/
└── siteMode.ts                 ← Svelte store for mode + reader state

convex/
├── siteConfig.ts               ← CRUD for site configuration
└── schema.ts                   ← Add siteConfig + featureFlags tables
```

### Modified Files
```
src/routes/+layout.svelte       ← Mode switching, reader mode class, new nav
src/routes/+page.svelte         ← Conditionally render OnePageView or HeroSection
src/routes/works/+page.svelte   ← Thin wrapper importing WorksSection
src/routes/talks/+page.svelte   ← Thin wrapper importing TalksSection
src/routes/cv/+page.svelte      ← Thin wrapper importing CvSection
src/routes/terminal/+page.svelte ← Thin wrapper importing TerminalSection
src/routes/academia/+page.svelte ← Thin wrapper importing AcademiaSection
src/routes/blog/+page.svelte    ← Pass data to BlogSection (Sanity load)
src/routes/process/+page.svelte ← Thin wrapper
src/routes/gallery/+page.svelte ← Thin wrapper
src/routes/likes/+page.svelte   ← Thin wrapper
src/routes/minor/+page.svelte   ← Thin wrapper
src/routes/gifts/+page.svelte   ← Thin wrapper
src/routes/os/+page.svelte      ← Thin wrapper
src/app.css                     ← Reader mode styles, section transitions
src/lib/components/CommandPalette.svelte ← Add j/k nav + r reader toggle
```

---

## Task 1: Convex Schema + Site Config Functions

**Files:**
- Modify: `convex/schema.ts`
- Create: `convex/siteConfig.ts`
- Create: `convex/helpers.ts` (if not exists — check for `stripUndefined`)

**Context:** The existing schema has tables for cv, works, talks, academia. We add `siteConfig` (singleton row for global settings) and `featureFlags` (per-feature toggles). Existing pattern: all mutations use `stripUndefined` from a helpers module, all queries use `.filter()` + `.collect()` + `.sort()`.

- [ ] **Step 1: Check if helpers.ts exists**

Run: `ls convex/helpers.ts 2>/dev/null || echo "not found"`

If not found, check where `stripUndefined` is defined:
Run: `grep -r "stripUndefined" convex/`

- [ ] **Step 2: Add siteConfig and featureFlags tables to schema**

In `convex/schema.ts`, add these table definitions alongside the existing ones:

```typescript
siteConfig: defineTable({
  mode: v.union(
    v.literal("one-page"),
    v.literal("multi-page"),
    v.literal("reader")
  ),
  sectionOrder: v.array(v.string()),
  parallaxSpeed: v.number(),
  readerModeRoute: v.optional(v.string()),
}),

featureFlags: defineTable({
  key: v.string(),
  enabled: v.boolean(),
  category: v.string(),
}).index("by_key", ["key"]),
```

- [ ] **Step 3: Create convex/siteConfig.ts**

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    const configs = await ctx.db.query("siteConfig").collect();
    return configs[0] ?? null;
  },
});

export const upsert = mutation({
  args: {
    mode: v.optional(
      v.union(
        v.literal("one-page"),
        v.literal("multi-page"),
        v.literal("reader")
      )
    ),
    sectionOrder: v.optional(v.array(v.string())),
    parallaxSpeed: v.optional(v.number()),
    readerModeRoute: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").collect();
    const filtered = Object.fromEntries(
      Object.entries(args).filter(([, v]) => v !== undefined)
    );
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, filtered);
      return existing[0]._id;
    }
    return await ctx.db.insert("siteConfig", {
      mode: args.mode ?? "multi-page",
      sectionOrder: args.sectionOrder ?? [
        "hero", "works", "talks", "terminal", "cv",
        "academia", "blog", "process", "gallery",
        "likes", "minor", "gifts", "os"
      ],
      parallaxSpeed: args.parallaxSpeed ?? 0.5,
      readerModeRoute: args.readerModeRoute,
    });
  },
});

export const getFeatureFlags = query({
  handler: async (ctx) => {
    return await ctx.db.query("featureFlags").collect();
  },
});

export const setFeatureFlag = mutation({
  args: {
    key: v.string(),
    enabled: v.boolean(),
    category: v.string(),
  },
  handler: async (ctx, { key, enabled, category }) => {
    const existing = await ctx.db
      .query("featureFlags")
      .filter((q) => q.eq(q.field("key"), key))
      .collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, { enabled, category });
      return existing[0]._id;
    }
    return await ctx.db.insert("featureFlags", { key, enabled, category });
  },
});
```

- [ ] **Step 4: Push schema and verify**

Run: `npx convex dev --once`
Expected: Schema push succeeds, new tables created.

- [ ] **Step 5: Commit**

```bash
git add convex/schema.ts convex/siteConfig.ts
git commit -m "feat: add siteConfig and featureFlags Convex tables"
```

---

## Task 2: Section Metadata Registry

**Files:**
- Create: `src/lib/sections/index.ts`
- Create: `src/lib/stores/siteMode.ts`

**Context:** Central registry that defines section metadata (id, label, order) and a Svelte store for site mode that components can subscribe to.

- [ ] **Step 1: Create site mode store**

Create `src/lib/stores/siteMode.ts`:

```typescript
import { writable, derived } from "svelte/store";

export type SiteMode = "one-page" | "multi-page" | "reader";

export const siteMode = writable<SiteMode>("multi-page");
export const readerMode = derived(siteMode, ($mode) => $mode === "reader");

// Local override for user toggle (r key) independent of admin setting
export const readerOverride = writable<boolean | null>(null);

// Effective reader state: override takes precedence over site mode
export const isReaderMode = derived(
  [readerMode, readerOverride],
  ([$readerMode, $override]) => $override ?? $readerMode
);
```

- [ ] **Step 2: Create section metadata registry**

Create `src/lib/sections/index.ts`:

```typescript
export interface SectionMeta {
  id: string;
  label: string;
  route: string;
}

export const sections: SectionMeta[] = [
  { id: "hero", label: "Home", route: "/" },
  { id: "works", label: "Works", route: "/works" },
  { id: "talks", label: "Talks", route: "/talks" },
  { id: "terminal", label: "Terminal", route: "/terminal" },
  { id: "cv", label: "CV", route: "/cv" },
  { id: "academia", label: "Re:mix", route: "/academia" },
  { id: "blog", label: "Blog", route: "/blog" },
  { id: "process", label: "Process", route: "/process" },
  { id: "gallery", label: "Gallery", route: "/gallery" },
  { id: "likes", label: "Likes", route: "/likes" },
  { id: "minor", label: "Minor", route: "/minor" },
  { id: "gifts", label: "Gifts", route: "/gifts" },
  { id: "os", label: "OS", route: "/os" },
];

export const sectionMap = new Map(sections.map((s) => [s.id, s]));
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit --pretty`
Expected: No errors related to new files.

- [ ] **Step 4: Commit**

```bash
git add src/lib/sections/index.ts src/lib/stores/siteMode.ts
git commit -m "feat: add section metadata registry and site mode store"
```

---

## Task 3: Extract Simple Static Sections (Process, Likes, Gifts, Minor)

**Files:**
- Create: `src/lib/sections/ProcessSection.svelte`
- Create: `src/lib/sections/LikesSection.svelte`
- Create: `src/lib/sections/GiftsSection.svelte`
- Create: `src/lib/sections/MinorSection.svelte`
- Modify: `src/routes/process/+page.svelte`
- Modify: `src/routes/likes/+page.svelte`
- Modify: `src/routes/gifts/+page.svelte`
- Modify: `src/routes/minor/+page.svelte`

**Context:** These 4 pages use only static/hardcoded data (no Convex, no Sanity). The extraction is mechanical: move the entire `<script>`, template, and `<style>` into a Section component, add an `id` prop, and make the route file a thin wrapper.

**Pattern (applied to each):**

- [ ] **Step 1: Extract ProcessSection**

Read `src/routes/process/+page.svelte`. Create `src/lib/sections/ProcessSection.svelte` with the exact same content, but:
1. Add `export let id = "process";` to the script
2. Wrap the outermost element with `id={id}`

Then replace `src/routes/process/+page.svelte` with:

```svelte
<script>
  import ProcessSection from "$lib/sections/ProcessSection.svelte";
</script>

<ProcessSection />
```

- [ ] **Step 2: Extract LikesSection**

Same pattern. Read `src/routes/likes/+page.svelte`. Create `src/lib/sections/LikesSection.svelte` with the content. Add `export let id = "likes";` and `id={id}` on root element.

Replace `src/routes/likes/+page.svelte` with:

```svelte
<script>
  import LikesSection from "$lib/sections/LikesSection.svelte";
</script>

<LikesSection />
```

- [ ] **Step 3: Extract GiftsSection**

Same pattern for `src/routes/gifts/+page.svelte` → `src/lib/sections/GiftsSection.svelte`.

- [ ] **Step 4: Extract MinorSection**

Same pattern for `src/routes/minor/+page.svelte` → `src/lib/sections/MinorSection.svelte`.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds. Navigate to /process, /likes, /gifts, /minor — all render identically.

- [ ] **Step 6: Commit**

```bash
git add src/lib/sections/ProcessSection.svelte src/lib/sections/LikesSection.svelte \
  src/lib/sections/GiftsSection.svelte src/lib/sections/MinorSection.svelte \
  src/routes/process/+page.svelte src/routes/likes/+page.svelte \
  src/routes/gifts/+page.svelte src/routes/minor/+page.svelte
git commit -m "refactor: extract process, likes, gifts, minor into section components"
```

---

## Task 4: Extract Gallery and OS Sections

**Files:**
- Create: `src/lib/sections/GallerySection.svelte`
- Create: `src/lib/sections/OsSection.svelte`
- Modify: `src/routes/gallery/+page.svelte`
- Modify: `src/routes/os/+page.svelte`

**Context:** Gallery uses `galleryItems` from content store + has a modal. OS has drag-and-drop window management. Both are self-contained with hardcoded data.

- [ ] **Step 1: Extract GallerySection**

Read `src/routes/gallery/+page.svelte`. Create `src/lib/sections/GallerySection.svelte`:
1. Move full content (script, template, styles)
2. Add `export let id = "gallery";` and `id={id}` on root
3. The modal backdrop is fixed-position — works fine in section context since it uses `position: fixed`

Replace route file with thin wrapper:
```svelte
<script>
  import GallerySection from "$lib/sections/GallerySection.svelte";
</script>

<GallerySection />
```

- [ ] **Step 2: Extract OsSection**

Read `src/routes/os/+page.svelte`. Create `src/lib/sections/OsSection.svelte`:
1. Move full content
2. Add `export let id = "os";`
3. **Important:** The OS page uses `position: fixed` for the desktop — in one-page mode it needs to be `position: relative` with a fixed height. Add a prop: `export let embedded = false;`
4. When `embedded` is true, change the desktop wrapper from `position: fixed; inset: 0` to `position: relative; height: 80vh`
5. When `embedded` is false (standalone route), keep current behavior

Replace route file:
```svelte
<script>
  import OsSection from "$lib/sections/OsSection.svelte";
</script>

<OsSection />
```

- [ ] **Step 3: Verify build + visual check**

Run: `npm run build`
Test: Navigate to /gallery (filter, modal should work), /os (drag windows should work).

- [ ] **Step 4: Commit**

```bash
git add src/lib/sections/GallerySection.svelte src/lib/sections/OsSection.svelte \
  src/routes/gallery/+page.svelte src/routes/os/+page.svelte
git commit -m "refactor: extract gallery and os into section components"
```

---

## Task 5: Extract Convex-Backed Sections (Works, Talks, Academia)

**Files:**
- Create: `src/lib/sections/WorksSection.svelte`
- Create: `src/lib/sections/TalksSection.svelte`
- Create: `src/lib/sections/AcademiaSection.svelte`
- Modify: `src/routes/works/+page.svelte`
- Modify: `src/routes/talks/+page.svelte`
- Modify: `src/routes/academia/+page.svelte`

**Context:** These pages use `onMount()` to subscribe to Convex queries. The subscription pattern (`getConvexClient().onUpdate()`) stays in the section component since it's self-contained. The `+page.ts` files just set `prerender: false; ssr: false` — those stay in the route.

- [ ] **Step 1: Extract WorksSection**

Read `src/routes/works/+page.svelte`. Create `src/lib/sections/WorksSection.svelte`:
1. Move the entire content (script with onMount/Convex subscription, template, styles)
2. Add `export let id = "works";` and `id={id}` on root
3. The `onMount` Convex subscription pattern stays as-is — it's self-contained

Replace route file (keep +page.ts for SSR config):
```svelte
<script>
  import WorksSection from "$lib/sections/WorksSection.svelte";
</script>

<WorksSection />
```

- [ ] **Step 2: Extract TalksSection**

Same pattern for talks. The Convex subscription + static fallback pattern stays in the section.

- [ ] **Step 3: Extract AcademiaSection**

Same pattern for academia. The MuxVideo component import stays in the section.

- [ ] **Step 4: Verify Convex subscriptions still work**

Run: `npm run dev`
Test: Navigate to /works, /talks, /academia. Data should load from Convex. Check browser console for errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sections/WorksSection.svelte src/lib/sections/TalksSection.svelte \
  src/lib/sections/AcademiaSection.svelte \
  src/routes/works/+page.svelte src/routes/talks/+page.svelte \
  src/routes/academia/+page.svelte
git commit -m "refactor: extract works, talks, academia into section components"
```

---

## Task 6: Extract CV Section

**Files:**
- Create: `src/lib/sections/CvSection.svelte`
- Modify: `src/routes/cv/+page.svelte`

**Context:** CV is the most styled page (581 lines, 380+ CSS) with a print stylesheet. The print stylesheet needs to stay functional. The section handles its own Convex data loading.

- [ ] **Step 1: Extract CvSection**

Read `src/routes/cv/+page.svelte`. Create `src/lib/sections/CvSection.svelte`:
1. Move full content including the print `@media print` styles
2. Add `export let id = "cv";`
3. **Print stylesheet consideration:** The `@media print` rules use global selectors like `.cv-container` — these work fine in a component since Svelte scopes styles but `@media print` with `:global()` should be preserved exactly as-is

Replace route file:
```svelte
<script>
  import CvSection from "$lib/sections/CvSection.svelte";
</script>

<CvSection />
```

- [ ] **Step 2: Verify CV renders + print preview**

Run: `npm run dev`
Test: Navigate to /cv. Check data loads. Use Cmd+P to verify print stylesheet still works.

- [ ] **Step 3: Commit**

```bash
git add src/lib/sections/CvSection.svelte src/routes/cv/+page.svelte
git commit -m "refactor: extract cv into section component with print styles"
```

---

## Task 7: Extract Terminal Section

**Files:**
- Create: `src/lib/sections/TerminalSection.svelte`
- Modify: `src/routes/terminal/+page.svelte`

**Context:** Terminal is the most complex page (724 lines) with a state machine, animations, and keyboard handlers. The canvas animations (matrix, pipes) use `position: fixed` overlays — in embedded one-page mode these need scoping.

- [ ] **Step 1: Extract TerminalSection**

Read `src/routes/terminal/+page.svelte`. Create `src/lib/sections/TerminalSection.svelte`:
1. Move full content
2. Add `export let id = "terminal";` and `export let embedded = false;`
3. When `embedded` is true:
   - Terminal height = `80vh` instead of `calc(100vh - footer)`
   - Animation overlay is `position: absolute` (scoped to section) instead of `position: fixed`
   - Disable global keyboard capture (don't hijack j/k/r when scrolled past terminal)
4. When `embedded` is false: current behavior (standalone page)

Key changes for embedded mode — in the `.terminal-page` style:
```css
.terminal-page {
  height: var(--terminal-height, calc(100dvh - var(--footer-height, 48px)));
  position: relative; /* for absolute-positioned animation overlay */
}
```

And in the `.animation-overlay` style, when embedded:
```css
.animation-overlay {
  position: var(--animation-position, fixed);
}
```

Set CSS variables based on `embedded` prop:
```svelte
<div
  class="terminal-page"
  {id}
  style:--terminal-height={embedded ? '80vh' : undefined}
  style:--animation-position={embedded ? 'absolute' : undefined}
>
```

Replace route file:
```svelte
<script>
  import TerminalSection from "$lib/sections/TerminalSection.svelte";
</script>

<TerminalSection />
```

- [ ] **Step 2: Verify terminal works standalone**

Run: `npm run dev`
Test: Navigate to /terminal. Type commands, test matrix animation, test Ctrl+C, test history.

- [ ] **Step 3: Commit**

```bash
git add src/lib/sections/TerminalSection.svelte src/routes/terminal/+page.svelte
git commit -m "refactor: extract terminal into section component with embedded mode"
```

---

## Task 8: Extract Hero and Blog Sections

**Files:**
- Create: `src/lib/sections/HeroSection.svelte`
- Create: `src/lib/sections/BlogSection.svelte`
- Modify: `src/routes/+page.svelte`
- Modify: `src/routes/blog/+page.svelte`

**Context:** Hero page has the ASCII donut + works list + identity section. Blog uses Sanity data via SvelteKit `load` function (`export let data: PageData`) — different pattern from Convex pages.

- [ ] **Step 1: Extract HeroSection**

Read `src/routes/+page.svelte`. Create `src/lib/sections/HeroSection.svelte`:
1. Move the hero content, works list, and identity section
2. Keep imports: AsciiDonut, Elevator, content data
3. Add `export let id = "hero";`

**Important:** The Elevator component is a back-to-top button — in one-page mode it should scroll to top of page, not just this section. Keep it as-is since it already uses `window.scrollTo`.

The route file will be modified in Task 10 (mode switching) rather than made into a thin wrapper, since the home page conditionally renders OnePageView or HeroSection.

- [ ] **Step 2: Extract BlogSection**

Read `src/routes/blog/+page.svelte`. Create `src/lib/sections/BlogSection.svelte`:
1. Move content, but the data loading is different: Blog gets data from SvelteKit load function
2. Change `export let data: PageData` to `export let posts: any[] = [];` and `export let id = "blog";`
3. The section receives posts as a prop instead of loading them

Update route file:
```svelte
<script>
  import type { PageData } from "./$types";
  import BlogSection from "$lib/sections/BlogSection.svelte";
  export let data: PageData;
</script>

<BlogSection posts={data.posts} />
```

For one-page mode, Blog posts will need a different loading strategy (fetch in OnePageView or load from Convex). For Phase 1, the one-page blog section can show a "Read more on /blog" link with recent post titles, loaded client-side.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Test: Navigate to / (hero), /blog (posts load, filtering works).

- [ ] **Step 4: Commit**

```bash
git add src/lib/sections/HeroSection.svelte src/lib/sections/BlogSection.svelte \
  src/routes/blog/+page.svelte
git commit -m "refactor: extract hero and blog into section components"
```

---

## Task 9: Build Reader Mode Styles

**Files:**
- Modify: `src/app.css`

**Context:** Reader mode is primarily CSS-driven. A `.reader-mode` class on the page container hides decorative elements and applies clean reading typography. The Svelte context flag (`isReaderMode` store) is used by components to skip mounting heavy elements entirely.

- [ ] **Step 1: Add reader mode CSS to app.css**

Add at the end of `src/app.css`:

```css
/* ─── Reader Mode ─── */
.reader-mode {
  --reader-max-width: 680px;
  --reader-font-size: 1.125rem;
  --reader-line-height: 1.75;
}

.reader-mode .section-wrapper {
  max-width: var(--reader-max-width);
  margin-inline: auto;
  padding-inline: var(--space-lg);
  font-size: var(--reader-font-size);
  line-height: var(--reader-line-height);
}

/* Hide decorative elements in reader mode */
.reader-mode canvas,
.reader-mode .ascii-donut,
.reader-mode .hero-visual,
.reader-mode .animation-overlay,
.reader-mode .pixel-canvas,
.reader-mode .geometric-bg,
.reader-mode .parallax-spacer,
.reader-mode iframe,
.reader-mode .project-embed,
.reader-mode .inline-browser,
.reader-mode .tmux-bar,
.reader-mode video,
.reader-mode .elevator {
  display: none !important;
}

/* Simplify layout in reader mode */
.reader-mode .hero {
  display: block;
}

.reader-mode .hero-content {
  max-width: 100%;
}

/* Clean typography for reader mode */
.reader-mode h1,
.reader-mode h2,
.reader-mode h3 {
  font-family: var(--font-sans);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
}

.reader-mode p,
.reader-mode li {
  font-family: var(--font-sans);
  line-height: var(--reader-line-height);
  color: var(--color-text-primary);
}

/* Subtle section dividers in reader mode */
.reader-mode .section-wrapper + .section-wrapper {
  border-top: 1px solid var(--color-border-subtle);
  padding-top: var(--space-2xl);
  margin-top: var(--space-2xl);
}

/* Remove all animations in reader mode */
.reader-mode * {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```

- [ ] **Step 2: Verify CSS parses**

Run: `npm run build`
Expected: No CSS errors.

- [ ] **Step 3: Commit**

```bash
git add src/app.css
git commit -m "feat: add reader mode CSS styles"
```

---

## Task 10: Build OnePageView Component

**Files:**
- Create: `src/lib/components/OnePageView.svelte`
- Modify: `src/routes/+page.svelte`

**Context:** OnePageView renders all sections in sequence with scroll spy, lazy loading, and URL hash sync. Sections are wrapped in a `<section class="section-wrapper">` with an `id` for anchor linking.

- [ ] **Step 1: Create OnePageView.svelte**

```svelte
<script>
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { sections } from "$lib/sections/index";
  import { isReaderMode } from "$lib/stores/siteMode";

  import HeroSection from "$lib/sections/HeroSection.svelte";
  import WorksSection from "$lib/sections/WorksSection.svelte";
  import TalksSection from "$lib/sections/TalksSection.svelte";
  import TerminalSection from "$lib/sections/TerminalSection.svelte";
  import CvSection from "$lib/sections/CvSection.svelte";
  import AcademiaSection from "$lib/sections/AcademiaSection.svelte";
  import BlogSection from "$lib/sections/BlogSection.svelte";
  import ProcessSection from "$lib/sections/ProcessSection.svelte";
  import GallerySection from "$lib/sections/GallerySection.svelte";
  import LikesSection from "$lib/sections/LikesSection.svelte";
  import MinorSection from "$lib/sections/MinorSection.svelte";
  import GiftsSection from "$lib/sections/GiftsSection.svelte";
  import OsSection from "$lib/sections/OsSection.svelte";

  export let sectionOrder = sections.map((s) => s.id);
  export let blogPosts = [];

  // Map section IDs to components
  const componentMap = {
    hero: HeroSection,
    works: WorksSection,
    talks: TalksSection,
    terminal: TerminalSection,
    cv: CvSection,
    academia: AcademiaSection,
    blog: BlogSection,
    process: ProcessSection,
    gallery: GallerySection,
    likes: LikesSection,
    minor: MinorSection,
    gifts: GiftsSection,
    os: OsSection,
  };

  let activeSection = "hero";
  let sectionElements = {};
  let observer;
  let ticking = false;

  // Lazy loading: track which sections are near viewport
  let visibleSections = new Set(["hero"]); // Hero always rendered

  // Scroll spy via IntersectionObserver
  onMount(() => {
    // Lazy load observer: render sections when ~1 viewport away
    const lazyObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
            visibleSections = visibleSections; // trigger reactivity
            lazyObserver.unobserve(entry.target); // once visible, always rendered
          }
        }
      },
      { rootMargin: "100% 0px" }
    );

    // Observe placeholder elements for lazy loading
    for (const id of sectionOrder) {
      const el = document.getElementById(id);
      if (el) lazyObserver.observe(el);
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
            // Update URL hash without scrolling
            history.replaceState(null, "", `/#${activeSection}`);
          }
        }
      },
      { rootMargin: "-40% 0px -60% 0px" }
    );

    // Observe all section wrappers
    for (const id of sectionOrder) {
      const el = document.getElementById(id);
      if (el) {
        sectionElements[id] = el;
        observer.observe(el);
      }
    }

    // Handle initial hash
    const hash = window.location.hash.slice(1);
    if (hash && sectionElements[hash]) {
      sectionElements[hash].scrollIntoView({ behavior: "smooth" });
    }
  });

  onDestroy(() => {
    observer?.disconnect();
  });

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Keyboard navigation: j/k to move between sections
  function handleKeydown(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    const currentIndex = sectionOrder.indexOf(activeSection);
    if (e.key === "j" && currentIndex < sectionOrder.length - 1) {
      e.preventDefault();
      scrollToSection(sectionOrder[currentIndex + 1]);
    } else if (e.key === "k" && currentIndex > 0) {
      e.preventDefault();
      scrollToSection(sectionOrder[currentIndex - 1]);
    }
  }

  // Props for specific sections
  function getSectionProps(id) {
    const props = { id };
    if (id === "terminal" || id === "os") {
      props.embedded = true;
    }
    if (id === "blog") {
      props.posts = blogPosts;
    }
    return props;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="one-page" class:reader-mode={$isReaderMode}>
  <!-- Section nav (scroll spy) -->
  <nav class="section-nav" aria-label="Page sections">
    {#each sectionOrder as id}
      {@const meta = sections.find((s) => s.id === id)}
      {#if meta}
        <button
          class="section-nav-item"
          class:active={activeSection === id}
          on:click={() => scrollToSection(id)}
        >
          {meta.label}
        </button>
      {/if}
    {/each}
  </nav>

  <!-- Sections -->
  {#each sectionOrder as id (id)}
    <section class="section-wrapper" {id}>
      {#if visibleSections.has(id)}
        <svelte:component this={componentMap[id]} {...getSectionProps(id)} />
      {:else}
        <div class="section-placeholder" style="min-height: 50vh;" />
      {/if}
    </section>
  {/each}
</div>

<style>
  .one-page {
    position: relative;
  }

  .section-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    gap: var(--space-2xs);
    padding: var(--space-xs) var(--space-md);
    background: var(--color-bg-primary);
    border-bottom: 1px solid var(--color-border-subtle);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .section-nav::-webkit-scrollbar {
    display: none;
  }

  .section-nav-item {
    all: unset;
    cursor: pointer;
    padding: var(--space-3xs) var(--space-xs);
    font-size: var(--font-size-xs);
    font-family: var(--font-mono);
    color: var(--color-text-tertiary);
    white-space: nowrap;
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--easing-default);
  }

  .section-nav-item:hover {
    color: var(--color-text-primary);
  }

  .section-nav-item.active {
    color: var(--color-accent);
    background: var(--color-bg-secondary);
  }

  .section-wrapper {
    min-height: 50vh;
    padding-block: var(--space-2xl);
  }

  /* Reader mode hides the section nav */
  .reader-mode .section-nav {
    display: none;
  }
</style>
```

- [ ] **Step 2: Update home page to conditionally render**

Modify `src/routes/+page.svelte`:

```svelte
<script>
  import { siteMode } from "$lib/stores/siteMode";
  import HeroSection from "$lib/sections/HeroSection.svelte";
  import OnePageView from "$lib/components/OnePageView.svelte";
</script>

{#if $siteMode === "one-page" || $siteMode === "reader"}
  <OnePageView />
{:else}
  <HeroSection />
{/if}
```

**Note:** This is a simplified version. The full integration with Convex mode reading happens in Task 11.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/OnePageView.svelte src/routes/+page.svelte
git commit -m "feat: build OnePageView component with scroll spy and section nav"
```

---

## Task 11: Mode Switching in Layout

**Files:**
- Modify: `src/routes/+layout.svelte`

**Context:** The layout reads `siteConfig.mode` from Convex and writes it to the `siteMode` store. It also adds the `r` keyboard shortcut for reader toggle and passes the reader mode class to the body.

- [ ] **Step 1: Add Convex siteConfig loading to layout**

In `src/routes/+layout.svelte`, add to the `<script>` block:

```typescript
import { siteMode, readerOverride, isReaderMode } from "$lib/stores/siteMode";
import { getConvexClient } from "$lib/convex";
import { api } from "$convex/_generated/api";
```

In the `onMount` callback, add:

```typescript
// Load site config from Convex
try {
  const client = getConvexClient();
  client.onUpdate(api.siteConfig.get, {}, (config) => {
    if (config?.mode) {
      siteMode.set(config.mode);
    }
  });
} catch (e) {
  // Convex not available — default to multi-page
  console.warn("Convex siteConfig not available, using multi-page mode");
}
```

- [ ] **Step 2: Add reader mode toggle keyboard shortcut**

In the existing `handleKeydown` function (or add one), include:

```typescript
// 'r' key toggles reader mode (unless in input/textarea)
if (e.key === "r" && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
  readerOverride.update((current) => (current === null ? true : current ? false : true));
}
```

- [ ] **Step 3: Support ?reader=true URL param**

In the `onMount` callback, add:

```typescript
// Check URL param for reader mode
const url = new URL(window.location.href);
if (url.searchParams.get("reader") === "true") {
  readerOverride.set(true);
}
```

- [ ] **Step 4: Apply reader mode class to body**

Add a reactive statement:

```typescript
$: if (typeof document !== "undefined") {
  document.body.classList.toggle("reader-mode", $isReaderMode);
}
```

- [ ] **Step 5: Verify mode switching**

Run: `npm run dev`
Test:
1. Default should be multi-page mode (normal routing works)
2. Press `r` — body gets `.reader-mode` class, visual elements should be stripped
3. Press `r` again — reader mode off
4. Navigate to `/?reader=true` — reader mode activates

- [ ] **Step 6: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat: add mode switching and reader mode toggle to layout"
```

---

## Task 12: Update CommandPalette with New Shortcuts

**Files:**
- Modify: `src/lib/components/CommandPalette.svelte`

**Context:** Add reader mode toggle, section navigation, and one-page mode awareness to the command palette. Currently has ~20 navigation commands using `g h`, `g w` patterns.

- [ ] **Step 1: Add new commands to CommandPalette**

Read `src/lib/components/CommandPalette.svelte`. Find the `commands` array and add:

```typescript
{ keys: "r", label: "Toggle Reader Mode", action: () => {
  readerOverride.update((c) => c === null ? true : !c);
}, category: "actions" },
```

Add the import at the top:
```typescript
import { readerOverride } from "$lib/stores/siteMode";
```

- [ ] **Step 2: Verify command palette shows new commands**

Run: `npm run dev`
Test: Press `?` to open palette. "Toggle Reader Mode" should appear. Press `r` should toggle reader mode.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/CommandPalette.svelte
git commit -m "feat: add reader mode toggle to command palette"
```

---

## Task 13: Deep Link Support for One-Page Mode

**Files:**
- Modify: `src/routes/works/+page.svelte` (and other route files)

**Context:** When site is in one-page mode, visiting `/works` should redirect to `/#works`. The route files need to check the site mode and redirect accordingly.

- [ ] **Step 1: Create a shared redirect helper**

Add to `src/lib/stores/siteMode.ts`:

```typescript
import { get } from "svelte/store";
import { goto } from "$app/navigation";

export function redirectIfOnePage(sectionId: string) {
  const mode = get(siteMode);
  if (mode === "one-page" || mode === "reader") {
    goto(`/#${sectionId}`, { replaceState: true });
    return true;
  }
  return false;
}
```

- [ ] **Step 2: Add redirect to route wrappers**

Update each route file (works, talks, cv, terminal, academia, etc.) to check mode:

```svelte
<script>
  import { onMount } from "svelte";
  import WorksSection from "$lib/sections/WorksSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("works");
  });
</script>

<WorksSection />
```

Apply this pattern to all route wrappers created in Tasks 3-8.

- [ ] **Step 3: Verify redirects work**

Run: `npm run dev`
Test:
1. In multi-page mode: `/works` renders normally
2. Switch to one-page mode (via Convex or store manipulation): `/works` redirects to `/#works`

- [ ] **Step 4: Commit**

```bash
git add src/lib/stores/siteMode.ts src/routes/works/+page.svelte \
  src/routes/talks/+page.svelte src/routes/cv/+page.svelte \
  src/routes/terminal/+page.svelte src/routes/academia/+page.svelte \
  src/routes/process/+page.svelte src/routes/gallery/+page.svelte \
  src/routes/likes/+page.svelte src/routes/minor/+page.svelte \
  src/routes/gifts/+page.svelte src/routes/os/+page.svelte
git commit -m "feat: add one-page mode redirect support to all routes"
```

---

## Task 14: Parallax Transitions Between Sections

**Files:**
- Modify: `src/lib/components/OnePageView.svelte`
- Modify: `src/app.css`

**Context:** Sarah Drasner-style vertical parallax — sections have different scroll speeds creating a layered depth effect. Implemented with CSS transforms driven by scroll position via a single `scroll` event listener + `requestAnimationFrame`.

- [ ] **Step 1: Add parallax logic to OnePageView**

In `OnePageView.svelte`, add to the script:

```typescript
let scrollY = 0;
let parallaxEnabled = true; // Read from Convex siteConfig.parallaxSpeed > 0
let parallaxSpeed = 0.5;

function handleScroll() {
  if (!parallaxEnabled || $isReaderMode) return;
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    scrollY = window.scrollY;
    ticking = false;
  });
}
```

Add to the template, on each section wrapper:

```svelte
<section
  class="section-wrapper"
  {id}
  style:transform={parallaxEnabled && !$isReaderMode
    ? `translateY(${(scrollY - (sectionElements[id]?.offsetTop ?? 0)) * parallaxSpeed * 0.1}px)`
    : undefined}
>
```

Add scroll listener:

```svelte
<svelte:window on:keydown={handleKeydown} on:scroll={handleScroll} />
```

- [ ] **Step 2: Add parallax spacer CSS**

In `src/app.css`, add:

```css
/* ─── Parallax Transitions ─── */
.section-wrapper {
  will-change: transform;
}

.parallax-spacer {
  height: var(--space-4xl);
  pointer-events: none;
}
```

- [ ] **Step 3: Verify parallax effect**

Run: `npm run dev`
Test: In one-page mode, scroll through sections. Sections should have subtle depth/speed differences. Reader mode should show no parallax.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/OnePageView.svelte src/app.css
git commit -m "feat: add parallax scroll transitions between sections"
```

---

## Task 15: Integration Verification

**Files:** None (read-only verification)

- [ ] **Step 1: Full build check**

Run: `npm run build`
Expected: Clean build, no errors or warnings.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit --pretty`
Expected: No type errors.

- [ ] **Step 3: Multi-page mode regression test**

Run: `npm run dev`
Test every route manually:
- `/` — hero renders
- `/works` — projects grid with iframes
- `/talks` — talks + interviews lists
- `/cv` — full CV with all sections
- `/terminal` — type commands, test matrix animation
- `/academia` — research papers load
- `/blog` — posts load, filtering works
- `/process` — SVG diagram renders
- `/gallery` — mosaic grid, modal works
- `/likes` — lists render
- `/minor` — accordion expand/collapse
- `/gifts` — letter renders
- `/os` — drag windows work

- [ ] **Step 4: One-page mode test**

Temporarily set siteMode store to "one-page" (in browser console or via layout):
```javascript
// In browser console
window.__siteMode = "one-page";
```

Or modify the layout temporarily to default to one-page mode for testing.

Test:
- All 13 sections visible on scroll
- Section nav highlights active section
- Clicking section nav scrolls to section
- j/k keyboard navigation works
- URL hash updates on scroll
- Deep links (/#works) scroll to correct section
- Terminal and OS sections work in embedded mode

- [ ] **Step 5: Reader mode test**

Press `r` to toggle reader mode:
- All decorative elements hidden
- Clean typography applied
- Section dividers visible
- No animations running
- Content readable and well-spaced
- Press `r` again to exit

- [ ] **Step 6: Run Validator Agent**

Launch agent with prompt: "Validate the whole diff on branch feat/theme-overhaul. Double-check that everything was implemented well, concisely, and safely. Verify no unwanted disruption to existing functionality."

- [ ] **Step 7: Run Minifier Agent**

Launch agent with prompt: "Review all new code added. Is all of it necessary? Can we reuse more from existing code? Is shorter code possible? Could we use available utils or packages for code tightness and simplicity? Could we reuse certain patterns used elsewhere in the codebase?"

- [ ] **Step 8: Iterate until both agents return "All clean"**

If either agent finds issues, fix them and re-run both agents.

- [ ] **Step 9: Final commit**

```bash
git add -A
git commit -m "feat: phase 1 complete — one-page portfolio + reader mode"
```

---

## Summary

| Task | Description | Files | Commits |
|------|-------------|-------|---------|
| 1 | Convex schema + siteConfig | 2 files | 1 |
| 2 | Section metadata + store | 2 files | 1 |
| 3 | Extract simple sections (4) | 8 files | 1 |
| 4 | Extract gallery + os | 4 files | 1 |
| 5 | Extract Convex sections (3) | 6 files | 1 |
| 6 | Extract CV | 2 files | 1 |
| 7 | Extract terminal | 2 files | 1 |
| 8 | Extract hero + blog | 4 files | 1 |
| 9 | Reader mode CSS | 1 file | 1 |
| 10 | OnePageView component | 2 files | 1 |
| 11 | Mode switching in layout | 1 file | 1 |
| 12 | Command palette updates | 1 file | 1 |
| 13 | Deep link redirects | 12 files | 1 |
| 14 | Parallax transitions | 2 files | 1 |
| 15 | Integration verification | 0 files | 1 |
