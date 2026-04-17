# Design: Experimental 3D Cube Frontend

## Architecture

```
┌─────────────────────────────────────────────────┐
│  +page.svelte (routes)                          │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ OnePageView   │  │ CubeShell (when flag on) │ │
│  │ (default)     │  │ ┌──────────────────────┐ │ │
│  │               │  │ │ CSS 3D Cube          │ │ │
│  │ Sections      │  │ │ ┌────┐ ┌────┐       │ │ │
│  │ stacked       │  │ │ │face│ │face│ ...   │ │ │
│  │ vertically    │  │ │ │hero│ │work│       │ │ │
│  │               │  │ │ └────┘ └────┘       │ │ │
│  │               │  │ └──────────────────────┘ │ │
│  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
         ▲                    ▲
         │                    │
    pages.getByPageId   pages.getByPageId
         │                    │
         └────── Convex ──────┘
```

## Component Tree

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `CubeShell.svelte` | `src/lib/components/CubeShell.svelte` | Main cube container, handles rotation state, pointer events |
| `CubeFace.svelte` | `src/lib/components/CubeFace.svelte` | Single face of the cube, renders a section component |
| `CubeNav.svelte` | `src/lib/components/CubeNav.svelte` | Navigation dots + face labels overlay |

### Modified Components

| Component | Change |
|-----------|--------|
| `AsciiDonut.svelte` | Add positional drag mode (Shift+drag) |
| `OnePageView.svelte` | Export `componentMap` for cube reuse |
| `flagIndicatorRegistry.ts` | Add `cube-mode` flag entry |
| `registry.ts` (command-os) | Add `toggleCubeMode` action |
| `+page.svelte` (routes) | Conditionally render CubeShell vs OnePageView |

## CSS 3D Cube Geometry

```css
.cube-viewport {
  perspective: 1200px;
  perspective-origin: 50% 50%;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.cube-container {
  transform-style: preserve-3d;
  width: var(--cube-size, 500px);
  height: var(--cube-size, 500px);
  position: relative;
  /* Centered in viewport */
  margin: auto;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.cube-face {
  position: absolute;
  width: var(--cube-size, 500px);
  height: var(--cube-size, 500px);
  overflow-y: auto;
  backface-visibility: hidden;
  /* Each face gets its own rotate + translateZ */
}

/* Face positions */
.face-front  { transform: rotateY(0deg)   translateZ(calc(var(--cube-size) / 2)); }
.face-right  { transform: rotateY(90deg)  translateZ(calc(var(--cube-size) / 2)); }
.face-back   { transform: rotateY(180deg) translateZ(calc(var(--cube-size) / 2)); }
.face-left   { transform: rotateY(-90deg) translateZ(calc(var(--cube-size) / 2)); }
.face-top    { transform: rotateX(90deg)  translateZ(calc(var(--cube-size) / 2)); }
.face-bottom { transform: rotateX(-90deg) translateZ(calc(var(--cube-size) / 2)); }
```

## Positional Donut Drag Design

### Mode Toggle
- Default drag = rotation (existing behavior)
- **Shift + drag** = positional move
- Visual indicator: cursor changes to `move` when Shift is held
- Position stored as `{ x: number, y: number }` relative to hero container

### State
```ts
let donutPos = $state({ x: 0, y: 0 });
let isPositionalDrag = $state(false);
```

### Bounds
- Hero container provides bounding rect
- Donut position clamped with 8px elastic margin
- On release beyond bounds, spring animation snaps back

### Persistence
- Position saved to `localStorage` key `donut-position`
- Broadcast via `postMessage({ type: 'admin:donutPosition', x, y })` to preview iframes

## Section-to-Face Mapping

### Default Mapping (from first 6 visible sections)
```
Front:  hero        (index 0)
Right:  works       (index 1)
Back:   talks/lab   (index 2)
Left:   process     (index 3)
Top:    academia    (index 4)
Bottom: cv/blog     (index 5)
```

### Custom Mapping
- Stored in `page.themeOverrides.cubeFaces` as `{ front: 'hero', right: 'works', ... }`
- Admin UI lets drag sections between face slots
- Falls back to default if not configured

## Feature Flag Integration

### Registry Entry
```ts
{ key: 'cube-mode', label: '3D Cube Mode', category: 'visual',
  mountHint: '+page.svelte conditional', icon: 'lucide:box' }
```

### CMD+K Action
```ts
toggleCubeMode: action({
  name: 'toggleCubeMode',
  description: 'Switch between scroll view and 3D cube view.',
  parameters: z.object({ enabled: z.boolean() }),
  async execute({ enabled }, { client, api }) {
    // Stage via stagedFlags store
    stagedFlags.stage('cube-mode', enabled, 'visual', '3D Cube Mode');
  },
}),
```

## Responsive Behavior

| Breakpoint | Cube Size | Behavior |
|-----------|-----------|----------|
| < 480px | 90vw | Touch drag to rotate, snap to nearest face |
| 480-768px | 80vw | Same as mobile |
| 768-1024px | 60vw | Pointer drag, keyboard arrows |
| > 1024px | min(500px, 40vw) | Full interaction, mouse + keyboard |

## Accessibility
- `prefers-reduced-motion`: cube snaps to face without animation, no inertia
- Keyboard: arrow keys rotate cube to adjacent faces
- Screen reader: `aria-roledescription="3D cube navigation"` on viewport
- Focus management: when cube rotates to a face, focus moves into that face's content
- Escape key exits cube mode (returns to scroll view)
