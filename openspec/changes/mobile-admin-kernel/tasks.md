# Tasks: Mobile Admin Kernel — Portfolio OS

## Phase 1: Foundation — Page Bar & Compartment Shell

### Task 1.1: Create PageBar.svelte
**Files:** `src/lib/admin/PageBar.svelte` (new)
- [x] Refactor mobile-pills from AdminShell into standalone PageBar component
- [x] Add current page name as prominent heading (`.admin-label--sm`, weight 700)
- [x] Horizontal scroll pills for page switching
- [x] Page-level indicators: accent color dot, section count badge, visibility dot
- [x] Props: `pages`, `activePage`, `onSelect`
- [x] Consistent with existing pill CSS (9px mono, uppercase, 44px touch target)
**Validation:** Page switching works, current page always visible, indicators accurate

### Task 1.2: Create SectionCompartment.svelte
**Files:** `src/lib/admin/SectionCompartment.svelte` (new)
- [x] Collapsed state: section type icon + label + status badges + chevron
- [x] Expanded state: reveals bookmark tab area (slot for content)
- [x] Click header to toggle expand/collapse
- [x] `1px solid var(--border-color-subtle)` divider between compartments
- [x] `role="button"`, `aria-expanded`, Enter/Space keyboard support
- [x] Smooth expand animation (120ms ease, max-height transition)
- [x] `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` on expand
- [x] Props: `section`, `expanded`, `onToggle`, `sectionIndex`
**Validation:** Accordion behavior works, only one expanded at a time, keyboard accessible

### Task 1.3: Create SectionCompartmentList.svelte
**Files:** `src/lib/admin/SectionCompartmentList.svelte` (new)
- [x] Renders array of SectionCompartment from page's sections[]
- [x] Manages accordion state (expandedIndex)
- [x] Passes section data + index to each compartment
- [x] Props: `sections`, `pageId`
**Validation:** All sections for current page render as compartments

### Task 1.4: Create BookmarkTabs.svelte
**Files:** `src/lib/admin/BookmarkTabs.svelte` (new)
- [x] Three tabs: CONTENT | STYLE | LAYOUT
- [x] Uses button elements styled as tabs (blue active, border styling)
- [x] `role="tablist"` with `role="tab"` items
- [x] Arrow key navigation between tabs
- [x] Props: `active`, dispatch `change` event
- [x] Flush with compartment edges, 8px vertical padding
**Validation:** Tab switching works, ARIA roles correct, keyboard navigable

### Task 1.5: Create GlobalCompartment.svelte
**Files:** `src/lib/admin/GlobalCompartment.svelte` (new)
- [x] Renders as the first compartment in every page's compartment list
- [x] FEATURE FLAGS group: all flags with AdminToggle, self-documenting labels
- [x] Each flag toggle calls existing `featureFlags` Convex mutation
- [x] Flag count indicator in collapsed header (e.g., "7/10" active)
- [x] SITE MODE group: AdminChipGroup (multi-page / one-page / reader)
- [x] NAVIGATION group: nav mode chips, parallax slider
- [x] All groups separated by divider + label pattern
- [x] Calls existing mutations: `siteConfig.update`, `featureFlags.toggle`
**Validation:** Toggling a flag immediately affects the live site via Convex

### Task 1.6: Wire into AdminShell.svelte
**Files:** `src/lib/admin/AdminShell.svelte` (modified)
- [x] Replace mobile-pills with PageBar on mobile (<768px)
- [x] Replace SectionBuilder's flat list with SectionCompartmentList in builder area
- [x] Preserve sidebar behavior on tablet/desktop
- [x] Ensure grid layout adapts: topbar | pagebar | compartments on mobile
- [x] Add new grid row for PageBar: `grid-template-rows: var(--admin-topbar-h) auto 1fr`
**Validation:** Mobile layout shows PageBar + compartments, tablet/desktop unchanged

---

## Phase 2: Bookmark Content — Style & Layout

### Task 2.1: Create StyleBookmark.svelte
**Files:** `src/lib/admin/bookmarks/StyleBookmark.svelte` (new)
- [x] TYPOGRAPHY group: embed TypographyControls for section typography
- [x] COLOR group: accent color picker
- [x] ANIMATION group (hero only): ASCII donut, wave, pixel art, velocity toggles
- [x] PARTICLES group (hero only): AdminChipGroup for particle presets
- [x] Each group separated by: `1px solid var(--border-color-subtle)` + label heading
- [x] Padding: `var(--admin-space-3)` above/below each group
- [x] Hero-specific controls detected via `section.sectionType === 'hero'`
- [x] Calls existing mutations: `hero.upsertHeroConfig`, `pages.updateSectionConfig`
**Validation:** All typography sliders work, hero toggles work, groups visually separated

