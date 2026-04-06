# Proposal: Add Crop Truth Table Configurator

## Why
The current `PositionPicker` is a reactive blind guess — you set an `objectPosition` and hope for the best. There's no way to see how a crop will render across different aspect ratios simultaneously, no way to define a focal point that the system respects at any ratio, and no way to predict the exact visible region of an image before it goes live.

Creative portfolios live or die on image presentation. A misplaced crop kills the entire card. The existing tool forces per-entry trial-and-error across a single hardcoded 16:10 ratio — exactly the kind of tedious, unscalable workflow that a staff-level portfolio admin should never tolerate.

## What
A **Crop Truth Table** — a dedicated admin configurator that makes image crop behavior **deterministic and predictable** across all display contexts. Inspired by iA Writer's commitment to showing you exactly what will happen before it happens.

### Core Concept: The Truth Table
A truth table in logic shows every possible input combination and its exact output. Applied to image crops:

| Input: Focal Point | Input: Aspect Ratio | Output: Visible Region |
|---|---|---|
| `(35%, 20%)` | `16:10` | Shows face + shoulders |
| `(35%, 20%)` | `1:1` | Tight face crop |
| `(35%, 20%)` | `4:3` | Face + upper body |
| `(35%, 20%)` | `21:9` | Horizontal band across face |

The admin sees **all outputs simultaneously** for any given focal point — no guessing.

## Proposed Solution

### 1. Focal Point Model (replaces raw objectPosition)
Instead of opaque CSS strings like `"35% 20%"`, store a semantic focal point:
- `focalX: number` (0–100, percentage from left)
- `focalY: number` (0–100, percentage from top)
- `zoom: number` (1.0–3.0, scale factor, default 1.0)
- Backward-compatible: generates `objectPosition` CSS at render time

### 2. Truth Table Preview Panel
A dedicated panel in `/admin` works entries that shows the image cropped at **multiple aspect ratios simultaneously**:
- `16:10` (current grid default)
- `1:1` (square, for potential card variants)
- `4:3` (classic)
- `21:9` (cinematic/wide banner)

Each cell shows the actual visible region with a crosshair on the focal point. Edit the focal point once → all cells update live.

### 3. Interactive Focal Point Editor
Replace the current 9-point grid with a direct-manipulation editor:
- Click anywhere on the full source image to set focal point
- Draggable crosshair with coordinate readout
- The 9-point grid remains as quick-snap shortcuts
- Zoom slider for scale control
- Real-time truth table updates as you drag

### 4. Render Integration
The `WorksSection.svelte` display code consumes the focal point and computes `object-position` at render time. The existing `objectPosition` field remains as the computed output — no breaking changes to the frontend display logic.

## Impact & Benefits
- **Deterministic**: See exactly what will display before publishing
- **Efficient**: Set one focal point → correct crop at every ratio
- **Professional**: iA Writer-level precision for image presentation
- **Non-breaking**: Existing `objectPosition` values continue to work; focal point is additive

## Risks
- Adding `focalX`/`focalY`/`zoom` fields to `worksEntries` schema requires Convex push
- Truth table panel adds visual density to the works admin — mitigated by keeping it in the existing expandable preview section
- Source images that are already tightly cropped won't benefit much from focal point control — edge case, acceptable

## Non-Goals
- Image upload or hosting (images remain external URLs)
- Server-side image processing or dynamic cropping (this is CSS-only)
- Batch editing focal points across multiple entries
- Responsive aspect ratio switching on the public site (future phase)
