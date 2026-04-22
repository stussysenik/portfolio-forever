# Mobile-First Responsive Eradication — Design

## Breakpoint Token System

Add to `:root` in `app.css`:
```css
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1440px;
--bp-2xl: 2200px;
```

These tokens are reference values. Due to CSS custom property limitations in `@media` queries (they can't be used directly), the actual queries will hardcode the values but reference the token names in comments.

## Shell Layout (BaseLayout.astro)

**Before**: Desktop-first with `max-width: 900px` override
**After**: Mobile-first base styles, `min-width: 900px` for sidebar activation

```css
/* Base: mobile (no sidebar) */
.astro-shell__sidebar { display: none; }
.astro-shell__main { width: 100%; max-width: 100%; padding: 1rem 1rem 7rem; }
.astro-terminal { display: none; }
.astro-shell::before { display: none; }

/* Desktop: sidebar active */
@media (min-width: 900px) {
  .astro-shell::before { display: block; /* gradient line */ }
  .astro-shell__sidebar { display: flex; /* full sidebar */ }
  .astro-shell__main { margin-left: var(--sidebar-width); width: ...; }
  .astro-terminal { display: flex; }
}
```

## OnePageView Mobile Padding Fix

**Before**: `padding: clamp(1rem, 2vw, 2rem) clamp(0.35rem, 1vw, 0.9rem) clamp(4rem, 8vh, 6rem)`
At 360px: ~5px horizontal padding — unusable.

**After**: Base padding of `1rem` horizontal, scaling up:
```css
.safe-boundary-viewport {
  padding: clamp(1rem, 2vw, 2rem) 1rem clamp(4rem, 8vh, 6rem);
}
@media (min-width: 480px) {
  .safe-boundary-viewport { padding-inline: clamp(1rem, 3vw, 2rem); }
}
@media (min-width: 768px) {
  .safe-boundary-viewport { padding-inline: clamp(1.5rem, 4vw, 3rem); }
}
```

Remove the `max-width: 480px` 15%-padding override (replaced by fluid padding above).

## Entry Component (app.css)

**Before**: `grid-template-columns: 120px 1fr auto` (no mobile override)
**After**:
```css
.entry {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-2xs);
  /* ... */
}
@media (min-width: 480px) {
  .entry {
    grid-template-columns: auto 1fr auto;
    gap: var(--space-md);
  }
}
```

## Section Breakpoint Inversion Pattern

For every section using `max-width`, invert to mobile-first:

| Component | Before | After |
|---|---|---|
| HeroSection | `max-width: 1023px`, `max-width: 767px` | Base = mobile, `min-width: 768px`, `min-width: 1024px` |
| WorksSection | `max-width: 767px` | Base = stacked, `min-width: 768px` for grid |
| TerminalSection | `max-width: 767px` | Base = small, `min-width: 768px` for full |
| BlogSection | `max-width: 900px`, `max-width: 600px` | Base = 1col, `min-width: 600px` 2col, `min-width: 900px` 3col |
| MinorSection | `max-width: 600px` | Base = stacked, `min-width: 600px` inline |
| AcademiaSection | `max-width: 600px` | Base = stacked, `min-width: 600px` grid |
| HiringProof | `max-width: 767px` | Base = stacked, `min-width: 900px` grid |
| NavSidebar | `max-width: 767px` | Base = inline, `min-width: 768px` fixed sidebar |
| NavHybrid | `max-width: 767px` | Base = compact, `min-width: 768px` expanded |
| NavDrawer | `max-width: 767px` | Base = touch-friendly, `min-width: 768px` desktop |
| Minimap | `max-width: 900px` (hide), range `901px–1100px` | Base = hidden, `min-width: 900px` show, `min-width: 1100px` reposition |
| Elevator | `max-width: 900px` | Base = compact, `min-width: 900px` expanded |
| HeroPositioningBlock | `max-width: 480px`, range `481px–768px` | Base = small, `min-width: 481px` medium, `min-width: 768px` large |
| HomepageRuntimeBridge | `max-width: 780px` | Base = stacked, `min-width: 780px` grid |

## MobileDock Inversion

**Before**: Hidden by default, shown at `max-width: 900px`
**After**: Shown by default, hidden at `min-width: 900px`

## Global Overflow Fix

Remove `overflow-x: hidden` from `:root` and `body` in `app.css`. Instead, add `overflow-x: clip` on `.astro-shell` only (clip without scrollbar).