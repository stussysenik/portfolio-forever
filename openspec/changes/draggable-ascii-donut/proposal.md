# Proposal: Draggable ASCII Donut

## Overview
Make the hero ASCII donut click-and-drag rotatable. Users grab the donut and spin it directly; auto-rotation resumes with inertia. This is the signature interaction the user named: "main page you could click and drag around with the ascii donut!"

## Problem Statement
`src/lib/components/AsciiDonut.svelte` renders a static Andy Sloane / `donut.c` torus. Rotation angles `A` and `B` (`AsciiDonut.svelte:12-13`) advance at a fixed rate inside `renderFrame()` (`:115-116`). The donut is mounted from `src/lib/sections/HeroSection.svelte:68` via `heroConfig.showDonut`.

It looks alive but it isn't *touchable*. The most-photographed object on the page does nothing when you reach for it. The grounding doc (`DOCS/plans/2026/04/15/portfolio-os-grounding.md:18`) calls out the missing pointer interaction as the "genuinely new bit" of the hero, and this proposal addresses only that gap.

## Proposed Solution
Add direct pointer manipulation to `AsciiDonut.svelte` without touching schema, admin UI, or `heroConfig`.

### 1. Pointer-Driven Rotation
- Convert `A` and `B` to Svelte 5 `$state` so reactive updates re-render the torus
- Wire `pointerdown` / `pointermove` / `pointerup` / `pointercancel` on the donut display element
- Map pointer delta to angular delta: horizontal drag updates `B` (yaw), vertical drag updates `A` (pitch), via a tunable sensitivity constant
- Pause auto-rotation on `pointerdown`, redraw on every move, release on `pointerup`/`pointercancel`

### 2. Inertia & Resume
- Track recent pointer velocity in a small ring buffer
- On release, seed an inertia velocity from the trailing average and decay it over ~600ms toward the baseline auto-rotation speeds (`A += 0.04`, `B += 0.02` from `AsciiDonut.svelte:115-116`)
- After decay, normal auto-rotation resumes seamlessly

### 3. Mobile & Pointer-Type Parity
- Use Pointer Events so mouse, pen, and touch share one path
- Apply `touch-action: none` to `.donut-display` / `.donut-ascii` so vertical swipes rotate instead of scrolling
- Capture the pointer (`setPointerCapture`) on grab so drags that leave the element finish cleanly

### 4. Accessibility
- Honor the existing `prefers-reduced-motion` branch (`AsciiDonut.svelte:122-150`): when reduced motion is active, disable BOTH auto-rotation AND drag inertia (a single drag still rotates, releasing snaps still)
- The donut remains decorative and non-essential; no keyboard equivalent required
- Add `aria-hidden="true"` on the `<pre>` if not already; keep the existing source-toggle button focusable
- Add `cursor: grab` / `cursor: grabbing` so the affordance is discoverable

## Out of Scope
- No changes to `convex/schema.ts`, `heroConfig`, or any Convex function
- No new admin UI, no inertia toggle, no sensitivity slider
- No changes to `HeroSection.svelte` beyond the existing `<AsciiDonut />` mount
- No refactor of the `donut.c` math itself
- No keyboard rotation control

## Success Criteria
- Donut visibly rotates under finger/mouse drag on desktop and mobile
- Page does not scroll while dragging the donut on touch devices
- Auto-rotation resumes within ~1s of release with smooth inertia decay
- `prefers-reduced-motion: reduce` users can drag once but see no inertia or auto-spin
- No regressions to the source-toggle button or hero layout
