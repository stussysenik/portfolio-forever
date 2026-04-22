# Context Audit: Broader User Scope

This file captures the broader scope the user asked to be covered by `openspec`, beyond the immediate embed/runtime fix.

## 1. Mobile Responsiveness

### What is already present

- The design contract already targets 320px to 3840px and prefers fluid `clamp()`-based sizing.
- Public routes already use some intrinsic patterns such as `repeat(auto-fit, minmax(...))`, `clamp()`, and `100dvh` in newer admin work.
- Admin mobile-shell work is already partially specified and partly implemented in `redesign-admin-shell`.

### Current gaps found in code

- Multiple surfaces still hard-code `13px` typography, especially in admin/terminal/profile/OS areas.
- Actual container-query usage is sparse compared with the design intent.
- Some route layouts still lean on viewport-sized rails and fixed structural assumptions rather than fully intrinsic component behavior.
- The embed page metrics grid is fixed to 3 columns and should be revisited for narrower widths in a dedicated responsive pass.

### Follow-up direction

- Use intrinsic layout defaults first: `auto-fit/minmax`, `minmax(0, 1fr)`, `aspect-ratio`, `100dvh`, and clamp-based tokens.
- Reduce fixed pixel type pockets and align them to the design token system.
- Run a dedicated responsive audit pass under the `impeccable` quality bar.

## 1.5 Public Shell Footer / Status Rail

### Surface identified from current UI review

- The public footer/status rail in `src/layouts/BaseLayout.astro` carries edition text, route state, availability, theme/font controls, and adjacent utility actions.
- It works functionally, but it currently reads as a long generic utility strip rather than a designed portfolio surface.

### Current gaps found in code/UI

- Identity, state, and controls are compressed into one flat row with weak visual grouping.
- The information hierarchy is too even, so the eye has no clear primary anchor.
- On large widths the surface becomes a stretched low-contrast bar instead of an intentional terminal/status composition.
- This needs to be treated as a real public-shell redesign target, not just footer cleanup.

## 2. Admin System Shape

### What appears healthy

- `redesign-admin-shell`, `mobile-admin-kernel`, `overhaul-admin-ux`, and `polish-admin-final` together define a coherent admin direction.
- The current runtime blocker that broke Vite dependency scanning is now repaired.
- The responsive mobile dock/sheet direction is already represented in spec.

### What still needs explicit follow-up

- Several admin spec changes still include deferred visual/manual verification items.
- `/admin` is more stable now, but not yet fully standardized into one final verified system.

## 3. Storybook / Token / CSS Variable Workflow

### What exists now

- `.storybook/` is present and configured with `@storybook/svelte-vite`.
- Story files exist for `ThemeSwitcher`, `FontSwitcher`, `Elevator`, `AsciiDonut`, and `Toast`.

### What does not yet match spec or request

- Some specs still expect `@storybook/sveltekit`, not the current `@storybook/svelte-vite` setup.
- `backfill-responsive-stories` still carries unfinished verification tasks.
- No clear Token Studio or Figma CSS-variable integration was found in the current repo shape.

## 4. State Management / Tooling Shape

### Present in repo

- `nanostores`
- `ts-pattern`

### Not present in installed/runtime shape

- `xstate`
- `remeda`

Implication:

- A blanket statement like "everything should already be XState" is not true of the current codebase.
- That needs an explicit architecture decision and migration spec, not silent drift.

## 5. Finished `openspec` Shape Check

The current repo does contain strong completed work across:

- Astro migration foundation
- theme/font customization
- media infrastructure
- reference superset recovery
- large parts of admin shell redesign

But "finished in spec" does not always equal "fully closed in verification":

- `redesign-admin-shell` still contains deferred visual/manual items
- `backfill-responsive-stories` still has incomplete verification
- `overhaul-admin-ux` still shows an unfinished test-audit phase
- Storybook-related specs do not fully match the current framework setup
- `astro-full-migration-foundation` and `reference-superset-standardization` still contain open parity/verification items even though their main architectural direction landed

## 6. Next Execution Tracks

1. Responsive polish pass for public + admin surfaces, using the `impeccable` skill as the implementation bar.
   Include the public footer/status rail and lobby-control cluster as explicit targets.
2. Storybook/design-token recovery pass, including an explicit decision on `svelte-vite` vs `sveltekit`, plus Token Studio/Figma CSS-variable workflow.
3. Admin finalization pass that closes deferred visual/manual verification in the existing admin specs.
4. Separate architecture change if XState/Remeda adoption is still desired.
