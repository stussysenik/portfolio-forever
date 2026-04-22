# Reality Audit: Openspec vs Current Repo

## Bottom Line

No, `openspec` is not fully finished.

More importantly, the drift is not one-directional:

- some specs look more finished on paper than they are in verification reality
- some specs look less finished on paper than the codebase actually is

The right conclusion is not "specs failed." The right conclusion is that the planning layer now needs a reconciliation pass so it can become trustworthy again.

## 1. Completed And Trustworthy

These changes currently read as substantially aligned with repo reality:

- `add-crop-truth-table`
- `add-theme-customization`
- `data-driven-overhaul`
- `media-infrastructure`
- `mobile-admin-kernel`
- `polish-admin-final`
- `stabilize-live-embed-admin-runtime`

These are the strongest foundations in the repo today.

## 2. Mixed / Partially Closed

These changes have real implementation behind them, but the task sheets still reflect meaningful open work:

- `astro-full-migration-foundation`
- `finish-admin-cms`
- `finish-astro-parity`
- `overhaul-admin-ux`
- `redesign-admin-shell`
- `reference-superset-standardization`
- `unify-shell-works-clean-writer`
- `precision-monolith-replatform`

Interpretation:

- the architecture direction is often real
- parity and verification are the usual unfinished edges
- these should not be described as "done" without qualification

## 3. Stale Task Sheets

These changes now show the clearest planning drift.

### `backfill-responsive-stories`

Task sheet status says effectively "not started," but the repo currently contains:

- tablet responsive specs under `tests/responsive/tablet/`
- desktop responsive specs under `tests/responsive/desktop/`
- story files for:
  - `ThemeSwitcher`
  - `FontSwitcher`
  - `Elevator`
  - `AsciiDonut`
  - `Toast`

Conclusion:

- this change is not unstarted
- it needs task-sheet reconciliation and actual validation status, not a fresh proposal
- however, the Storybook layer itself is still broken in current reality: `bun run build-storybook` fails because the repo is using `@storybook/svelte-vite` in a SvelteKit-shaped project and `.storybook/main.ts` references `@storybook/addon-essentials` even though it is not installed

### `command-palette-os`

Task sheet is largely unchecked, but the repo currently contains:

- `src/lib/command-os/CommandPalette.svelte`
- `src/lib/command-os/registry.ts`
- `src/lib/command-os/schema.ts`
- `src/lib/command-os/parser.ts`
- `convex/commandOs.ts`

Conclusion:

- substantial implementation exists
- the spec is stale and should be updated to reflect current code before more palette work happens

### `add-stress-testing`

Its task sheet is effectively untracked as a checkbox artifact, while later changes and current repo state already cover portions of the intended surface.

Conclusion:

- this is no longer a reliable execution document in its current form

## 4. Strategic Backlog / Clearly Not Landed

These still read as future work more than current reality:

- `add-carbon-theme`
- `add-flag-visual-indicators`
- `draggable-ascii-donut`
- `experimental-3d-cube-frontend`
- `fold-header-oneliner`
- `katex-primitive`
- `works-page-editability`

These should remain backlog until they move onto the active execution path.

## 5. Tooling And Architecture Reality

### Present And Real

- Astro 6 host app
- Storybook 10 files and scripts are present
- responsive tablet and desktop suites
- command palette implementation surface
- `nanostores`
- `ts-pattern`

### Not Present In The Installed Stack

- `xstate`
- `remeda`
- Token Studio integration
- explicit Figma CSS-variable sync pipeline

### Present But Broken / Misaligned

- Storybook currently fails to build in the checked repo state
- `.storybook/main.ts` uses `@storybook/svelte-vite` even though Storybook detects a SvelteKit project and requires `@storybook/sveltekit`
- `.storybook/main.ts` references `@storybook/addon-essentials`, but that addon is not currently installed

Implication:

The repo should not claim a full "all the tools are aligned" state yet. Some of that vision is still roadmap, not current implementation.

## 6. Vision-Critical Gaps

If the goal is the strongest hire-me portfolio rather than maximal backlog breadth, the most important unresolved gaps are:

1. The public shell still needs a stronger designed system at the footer/status-rail and control-strip level.
2. Mobile responsiveness is directionally good but still inconsistent in token discipline and intrinsic layout execution.
3. `/admin` is improved but not yet fully standardized and fully verified.
4. Storybook/design-system/tooling needs reconciliation so it becomes an active contract rather than a partial artifact.

## 7. Recommended Execution Order

### Track 1: Public shell + responsive polish

Use `impeccable` as the bar.

Targets:

- `BaseLayout` shell
- footer/status rail
- lobby/control strip
- narrow-width and tablet behavior

### Track 2: Admin system closure

Targets:

- close the deferred visual/manual items in `redesign-admin-shell`
- close the remaining standardization items across `overhaul-admin-ux` and `finish-admin-cms`
- make `/admin` read as one system, not layered migrations

### Track 3: Storybook and design-token truth pass

Targets:

- reconcile `add-stress-testing` and `backfill-responsive-stories`
- move Storybook to a working framework contract for this repo instead of the current broken `svelte-vite` setup
- explicitly document absence or adoption plan for Token Studio / Figma variable sync

### Track 4: Optional architecture widening

Only after Tracks 1 through 3:

- decide whether XState belongs here
- decide whether Remeda belongs here

Right now those are architecture choices, not missing bug fixes.
