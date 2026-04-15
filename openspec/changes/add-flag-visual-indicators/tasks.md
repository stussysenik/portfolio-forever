# Tasks: Add Feature Flag Visual Indicators

## Overview
Ordered task list for wiring live visual indicators between `featureFlags` (`convex/schema.ts:139-143`), the public site, and the admin chip in `src/lib/admin/FeatureFlagsAdmin.svelte`.

---

## Phase 1: Indicator Primitive (High Priority)

### Task 1.1: Create FlagIndicator Component
**File**: `src/lib/components/FlagIndicator.svelte` (new)

- [ ] Accept props: `flagKey: string`, `enabled: boolean`, `label?: string`
- [ ] Render a small dot + monospace label using existing chip vocabulary (`--color-success`, `--font-mono`, `--font-size-2xs`)
- [ ] Distinct visual states for `enabled === true` (filled green) vs `enabled === false` (dim outline)
- [ ] Respect `prefers-reduced-motion` for any state-change transition

---

### Task 1.2: Build flagIndicatorRegistry
**File**: `src/lib/admin/flagIndicatorRegistry.ts` (new)

- [ ] One map keyed by the 10 flag keys in `FeatureFlagsAdmin.svelte:8-19`
- [ ] Each entry: `{ key, label, mountHint }` describing where the public-site mount lives
- [ ] Single source of truth shared by admin chip and public indicator

---

## Phase 2: Public-Site Wiring (High Priority)

### Task 2.1: Add Debug Visibility Gate
**File**: `convex/schema.ts`, `convex/siteConfig.ts`

- [ ] Add `showFlagIndicators?: boolean` to the `siteConfig` table fields
- [ ] Extend `siteConfig.upsert` to accept the new field
- [ ] Default false — indicators hidden for normal visitors

---

### Task 2.2: Mount FlagIndicator at Each Feature Site
**Files**: section components that consume each flag from `featureFlags`

- [ ] `pixel-engine` — mount near the `<PixelCanvas />` consumer
- [ ] `ascii-donut` — mount in `HeroSection.svelte` next to the donut conditional
- [ ] `parallax` — mount near the parallax controller
- [ ] `view-transitions` — mount in `+layout.svelte`
- [ ] `wip-banner` — mount near the banner
- [ ] `elevator` — mount near the back-to-top control
- [ ] `terminal-matrix` — mount near the terminal animation
- [ ] `os-desktop` — mount near the OS Desktop simulator
- [ ] `social-links` — mount near the social links dropdown
- [ ] `command-palette` — mount near the command palette host
- [ ] All mounts gated by `siteConfig.showFlagIndicators`

---

## Phase 3: Admin Chip Parity (Medium Priority)

### Task 3.1: Replace Static Status Pill With FlagIndicator
**File**: `src/lib/admin/FeatureFlagsAdmin.svelte:38, 94-108`

- [ ] Replace the `flag-status` static pill with `<FlagIndicator>` bound to live `enabled`
- [ ] Keep the existing ON/OFF toggle button at `FeatureFlagsAdmin.svelte:40-46` unchanged
- [ ] Remove the `status: 'active' | 'planned'` literal from `DEFAULT_FLAGS` if no longer referenced

---

### Task 3.2: Add showFlagIndicators Toggle to Admin
**File**: `src/lib/admin/FeatureFlagsAdmin.svelte` (or appropriate global compartment)

- [ ] Surface a single switch that flips `siteConfig.showFlagIndicators`
- [ ] Persist via `siteConfig.upsert`

---

## Phase 4: Playwright Coverage (Required)

### Task 4.1: Spec — Indicator Reflects Flag State
**File**: `tests/e2e/feature-flag-indicators.spec.ts` (new)

- [ ] Enable `showFlagIndicators` via `siteConfig.upsert`
- [ ] For at least 3 representative flags (`ascii-donut`, `elevator`, `pixel-engine`): toggle via `siteConfig.setFeatureFlag`, assert the public-site indicator appears/disappears
- [ ] Assert admin chip and public indicator show identical state at the same moment
- [ ] Assert indicators are absent when `showFlagIndicators` is false

---

## Task Summary

**Total Tasks**: 8
**Completed**: 0/8 (0%)
**Remaining**: 8 — not started
