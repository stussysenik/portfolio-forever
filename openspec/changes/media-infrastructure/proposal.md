# Proposal: Media Infrastructure — Color-Accurate, Batteries-Included

## Overview

Add a performance-first media layer to portfolio-forever that handles photos (wide-gamut, HDR), videos (Mux), animations (GIF/Lottie/live-embed), and project showcases — all backed by Convex, managed from /admin, and served with color accuracy that ties into the dcal narrative.

The infrastructure is **dependency-injectable**: Svelte stores, Convex functions, and display components that compose together. Adding a new photo collection or project showcase is a data insert, not new code.

Additionally, this change introduces:
- **Magazine-editorial layout system** — 8 switchable layouts (editorial, masonry, filmstrip, longform, grid, list, hero-split, carousel) per page/section, stored in Convex, CSS-only rendering
- **Tight information architecture** — every section wrapped in `SectionShell` with consistent header/divider/content/footer pattern (the "train departure board" metaphor)
- **Rails-inspired conventions** — every media type follows the same file/table/component/store pattern
- **White-label foundation** — all content from Convex, all styles via CSS custom properties, convention-based structure

## Problem Statement

1. **No photo pipeline** — the portfolio can't showcase long-exposure photography, physical work, or process shots at the fidelity they deserve. No wide-gamut, no HDR, no ICC profiles.
2. **Mux underused** — `MuxVideo.svelte` exists but only gallery uses `muxPlaybackId`. No per-project videos, no device frames, no chapters.
3. **No animation system** — 286 GitHub repos include Go terminal animations, WebGPU demos, Zig/WASM carousels — none are capturable/displayable in the portfolio today.
4. **No project showcase structure** — `/works` has 11 iframe previews but no unified media system for showing demos, process videos, GIFs, and photos per project.
5. **No media admin** — adding media requires code changes, not admin panel edits.

## Proposed Solution

### Pillar 1: Color-Accurate Photo Pipeline

Build-time processing via Sharp:
- Preserve ICC profiles (Display P3, Adobe RGB, ProPhoto RGB)
- Generate: AVIF (P3 gamut) → WebP (sRGB) → JPEG (universal fallback)
- Responsive srcset: 640 / 1024 / 1536 / 2048 / 3840px
- Blur-up placeholders: tiny base64 inline (~800 bytes per image)
- Extract EXIF metadata for optional overlay (exposure, aperture, ISO, lens)

Runtime:
- `color-gamut: p3` media query serves P3 AVIF on wide-gamut displays
- Proper sRGB fallback with tone mapping on standard displays
- Lazy loading via IntersectionObserver with blur-up transition
- Performance budget: LCP image < 2.5s, all above-fold images preloaded

### Pillar 2: Expanded Video (Mux)

- Per-project video support (demo, process walkthrough, live coding)
- Device frame wrappers: iOS simulator, terminal, browser chrome
- Chapter markers for longer walkthroughs
- Poster frames served through the photo pipeline (P3 color)
- Mux webhook integration for upload status tracking

### Pillar 3: Animation & GIF System

- GIF: optimized loops for terminal animations (gifsicle compression)
- Lottie/Rive: for UI micro-interactions and design showcases
- Live embed: sandboxed iframe for WebGPU/web projects with static poster fallback
- Unified AnimationPlayer component with play/pause, loop toggle, speed control

### Pillar 4: Project Showcase System

Unified `projectShowcases` table that ties media to projects. Each showcase entry defines:
- GitHub source, languages, categories
- Capture type (terminal-recording, ios-simulator, web-embed, screen-recording, photo-gallery)
- Ordered media array (videos, GIFs, photos, embeds)
- Tier (1/2/3) for showcase priority
- Full admin CRUD

### Pillar 5: Common Lisp Moat

CL as build-time DSL for media transformations — macro-based, composable pipeline definitions. Starting point, expandable to generative art and content DSLs.

## Media Fixtures: Lorem Ipsum for Every Type

Each media type gets fixture data that defines the **one** (single item layout), constrains the **space** (performance budget), and proves the **many** (collection scaling).

