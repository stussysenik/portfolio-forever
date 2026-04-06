# Tasks: Mobile Admin Kernel — Portfolio OS

## Phase 1: Foundation — Page Bar & Compartment Shell

### Task 1.1: Create PageBar.svelte
**Files:** `src/lib/admin/PageBar.svelte` (new)
- [ ] Refactor mobile-pills from AdminShell into standalone PageBar component
- [ ] Add current page name as prominent heading (`.admin-label--sm`, weight 700)
- [ ] Horizontal scroll pills for page switching
- [ ] Page-level indicators: accent color dot, section count badge, visibility dot
- [ ] Props: `pages`, `activePage`, `onSelect`
- [ ] Consistent with existing pill CSS (9px mono, uppercase, 44px touch target)
**Validation:** Page switching works, current page always visible, indicators accurate

### Task 1.2: Create SectionCompartment.svelte
**Files:** `src/lib/admin/SectionCompartment.svelte` (new)
- [ ] Collapsed state: section type icon + label + status badges + chevron
- [ ] Expanded state: reveals bookmark tab area (slot for content)
- [ ] Click header to toggle expand/collapse
- [ ] `1px solid var(--border-color-subtle)` divider between compartments
- [ ] `role="button"`, `aria-expanded`, Enter/Space keyboard support
- [ ] Smooth expand animation (120ms ease, max-height transition)
- [ ] `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` on expand
- [ ] Props: `section`, `expanded`, `onToggle`, `sectionIndex`
**Validation:** Accordion behavior works, only one expanded at a time, keyboard accessible

### Task 1.3: Create SectionCompartmentList.svelte
**Files:** `src/lib/admin/SectionCompartmentList.svelte` (new)
- [ ] Renders array of SectionCompartment from page's sections[]
- [ ] Manages accordion state (expandedIndex)
- [ ] Passes section data + index to each compartment
- [ ] Props: `sections`, `pageId`
**Validation:** All sections for current page render as compartments

### Task 1.4: Create BookmarkTabs.svelte
**Files:** `src/lib/admin/BookmarkTabs.svelte` (new)
- [ ] Three tabs: CONTENT | STYLE | LAYOUT
- [ ] Uses AdminChipGroup primitive (exclusive mode, blue color, sm size)
- [ ] `role="tablist"` with `role="tab"` items
- [ ] Arrow key navigation between tabs
- [ ] Props: `active`, `onChange`
- [ ] Flush with compartment edges, 8px vertical padding
**Validation:** Tab switching works, ARIA roles correct, keyboard navigable

### Task 1.5: Create GlobalCompartment.svelte
**Files:** `src/lib/admin/GlobalCompartment.svelte` (new)
- [ ] Renders as the first compartment in every page's compartment list
- [ ] FEATURE FLAGS group: all 10 flags with AdminToggle, self-documenting labels
- [ ] Each flag toggle calls existing `featureFlags` Convex mutation
- [ ] Flag count indicator in collapsed header (e.g., "7/10" active)
- [ ] SITE MODE group: AdminChipGroup (multi-page / one-page / reader / disabled)
- [ ] NAVIGATION group: nav mode chips, parallax slider, hero visual chips
- [ ] All groups separated by divider + label pattern
- [ ] Calls existing mutations: `siteConfig.update`, `featureFlags.toggle`
**Validation:** Toggling a flag (e.g., WIP BANNER) immediately affects the live site via Convex

### Task 1.6: Wire into AdminShell.svelte
**Files:** `src/lib/admin/AdminShell.svelte` (modified)
- [ ] Replace mobile-pills with PageBar on mobile (<768px)
- [ ] Replace SectionBuilder's flat list with SectionCompartmentList in builder area
- [ ] Preserve sidebar behavior on tablet/desktop
- [ ] Ensure grid layout adapts: topbar | pagebar | compartments on mobile
- [ ] Add new grid row for PageBar: `grid-template-rows: var(--admin-topbar-h) auto 1fr`
**Validation:** Mobile layout shows PageBar + compartments, tablet/desktop unchanged

---

## Phase 2: Bookmark Content — Style & Layout

