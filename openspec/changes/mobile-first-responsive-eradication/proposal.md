# Mobile-First Responsive Eradication

## Problem

The portfolio site has **fragmented responsive breakpoints** with no shared design-token system. 19 different pixel values are used as breakpoints across 40+ files, mixing `max-width` (desktop-first) and `min-width` (mobile-first) patterns. On a 360px viewport, the `.one-page` grid generates a `528px` fixed column, causing horizontal overflow and content clipping.

### Symptoms
- On mobile (320–480px), content overflows, overlaps sidebars, and the LIVE SIGNAL box crashes into headings
- `.safe-boundary-viewport` uses `clamp(0.35rem, 1vw, 0.9rem)` horizontal padding which gives ~5px per side on 360px — far too tight
- `overflow-x: hidden` on `:root` and `body` masks the overflow rather than solving it
- BaseLayout's shell breakpoint at `max-width: 900px` is the only structural breakpoint; all sections use ad-hoc breakpoints
- The `.entry` component in `app.css` has `grid-template-columns: 120px 1fr auto` with no mobile override — the 120px date column chokes on small screens

### Root Cause
No breakpoint token system. Each component independently decides its own breakpoints, leading to inconsistent behavior and fragile layouts. The site was built desktop-first and patched with `max-width` queries.

## Proposal

Eradicate all `max-width` responsive patterns and establish a **mobile-first breakpoint system** using CSS custom properties. Every `max-width` query in the public-facing UI gets inverted to `min-width`. The base (no-query) styles target the smallest viewport (320px), and progressive enhancement adds layout complexity at named breakpoints.

### Canonical Breakpoint Tokens
```
--bp-sm:  480px   /* large phone */
--bp-md:  768px   /* tablet */
--bp-lg:  1024px  /* desktop */
--bp-xl:  1440px  /* wide desktop */
--bp-2xl: 2200px  /* ultra-wide */
```

### Scope
- `app.css` — add breakpoint tokens, fix `.entry` grid, add base mobile utilities
- `BaseLayout.astro` — invert shell breakpoint to mobile-first
- `OnePageView.svelte` — fix mobile padding, ensure base styles are mobile-first
- `MobileDock.svelte` — invert to mobile-first (show by default, hide at `md`)
- `HeroSection.svelte` — invert all `max-width` queries
- `WorksSection.svelte` — invert `max-width: 767px`
- `MediaSection.svelte` — already mobile-first, verify
- `TerminalSection.svelte` — invert `max-width: 767px`
- `BlogSection.svelte` — invert `max-width: 900px` and `600px`
- `MinorSection.svelte` — invert `max-width: 600px`
- `AcademiaSection.svelte` — invert `max-width: 600px`
- `LikesSection.svelte` — already mobile-first, verify
- `TalksSection.svelte` — already mobile-first, verify
- `GiftsSection.svelte` — already mobile-first, verify
- `Minimap.svelte` — invert visibility breakpoint to mobile-first
- `Elevator.svelte` — invert `max-width: 900px`
- `NavSidebar.svelte` / `NavHybrid.svelte` / `NavDrawer.svelte` — invert mobile overrides
- `HiringProof.svelte` — invert `max-width: 767px`
- `HeroPositioningBlock.svelte` — invert `max-width: 480px`
- `HomepageRuntimeBridge.svelte` — invert `max-width: 780px`
- All admin components — leave as-is (separate pass)

### Out of Scope
- Admin layout responsive fixes (separate change)
- Content/data restructure
- New features or design changes