### Photo Fixtures

| Fixture | Purpose | Dimensions | File Size Budget |
|---------|---------|-----------|-----------------|
| `photo-single` | One hero photo, full-bleed | 3840×2560 | AVIF: ≤400KB, WebP: ≤600KB, JPEG: ≤800KB |
| `photo-grid-6` | 2×3 grid layout | 1536×1024 each | ≤150KB each (AVIF), 900KB total |
| `photo-grid-24` | 4×6 masonry | 1024×768 each | ≤80KB each, 1.9MB total, paginated at 12 |
| `photo-collection-100` | Stress test | 640×480 thumbs | ≤30KB each thumb, lazy-load beyond viewport |

**Performance constraint**: First 6 photos load in < 1.5s on 4G. Collection of 100 never exceeds 3MB in viewport.

### Video Fixtures

| Fixture | Purpose | Duration | Size Budget |
|---------|---------|----------|-------------|
| `video-single-demo` | One project demo | 30–90s | Mux adaptive bitrate, poster ≤100KB |
| `video-process` | Walkthrough with chapters | 3–10min | Mux HLS, 3 chapter markers |
| `video-grid-4` | Video gallery section | 15–30s each | Poster grid loads first, video on interaction |
| `video-grid-16` | Stress test | mixed | Only 1 video plays at a time, rest show posters |

**Performance constraint**: Zero video autoplay on page load. Posters are photos (go through photo pipeline). First video playback starts < 2s after interaction.

### GIF/Animation Fixtures

| Fixture | Purpose | Dimensions | Size Budget |
|---------|---------|-----------|-------------|
| `gif-single-terminal` | One terminal animation loop | 800×600 | ≤2MB optimized, ≤500KB if converted to WebM |
| `gif-strip-4` | Horizontal strip of 4 loops | 400×300 each | ≤800KB each, staggered load |
| `gif-gallery-12` | Animation showcase grid | 400×300 each | Poster frames first, GIF on hover/tap |
| `lottie-single` | Interactive UI animation | SVG-based | ≤100KB JSON |
| `embed-single` | Live WebGPU/iframe | responsive | Poster until interaction, max 1 active embed |

**Performance constraint**: GIFs only animate when in viewport. Max 3 simultaneous GIF playbacks. Lottie files < 100KB. Embeds are always opt-in (click to activate).

### Project Showcase Fixtures

| Fixture | Purpose | Media Count | Total Budget |
|---------|---------|-------------|-------------|
| `showcase-minimal` | 1 photo + 1 video | 2 assets | ≤500KB initial |
| `showcase-standard` | 1 video + 3 photos + 1 GIF | 5 assets | ≤1.5MB initial (posters only) |
| `showcase-rich` | 2 videos + 6 photos + 2 GIFs + 1 embed | 11 assets | ≤2MB initial, ≤8MB full |
| `showcase-max` | Stress test: 20 mixed assets | 20 assets | Paginated, ≤3MB per page |

**Performance constraint**: Showcase page LCP < 2.5s. Total initial payload (before interaction) < 3MB. Progressive disclosure — hero media loads first, rest lazy.

### Scaling Matrix

| Count | Photos | Videos | GIFs | Showcases |
|-------|--------|--------|------|-----------|
| **1** (the one) | Full-bleed hero, P3 AVIF, EXIF overlay | Single Mux player, device frame | Single loop, inline | Minimal: 1 video + 1 photo |
| **6** (comfortable) | 2×3 grid, ≤900KB total | Poster grid, play on tap | Horizontal strip | Standard: 5 assets each |
| **24** (gallery) | Masonry, paginate at 12 | Category tabs, 1 active | Grid, hover-to-play | Filter by language/category |
| **100** (archive) | Virtual scroll, 30KB thumbs | Search + filter only | Not applicable | Tiered: T1 featured, T2 grid, T3 list |

## Performance Budgets (Global)