### Task 2.1: Create StyleBookmark.svelte
**Files:** `src/lib/admin/bookmarks/StyleBookmark.svelte` (new)
- [ ] TYPOGRAPHY group: embed TypographyControls (existing) for section typography
- [ ] COLOR group: accent color picker using ColorStrip or inline input
- [ ] ANIMATION group (hero only): ASCII donut, wave, pixel art, velocity toggles
- [ ] PARTICLES group (hero only): AdminChipGroup for particle presets
- [ ] Each group separated by: `1px solid var(--border-color-subtle)` + `.admin-label--2xs` heading
- [ ] Padding: `var(--admin-space-3)` above/below each group
- [ ] Hero-specific controls detected via `section.sectionType === 'hero'`
- [ ] Calls existing mutations: `hero.upsertHeroConfig`, `pages.updateSectionConfig`
**Validation:** All typography sliders work, hero toggles work, groups visually separated

### Task 2.2: Create LayoutBookmark.svelte
**Files:** `src/lib/admin/bookmarks/LayoutBookmark.svelte` (new)
- [ ] VISIBILITY group: AdminToggle (green) for section visible/hidden
- [ ] SPACING group: preset chips (none/sm/md/lg/xl) + AdminSlider for custom
- [ ] BOX MODEL group: embed BoxModelDiagram (existing) for margin/padding
- [ ] POSITION group: move up/down buttons, remove section with confirmation
- [ ] Each group separated by divider + label pattern
- [ ] Calls existing mutations: `pages.updateSectionSpacing`, `pages.updateSectionThemeOverrides`, `pages.upsert` (for reorder)
**Validation:** Visibility toggle works, spacing changes reflected, box model editable

### Task 2.3: Wire bookmarks into SectionCompartment
**Files:** `src/lib/admin/SectionCompartment.svelte` (modified)
- [ ] Render BookmarkTabs when expanded
- [ ] Conditionally render StyleBookmark or LayoutBookmark based on active tab
- [ ] Pass section data, pageId, sectionIndex as props
- [ ] Lazy render: only mount active bookmark's content
**Validation:** Switching tabs shows correct bookmark, no unnecessary renders

---

## Phase 3: Content Bookmark — The Core

### Task 3.1: Create ContentBookmark.svelte
**Files:** `src/lib/admin/bookmarks/ContentBookmark.svelte` (new)
- [ ] Read section-editors.ts to determine editor config for sectionType
- [ ] For section types WITH dedicated admin components, render that component:
  - hero → HeroCaseStudyAdmin + cvProfile editor (new sub-component)
  - works-grid → WorksAdmin
  - blog-feed → BlogAdmin
  - cv → CvAdmin
  - timeline → TalksAdmin
  - gallery → GalleryAdmin
  - academia → AcademiaAdmin
  - likes → LikesAdmin
  - minor → MinorAdmin
  - labs → LabsAdmin
  - gifts → GiftsAdmin
- [ ] For section types WITHOUT dedicated admin components, render generic EntryTable
- [ ] Groups: section-specific (divider + label pattern)
- [ ] Add `max-width: 100%; overflow-x: auto` container for mobile overflow
**Validation:** Each section type renders its appropriate content editor

### Task 3.2: Create HeroContentEditor.svelte (hero-specific)
**Files:** `src/lib/admin/bookmarks/HeroContentEditor.svelte` (new)
- [ ] PROFILE group: editable fields for cvProfile (name, taglines, shortBio, location)
  - Name: text input
  - Taglines: editable list with add/remove
  - Short Bio: textarea
  - Location: text input
- [ ] CASE STUDIES group: embed existing HeroCaseStudyAdmin
- [ ] Calls existing mutations: `cv.updateProfile`, heroCaseStudies CRUD
- [ ] Each group separated by divider + label
**Validation:** Profile fields save to Convex, case studies CRUD works

### Task 3.3: Compact existing admin components for embedding
**Files:** Multiple existing admin components (modified)
- [ ] WorksAdmin: add `compact` prop that hides standalone header
- [ ] BlogAdmin: add `compact` prop
- [ ] CvAdmin: add `compact` prop
- [ ] TalksAdmin: add `compact` prop
- [ ] GalleryAdmin: add `compact` prop
- [ ] AcademiaAdmin: add `compact` prop
- [ ] LikesAdmin: add `compact` prop
- [ ] MinorAdmin: add `compact` prop
- [ ] LabsAdmin: add `compact` prop
- [ ] GiftsAdmin: add `compact` prop
- [ ] All: ensure 44px touch targets, no overflow on 414px width
**Validation:** Components render correctly both standalone and in compact mode

