# Portfolio Forever — Complete Project Summary

> Generated: April 2026

---

## The Vision

**"The Portfolio as an Operating System"** — A living platform for Stüssy Senik (Mengxuan Zou), a staff-level creative technologist. The medium is the message: every design decision demonstrates craft. Target audience: creative directors at Pentagram, Apple, baek+baek.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2.49.1 (Svelte 5) + TypeScript |
| Styling | Pure CSS with custom properties (OKLCH color space) |
| Backend | Convex (real-time, reactive database) |
| Testing | Playwright + Vitest + axe-core |
| Build | Vite 7.2.6 |
| Deploy | Vercel (static adapter) |
| Package Manager | Bun |

---

## 16 Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, works list, identity |
| `/works` | Live project embeds (11 iframes) + previews |
| `/talks` | Speaking engagements |
| `/likes` | Curated bookmarks |
| `/blog` | Notes (Convex) |
| `/gifts` | "The Promise" — creative exchange |
| `/cv` | Structured timeline + disciplines |
| `/process` | Behind-the-scenes methodology |
| `/terminal` | CLI with 30 commands, virtual filesystem |
| `/admin` | Portfolio OS — mobile-first admin |
| `/gallery` | Image gallery |
| `/labs` | Experiments |
| `/os` | Win95-style desktop simulation |
| `/minor` | Smaller projects |
| `/scratchpad` | Draft area |
| `/blog/[slug]` | Nested blog posts |

---

## Design Philosophy

**Core principle**: *Specificity over flexibility* — constrained palette applied consistently beats unlimited options inconsistently.

### Admin Chrome (3 colors beyond neutral grays)
- `#2563EB` — blue for active states, primary actions
- `#44D62C` — electric green for visible/enabled states
- Black/white for all structure, text, borders

### Color System
- All themes use **OKLCH** color space (perceptual uniformity)
- 60/30/10 rule: 60% dominant neutral, 30% secondary, 10% accent
- Named palette: `orange`, `green`, `electric-green`, `ocean`, `gold`, `pink`, `cloud`, `red`, `yellow`

### Typography
- **Primary**: Inter (UI), JetBrains Mono (code/terminal)
- **Switchable**: Crimson Pro, Fira Code, Space Grotesk
- 12 size tokens via CSS `clamp()` — scales from 320px to 3840px
- 7 weights, 4 line-heights, 6 letter-spacing tokens

### Spacing
- Base unit: 4px
- Tokens: `2xs`(4px), `xs`(8px), `sm`(12px), `md`(16px), `lg`(24px), `xl`(32px), `2xl`(48px), `3xl`(64px), `4xl`(96px)

### Motion
- GPU-accelerated only: `transform`, `opacity`
- Respects `prefers-reduced-motion`
- Default easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### Accessibility
- WCAG AA minimum, WCAG AAA for `accessible` theme
- Keyboard shortcuts: `T` (theme), `F` (font), `/` (command palette), `?` (help)

---

## Four Themes

| Theme | Description |
|-------|-------------|
| **minimal** | Default, clean, high-contrast, editorial |
| **studio** | Warmer, slightly textured, creative presentations |
| **darkroom** | Low-light, photography-first |
| **accessible** | WCAG AAA, maximum contrast, no decorative motion |

---

## Rich Interaction Layer

- **Terminal** (`/terminal`): 30 commands, virtual filesystem — used to build parts of the platform
- **Lua Pixel Engine**: Fengari Lua VM with Balatro shader pipeline, composable per page
- **Command Palette** (`/`): Fuzzy search over routes, commands, content
- **Fluid Typography**: `clamp()` from 320px to 3840px
- **5 Typefaces**: Switchable via `F` key

---

## Convex Schema (20+ tables)

### Core Tables
- `pages` — composable page-first platform
- `sectionRegistry` — typed map of every section type
- `siteConfig` — mode, section order, parallax, feature flags
- `themes` — layered theme system

