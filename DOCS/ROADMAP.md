# Roadmap

## Tech Stack

SvelteKit 2 (Svelte 5) — Convex (reactive backend) — Vite — Playwright — Bun — Vercel


## Phase 0: Cleanup — DONE

Dead code removal, design token consolidation, CSS custom properties audit.
- Removed legacy inline styles and one-off color values.
- Consolidated all design tokens into `src/lib/data/tokens.ts` and `src/app.css`.
- Established OKLCH color space as the baseline for all theme values.
- Cleaned up unused components and route files.


## Phase 1: Data Layer — DONE

Convex schema, section registry, site config.
- Defined 14 Convex tables: pages, works, blog, talks, likes, gifts, gallery, labs, terminal,
  process, os, minor, siteConfig, themes.
- Built `sectionRegistry` — a typed map of every section type with its data table, view modes,
  and default config.
- Wired `siteConfig` for site-wide settings: active theme, font, feature flags, one-page mode,
  reader mode, parallax, particle engine toggle.
- Section visibility, nav order, and per-page config all persisted to Convex.


## Phase 2: Admin Content Hub — IN PROGRESS

Unified, Linear-style admin landing page.
- Tabbed page navigator: all pages from Convex in a scrollable tab bar, ordered by `navOrder`.
- Tab labels are WYSIWYG — the raw stored string, no normalization.
- Active tab panel: page controls (visibility, view mode, nav order), color strip with entry
  counts per color, particle animation preset multi-select, compact entry table.
- Settings drawer: appearance (theme, font), site config, feature flags.
- Auto-seed all known pages from `sectionRegistry` on admin load (idempotent).
- Entry counts live-updated from Convex queries keyed to each section's `dataTable`.
- Keyboard navigation: ArrowLeft/ArrowRight to switch tabs, 1-9 for quick jump.


## Phase 2b: CMS Foundation

Wire ALL sections to Convex. Kill static imports.
- Replace every static data file (`src/lib/data/*.ts`) with Convex queries.
- Wire hero section config (title, subtitle, CTA, background) to `siteConfig`.
- Wire display config (grid density, image aspect ratio, card style) per section.
- Blog migration: replace Sanity CMS with Convex `blog` table. Keep slug routing.
- Audit and remove all remaining static content that should be admin-editable.
- Goal: zero hardcoded content that bypasses the admin.


## Phase 3: Page Composer

Deep page editing with live preview.
- Two-panel layout: section list (left) + live preview iframe (right).
- Drag-to-reorder sections within a page. Changes persist immediately.
- Inline CRUD: add section (section picker modal), remove section, duplicate section.
- Per-section config panel: view mode, visibility, particle presets, accent color.
- Meta panel: SEO title, description, og:image, route slug (read-only for system pages).
- Keyboard shortcut to open composer from admin tab panel.


## Phase 4: Theme Builder

Visual theme editing and per-page overrides.
- Theme editor: edit OKLCH token values for each of the 4 themes in a live panel.
- Per-page theme override: a page can diverge from the global theme (e.g., /gallery uses
  `darkroom` regardless of active global theme).
- Per-section color override: accent color, surface color.
- Visual mode switching: grid / case-study / minimal-list / pixel-universe, previewed live.
- Export theme as CSS custom properties block for portability.
- Themes persisted to the `themes` Convex table.


## Phase 5: Rich Media Blocks

Media-block component system and upload pipeline.
- `MediaBlock` component: handles image, video, iframe, Lottie, and embed types uniformly.
- Video reel support on /works: background video per project, autoplay on hover/focus.
- Upload system: drag-and-drop media upload to Convex file storage from the admin.
- Lottie animation support: upload `.json` Lottie files, assign to sections or entries.
- Embed blocks: YouTube, Vimeo, CodePen, Figma — sandboxed iframes with lazy loading.
- All media blocks respect `prefers-reduced-motion` for autoplay and animation.


## Out of Scope (Not Planned)

- Multi-user admin (single owner only, no auth roles).
- Public CMS / headless API for third-party consumption.
- Native mobile app.
- E-commerce or transactional features.
