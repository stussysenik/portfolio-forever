# Design: Crop Truth Table Configurator

## Architecture Overview

The system spans three layers: **Data** (Convex schema), **Admin** (configurator UI), and **Render** (public display). The focal point is the single source of truth — everything else is derived.

```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN LAYER                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │           CropTruthTable.svelte                  │   │
│  │                                                  │   │
│  │  ┌─────────────┐  ┌──────────────────────────┐   │   │
│  │  │ FocalEditor │  │    Truth Table Grid       │   │   │
│  │  │             │  │                           │   │   │
│  │  │  ╳ (drag)   │  │  16:10  1:1  4:3  21:9  │   │   │
│  │  │  ├─ snap    │  │  ┌──┐  ┌─┐  ┌──┐ ┌────┐ │   │   │
│  │  │  ├─ coords  │  │  │╳ │  │╳│  │╳ │ │ ╳  │ │   │   │
│  │  │  └─ zoom    │  │  └──┘  └─┘  └──┘ └────┘ │   │   │
│  │  └─────────────┘  └──────────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│                    onChange(focal)                       │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│                                                         │
│  worksEntries {                                         │
│    ...existing fields,                                  │
│    focalX: optional(number),    // 0-100                │
│    focalY: optional(number),    // 0-100                │
│    zoom: optional(number),      // 1.0-3.0              │
│    objectPosition: optional(string) // computed output  │
│  }                                                      │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   RENDER LAYER                          │
│                                                         │
│  WorksSection.svelte                                    │
│    if (focalX != null && focalY != null)                │
│      objectPosition = `${focalX}% ${focalY}%`          │
│    else                                                 │
│      objectPosition = entry.objectPosition ?? default   │
│                                                         │
│  objectFit: cover (unchanged)                           │
│  aspect-ratio: 16/10 (unchanged)                        │
└─────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### D1: Focal Point as Semantic Model, objectPosition as Computed Output
**Decision**: Store `focalX`/`focalY`/`zoom` as the source of truth. Compute `objectPosition` CSS from them.
**Why**: `objectPosition: "35% 20%"` is opaque — you can't reason about it across ratios. A focal point is a universal concept: "keep this point visible." The truth table works because it can compute the visible region for any aspect ratio given a single focal point.
**Trade-off**: Dual storage (focal fields + objectPosition). Accepted because objectPosition is the CSS-native output and allows zero-change to the render path for entries that only have legacy objectPosition values.

### D2: Truth Table in Existing Expandable Panel
**Decision**: Embed the truth table inside the existing `expandedId` preview panel in WorksAdmin, replacing the current PositionPicker.
**Why**: No new routes, no new navigation. The admin already has the expand/collapse pattern. The truth table replaces the PositionPicker — it's strictly an upgrade, not an addition.
**Trade-off**: More visual density in the expanded panel. Acceptable because the truth table is compact (4 small ratio cells in a row) and the focal editor replaces the existing 9-point grid + sliders.

### D3: CSS-Only Crop Simulation (No Canvas)
**Decision**: Use `object-fit: cover` + `object-position` in all truth table cells — pure CSS.
**Why**: The truth table must show exactly what the browser will render. Using CSS means zero simulation error. Canvas would add complexity and potential visual drift.
**Trade-off**: Can't draw crop region outlines on the source image with pure CSS. Solved by using the focal editor (full image with crosshair overlay) as a separate panel from the truth table cells (cropped previews).

### D4: Backward Compatibility via Fallback Chain
**Decision**: If `focalX`/`focalY` are null, fall back to `objectPosition` string. If that's also null, fall back to `center top`.
**Why**: ~11 existing entries may have `objectPosition` set. Migration is optional, not forced.
**Fallback chain**: `focal → objectPosition → "center top"`

### D5: Zoom as Scale Factor
**Decision**: `zoom` field (1.0–3.0) applies `transform: scale(zoom)` on the image within its container, combined with `transform-origin` set to the focal point.
**Why**: CSS `object-fit: cover` already handles filling the container. Zoom allows "punching in" beyond the default cover behavior — useful for images where the subject is small relative to the frame.
**Trade-off**: Zoom + object-position interaction can be non-obvious. Mitigated by the truth table showing the exact result.

## Component Structure

```
src/lib/admin/controls/
├── PositionPicker.svelte      (existing — kept for backward compat, no longer primary)
├── CropTruthTable.svelte      (NEW — orchestrator)
├── FocalPointEditor.svelte    (NEW — click/drag on source image)
└── CropPreviewCell.svelte     (NEW — single ratio preview cell)
```

### CropTruthTable.svelte
Props: `previewUrl`, `focalX`, `focalY`, `zoom`, `onChange`
Orchestrates the focal editor and truth table grid. Computes `objectPosition` from focal point and passes it down.

### FocalPointEditor.svelte
Props: `imageUrl`, `focalX`, `focalY`, `onFocalChange`
Shows the full source image with a draggable crosshair. Click to set, drag to adjust. 9-point snap grid as keyboard shortcuts. Coordinate readout in mono type.

### CropPreviewCell.svelte
Props: `imageUrl`, `focalX`, `focalY`, `zoom`, `aspectRatio`, `label`
A single truth table cell. Shows the image at the given aspect ratio with computed `object-position`. Label underneath (e.g., "16:10").

## Visual Language (iA Writer Principles)
- **Monospace coordinates**: All numeric readouts in `var(--font-mono)`, tabular-nums
- **Crosshair, not circle**: Thin 1px lines extending to edges, intersection at focal point
- **Minimal chrome**: No borders on truth table cells unless hovered. Subtle label underneath.
- **Active state**: Blue crosshair (`--bento-blue`), coordinates highlight on drag
- **Typography**: 7px uppercase labels (consistent with existing admin tokens)