| Metric | Target | Hard Limit |
|--------|--------|------------|
| LCP | < 2.0s | < 2.5s |
| FCP | < 1.0s | < 1.5s |
| CLS | < 0.05 | < 0.1 |
| Total initial payload | < 2MB | < 3MB |
| Above-fold images | Preloaded | — |
| Below-fold media | Lazy, poster-first | — |
| Simultaneous video playback | 1 | 1 |
| Simultaneous GIF playback | 3 | 5 |
| Active iframes | 1 | 2 |

## Convex Schema Additions

```typescript
// New tables
mediaAssets: defineTable({
  type: v.union(v.literal("photo"), v.literal("video"), v.literal("gif"), v.literal("lottie"), v.literal("embed")),
  title: v.string(),
  url: v.optional(v.string()),
  muxPlaybackId: v.optional(v.string()),
  // Photo-specific
  srcset: v.optional(v.object({
    avif: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
    webp: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
    jpeg: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
  })),
  blurPlaceholder: v.optional(v.string()),
  colorProfile: v.optional(v.string()), // "srgb" | "display-p3" | "adobe-rgb"
  exif: v.optional(v.object({
    exposureTime: v.optional(v.string()),
    aperture: v.optional(v.string()),
    iso: v.optional(v.number()),
    focalLength: v.optional(v.string()),
    camera: v.optional(v.string()),
    lens: v.optional(v.string()),
  })),
  // Video-specific
  duration: v.optional(v.number()),
  chapters: v.optional(v.array(v.object({
    time: v.number(),
    label: v.string(),
  }))),
  deviceFrame: v.optional(v.union(
    v.literal("ios"), v.literal("terminal"), v.literal("browser"), v.literal("none")
  )),
  // Animation-specific
  posterUrl: v.optional(v.string()),
  loop: v.optional(v.boolean()),
  // Metadata
  width: v.optional(v.number()),
  height: v.optional(v.number()),
  fileSizeBytes: v.optional(v.number()),
  order: v.number(),
  visible: v.boolean(),
}).index("by_type", ["type"]).index("by_order", ["order"]),

projectShowcases: defineTable({
  slug: v.string(),
  title: v.string(),
  description: v.string(),
  githubUrl: v.optional(v.string()),
  languages: v.array(v.string()),
  categories: v.array(v.string()),
  captureType: v.union(
    v.literal("terminal-recording"),
    v.literal("ios-simulator"),
    v.literal("web-embed"),
    v.literal("screen-recording"),
    v.literal("photo-gallery"),
  ),
  media: v.array(v.object({
    assetId: v.id("mediaAssets"),
    label: v.string(),
    featured: v.optional(v.boolean()),
  })),
  tier: v.union(v.literal(1), v.literal(2), v.literal(3)),
  visible: v.boolean(),
  order: v.number(),
}).index("by_tier", ["tier"]).index("by_order", ["order"]).index("by_slug", ["slug"]),

photoCollections: defineTable({
  slug: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  coverAssetId: v.optional(v.id("mediaAssets")),
  assetIds: v.array(v.id("mediaAssets")),
  visible: v.boolean(),
  order: v.number(),
}).index("by_order", ["order"]).index("by_slug", ["slug"]),
```

## Svelte Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `PhotoViewer.svelte` | Color-accurate `<picture>` with P3/sRGB, blur-up, EXIF overlay | `asset`, `showExif?`, `priority?` |
| `MuxVideo.svelte` (existing, expanded) | Video with device frames, chapters | `asset`, `deviceFrame?`, `chapters?` |
| `AnimationPlayer.svelte` | Unified GIF/Lottie/Rive/embed wrapper | `asset`, `controls?` |
| `DeviceFrame.svelte` | iOS/terminal/browser chrome wrapper | `type`, `children` |
| `MediaGrid.svelte` | Responsive grid with lazy loading, virtual scroll at n>24 | `assets[]`, `columns?`, `paginate?` |
| `ProjectShowcase.svelte` | Full showcase card with hero media + supporting grid | `showcase` |
| `MediaAdmin.svelte` | Admin CRUD for all media types | — |
| `ProjectShowcaseAdmin.svelte` | Admin for project showcases | — |

