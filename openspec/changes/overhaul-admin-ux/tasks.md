# Tasks: Overhaul Admin UX

## Phase 1: Schema & Data Layer
- [ ] Add `adminHistory` table to `convex/schema.ts` with `by_table_field` index
- [ ] Create `convex/adminHistory.ts` with `insert` mutation and `getRecent` query
- [ ] Add `lastModified` optional field to hero, siteConfig flag entries
- [ ] Deploy schema changes (`npx convex dev`)

## Phase 2: New Primitives (parallelizable)
- [ ] Create `src/lib/admin/primitives/ChangeBadge.svelte` — relative timestamp / "default" badge
- [ ] Create `src/lib/admin/primitives/ResetButton.svelte` — dashed reset button, hidden when at default
- [ ] Create `src/lib/admin/primitives/HistoryPopover.svelte` — popover with last 5 changes + restore
- [ ] Export new primitives from `src/lib/admin/primitives/index.ts`
- [ ] Add `DEFAULTS` const map to `src/lib/admin/constants.ts`

## Phase 3: Component Standardization
- [ ] Audit all chip/button groups for non-standard border-radius or inline markup
- [ ] Replace any custom chip markup with `AdminChipGroup` primitive calls
- [ ] Verify all chips render as 2px-radius rectangles
- [ ] Test weight, wrap, view mode, theme, animation type chip groups

## Phase 4a: Sidebar — Home Card + Flags (parallelizable with 4b)
- [ ] Add Home card header to `src/lib/admin/PageSidebar.svelte` (above PAGES label)
- [ ] Exclude Home (pageId === 'home') from drag-reorder list
- [ ] Add flag categories constant (Visual/Layout/System) to `constants.ts`
- [ ] Refactor `FlagsCell.svelte` with step bar, category pagination, arrow nav, page dots
- [ ] Integrate paginated flags into `PageSidebar.svelte` footer

## Phase 4b: Preview + Top Bar (parallelizable with 4a)
- [ ] Redesign `PreviewPane.svelte` breakpoint bar: 3 presets + custom + H/V + WxH display
- [ ] Add dashed border styling to `.iframe-viewport` when fixed-width active
- [ ] Add viewport height tracking and display
- [ ] Refactor `AdminShell.svelte` topbar: add overflow chip, hide theme/font at <1024px
- [ ] Add overflow dropdown component for collapsed theme/font selectors

## Phase 5: Wire History + Reset
- [ ] Update `convex/hero.ts` mutations to write `adminHistory` entries on changes
- [ ] Update `convex/siteConfig.ts` to write history on flag/config changes
- [ ] Update `convex/sectionRegistry.ts` to write history on section config changes
- [ ] Add ChangeBadge + ResetButton to `PagePanel.svelte` control headers
- [ ] Add ChangeBadge + ResetButton to `SectionConfigPanel.svelte` hero controls
- [ ] Wire HistoryPopover to badge click events
- [ ] Wire ResetButton to reset mutations using `DEFAULTS` map

## Phase 6: Test Audit
- [ ] Update `tests/e2e/admin.spec.ts` selectors for new chip markup
- [ ] Add test: Home card is visible and not draggable
- [ ] Add test: Breakpoint custom input works
- [ ] Add test: Top bar collapses at narrow width
- [ ] Add test: Flag category navigation works
- [ ] Verify `npx tsc --noEmit` passes
- [ ] Visual verification in browser at 3 breakpoints (mobile, tablet, desktop)
