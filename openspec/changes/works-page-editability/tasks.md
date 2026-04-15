# Tasks: Works Page Full Editability (MVP "First Page" Slice)

## Overview
Ordered task list for the additive-only works-page editability migration. Three new optional fields, no renames, backwards compatible.

---

## Phase 1: Schema (additive only)

### Task 1.1: Add `linkLabel` to `worksEntries`
**File**: `convex/schema.ts:76-105`

- [ ] Add `linkLabel: v.optional(v.string())` as a top-level field on `worksEntries`, sibling to `title` and `url`
- [ ] Verify the existing `styleOverrides` object still has exactly `accentColor`, `badgeStyle`, `impactMetrics` before editing
- [ ] Run `npx convex dev` and confirm schema validates against existing documents

### Task 1.2: Add `httpColor` and `secondaryHighlight` to `styleOverrides`
**File**: `convex/schema.ts:97-104`

- [ ] Add `httpColor: v.optional(v.string())` inside the existing `styleOverrides` v.object
- [ ] Add `secondaryHighlight: v.optional(v.string())` inside the existing `styleOverrides` v.object
- [ ] Do NOT rename `accentColor` — it stays as-is and is reinterpreted as the stripe color in the renderer
- [ ] Re-run `npx convex dev` and confirm zero validation errors against existing data

---

## Phase 2: Mutation validators

### Task 2.1: Extend `createEntry` validator
**File**: `convex/works.ts:22-48`

- [ ] Add `linkLabel: v.optional(v.string())` to the `args` block
- [ ] Add a `styleOverrides` arg matching the schema shape (accentColor, badgeStyle, impactMetrics, httpColor, secondaryHighlight) — all optional
- [ ] Verify the handler still passes `args` to `ctx.db.insert` unchanged

### Task 2.2: Extend `updateEntry` validator
**File**: `convex/works.ts:50-77`

- [ ] Add `linkLabel: v.optional(v.string())` to the `args` block
- [ ] Add the optional `styleOverrides` arg with the full nested shape
- [ ] Confirm `stripUndefined(fields)` continues to handle partial patches correctly

---

## Phase 3: Admin UI

### Task 3.1: Add `linkLabel` chip to admin
**File**: `src/lib/admin/WorksAdmin.svelte`

- [ ] Add a new chip entry in the tool-tag row at lines 239-248, following the same pattern as `viewport`, `cam`, `videoPreview`, `muxPlaybackId`
- [ ] Wire the chip to the existing `startEdit` / `saveWorkEdit` flow with field name `linkLabel`
- [ ] Verify edit-buffer save persists via `client.mutation(api.works.updateEntry, ...)`

### Task 3.2: Add color pickers for `httpColor` and `secondaryHighlight`
**File**: `src/lib/admin/WorksAdmin.svelte`

- [ ] Add a color control for `styleOverrides.httpColor`, consistent with how `accentColor` is currently exposed (or via a minimal `<input type="color">` chip if no picker exists)
- [ ] Add a matching color control for `styleOverrides.secondaryHighlight`
- [ ] Both controls call `client.mutation(api.works.updateEntry, { id, styleOverrides: { ...existing, httpColor: value } })` to avoid stomping sibling fields
- [ ] Confirm the existing `accentColor` control (if any) still works unchanged

---

## Phase 4: Render surface

### Task 4.1: Render `linkLabel` in `WorksSection.svelte`
**File**: `src/lib/sections/WorksSection.svelte`

- [ ] Add `linkLabel?: string` to the `Project` interface at lines 13-26
- [ ] Where the URL is rendered as link text, prefer `project.linkLabel ?? project.url`
- [ ] Verify fallback: a project with no `linkLabel` still renders the raw URL

### Task 4.2: Apply `httpColor` and `secondaryHighlight` as CSS variables
**File**: `src/lib/sections/WorksSection.svelte`

- [ ] Add `styleOverrides` to the `Project` interface
- [ ] On each project card, set `--works-http-color` and `--works-secondary-highlight` inline-style from `styleOverrides.httpColor` / `secondaryHighlight`
- [ ] Reference the existing `styleOverrides.accentColor` as `--works-stripe-color` for the stripe element
- [ ] Update the relevant `<style>` rules to consume the three CSS variables with sensible fallbacks (existing theme tokens)

---

## Phase 5: Verification

### Task 5.1: Live edit smoke test
- [ ] Open `/admin` and `/works` side by side
- [ ] Edit `linkLabel` on a project — verify the link text updates live with no reload
- [ ] Edit `httpColor` — verify the http highlight updates live
- [ ] Edit `secondaryHighlight` — verify the secondary accent updates live
- [ ] Edit existing `accentColor` — verify the stripe updates (no regression)

### Task 5.2: Backwards compatibility
- [ ] Load `/works` against existing production data — confirm zero schema validation errors
- [ ] Confirm projects without any of the three new fields render identically to before

### Task 5.3: Type and build check
- [ ] Run `npx tsc --noEmit` (or equivalent) — zero new errors
- [ ] Run the existing works-related Playwright spec (if present) — no regressions

---

## Task Summary

**Total Tasks**: 13
**Completed**: 0/13
**Scope**: 3 optional schema fields, 2 validator updates, admin chip + 2 color controls, 2 render-surface updates