## Svelte Stores

| Store | Purpose |
|-------|---------|
| `mediaStore` | Convex subscription to mediaAssets, filtered by type |
| `showcaseStore` | Convex subscription to projectShowcases, filterable |
| `colorProfileStore` | Detects display capabilities (P3, HDR, standard) via matchMedia |
| `viewportMediaStore` | Tracks which media items are in viewport for playback control |
| `mediaUploadStore` | Upload state for admin panel (progress, status, errors) |

## Routes

| Route | Content | Fixture Test |
|-------|---------|-------------|
| `/photos` | Photo collections with P3/EXIF | photo-grid-24 fixture |
| `/photos/[slug]` | Single collection | photo-collection-100 fixture |
| `/videos` | Video showcase grid | video-grid-16 fixture |
| `/gallery` (expanded) | All media, filterable | mixed showcase-max fixture |
| `/works` (expanded) | Project showcases with full media | showcase-rich fixture per project |

## Common Lisp Integration (Phase 2)

Build-time DSL for media pipeline:

```lisp
;; Define a photo processing pipeline
(defpipeline hero-photo
  (read-icc-profile)
  (generate-srcset :widths '(640 1024 1536 2048 3840))
  (encode :avif :quality 80 :color-space :display-p3)
  (encode :webp :quality 85 :color-space :srgb)
  (encode :jpeg :quality 90 :color-space :srgb)
  (blur-placeholder :width 32)
  (extract-exif))
```

Compiles to Sharp invocations at build time. The CL layer is the declarative orchestrator.

## Non-Goals

- No CDN service (Cloudinary/imgix) — self-hosted pipeline keeps costs at zero
- No video recording/capture in the portfolio itself — capture happens externally, portfolio displays
- No real-time video transcoding — Mux handles adaptive bitrate
- No 3D model viewer (yet) — out of scope for this change
- No CMS migration — Convex stays as the only backend

## Acceptance Criteria

1. `/photos` route renders photo-grid-6 fixture with P3 AVIF on supported displays, sRGB WebP fallback
2. `PhotoViewer` shows blur-up placeholder → full image transition in < 300ms
3. `MuxVideo` plays video in iOS device frame with chapter markers
4. `AnimationPlayer` renders GIF with play/pause and respects viewport-based playback limits
5. `ProjectShowcase` renders showcase-standard fixture (1 video + 3 photos + 1 GIF) with LCP < 2.5s
6. All media managed from /admin via Convex
7. photo-collection-100 fixture loads with virtual scroll, < 3MB in viewport
8. video-grid-16 fixture shows poster grid, only 1 video plays at a time
9. `color-gamut: p3` media query correctly routes P3 vs sRGB assets
10. Performance budgets pass on Lighthouse (LCP < 2.5s, CLS < 0.1)
11. `SectionShell` wraps all media sections with header/divider/content/footer pattern
12. `LayoutSwitcher` toggles between at least 3 layouts per section, persists to localStorage
13. All layouts are responsive: mobile (320px) through wide (3840px)
14. Magazine-editorial layout renders showcase-rich fixture with asymmetric 2/3 + 1/3 composition
15. Convention check: every new media type has matching Convex table + store + component + admin + route

## Risks

1. **AVIF browser support** — Safari 16.4+ supports AVIF but older Safari doesn't. Mitigated by WebP/JPEG fallback chain.
2. **ICC profile preservation through Sharp** — Sharp supports ICC but some edge cases with ProPhoto RGB. Mitigated by testing with dcal-calibrated display.
3. **Mux costs** — free tier covers 10GB storage, 200 min encoding. Sufficient for initial showcase. Monitor usage.
4. **Common Lisp build dependency** — adds SBCL to build chain. Mitigated by making CL layer optional (Phase 2), Sharp pipeline works standalone.
5. **Static adapter constraints** — SvelteKit static adapter means all srcset URLs must be known at build time. Mitigated by build-time asset processing.
