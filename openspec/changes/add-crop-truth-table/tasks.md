# Tasks: Add Crop Truth Table Configurator

## Phase 1: Data Layer (schema + mutations)

- [x] **T1: Extend worksEntries schema** — Add `focalX`, `focalY`, `zoom` optional fields to `convex/schema.ts`. Push schema.
  - Verify: `npx convex dev` succeeds, fields visible in Convex dashboard
  - Files: `convex/schema.ts`

- [x] **T2: Update works mutations** — Add focal fields to `createEntry` and `updateEntry` validators in `convex/works.ts`. Add range validation (focalX/Y: 0-100, zoom: 1.0-3.0).
  - Verify: Mutation accepts valid focal data, rejects out-of-range values
  - Files: `convex/works.ts`
  - Depends on: T1

## Phase 2: Admin Components (bottom-up)

- [x] **T3: Build CropPreviewCell** — New component: renders a single image at a given aspect ratio with computed `object-position` from focal point. Pure CSS `object-fit: cover`.
  - Verify: Component renders image correctly at 16:10, 1:1, 4:3, 21:9 ratios with various focal points
  - Files: `src/lib/admin/controls/CropPreviewCell.svelte`

- [x] **T4: Build FocalPointEditor** — New component: full source image with crosshair overlay. Click to set, drag to move. Coordinate readout.
  - Verify: Click sets focal point, drag updates smoothly, coordinates display correctly
  - Files: `src/lib/admin/controls/FocalPointEditor.svelte`
  - Parallelizable with: T3

- [x] **T5: Build CropTruthTable** — Orchestrator component combining FocalPointEditor + 4 CropPreviewCells + zoom slider. Single `onChange` callback.
  - Verify: Editing focal point updates all 4 cells live, zoom slider works, coordinate readout accurate
  - Files: `src/lib/admin/controls/CropTruthTable.svelte`
  - Depends on: T3, T4

## Phase 3: Integration

- [x] **T6: Wire into WorksAdmin** — Add CropTruthTable to expanded preview panel in WorksAdmin. Save focal fields on change. Parse legacy `cam` into focal coords for existing entries.
  - Verify: Expanding a works entry shows truth table, editing saves to Convex, legacy entries display correctly
  - Files: `src/lib/admin/WorksAdmin.svelte`
  - Depends on: T2, T5

- [x] **T7: Update WorksSection render** — Add focal point to CSS computation in the public display. Fallback chain: focal -> cam -> "center top". Apply zoom transform when zoom > 1.
  - Verify: Public /works page renders correctly with focal point data, legacy entries unchanged, zoom applies correctly
  - Files: `src/lib/sections/WorksSection.svelte`
  - Depends on: T2

## Phase 4: Polish

- [x] **T8: Visual polish pass** — Ensure iA Writer aesthetic: monospace coordinates, thin crosshair lines, minimal chrome, consistent with admin design tokens. Test at various image sizes.
  - Verify: Visual inspection matches design spec, no layout breaks, consistent with admin design language
  - Depends on: T5, T6
