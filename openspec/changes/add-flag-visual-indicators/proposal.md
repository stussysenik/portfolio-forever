# Proposal: Add Feature Flag Visual Indicators

## Overview
Surface live, on-page visual indicators for every flag-controlled feature on the public site, so each `featureFlags` row is observable without opening admin. This is the only remaining gap from `mobile-admin-kernel`; the rest is delivered (see `DOCS/plans/2026/04/15/portfolio-os-grounding.md` D1).

## Problem Statement
Feature flags today are administered as a flat list of ON/OFF toggles in `src/lib/admin/FeatureFlagsAdmin.svelte:35-48`, persisted via `convex/siteConfig.ts:74-100` (`setFeatureFlag`) into the `featureFlags` table declared at `convex/schema.ts:139-143`. Three problems result:

1. **No public-site feedback loop.** When an admin toggles `pixel-engine`, `ascii-donut`, `parallax`, `view-transitions`, `wip-banner`, `elevator`, `terminal-matrix`, `os-desktop`, `social-links`, or `command-palette` (the ten flags hard-coded in `FeatureFlagsAdmin.svelte:8-19`), there is no visual confirmation on the public site that the corresponding feature is currently mounted vs. dormant.
2. **Status pill in admin is decoupled from runtime.** The `flag-status` pill (`FeatureFlagsAdmin.svelte:38, 94-108`) reflects the static `status: 'active' | 'planned'` field of the `DEFAULT_FLAGS` constant, not the live `enabled` boolean. An admin cannot tell at a glance which flags are actually firing.
3. **No regression net.** Flag-driven mounts (e.g. `<AsciiDonut />` conditional in `HeroSection.svelte`) are not covered by Playwright tests that assert the indicator's presence/absence as the flag toggles.

## Proposed Solution
Add a small, consistent visual indicator next to each flag-controlled feature on the public site, plus mirror the same indicator language inside the admin chip so admin and runtime agree.

### 1. Public-site indicator primitive
A subtle on-page badge (small green dot for `enabled === true`, dim outline dot for `enabled === false`) attached to each flag-controlled feature's mount point. Visual language matches the existing admin chip system (`--color-success` border + dot, `--font-mono`, `--font-size-2xs`) so it reads as "system status" rather than decoration. The indicator is opt-in per route via a query param or a global "show flag debug" toggle in `siteConfig` so it does not appear for normal visitors.

### 2. Admin chip parity
Replace the static `flag-status` pill in `FeatureFlagsAdmin.svelte` with a live indicator bound to the `enabled` boolean (the same green-dot/outline-dot vocabulary) so admin and public site speak one language.

### 3. Playwright coverage
End-to-end tests that flip each flag via `api.siteConfig.setFeatureFlag` and assert the corresponding public-site indicator appears or disappears, gating future regressions.

## Impact & Benefits
- **Closes the feedback loop** — admins see runtime state without leaving the page they edited
- **Single source of truth** — runtime indicator and admin chip share one visual + data binding
- **Regression net** — Playwright catches future flag wiring bugs automatically
- **Zero impact on normal visitors** — indicators are gated behind a debug toggle
- **Closes the last open `mobile-admin-kernel` gap** per Decision D1

## Dependencies
- `featureFlags` table at `convex/schema.ts:139-143` (no migration required)
- `convex/siteConfig.ts:67-100` queries/mutations (`getFeatureFlags`, `setFeatureFlag`) — existing
- `src/lib/admin/FeatureFlagsAdmin.svelte` — existing UI to refactor
- Existing Playwright test infrastructure (`tests/e2e/`) — no new harness

## Risks
- **Visual noise.** Mitigation: indicators are debug-gated and use the existing chip palette so they read as system status, not feature ornament.
- **Drift between flag list and mount sites.** Mitigation: a single shared `flagIndicatorRegistry` map keyed by flag key.

## Success Criteria
- [ ] Every flag in `DEFAULT_FLAGS` (`FeatureFlagsAdmin.svelte:8-19`) has a corresponding public-site indicator wired to its mount point
- [ ] Admin chip and public indicator share one component and one binding to the `enabled` field
- [ ] Indicators are hidden by default for unauthenticated visitors
- [ ] Playwright spec verifies indicator presence/absence for at least 3 representative flags after toggling
- [ ] No regression in existing `FeatureFlagsAdmin.svelte` toggle behavior
