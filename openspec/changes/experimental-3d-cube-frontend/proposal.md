# Proposal: Experimental 3D Cube Frontend

## Overview

Add an **experimental frontend mode** that transforms the flat one-page portfolio into a **navigable 3D cube** where each face renders a live section. Also add **positional dragging** to the ASCII donut so it can be moved freely around the hero area like a canvas element. Both features are controlled by feature flags, toggleable via CMD+K and the admin panel, and backed by the existing data-driven Convex layer.

## Problem Statement

The portfolio currently renders as a vertical scroll — sections stack linearly in `OnePageView.svelte`. The ASCII donut in the hero (`AsciiDonut.svelte`) already has rotational drag but can't be repositioned. There's no "wow mode" that shows the portfolio as a spatial, navigable 3D object.

The user's vision: *"each section on a face of a cube, a 3D cube or HTML-in-canvas, so I have a data-driven backbone and can toggle the experimental frontend mode on and off."*

## Proposed Solution

### 1. Positional Donut Drag
- Add `translateX`/`translateY` state to `AsciiDonut.svelte`
- New drag mode: hold **Shift** (or toggle a mode button) to drag the donut positionally instead of rotationally
- Position persists in `localStorage` and broadcasts to preview iframes via postMessage
- Donut stays within hero bounds with elastic clamping

### 2. 3D Cube Shell (`CubeShell.svelte`)
- Pure CSS 3D — `transform-style: preserve-3d` on a container, 6 faces with `rotateY`/`rotateX` + `translateZ`
- No Three.js, no WebGL — just CSS transforms (the project already has a pixel engine with WebGL shaders; we don't need another GPU pipeline)
- Each face renders a live section component from the existing `componentMap` in `OnePageView.svelte`
- Faces: **Front** (hero), **Right** (works), **Back** (talks/lab), **Left** (process), **Top** (academia), **Bottom** (cv/blog)
- Cube rotates via pointer drag or scroll, with momentum/inertia
- Navigation dots or edge labels show which face is active

### 3. Feature Flag: `cube-mode`
- New flag `cube-mode` in `flagIndicatorRegistry.ts` (category: `visual`)
- When enabled on the public site, `+page.svelte` renders `<CubeShell />` instead of `<OnePageView />`
- When enabled in admin preview, the preview iframe switches to cube mode
- CMD+K action: `toggleCubeMode` — instant visual switch
- Staged via the existing `stagedFlags` store (not instant-persist)

### 4. Data-Driven Backbone
- Cube reads sections from the same `pages.getByPageId` subscription that `OnePageView` uses
- Section-to-face mapping is configurable per page in `themeOverrides.cubeFaces` (stored in Convex)
- Default mapping uses the first 6 visible sections from the page's section order
- Admin gets a face-assignment picker in the section compartment

### 5. Admin Integration
- New `CubeModeConfig.svelte` compartment appears when `cube-mode` flag is on
- Shows face assignment (drag sections to faces)
- Shows cube size, rotation speed, and background style options
- All changes stage via `stagedFlags`

## Out of Scope
- No Three.js or WebGL (CSS 3D transforms only)
- No physics simulation on the cube
- No multi-page cube (one cube per page view)
- No cube mode on individual section routes (`/works`, `/talks`, etc.) — only the one-page home
- No canvas-based HTML rendering (CSS 3D is sufficient)
- No changes to existing section components — they render inside cube faces as-is

## Success Criteria
- ASCII donut can be positionally dragged around the hero area (Shift+drag)
- Cube mode renders 6 sections on cube faces with live content
- Cube rotates via pointer drag with inertia
- `cube-mode` flag toggles the mode on/off via CMD+K and admin sidebar
- Preview iframe reflects cube mode changes in real-time
- All changes stage through the `stagedFlags` system
- No regressions to existing one-page scroll view
- Works on mobile (touch drag for cube rotation)
