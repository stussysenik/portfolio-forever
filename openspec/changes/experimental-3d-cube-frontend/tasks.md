# Tasks: Experimental 3D Cube Frontend

## Phase 1: Positional Donut Drag

### Task 1.1: Add positional drag state to AsciiDonut
- [ ] Add `donutPos = $state({ x: 0, y: 0 })` for translate position
- [ ] Add `isPositionalDrag = $state(false)` flag
- [ ] Add `isShiftHeld = $state(false)` tracking via `onkeydown`/`onkeyup` on window
- [ ] Load saved position from `localStorage('donut-position')` on mount

### Task 1.2: Dual-mode pointer handling
- [ ] In `handlePointerDown`: check `isShiftHeld` → set `isPositionalDrag = true` if shift
- [ ] In `handlePointerMove`: if `isPositionalDrag`, update `donutPos.x/y` instead of rotation angles
- [ ] Clamp `donutPos` within parent bounds (query `.hero-visual` bounding rect)
- [ ] Apply `transform: translate(${donutPos.x}px, ${donutPos.y}px)` to `.donut-display`
- [ ] Cursor: `move` when Shift held, `grab` otherwise

### Task 1.3: Persistence + broadcast
- [ ] On `handlePointerEnd` with positional drag: save `donutPos` to `localStorage('donut-position')`
- [ ] Broadcast `postMessage({ type: 'admin:donutPosition', x, y })` to preview iframes
- [ ] In `+layout.svelte` preview mode: listen for `admin:donutPosition` and apply to donut

## Phase 2: CubeShell Component

### Task 2.1: Create CubeShell.svelte
- [ ] Create `src/lib/components/CubeShell.svelte`
- [ ] Accept `sections` prop (ordered section array with types and data)
- [ ] Accept `componentMap` prop (same map from OnePageView)
- [ ] CSS 3D viewport with `perspective: 1200px`
- [ ] CSS 3D cube container with `transform-style: preserve-3d`
- [ ] Responsive `--cube-size` via CSS custom property + media queries

### Task 2.2: Create CubeFace.svelte
- [ ] Create `src/lib/components/CubeFace.svelte`
- [ ] Accept `face` prop (front/right/back/left/top/bottom)
- [ ] Accept `sectionType` and `sectionData` props
- [ ] Render section component dynamically using `<svelte:component>`
- [ ] CSS face positioning with correct `rotateX/Y` + `translateZ`
- [ ] `overflow-y: auto` on each face for scrollable content
- [ ] `backface-visibility: hidden`

### Task 2.3: Cube rotation mechanics
- [ ] Track `rotateX` and `rotateY` state for the cube container
- [ ] Pointer drag on viewport background → update rotation
- [ ] Inertia on release (same velocity buffer pattern as donut)
- [ ] Snap-to-face: on rest, round rotation to nearest 90° increments
- [ ] Keyboard: arrow keys rotate to adjacent faces (±90°)
- [ ] `prefers-reduced-motion`: instant snap, no inertia

### Task 2.4: Create CubeNav.svelte
- [ ] Create `src/lib/components/CubeNav.svelte`
- [ ] Show 6 navigation dots (one per face)
- [ ] Active face highlighted
- [ ] Click dot → rotate cube to that face
- [ ] Face label appears on hover
- [ ] Positioned as overlay at bottom of viewport

## Phase 3: Section-to-Face Mapping

### Task 3.1: Default face mapping
- [ ] Create `src/lib/utils/cube-faces.ts` with `getDefaultCubeFaces(sections)` function
- [ ] Takes ordered section array, returns `{ front, right, back, left, top, bottom }` mapping
- [ ] Uses first 6 visible sections, fills remaining faces with empty placeholder

### Task 3.2: Custom face mapping from page data
- [ ] Add `cubeFaces` to page `themeOverrides` in Convex schema (`convex/schema.ts`)
- [ ] Type: `{ front?: string, right?: string, back?: string, left?: string, top?: string, bottom?: string }`
- [ ] CubeShell reads `page.themeOverrides?.cubeFaces` and merges with defaults
- [ ] Pass resolved mapping to CubeFace components

## Phase 4: Feature Flag + CMD+K Integration

### Task 4.1: Register cube-mode flag
- [ ] Add entry to `flagIndicatorRegistry.ts`: `{ key: 'cube-mode', label: '3D Cube Mode', category: 'visual', mountHint: '+page.svelte conditional', icon: 'lucide:box' }`
- [ ] Ensure it appears in admin sidebar FLAGS section

### Task 4.2: CMD+K toggleCubeMode action
- [ ] Add `toggleCubeMode` action to `src/lib/command-os/registry.ts`
- [ ] Uses `stagedFlags.stage('cube-mode', enabled, 'visual', '3D Cube Mode')` — goes through staging
- [ ] Includes admin history recording
- [ ] Description: "Switch between scroll view and 3D cube navigation"

### Task 4.3: Route-level conditional rendering
- [ ] In `src/routes/+page.svelte`: import `featureFlags` store and check `cube-mode`
- [ ] If `cube-mode` is enabled: render `<CubeShell />` instead of `<OnePageView />`
- [ ] Pass same data subscriptions (pages, entries) to CubeShell
- [ ] Smooth transition: fade out OnePageView, fade in CubeShell (CSS transition)

### Task 4.4: Preview iframe support
- [ ] `stagedFlags` already broadcasts `admin:flagOverrides` to preview iframes
- [ ] In preview `+layout.svelte`: handle `cube-mode` override from staged flags
- [ ] Preview iframe renders CubeShell when flag is staged ON

## Phase 5: Admin Controls

### Task 5.1: CubeModeConfig compartment
- [ ] Create `src/lib/admin/CubeModeConfig.svelte`
- [ ] Shows when `cube-mode` flag is enabled
- [ ] Face assignment: 6 slots (front/right/back/left/top/bottom) with dropdown to pick section
- [ ] Cube size slider (300px–800px)
- [ ] Rotation speed slider
- [ ] All changes use `stagedFlags.stage()` for consistency

### Task 5.2: Wire into SectionBuilder
- [ ] Add CubeModeConfig to `SectionBuilder.svelte` when cube-mode flag is on
- [ ] Shows above section list as a global config panel
- [ ] Reads/writes `page.themeOverrides.cubeFaces` via Convex mutation

## Task Summary

**Total Tasks**: 17 + 1 typography audit
**Completed**: 15/18

### Priority Order
1. ~~Phase 1 (positional donut)~~ — DONE
2. ~~Phase 2 (CubeShell)~~ — DONE
3. ~~Phase 3 (face mapping)~~ — DONE
4. ~~Phase 4 (flag + CMD+K)~~ — DONE
5. Phase 5 (admin controls) — pending
6. ~~Public typography audit (52 fixes, 12px floor)~~ — DONE

### Typography Audit (Completed)
- Raised `--font-size-3xs` from 0.5rem→0.75rem (8px→12px floor)
- Raised `--font-size-2xs` from 0.563rem→0.75rem (9px→12px floor)
- Raised `--font-size-xs` minimum from 0.688rem→0.75rem (11px→12px floor)
- Fixed 31 hardcoded `font-size` values below 12px across:
  - WorksCaseStudy, WorksMinimalList (badges, meta, links)
  - GallerySection (tile year)
  - TerminalSection (browser url, tmux bar)
  - OsSection (close button, taskbar, clock)
  - NavHybrid, NavDrawer, NavSidebar (headers, arrows, external links)
  - Elevator (sound button, labels)
  - FontSwitcher (cell name, check, category)
  - CubeShell (dot labels)
  - +layout.svelte (WIP banner, nav links, separators)
