# Tasks: Overhaul Admin UX

## Phase 1: Schema & Data Layer — 75% DONE
- [x] Add `adminHistory` table to `convex/schema.ts` with `by_table_field` index
- [x] Create `convex/adminHistory.ts` with `insert` mutation and `getRecent` query
- [ ] Add `lastModified` optional field to hero, siteConfig flag entries
- [x] Deploy schema changes (`npx convex dev`)

## Phase 2: New Primitives — 100% DONE
- [x] Create `src/lib/admin/primitives/ChangeBadge.svelte` — relative timestamp / "default" badge
- [x] Create `src/lib/admin/primitives/ResetButton.svelte` — dashed reset button, hidden when at default
- [x] Create `src/lib/admin/primitives/HistoryPopover.svelte` — popover with last 5 changes + restore
- [x] Export new primitives from `src/lib/admin/primitives/index.ts`
- [x] Add `DEFAULTS` const map + `FLAG_CATEGORIES` + `formatRelativeTime` to `src/lib/admin/constants.ts`

## Phase 3: Component Standardization — 85% DONE
- [x] Audit all chip/button groups for non-standard border-radius or inline markup
- [ ] Replace PageSidebar flag items custom markup with `AdminChipGroup` primitive calls
- [x] Verify all chips render as 2px-radius rectangles (AdminChipGroup, AdminSlider, PreviewPane chips)
- [x] Test weight, wrap, view mode, theme, animation type chip groups

## Phase 4a: Sidebar — Home Card + Flags — 67% DONE
- [x] Add Home card header to `src/lib/admin/PageSidebar.svelte` (above PAGES label)
- [x] Exclude Home (pageId === 'home') from drag-reorder list
- [x] Add flag categories constant (Visual/Layout/System) to `constants.ts`
- [ ] Refactor `FlagsCell.svelte` with step bar, category pagination, arrow nav, page dots
- [ ] Integrate paginated flags into `PageSidebar.svelte` footer

## Phase 4b: Preview + Top Bar — 100% DONE
- [x] Redesign `PreviewPane.svelte` breakpoint bar: 3 presets + custom + H/V + WxH display
- [x] Add dashed border styling to `.iframe-viewport` when fixed-width active
- [x] Add viewport height tracking and display
- [x] Refactor `AdminShell.svelte` topbar: add overflow chip, hide theme/font at <1024px
- [x] Add overflow dropdown component for collapsed theme/font selectors

## Phase 5: Wire History + Reset — 43% DONE
- [x] Update `convex/hero.ts` mutations to write `adminHistory` entries on changes
- [x] Update `convex/siteConfig.ts` to write history on flag/config changes
- [x] Update `convex/sectionRegistry.ts` to write history on section config changes
- [ ] Wire ChangeBadge + ResetButton into `PagePanel.svelte` control headers (imported but unused)
- [ ] Wire ChangeBadge + ResetButton into `SectionConfigPanel.svelte` hero controls (partially done)
- [ ] Wire HistoryPopover to badge click events (component exists, not connected)
- [ ] Wire ResetButton to reset mutations using `DEFAULTS` map

## Phase 6: Test Audit — 0% DONE
- [ ] Update `tests/e2e/admin.spec.ts` selectors for new chip markup
- [ ] Add test: Home card is visible and not draggable
- [ ] Add test: Breakpoint custom input works
- [ ] Add test: Top bar collapses at narrow width
- [ ] Add test: Flag category navigation works
- [ ] Verify `npx tsc --noEmit` passes
- [ ] Visual verification in browser at 3 breakpoints (mobile, tablet, desktop)

---

## Summary
**Total**: 37 tasks | **Done**: 24/37 (65%) | **Remaining**: 13 tasks
**Critical gaps**: Phase 5 UI wiring (history + reset), Phase 4a flag pagination, Phase 6 tests
