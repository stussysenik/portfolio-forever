# Progress Log — feat/theme-overhaul

Branch: `feat/theme-overhaul` · 50+ commits · Started from `main`

---

## Phase 0: Cleanup & Foundation (3 commits)

Removed dead code, consolidated design tokens, established theme system.

- `bbd958e` 4-theme system (brutalist, soft, darkroom, terminal), camera framing, footer BedStuy
- `4c6ada0` 3x3 font grid + terminal showcase with 30 commands
- `d0ab49c` Terminal perf overhaul, identity update, expandable browser

---

## Phase 1: Data Layer & Section Architecture (30+ commits)

Built Convex backend, extracted all sections into components, wired real-time data.

**Section extraction** (6 commits):
- Extracted hero, blog, works, talks, academia, cv, terminal, gallery, os, process, likes, gifts, minor into standalone `$lib/sections/*.svelte` components

**OnePageView & navigation** (6 commits):
- `af51903` OnePageView with scroll spy, section nav, lazy loading
- `3782a35` Parallax scroll transitions between sections
- `289aa89` Reader mode toggle in command palette
- `e83f69d` One-page mode redirect support for all routes

**Convex backend** (10+ commits):
- `a27881f` siteConfig schema, section registry, site mode store
- `a8dfb09` Wire gifts, likes, cv sections to Convex
- `399c0e9` Backend functions for all data-driven sections
- `e51e3ea` Extended schema: cvProfile hero fields, worksEntries styleOverrides, 6 new tables
- `214293d` Gallery, minor, labs, blog CRUD modules
- `548470c` Wire ALL sections to Convex, remove static content fallbacks

**Special features**:
- `18672d0` Pixel engine with Fengari Lua VM and Balatro shader pipeline
- `c3d8837` Periodic table name, geometric backgrounds, category diagrams
- `e850304` Works view modes (case-study, minimal-list) with immunity system

---

## Phase 2: Admin Content Hub (15+ commits)

Built Linear-style admin dashboard with composable components.

**Foundation** (5 commits):
- `ed4ff1e` sectionRegistry + githubProjects Convex data layer
- `4f4dca1` BentoGrid + BentoCell layout components
- `a03578a` 9 section preview components for bento dashboard
- `cc89b2b` 7 system control cells for admin dashboard
- `d3ef62c` Rewired admin page to BentoGrid layout

**ContentHub** (7 commits):
- `eec3de2` WYSIWYG validation helpers and named color constants
- `f786cf6` Editable ColorStrip with palette popover
- `e23a3a0` ParticlesCell with multi-select presets
- `6bad41d` EntryTable with adaptive columns and expandable rows
- `0f60825` PagePanel with controls, colors, particles, entries, sections
- `3e22653` ContentHub with tab bar, new page form, panel orchestration
- `4b74f3b` Wire ContentHub as admin landing, replace PageGrid

**Polish** (3 commits):
- `f762ce4` Admin accessibility: focus-visible, labels, aria, semantic HTML
- `30183c7` Seed all known pages on admin load
- `a2132de` Mobile responsive: larger touch targets, wrapping controls

---

## Repo Cleanup (this commit)

Organized root directory for continued development:

- **Removed**: `markdown/` (old Sanity docs), `zachteed-full.png`, `prompt.md`, `PROGRESS.md`, `QA_LEDGER.md`, `AGENTS.md`, `package-lock.json`, `skills-lock.json`
- **Consolidated**: Moved `DESIGN.md`, `VISION.md`, `ROADMAP.md`, `DOCS.md` into `DOCS/`
- **Gitignored**: `.agents/`, `.goose/`, `.trae/`, `.impeccable.md`
- **Deleted**: AI agent caches, test artifacts, `.DS_Store` files
- **Fixed**: Infinite reactivity loop in `OnePageView.svelte` (Svelte 5 effect cycle)

---

## Current State

- **Phase 0**: Done
- **Phase 1**: Done
- **Phase 2**: In progress — ContentHub wired, mobile responsive, page seeding working
- **Phase 2b** (CMS Foundation): Not started
- **Phase 3** (Page Composer): Not started
- **Known issue**: Some sections show `[0]` entry counts (Convex tables empty until seeded)
