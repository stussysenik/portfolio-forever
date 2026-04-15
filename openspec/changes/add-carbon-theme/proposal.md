# Proposal: Add Carbon Design System as Sixth Theme

## Overview
Add IBM Carbon Design System v11 as a sixth selectable theme alongside the existing five (`minimal`, `studio`, `terminal`, `darkroom`, `accessible`). Purely additive — no existing theme is replaced, modified, or deprecated.

## Problem Statement
The five existing themes cover refined-minimal, studio-achromatic, terminal-dark, darkroom, and high-contrast accessible aesthetics. None speak the visual vocabulary of enterprise/industrial design systems. Carbon — IBM's open design system — represents a distinct, well-recognized point in the design landscape: data-dense, IBM Plex typography, Carbon Gray palette, 8px Carbon grid, "productive" and "expressive" motion curves.

Adding Carbon demonstrates fluency with a major industrial design system without disrupting delivered work. It also exercises the data-driven theme registry — proving that a sixth theme requires zero new UI code, zero new switching logic, and zero changes to the WCAG contrast machinery.

## Proposed Solution
Carbon ships as a sixth row in the existing theme system, reusing every primitive that already exists.

### 1. New `[data-theme="carbon"]` Block in `src/app.css`
A new selector block alongside the existing five, populating the same project CSS custom properties (`--color-bg`, `--color-text`, `--color-accent`, `--font-sans`, `--font-mono`, `--space-*`, `--border-color`, `--shadow-*`) with values mapped from Carbon v11 tokens. Typography is **IBM Plex Sans** (UI) and **IBM Plex Mono** (code). `IBM Plex Mono` is already imported in `src/app.css:7`; only `IBM Plex Sans` needs adding to the existing Google Fonts `@import`.

### 2. New Convex `themes` Row
A new entry seeded by extending `convex/themes.ts:seedBuiltIn` with one additional element: `{ themeId: "carbon", label: "Carbon", type: "light", colors: {...}, fonts: {...}, isBuiltIn: true, isDefault: false }`. For already-seeded environments, a one-shot `themes.upsert` injects Carbon. `convex/seed.ts` / `convex/seedAll.ts` remain untouched.

### 3. Zero New Admin UI
The admin theme switcher already iterates the `themes` table via `api.themes.getAll`. Carbon appears in the dropdown the moment the seed runs. Per-page selection via `pages.themeOverrides` works identically — Carbon is a string ID like every other theme.

### 4. Existing Contrast Machinery Applies Unchanged
The `ThemeController` WCAG AAA validator operates on resolved CSS custom properties, not theme-specific code. Carbon flows through it with no special-casing.

## Impact & Benefits
- **Additive only** — no existing theme touched, no migration, no deprecation, no risk to delivered `add-theme-customization` work
- **Demonstrates registry pattern** — proves the data-driven theme system scales without code changes
- **Industrial design fluency** — adds a recognizable enterprise-grade visual option
- **Zero new UI code** — switcher, persistence, per-page overrides, contrast validation all reused

## Dependencies
- `IBM Plex Sans` added to existing Google Fonts `@import` (`src/app.css:7`)
- Existing `themes` Convex table (`convex/schema.ts:362`)
- Existing `themes.upsert` and `themes.seedBuiltIn` (`convex/themes.ts`)
- Existing `[data-theme="..."]` selector pattern (`src/app.css:148+`)
- Existing admin theme switcher (registry-driven, no edits)

## Alternatives Considered
1. **Replace an existing theme with Carbon** — Rejected. Destroys delivered work; user explicitly chose additive.
2. **Carbon as a top-level mode (not a theme)** — Rejected. Forks the theme system into two pipelines.
3. **Tokens-only adoption (rename project tokens globally)** — Rejected. Touches every existing theme.

## Success Criteria
- [ ] `[data-theme="carbon"]` selector block exists in `src/app.css` and populates all theme-scoped custom properties
- [ ] `IBM Plex Sans` loads via the existing `@import`
- [ ] `themes` table contains a row with `themeId: "carbon"`, `isBuiltIn: true`, `isDefault: false`
- [ ] Admin theme switcher shows Carbon without any code edits
- [ ] Per-page `themeOverrides` accepts `"carbon"` and renders correctly
- [ ] Carbon palette passes the existing WCAG AAA contrast validation
- [ ] All five existing themes continue to render identically (visual regression)
- [ ] Theme persistence cycles through 6 themes including Carbon