### Content Tables
- `worksEntries` — project showcases with iframe//video/static modes
- `blogPosts` — notes (replaced Sanity)
- `talksEntries` — speaking engagements
- `cvEntries` — work, education, awards, publications, projects
- `cvProfile` — name, job title, bio, skills, contact
- `cvLanguages` — language proficiency
- `academicEntries` — research papers
- `galleryItems` — image gallery
- `labEntries` — experiments with memory budgets
- `minorEntries` — smaller projects by category
- `likesCategories` — curated bookmarks
- `processConfig` — methodology phases
- `giftsConfig` — manifesto content

### Configuration Tables
- `heroConfig` — ASCII art toggles, layout, accent
- `displayConfig` — view modes, animations, immunity
- `thumbnailConfig` — grid/list/carousel/masonry
- `terminalConfig` — fortunes, neofetch, skills
- `githubProjects` — synced from GitHub API
- `featureFlags` — site-wide toggles
- `adminHistory` — change tracking for undo/audit

---

## Current Status (from PROGRESS.md)

- **Phase 0**: ✅ Done (cleanup, tokens)
- **Phase 1**: ✅ Done (data layer, Convex, sections)
- **Phase 2**: ✅ Done (Admin Content Hub)
- **Phase 2b (CMS Foundation)**: Not started
- **Phase 3 (Page Composer)**: Not started

---

## OpenSpec Changes (7 active proposals)

| Change | Status |
|--------|--------|
| data-driven-overhaul | In progress |
| overhaul-admin-UX | In progress |
| mobile-admin-kernel | In progress |
| media-infrastructure | Proposed |
| add-theme-customization | Proposed |
| add-crop-truth-table | Proposed |
| add-stress-testing | Proposed |

---

## Control Theory Architecture

From `openspec/controls-architecture.md`:

The portfolio is a dynamic, closed-loop state machine structured around **Control Theory**:

### The Inputs (Controls Array)

1. **TimeDepthController** — Information Architecture depth
   - 5-Minute Mode: Hero + 2 flagship outcomes (recruiter screen-pass)
   - 15-Minute Mode: Case studies + metadata blocks
   - Full Archive: Complete DOM exposure

2. **ThemeController** — Aesthetic matrix
   - Night Vision: WCAG AAA contrast thresholding
   - Brutalist/Minimalist: CSS custom property swaps

3. **MotionController** — Physics engines
   - Layout transitions: cubic-bezier easing
   - Physical dynamics: String Problem fluid math
   - Embellishments: parallel DOM layer (toggleable)

### The Output (Modular Blocks)
- `HeroPositioningBlock` — positioning string
- `OutcomeBlock` — Problem → Constraint → Metric
- `MetadataBlock` — Time-to-ship, scope
- `GenericListBlock` — `/likes`, `Re:mix` columns

---

## Directory Structure

```
portfolio-forever/
├── src/
│   ├── lib/
│   │   ├── admin/           # Portfolio OS admin (60+ components)
│   │   ├── components/      # AsciiDonut, CommandPalette, ThemeSwitcher
│   │   ├── data/            # content.ts, cv.ts, tokens.ts
│   │   ├── sections/        # All page sections (Convex-wired)
│   │   ├── stores/          # Svelte stores (site config)
│   │   └── utils/           # Helpers
│   ├── routes/              # SvelteKit file-based routing
│   └── app.css              # Design tokens + themes
├── convex/
│   ├── schema.ts            # 20+ tables
│   └── *.ts                 # CRUD modules
├── tests/                   # Playwright E2E + Vitest
├── openspec/                # Change proposals + specs
└── DOCS/                   # Project documentation
```

---

## Key Documentation

- `DOCS/VISION.md` — The operating system philosophy
- `DOCS/DESIGN.md` — Complete design system spec
- `DOCS/ROADMAP.md` — Phased implementation plan
- `DOCS/architecture.md` — Layout, spacing, testing decisions
- `openspec/controls-architecture.md` — Control Theory spec
- `README.md` — Quick start + structure

---

## What Makes It Unique

1. **Page-first architecture**: Each of 16 routes independently configurable from admin without deploy
2. **Real-time Convex**: Every mutation instantly reflected in UI, no page reloads
3. **Control Theory**: Depth slider for "5-minute mode" vs "full archive"
4. **Lua Pixel Engine**: Fengari VM for generative canvas effects
5. **WYSIWYG**: Display strings = stored strings, no normalization
6. **Zero hardcoded content**: Every element admin-controlled (goal)