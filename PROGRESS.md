# Progress Log

## Session: Feb 24, 2026 — Spacing, Scroll, Nav Polish

### Consistent Page Spacing
- Removed `justify-content: center` and `min-height: 60vh` from `/likes` wrapper — content anchors to top
- Removed `justify-content: center` and `min-height: 50vh` from `/talks` wrapper — same fix
- Added `padding-top: var(--space-lg)` to `/cv` container for breathing room below fixed header

### Works Scroll-to-Top
- Added `window.scrollTo(0, 0)` in `onMount` to prevent mid-page load from skeleton loading

### Nav & Layout Polish
- Unified social links to always use `@` dropdown toggle (all viewports, removed desktop-inline mode)
- Changed nav active underline: 1.5px `--color-text` to 2px `--color-electric-green`
- Fixed email hover gradient: Zig orange (`#F7A41D`) -> accent blue (`#2563EB`)
- Added X brand hover: bold black (light), white (terminal theme)
- Increased `terminal -> @` toggle gap to `var(--space-lg)` on desktop

### Colored Highlight Backgrounds
- Homepage entries with `data-highlight` now show colored background chips (9 levels) instead of colored text

### Tests — 317 Playwright tests across 8 files
- Updated nav hierarchy tests to match unified `@` dropdown (no more desktop-inline social links)
- Updated base URL to portless `portfolio.localhost:1355`
- Added 30+ mobile `/works` tests: skeleton transitions, iframe suppression, preview images, network throttling (3G/4G), failure resilience, viewport layouts, touch targets, performance

### Docs
- Updated README.md test section (317 tests, mobile works coverage)
- Created DOCS.md with architecture decisions (spacing, social links, works mobile strategy, tokens, test structure)
- Updated PROGRESS.md (this file)

---

## Session: Feb 2026 — UI Polish & Deploy Prep

### Identity Section Fix
- Reordered domains: mxzou.com (main) → mengxuanzou.com (filmmaking) → stussysenik.com (dev + creative)
- Wrapped each domain in `.domain-group` spans for self-contained units
- Added `justify-content: space-between` for full-width spacing

### Nav Hierarchy
- Changed "elsewhere" label to "find me elsewhere" for clearer 3-tier separation: title | pages | external links
- Desktop: label visible inline before social links
- Mobile: label hidden, `@` toggle visible

### Playwright Tests (`tests/ui-polish.spec.ts`)
32 tests covering:
- Route health: all 9 pages return 200
- Nav hierarchy: desktop label visible, mobile toggle works
- Hero responsiveness: column-reverse on mobile, side-by-side on desktop
- Footer dropdowns: theme switcher opens upward
- Command palette: opens with `?`, 2-col desktop / 1-col mobile, contains "Go to Gifts"
- Works page: 11 projects, no "2D CAD editor", mymind preview image
- Blog route: `/blog` loads, `/notes` returns 404
- Identity: domain ordering verified
- CV: skill bars present, no percentages, Cooper Union "dropped out"
- Gifts: 3 send items, no "physical address", Promise clarification
- Cross-breakpoint smoke: 375px, 768px, 1280px

### Documentation
- Updated README.md with current routes, design system, tech stack
- Created PROGRESS.md (this file)

### Verification
- `npx vite build` — passes (warnings only: unused CSS selectors in process/gallery)
- `npx playwright test tests/ui-polish.spec.ts --project=chromium` — 32/32 passed