### Task 3.4: Wire ContentBookmark into SectionCompartment
**Files:** `src/lib/admin/SectionCompartment.svelte` (modified)
- [ ] Render ContentBookmark when CONTENT tab is active
- [ ] Pass section data, pageId, sectionIndex
- [ ] Content bookmark is the default active tab on expand
**Validation:** Expanding a compartment shows Content bookmark by default

---

## Phase 4: Preview Drawer

### Task 4.1: Create PreviewDrawer.svelte
**Files:** `src/lib/admin/PreviewDrawer.svelte` (new)
- [ ] Extends BottomSheet pattern (16px top radius, backdrop, slide animation)
- [ ] Persistent grab handle at bottom of screen (36px wide, 4px tall, centered)
- [ ] Pull-up gesture or tap to open
- [ ] Contains iframe to live site URL
- [ ] Max-height: 70vh (leaves page bar visible)
- [ ] Iframe: 100% width, fill remaining height after handle + header
- [ ] Header: "PREVIEW" label + "DONE" button (existing sheet pattern)
- [ ] Escape to close, focus trap when open
- [ ] Iframe lazy-loads (only mounts when drawer opens)
**Validation:** Drawer opens/closes smoothly, iframe shows live site, Convex changes reflected

### Task 4.2: Wire PreviewDrawer into AdminShell
**Files:** `src/lib/admin/AdminShell.svelte` (modified)
- [ ] Mount PreviewDrawer on mobile/tablet (<1024px)
- [ ] Persistent handle visible at bottom of viewport
- [ ] Hide on desktop where live preview pane exists
- [ ] State: `previewOpen` boolean in AdminShell
**Validation:** Preview drawer available on mobile/tablet, hidden on desktop

---

## Phase 5: Polish & Integration

### Task 5.1: Strict CSS divider audit
**Files:** All new components
- [ ] Verify every control group has: `1px solid var(--border-color-subtle)` top border
- [ ] Verify every group has: `.admin-label--2xs` heading label
- [ ] Verify padding: `var(--admin-space-3, 12px)` above/below groups
- [ ] Verify compartment dividers: `1px solid var(--border-color-subtle)` between items
- [ ] No floating/unlabeled controls anywhere
**Validation:** Visual audit at 414px — every control belongs to a labeled, bordered group

### Task 5.2: Touch target audit
**Files:** All new components
- [ ] Every interactive element >= 44px touch target
- [ ] Verify on real device or Chrome DevTools mobile emulation
- [ ] Fix any sub-44px targets with padding or min-height
**Validation:** No tap frustration on iPhone 11 Pro Max (414px)

### Task 5.3: Responsive regression testing
**Files:** AdminShell.svelte, all new components
- [ ] Test at 414px (iPhone 11 Pro Max)
- [ ] Test at 768px (iPad)
- [ ] Test at 1024px (desktop threshold)
- [ ] Test at 1440px (desktop)
- [ ] Verify desktop preview pane still works
- [ ] Verify sidebar still works on tablet
- [ ] Verify compartment scroll behavior on all sizes
**Validation:** No layout breakage at any breakpoint

### Task 5.4: Keyboard & accessibility audit
**Files:** All new components
- [ ] Compartment headers: Enter/Space to toggle, Tab to navigate
- [ ] Bookmark tabs: Arrow keys to switch, proper ARIA
- [ ] Preview drawer: Focus trap, Escape to close
- [ ] Screen reader: compartment state announced correctly
**Validation:** Full keyboard navigation works, VoiceOver reads state

---

## Task Summary

| Phase | Tasks | Complexity | Critical Path |
|-------|-------|-----------|---------------|
| 1: Foundation | 6 tasks | Medium | Yes — everything depends on shell |
| 2: Style & Layout | 3 tasks | Low-Medium | Parallel after Phase 1 |
| 3: Content | 4 tasks | Medium-High | Parallel with Phase 2 after Phase 1 |
| 4: Preview | 2 tasks | Low | Independent after Phase 1 |
| 5: Polish | 4 tasks | Low | After Phases 2-4 |

**Total: 19 tasks across 5 phases**

**Parallelizable work:**
- Phase 2 + Phase 3 + Phase 4 can run in parallel after Phase 1 completes
- Within Phase 3, Task 3.2 (HeroContentEditor) and Task 3.3 (compact props) can run in parallel
- Phase 5 runs after all others complete

**Critical path:** Phase 1 → (Phase 2 | Phase 3 | Phase 4) → Phase 5

**Estimated new files:** 8 components
**Estimated modified files:** ~12 (AdminShell + 10 existing admin components + SectionBuilder)
**No Convex changes needed.**
