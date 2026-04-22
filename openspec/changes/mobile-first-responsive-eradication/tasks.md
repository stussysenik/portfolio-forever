# Mobile-First Responsive Eradication — Tasks

## Phase 1: Foundation (app.css + tokens)

- [ ] Add breakpoint token custom properties to `:root` in `app.css`
- [ ] Fix `.entry` grid to mobile-first (single column base, multi-column at `min-width: 480px`)
- [ ] Remove `overflow-x: hidden` from `html` and `body` in `app.css`
- [ ] Add mobile-first utility classes if needed

## Phase 2: Shell + Core Layout

- [ ] Invert `BaseLayout.astro` shell to mobile-first (`min-width: 900px` for sidebar)
- [ ] Invert `MobileDock.svelte` to mobile-first (show by default, hide at `min-width: 900px`)
- [ ] Fix `OnePageView.svelte` mobile padding (replace tight clamp with progressive padding)
- [ ] Remove `max-width: 480px` 15%-padding override in OnePageView, replace with fluid approach

## Phase 3: Section Components

- [ ] Invert `HeroSection.svelte` breakpoints to mobile-first
- [ ] Invert `WorksSection.svelte` breakpoints to mobile-first
- [ ] Invert `TerminalSection.svelte` breakpoints to mobile-first
- [ ] Invert `BlogSection.svelte` breakpoints to mobile-first
- [ ] Invert `MinorSection.svelte` breakpoints to mobile-first
- [ ] Invert `AcademiaSection.svelte` breakpoints to mobile-first
- [ ] Invert `HiringProof.svelte` breakpoints to mobile-first
- [ ] Verify `LikesSection.svelte` (already mobile-first)
- [ ] Verify `TalksSection.svelte` (already mobile-first)
- [ ] Verify `GiftsSection.svelte` (already mobile-first)
- [ ] Verify `MediaSection.svelte` (already mobile-first)

## Phase 4: Navigation + UI Shell Components

- [ ] Invert `NavSidebar.svelte` to mobile-first
- [ ] Invert `NavHybrid.svelte` to mobile-first
- [ ] Invert `NavDrawer.svelte` to mobile-first
- [ ] Invert `Minimap.svelte` to mobile-first (hidden base, show at `min-width: 900px`)
- [ ] Invert `Elevator.svelte` to mobile-first

## Phase 5: Support Components

- [ ] Invert `HeroPositioningBlock.svelte` to mobile-first
- [ ] Invert `HomepageRuntimeBridge.svelte` to mobile-first
- [ ] Invert `ColorfulWorksTable.svelte` and `HiccupWorks.svelte` mobile overrides
- [ ] Invert `CommandPalette.svelte` mobile override
- [ ] Invert `AsciiDonut.svelte` mobile override
- [ ] Invert `ProcessFlow.astro` mobile override
- [ ] Invert `CvAdmin.svelte`, `ProfileAdmin.svelte`, `TerminalAdmin.svelte` mobile overrides

## Phase 6: Validation

- [ ] Test at 320px, 375px, 390px, 428px, 768px, 834px (iPad), 1024px, 1440px, 1920px
- [ ] Verify no horizontal overflow at any viewport
- [ ] Verify mobile dock shows Below 900px, sidebar shows above
- [ ] Verify all section grids stack on mobile, expand on tablet+
- [ ] Run `npm run build` with zero errors