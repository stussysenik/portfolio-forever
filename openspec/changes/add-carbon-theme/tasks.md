# Tasks: Add Carbon as Sixth Theme

## Overview
Ordered task list for shipping IBM Carbon Design System v11 as a sixth, additive theme. Every step is purely additive — no existing theme block, component, or schema shape is modified.

---

## Phase 1: Font Loading

### Task 1.1: Add IBM Plex Sans to the existing Google Fonts import
**File**: `src/app.css`

- [ ] Append `IBM+Plex+Sans:wght@300;400;500;600;700` to the existing `@import` on line 7
- [ ] Confirm `IBM Plex Mono` (already imported) covers the mono weights Carbon uses (300, 400, 500, 700)
- [ ] Verify `display=swap` parameter still applies to the combined import

---

## Phase 2: Carbon CSS Theme Block

### Task 2.1: Add `[data-theme="carbon"]` selector block
**File**: `src/app.css`

- [ ] Insert new block after the existing `[data-theme="accessible"]` block (around line 315)
- [ ] Map all Carbon v11 color tokens per `design.md` token table
- [ ] Set `--font-sans` to `'IBM Plex Sans', system-ui, sans-serif`
- [ ] Set `--font-mono` to `'IBM Plex Mono', ui-monospace, monospace`
- [ ] Carbon-shaped `--color-bg-alt`, `--color-surface`, `--color-surface-raised` from `$layer-01..03`
- [ ] Carbon `$border-subtle-01`, `$border-strong-01`, `$border-inverse` mapped to existing border vars
- [ ] Carbon `$support-success / warning / error` mapped to existing semantic colors
- [ ] Confirm zero edits to existing five theme blocks

### Task 2.2: Verify Carbon block does not introduce new CSS custom properties
- [ ] Diff the full file: only one new selector block, no new `--*` variables outside it

---

## Phase 3: Convex Seed

### Task 3.1: Extend `themes.seedBuiltIn`
**File**: `convex/themes.ts`

- [ ] Add a sixth element to the `builtIn` array with `themeId: "carbon"`
- [ ] `label: "Carbon"`, `type: "light"`, `isBuiltIn: true`, `isDefault: false`
- [ ] `colors` object populated per design.md token table
- [ ] `fonts: { sans: "ibm-plex-sans", mono: "ibm-plex-mono" }`
- [ ] Confirm idempotent guard (`existing.length > 0`) is preserved

### Task 3.2: Inject Carbon into already-seeded environments
- [ ] Run `themes.upsert({ themeId: "carbon", ... })` against dev Convex deployment
- [ ] Verify `themes.getAll` now returns 6 rows in dev
- [ ] Document the upsert call in the change notes for prod rollout

---

## Phase 4: Verification (No New UI Code)

### Task 4.1: Confirm admin theme switcher picks up Carbon automatically
- [ ] Open `/admin` theme controls
- [ ] Verify Carbon appears in the theme list with no source edits to the switcher
- [ ] Select Carbon and confirm `data-theme="carbon"` appears on `<html>`

### Task 4.2: Confirm per-page override accepts Carbon
- [ ] In `/admin/pages/[slug]`, set `themeOverrides` to `"carbon"`
- [ ] Visit the page and confirm Carbon palette renders
- [ ] Confirm sibling pages still render their assigned themes

### Task 4.3: Visual regression — existing five themes
- [ ] Capture homepage screenshots in `minimal`, `studio`, `terminal`, `darkroom`, `accessible`
- [ ] Diff against `main` baseline
- [ ] Confirm zero pixel deltas in any of the five existing themes

---

## Phase 5: Accessibility

### Task 5.1: WCAG validation for Carbon palette
- [ ] Run existing axe-core suite (`tests/accessibility/homepage.spec.ts`) with `data-theme="carbon"`
- [ ] Confirm body text on `--color-bg` ≥ 7:1 (Carbon `$text-primary` on `$background` is 16.78:1)
- [ ] Confirm `--color-accent` on `--color-bg` meets WCAG AA for interactive elements
- [ ] Confirm focus indicators remain visible against Carbon `$layer-01` surfaces

### Task 5.2: Keyboard cycle includes Carbon
- [ ] Press `T` repeatedly and confirm the cycle reaches Carbon as the sixth option
- [ ] Confirm screen reader announces "Theme changed to Carbon" via existing `aria-live` region
- [ ] Confirm `localStorage` persists `preferred-theme = carbon` across reload

---

## Phase 6: Documentation

### Task 6.1: Update README theme count
- [ ] Bump the theme count from 5 to 6
- [ ] List Carbon alongside the existing five themes

---

## Task Summary

**Total Tasks**: 17
**Completed**: 0/17
**Remaining**: 17 — not started
