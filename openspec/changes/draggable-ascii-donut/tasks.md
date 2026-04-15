# Tasks: Draggable ASCII Donut

All edits land in `src/lib/components/AsciiDonut.svelte`. No schema, no admin, no `heroConfig`.

## Phase 1: State & Math Wiring

### Task 1.1: Promote rotation angles to reactive state
- [ ] Convert `let A = 0` / `let B = 0` (`AsciiDonut.svelte:12-13`) to Svelte 5 `$state`
- [ ] Verify `drawFrame()` and `renderFrame()` (`:115-116`) still advance them

### Task 1.2: Add drag-state primitives
- [ ] Add `$state` flags: `isDragging`, `lastPointerX`, `lastPointerY`, `activePointerId`
- [ ] Add a small velocity ring buffer (~5 samples) for inertia seeding
- [ ] Define a `SENSITIVITY` constant mapping pixel delta to radian delta

## Phase 2: Pointer Event Handlers

### Task 2.1: pointerdown
- [ ] Cancel `animationFrame` to pause auto-rotation
- [ ] `setPointerCapture(event.pointerId)`; store id
- [ ] Seed `lastPointerX`/`lastPointerY`; clear velocity buffer
- [ ] Set `isDragging = true`

### Task 2.2: pointermove
- [ ] Guard on `isDragging` and matching `pointerId`
- [ ] Compute `dx`, `dy`; update `B += dx * SENSITIVITY` (yaw), `A += dy * SENSITIVITY` (pitch)
- [ ] Push `{dx, dy, t}` into velocity buffer; trim to last 5
- [ ] Call `drawFrame()` directly to repaint

### Task 2.3: pointerup / pointercancel
- [ ] Release pointer capture
- [ ] Compute trailing average velocity from buffer
- [ ] Set `isDragging = false`; hand off to inertia loop (Task 3.1)

## Phase 3: Inertia & Resume

### Task 3.1: Inertia decay loop
- [ ] On release, start an rAF loop applying `inertiaVx`, `inertiaVy` to `B`, `A`
- [ ] Decay both toward baseline auto-rotation rates (`0.02`, `0.04`) over ~600ms
- [ ] When decay completes, restart `renderFrame()` to resume normal auto-rotation
- [ ] Skip inertia entirely when `prefersReducedMotion` is true

## Phase 4: Markup, Styles & Accessibility

### Task 4.1: Wire handlers and touch-action
- [ ] Bind `onpointerdown`/`onpointermove`/`onpointerup`/`onpointercancel` to `.donut-display`
- [ ] Add `touch-action: none` to `.donut-display` and `.donut-ascii`
- [ ] Add `cursor: grab` default and `cursor: grabbing` while `isDragging`
- [ ] Add `aria-hidden="true"` to `<pre class="donut-ascii">` if not present
- [ ] Leave the existing source-toggle button untouched

### Task 4.2: Reduced-motion path
- [ ] In existing `syncMotionPreference` (`:123-137`), allow drag (single redraw on move) but skip inertia and auto-resume
- [ ] Verify no rAF loops run when reduced motion is active and not dragging

## Phase 5: Verification

### Task 5.1: Manual visual check (FlowDeck simulator)
- [ ] Donut spins under mouse drag on desktop
- [ ] Donut spins under finger drag on mobile; page does not scroll
- [ ] Auto-rotation resumes within ~1s of release with visible inertia
- [ ] `prefers-reduced-motion: reduce` disables auto-spin and inertia

### Task 5.2: Regression checks
- [ ] Source-toggle still opens/closes the Zig source panel
- [ ] Hero layout (`hero--diptych` / `hero--editorial` / `hero--stacked`) unchanged
- [ ] No console errors during drag

## Task Summary

**Total Tasks**: 11
**Completed**: 0/11