### Task 2.2: Create LayoutBookmark.svelte
**Files:** `src/lib/admin/bookmarks/LayoutBookmark.svelte` (new)
- [x] VISIBILITY group: AdminToggle (green) for section visible/hidden
- [x] SPACING group: preset chips (none/sm/md/lg/xl) + custom values
- [x] BOX MODEL group: embed BoxModelDiagram for margin/padding
- [x] POSITION group: move up/down buttons, remove section with confirmation
- [x] Each group separated by divider + label pattern
- [x] Calls existing mutations: `pages.updateSectionSpacing`, `pages.upsert`
**Validation:** Visibility toggle works, spacing changes reflected, box model editable

### Task 2.3: Wire bookmarks into SectionCompartment
**Files:** `src/lib/admin/SectionCompartment.svelte` (modified)
- [x] Render BookmarkTabs when expanded
- [x] Conditionally render StyleBookmark or LayoutBookmark based on active tab
- [x] Pass section data, pageId, sectionIndex as props
- [x] Lazy render: only mount active bookmark's content
**Validation:** Switching tabs shows correct bookmark, no unnecessary renders

---

## Phase 3: Content Bookmark — The Core

### Task 3.1: Create ContentBookmark.svelte
**Files:** `src/lib/admin/bookmarks/ContentBookmark.svelte` (new)
- [x] Read section-editors.ts to determine editor config for sectionType
- [x] Dedicated editor components for all section types (hero, works, blog, cv, etc.)
- [x] Fallback: generic "No content editor" message for unknown types
- [x] Container: `max-width: 100%; overflow-x: auto` for mobile
**Validation:** Each section type renders its appropriate content editor

### Task 3.2: Create HeroContentEditor.svelte
**Files:** `src/lib/admin/bookmarks/HeroContentEditor.svelte` (new)
- [x] PROFILE group: editable fields for cvProfile (name, taglines, shortBio, location)
- [x] CASE STUDIES group: embed existing HeroCaseStudyAdmin
- [x] Calls existing mutations: `cv.updateProfile`, heroCaseStudies CRUD
- [x] Each group separated by divider + label
**Validation:** Profile fields save to Convex, case studies CRUD works

### Task 3.3: Compact existing admin components for embedding
**Files:** Multiple existing admin components (modified)
- [x] All 10 admin components (WorksAdmin, BlogAdmin, CvAdmin, etc.) have `compact` prop
- [x] All components pass `compact` prop when rendered from ContentBookmark
- [x] Touch targets: 44px min-height maintained across all sizes
**Validation:** Components work in both standalone and compact mode

### Task 3.4: Wire ContentBookmark into SectionCompartment
**Files:** `src/lib/admin/SectionCompartment.svelte` (modified)
- [x] ContentBookmark rendered when CONTENT tab is active (default)
- [x] Pass section data, pageId, sectionIndex, entriesByTable, client, api
**Validation:** Expanding compartment shows Content bookmark by default

---

## Phase 4: Preview Drawer

### Task 4.1: Create PreviewDrawer.svelte
**Files:** `src/lib/admin/PreviewDrawer.svelte` (new)
- [x] BottomSheet pattern: 16px top radius, backdrop, slide animation
- [x] Persistent grab handle at bottom
- [x] Pull-up gesture: touch handling with dragging logic
- [x] Contains iframe to live site URL
- [x] Max-height: 70vh, Escape to close
- [x] Focus trap: dialog role with modal semantics
- [x] Iframe lazy-loads: only mounts when open
**Validation:** Drawer opens/closes smoothly, iframe shows live site

### Task 4.2: Wire PreviewDrawer into AdminShell
**Files:** `src/lib/admin/AdminShell.svelte` (modified)
- [x] PreviewDrawer imported and mounted
- [x] Hidden on desktop: `@media (min-width: 1024px) { display: none }`
- [x] Persistent handle visible at bottom on mobile/tablet
**Validation:** Preview drawer available on mobile/tablet, hidden on desktop

---

## Phase 5: Polish & Integration

### Task 5.1: Strict CSS divider audit
- [x] All components use `1px solid var(--border-color-subtle)` dividers
- [x] All group labels use consistent styling
- [x] Padding: `var(--admin-space-3, 12px)` on groups

### Task 5.2: Touch target audit
- [x] All interactive elements >= 44px min-height
- [x] PageBar pills, compartment headers, bookmark tabs, drawer buttons all compliant

### Task 5.3: Responsive regression testing
- [x] 414px (mobile), 768px (tablet), 1024px (desktop), 1440px (large) — all working
- [x] Grid layouts adapt correctly at each breakpoint
- [x] No horizontal overflow on mobile

### Task 5.4: Keyboard & accessibility audit
- [x] Full keyboard navigation: Enter/Space toggles, Arrow keys navigate tabs
- [x] ARIA attributes: role="button", aria-expanded, role="tablist", role="tab", aria-selected
- [x] Screen reader support: state announcements, descriptive labels
- [x] Focus-visible outlines on all interactive elements
