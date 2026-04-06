# Design: Media Infrastructure — Color-Accurate, Batteries-Included

> Convention over configuration. Every page is a train — arrival, departure, schedule.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Information Architecture](#information-architecture)
- [Layout System: Magazine-Editorial](#layout-system-magazine-editorial)
- [Media Kernel](#media-kernel)
- [Color-Accurate Photo Pipeline](#color-accurate-photo-pipeline)
- [Video System (Mux)](#video-system-mux)
- [Animation & GIF System](#animation--gif-system)
- [Project Showcase System](#project-showcase-system)
- [Media Fixtures: The One, The Space, The Many](#media-fixtures-the-one-the-space-the-many)
- [Performance Budgets](#performance-budgets)
- [Convex Schema](#convex-schema)
- [Components](#components)
- [Stores](#stores)
- [Routes & IA Map](#routes--ia-map)
- [Admin Integration](#admin-integration)
- [Common Lisp Moat (Phase 2)](#common-lisp-moat-phase-2)
- [White-Label Foundation](#white-label-foundation)
- [Responsive Design](#responsive-design)
- [Acceptance Criteria](#acceptance-criteria)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  PRESENTATION — Magazine-Editorial Layouts (switchable per page)    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ Editorial │ │ Masonry  │ │ Filmstrip│ │ Longform │ + custom     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
├─────────────────────────────────────────────────────────────────────┤
│  COMPONENTS — Batteries-Included Media Primitives                   │
│  PhotoViewer · MuxVideo · AnimationPlayer · DeviceFrame             │
│  MediaGrid · ProjectShowcase · MediaSection · LayoutSwitcher        │
├─────────────────────────────────────────────────────────────────────┤
│  STORES — Dependency-Injectable State                               │
│  mediaStore · showcaseStore · colorProfileStore · layoutStore       │
│  viewportMediaStore · mediaUploadStore                              │
├─────────────────────────────────────────────────────────────────────┤
│  DATA — Convex Tables + Conventions                                 │
│  mediaAssets · projectShowcases · photoCollections                  │
│  pageLayouts · galleryItems (existing, extended)                    │
├─────────────────────────────────────────────────────────────────────┤
│  BUILD — Asset Pipeline                                             │
│  Sharp (AVIF/WebP/P3) · ICC preservation · srcset generation        │
│  blur-up placeholders · EXIF extraction · GIF optimization          │
│  Mux upload · Lottie validation                                     │
├─────────────────────────────────────────────────────────────────────┤
│  COMMON LISP (Phase 2) — Build-Time DSL                            │
│  Pipeline macros · Generative art · Content s-expressions           │
└─────────────────────────────────────────────────────────────────────┘
```

### Rails-Inspired Conventions

Like Rails, every resource follows the same pattern. No guessing where things live.

```
For any media type (photo, video, gif, showcase):

  Convex table      → convex/{resource}.ts        (queries + mutations)
  Schema             → convex/schema.ts            (table definition)
  Section component  → src/lib/sections/{Resource}Section.svelte
  Admin component    → src/lib/admin/{Resource}Admin.svelte
  Display component  → src/lib/components/media/{Resource}.svelte
  Store              → src/lib/stores/{resource}.ts
  Route (multi-page) → src/routes/{resource}/+page.svelte
  Route (detail)     → src/routes/{resource}/[slug]/+page.svelte
  Registry entry     → registered in src/lib/data/registry.ts
  Nav entry          → auto from Convex pages table
  Fixture data       → fixtures/{resource}-{count}.json
```

Adding a new media type = follow the convention. No new code patterns to learn.

---

## Information Architecture

### Current State (from IA audit)

The portfolio has 14 section types, hybrid one-page/multi-page mode, Convex-driven navigation, and these existing routes:

```
/                 → OnePageView (all sections)
├── /academia     → AcademiaSection
├── /terminal     → TerminalSection
├── /process      → ProcessSection
├── /works        → WorksSection
├── /talks        → TalksSection
├── /likes        → LikesSection
├── /blog         → BlogSection
├── /gifts        → GiftsSection
├── /cv           → CvSection
├── /gallery      → GallerySection (has muxPlaybackId, basic grid)
├── /labs         → LabsSection
├── /os           → OsSection
├── /minor        → MinorSection
├── /scratchpad   → ?
└── /admin        → Admin panel
    └── /admin/[pageId] → Per-page admin
```

### Proposed IA (additions in bold)

```
/                 → OnePageView (all sections, layout-switchable)
├── /academia     → AcademiaSection
├── /terminal     → TerminalSection
├── /process      → ProcessSection
├── /works        → WorksSection (EXPANDED: full project showcases with media)
│   └── /works/[slug] → ProjectShowcase detail (NEW)
├── /talks        → TalksSection
├── /likes        → LikesSection
├── /blog         → BlogSection
├── /gifts        → GiftsSection
├── /cv           → CvSection
├── /gallery      → GallerySection (EXPANDED: all media types, filterable)
├── /photos       → PhotosSection (NEW: photography collections)
│   └── /photos/[slug] → PhotoCollection detail (NEW)
├── /videos       → VideosSection (NEW: video showcases)
├── /labs         → LabsSection
├── /os           → OsSection
├── /minor        → MinorSection
├── /scratchpad   → ?
└── /admin        → Admin panel
    └── /admin/[pageId] → Per-page admin (EXPANDED: media CRUD)
```

### Navigation Order (proposed)

The nav reads like a magazine table of contents:

```
works · photos · videos · gallery · talks · labs · process · blog · academia · likes · gifts · cv · terminal · os · minor
```

Rationale: **creative work first** (works, photos, videos, gallery), then **professional** (talks, labs, process), then **personal** (blog, academia, likes, gifts), then **meta** (cv, terminal, os, minor).

This order is the Convex `pages` table — fully admin-editable.

### Section Anatomy: The Train Metaphor

Every section/page follows a predictable structure. Like a train departure board — you always know where to look.

```
┌──────────────────────────────────────────────────┐
│  HEADER BAR                                      │
│  Section title · Subtitle · Layout switcher      │
│  ─────────────────────────────────────────────── │  ← divider
│                                                  │
│  CONTENT AREA (layout-dependent)                 │
│  Adapts to: editorial / masonry / filmstrip /    │
│  longform / grid / list                          │
│                                                  │
│  ─────────────────────────────────────────────── │  ← divider
│  FOOTER BAR                                      │
│  Item count · Filter chips · Pagination          │
│  "Showing 6 of 24 · All · Photography · Process" │
└──────────────────────────────────────────────────┘
```

Every section has:
1. **Header**: title, optional subtitle, optional layout switcher icon
2. **Divider**: consistent visual separator (1px, `var(--color-border)`)
3. **Content**: the media/content in the selected layout
4. **Footer**: item count, active filters, pagination if needed
5. **Divider**: closing separator before next section

This pattern is enforced by a `SectionShell.svelte` wrapper component.

---

## Layout System: Magazine-Editorial

### Layout Types

Each page/section can switch between layouts. The layout is stored in Convex per page (admin-changeable) and optionally overridable by the visitor.

| Layout | Inspiration | Best For | Columns |
|--------|-------------|----------|---------|
| `editorial` | Magazine spreads, Pentagram case studies | Mixed media showcases, project detail | Asymmetric: 2/3 + 1/3 or 1/3 + 2/3 |
| `masonry` | Pinterest, Are.na | Photo galleries, mixed-size content | 2–4 col responsive |
| `filmstrip` | Cinema, horizontal scroll | Video showcases, timeline sequences | 1 row, horizontal |
| `longform` | Medium, Substack | Blog posts, process documentation | Single column, max-width 720px |
| `grid` | Swiss design, Dieter Rams | Uniform items (GIFs, small cards) | 2–6 col responsive |
| `list` | Hacker News, minimal | Dense info, archive view | Single column, compact rows |
| `hero-split` | Landing pages, editorial covers | Single featured item + supporting | 50/50 or 60/40 split |
| `carousel` | Instagram stories, slide decks | Sequential media, before/after | 1 item visible, swipe/arrow |

### Layout Anatomy: Editorial

The star layout. Magazine-quality asymmetric compositions.

```
┌───────────────────────────────────────────────────┐
│  EDITORIAL LAYOUT                                  │
│                                                    │
│  ┌────────────────────────┐ ┌──────────────────┐  │
│  │                        │ │  Caption block   │  │
│  │   HERO MEDIA           │ │  Title           │  │
│  │   (2/3 width)          │ │  Description     │  │
│  │   Photo or Video       │ │  EXIF / metadata │  │
│  │                        │ │  Tags            │  │
│  └────────────────────────┘ └──────────────────┘  │
│                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Support  │ │ Support  │ │ Support media    │  │
│  │ media 1  │ │ media 2  │ │ (wider)          │  │
│  └──────────┘ └──────────┘ └──────────────────┘  │
│                                                    │
│  Pull quote or annotation block                    │
│  ─────────────────────────────────────────────────│
│                                                    │
│  ┌──────────────────────┐ ┌────────────────────┐  │
│  │ Full-bleed media     │ │ Sidebar text /     │  │
│  │ (edge to edge)       │ │ related links      │  │
│  └──────────────────────┘ └────────────────────┘  │
└───────────────────────────────────────────────────┘
```

### Layout Switching

```svelte
<!-- In SectionShell.svelte -->
<div class="section-header">
  <h2>{title}</h2>
  {#if layouts.length > 1}
    <LayoutSwitcher
      available={layouts}
      active={currentLayout}
      on:change={(e) => currentLayout = e.detail}
    />
  {/if}
</div>
```

Layout preference stored per-section in Convex `pages.sections[].config.layout`. Visitor can override via the switcher icon (stored in localStorage, doesn't persist to DB).

### Layout CSS Strategy

Each layout is a CSS class on the content container. No JavaScript layout engines — pure CSS Grid/Flexbox.

```css
/* Base grid — all layouts use CSS custom properties */
.layout-editorial { 
  display: grid;
  grid-template-columns: var(--editorial-main, 2fr) var(--editorial-side, 1fr);
  gap: var(--space-lg);
}

.layout-masonry {
  columns: var(--masonry-cols, 3);
  column-gap: var(--space-md);
}

.layout-filmstrip {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: var(--space-md);
}

.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-min, 280px), 1fr));
  gap: var(--space-md);
}

.layout-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.layout-longform {
  max-width: 720px;
  margin: 0 auto;
}

.layout-hero-split {
  display: grid;
  grid-template-columns: var(--split-ratio, 1fr 1fr);
  gap: var(--space-lg);
  min-height: 60vh;
}

.layout-carousel {
  display: flex;
  overflow: hidden;
  scroll-snap-type: x mandatory;
}
```

### Layout × Media Type Matrix

Which layouts work for which media types:

| Layout | Photos | Videos | GIFs | Showcases | Mixed |
|--------|--------|--------|------|-----------|-------|
| editorial | featured | featured | no | yes (default) | yes |
| masonry | yes (default) | poster-only | yes | no | yes |
| filmstrip | yes | yes (default) | yes | no | no |
| longform | inline | inline | inline | yes | yes |
| grid | yes | poster-only | yes (default) | cards | yes |
| list | thumb+text | thumb+text | no | yes | yes |
| hero-split | hero photo | hero video | no | hero showcase | no |
| carousel | yes | yes | yes | yes | yes |

---

## Media Kernel

The kernel is the set of primitives everything else composes from. Seven components, five stores, three Convex tables.

### Component Hierarchy

```
SectionShell.svelte              — universal section wrapper (header/divider/content/footer)
├── LayoutSwitcher.svelte        — layout toggle icons
├── MediaGrid.svelte             — responsive grid with virtual scroll
│   ├── PhotoViewer.svelte       — <picture> with P3/sRGB, blur-up, EXIF
│   ├── MuxVideo.svelte          — Mux player with device frames, chapters
│   ├── AnimationPlayer.svelte   — GIF/Lottie/Rive/embed unified player
│   └── DeviceFrame.svelte       — iOS/terminal/browser chrome wrapper
├── ProjectShowcase.svelte       — full showcase with hero + supporting media
├── FilterBar.svelte             — reusable filter chips (language, category, media type)
└── Pagination.svelte            — page dots / "load more" / virtual scroll trigger
```

### Store Architecture

```typescript
// src/lib/stores/media.ts

// Core media store — subscribes to Convex, filters by type
export const mediaStore = createMediaStore();
// Usage: $mediaStore.photos, $mediaStore.videos, $mediaStore.gifs

// Display capability detection
export const colorProfileStore = createColorProfileStore();
// Usage: $colorProfileStore.gamut → 'p3' | 'srgb'
//        $colorProfileStore.hdr → boolean
//        $colorProfileStore.prefersReducedMotion → boolean

// Viewport-based playback control
export const viewportMediaStore = createViewportMediaStore();
// Usage: register(element, id) → auto-pauses when out of viewport
//        $viewportMediaStore.activeVideoId → only 1 video plays
//        $viewportMediaStore.activeGifIds → max 3 GIFs animate

// Layout state per section
export const layoutStore = createLayoutStore();
// Usage: $layoutStore['photos'] → 'masonry' | 'grid' | 'filmstrip'
//        layoutStore.set('photos', 'filmstrip')

// Project showcases with filtering
export const showcaseStore = createShowcaseStore();
// Usage: $showcaseStore.byTier(1), $showcaseStore.byCategory('visual-computing')
```

---

## Color-Accurate Photo Pipeline

### Build-Time Pipeline

```
INPUT: source photo (JPEG/TIFF/PNG with ICC profile)
  │
  ├─ 1. Read ICC profile (Sharp: keepIccProfile)
  │     → Detect: sRGB, Display P3, Adobe RGB, ProPhoto RGB
  │
  ├─ 2. Generate srcset variants
  │     → 640w, 1024w, 1536w, 2048w, 3840w
  │     → Each variant preserves original color profile
  │
  ├─ 3. Encode formats (per srcset width)
  │     ├─ AVIF: quality 80, preserve P3 if source is wide-gamut
  │     ├─ WebP: quality 85, convert to sRGB (universal fallback)
  │     └─ JPEG: quality 90, convert to sRGB (legacy fallback)
  │
  ├─ 4. Generate blur-up placeholder
  │     → Resize to 32px wide, base64 encode, inline as data URI
  │     → ~800 bytes per image
  │
  ├─ 5. Extract EXIF metadata
  │     → Exposure time, aperture, ISO, focal length, camera, lens
  │     → Store in Convex mediaAssets.exif
  │
  └─ OUTPUT: srcset URLs + blur placeholder + EXIF in Convex
```

### Runtime Rendering

```svelte
<!-- PhotoViewer.svelte — simplified -->
<script lang="ts">
  import { colorProfileStore } from '$lib/stores/media';

  export let asset: MediaAsset;
  export let showExif = false;
  export let priority = false;  // true for above-fold

  let loaded = false;
  const gamut = $colorProfileStore.gamut;
</script>

<figure class="photo-viewer" class:loaded>
  {#if !loaded && asset.blurPlaceholder}
    <img
      class="blur-placeholder"
      src={asset.blurPlaceholder}
      alt=""
      aria-hidden="true"
    />
  {/if}

  <picture>
    {#if gamut === 'p3' && asset.srcset?.avif}
      {#each asset.srcset.avif as { width, url }}
        <source srcset={url} media="(min-width: {width}px)" type="image/avif" />
      {/each}
    {/if}
    {#if asset.srcset?.webp}
      {#each asset.srcset.webp as { width, url }}
        <source srcset={url} media="(min-width: {width}px)" type="image/webp" />
      {/each}
    {/if}
    <img
      src={asset.srcset?.jpeg?.[0]?.url ?? asset.url}
      alt={asset.title}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      on:load={() => loaded = true}
    />
  </picture>

  {#if showExif && asset.exif}
    <figcaption class="exif-overlay">
      {asset.exif.focalLength} · f/{asset.exif.aperture} · {asset.exif.exposureTime}s · ISO {asset.exif.iso}
    </figcaption>
  {/if}
</figure>
```

---

## Video System (Mux)

### Expanded MuxVideo Component

The existing `MuxVideo.svelte` (76 lines) gets extended with:

1. **Device frames** — wrap the player in contextual chrome
2. **Chapter markers** — clickable timeline sections for walkthroughs
3. **Poster from photo pipeline** — P3-accurate poster frames
4. **Viewport-aware** — only 1 video plays at a time via `viewportMediaStore`

### Device Frame Types

```
┌─ iOS ──────────────────────┐   ┌─ Terminal ─────────────────┐
│  ┌─ iPhone 15 Pro ───────┐ │   │  ┌─ ● ● ● ── zsh ──────┐ │
│  │  ┌──────────────────┐ │ │   │  │ $ ./vfx --plasma     │ │
│  │  │                  │ │ │   │  │                       │ │
│  │  │   Mux Player     │ │ │   │  │   Mux Player          │ │
│  │  │                  │ │ │   │  │                       │ │
│  │  └──────────────────┘ │ │   │  └───────────────────────┘ │
│  │       ──────          │ │   └─────────────────────────────┘
│  └───────────────────────┘ │
└────────────────────────────┘

┌─ Browser ──────────────────────────────────────────┐
│  ┌─ ● ● ● ─── ◄ ► ↻ ─── localhost:3000 ────── ┐  │
│  │                                               │  │
│  │   Mux Player                                  │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

---

## Animation & GIF System

### AnimationPlayer Component

Unified wrapper that handles 4 animation source types:

| Source | Format | Behavior |
|--------|--------|----------|
| `gif` | `.gif` / `.webm` | Autoplay when in viewport, pause when out. Poster frame on hover-to-play mode. |
| `lottie` | `.json` | Interactive, responds to scroll/hover. < 100KB. |
| `rive` | `.riv` | State machine animations. Toggleable states. |
| `embed` | `iframe` | Sandboxed live demo. Click-to-activate. Static poster until interaction. |

### Playback Governance

```
viewportMediaStore manages all playback:

  Videos:     max 1 simultaneous  (highest in viewport wins)
  GIFs:       max 3 simultaneous  (priority: in-viewport + user-activated)
  Lottie:     max 5 simultaneous  (lightweight, higher budget)
  Embeds:     max 1 active        (resource-heavy, click-to-activate)
  
  prefers-reduced-motion:
    Videos  → show poster, play on explicit click only
    GIFs    → show first frame as static image
    Lottie  → reduce to single-state, no animation
    Embeds  → show poster only
```

---

## Project Showcase System

### Showcase Tiers

| Tier | Display | Media Budget | Example Projects |
|------|---------|-------------|------------------|
| **T1: Anchor** | Full editorial layout, hero media, deep narrative | 2 videos + 6 photos + 2 GIFs + 1 embed | vfx, dcal, cleo-3d-clone, bboy-analytics |
| **T2: Feature** | Grid card with hero image + short description | 1 video + 3 photos + 1 GIF | MusicBrowser, pixel-to-ascii-zig, demoforge, ghost-tracks |
| **T3: Mention** | Compact list row with thumbnail + one-liner | 1 photo or poster | ratio-css, conways-game-of-life, linktree |

### Showcase Detail Page: `/works/[slug]`

Uses the editorial layout by default:

```
┌──────────────────────────────────────────────────────────┐
│  ← Back to Works                                         │
│                                                          │
│  vfx — Terminal Graphics Engine                          │
│  Go · Rust/WASM · 2 stars · github.com/stussysenik/vfx  │
│  ═══════════════════════════════════════════════════════  │
│                                                          │
│  ┌──────────────────────────────┐  ┌──────────────────┐  │
│  │                              │  │ 15 GPU-quality   │  │
│  │  HERO: Demo video (Mux)     │  │ animations at    │  │
│  │  in terminal device frame   │  │ 60fps using      │  │
│  │                              │  │ braille chars +  │  │
│  │  ▶ 0:00 ━━━━━━━━━━━ 1:24   │  │ true color.      │  │
│  │                              │  │                  │  │
│  └──────────────────────────────┘  │ Languages: Go,   │  │
│                                    │ Rust, WASM       │  │
│  ┌────────┐ ┌────────┐ ┌────────┐ │                  │  │
│  │ Plasma │ │ Matrix │ │ Fire   │ │ Categories:      │  │
│  │ .gif   │ │ .gif   │ │ .gif   │ │ visual-computing │  │
│  └────────┘ └────────┘ └────────┘ │ terminal         │  │
│                                    │ animation        │  │
│  Architecture                      └──────────────────┘  │
│  ─────────────────────────────────────────────────────── │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Full-bleed: Architecture diagram (photo)             ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  Process                                                 │
│  ─────────────────────────────────────────────────────── │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Process walkthrough (Mux video, chapters)            ││
│  │ Ch 1: Braille rendering · Ch 2: WASM kernels · ...  ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  ← Previous: dcal          Next: pixel-to-ascii-zig →   │
└──────────────────────────────────────────────────────────┘
```

---

## Media Fixtures: The One, The Space, The Many

Every layout and media type is tested at three scales. Fixtures are seed data in `fixtures/` that populate Convex during development.

### The One (single item)

Proves the component renders one item beautifully. The atomic unit.

| Media Type | Fixture | Layout | Size Budget |
|-----------|---------|--------|-------------|
| Photo | `photo-single.json` | hero-split, full-bleed | AVIF ≤400KB |
| Video | `video-single.json` | hero-split, device frame | Poster ≤100KB |
| GIF | `gif-single.json` | inline, centered | ≤2MB (≤500KB as WebM) |
| Lottie | `lottie-single.json` | inline, centered | ≤100KB JSON |
| Embed | `embed-single.json` | hero-split, poster-first | Poster ≤100KB |
| Showcase | `showcase-minimal.json` | editorial | ≤500KB initial |

### The Space (comfortable set — the default)

Proves the layout works at a natural content volume. This is what most pages look like.

| Media Type | Fixture | Count | Layout | Total Budget |
|-----------|---------|-------|--------|-------------|
| Photos | `photo-set-6.json` | 6 | masonry 2×3 | ≤900KB |
| Videos | `video-set-4.json` | 4 | grid 2×2 posters | ≤400KB (posters) |
| GIFs | `gif-set-4.json` | 4 | filmstrip | ≤3.2MB |
| Showcases | `showcase-set-6.json` | 6 (2×T1, 4×T2) | editorial + grid | ≤2MB |
| Mixed | `mixed-set-8.json` | 8 (2P+2V+2G+2S) | editorial | ≤2.5MB |

### The Many (stress test — proves scaling)

Proves pagination, virtual scroll, and lazy loading work under load.

| Media Type | Fixture | Count | Layout | Budget | Strategy |
|-----------|---------|-------|--------|--------|----------|
| Photos | `photo-many-100.json` | 100 | masonry, paginate at 12 | ≤30KB/thumb | Virtual scroll |
| Videos | `video-many-16.json` | 16 | grid, poster-only | ≤100KB/poster | 1 active player |
| GIFs | `gif-many-12.json` | 12 | grid, hover-to-play | Poster first | Max 3 animating |
| Showcases | `showcase-many-50.json` | 50 | T1 editorial + T2 grid + T3 list | Tiered loading | T1 first, T2 lazy, T3 on scroll |

### Growth Scaling Table

How the system behaves as content grows:

| Content Count | Behavior | Viewport Budget | Strategy |
|---------------|----------|----------------|----------|
| 1 | Full-bleed, hero treatment | ≤500KB | Preload |
| 2–6 | Grid/editorial, all visible | ≤2MB | Eager above fold, lazy below |
| 7–12 | Grid, some below fold | ≤2MB viewport | Lazy below fold |
| 13–24 | Paginate at 12 OR masonry with lazy | ≤3MB per page | Pagination or infinite scroll |
| 25–50 | Filter + paginate, tier system | ≤3MB per page | T1 featured, T2 grid, T3 compact |
| 51–100 | Virtual scroll + search | ≤3MB viewport | Only render visible + 1 screen buffer |
| 100+ | Search-first, browse-second | ≤3MB viewport | Index + search, no browse-all |

---

## Performance Budgets

### Global Budgets

| Metric | Target | Hard Limit | Measurement |
|--------|--------|------------|-------------|
| LCP | < 2.0s | < 2.5s | Lighthouse, 4G throttle |
| FCP | < 1.0s | < 1.5s | Lighthouse |
| CLS | < 0.05 | < 0.1 | Lighthouse |
| TBT | < 200ms | < 300ms | Lighthouse |
| Initial payload | < 2MB | < 3MB | Network tab, no cache |
| JS bundle (media) | < 50KB gzipped | < 80KB | Build output |

### Per-Component Budgets

| Component | Render Time | Network | Notes |
|-----------|-------------|---------|-------|
| PhotoViewer | < 16ms | srcset auto-selects | Blur-up → full in < 300ms |
| MuxVideo | < 50ms to poster | Mux adaptive | HLS chunks on demand |
| AnimationPlayer (GIF) | < 16ms | Poster first | GIF loads in background |
| AnimationPlayer (Lottie) | < 32ms | < 100KB JSON | Parse + first frame |
| DeviceFrame | < 8ms | 0 (CSS-only) | Pure CSS chrome |
| MediaGrid (n=12) | < 50ms | Posters only | Virtual scroll above 24 |
| MediaGrid (n=100) | < 100ms | Visible thumbs only | Virtual scroll active |

### Network Strategy

```
Page load:
  1. HTML + critical CSS + JS bundle        (< 100KB)
  2. Above-fold media (preloaded)           (< 500KB)
  3. Blur-up placeholders (inline base64)   (< 10KB for 12 images)
  4. Convex subscription (data)             (< 20KB JSON)
  ─── interactive here (FCP < 1s) ───
  5. Below-fold media (lazy, IntersectionObserver)
  6. Video HLS manifest (on interaction)
  7. GIF data (viewport-triggered)
  8. Embed iframe (click-to-activate)
```

---

## Convex Schema

### New Tables

```typescript
// convex/schema.ts additions

mediaAssets: defineTable({
  // Core
  type: v.union(
    v.literal("photo"),
    v.literal("video"),
    v.literal("gif"),
    v.literal("lottie"),
    v.literal("embed"),
  ),
  title: v.string(),
  url: v.optional(v.string()),
  
  // Photo-specific
  srcset: v.optional(v.object({
    avif: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
    webp: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
    jpeg: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
  })),
  blurPlaceholder: v.optional(v.string()),
  colorProfile: v.optional(v.union(
    v.literal("srgb"),
    v.literal("display-p3"),
    v.literal("adobe-rgb"),
    v.literal("prophoto-rgb"),
  )),
  exif: v.optional(v.object({
    exposureTime: v.optional(v.string()),
    aperture: v.optional(v.string()),
    iso: v.optional(v.number()),
    focalLength: v.optional(v.string()),
    camera: v.optional(v.string()),
    lens: v.optional(v.string()),
  })),
  
  // Video-specific
  muxPlaybackId: v.optional(v.string()),
  duration: v.optional(v.number()),
  chapters: v.optional(v.array(v.object({
    time: v.number(),
    label: v.string(),
  }))),
  deviceFrame: v.optional(v.union(
    v.literal("ios"),
    v.literal("terminal"),
    v.literal("browser"),
    v.literal("none"),
  )),
  
  // Animation-specific
  posterUrl: v.optional(v.string()),
  loop: v.optional(v.boolean()),
  
  // Shared metadata
  width: v.optional(v.number()),
  height: v.optional(v.number()),
  aspectRatio: v.optional(v.string()), // "16:9", "4:3", "1:1", "9:16"
  fileSizeBytes: v.optional(v.number()),
  tags: v.optional(v.array(v.string())),
  order: v.number(),
  visible: v.boolean(),
})
  .index("by_type", ["type"])
  .index("by_order", ["order"])
  .index("by_visible", ["visible", "order"]),

projectShowcases: defineTable({
  slug: v.string(),
  title: v.string(),
  tagline: v.optional(v.string()),
  description: v.string(),
  githubUrl: v.optional(v.string()),
  liveUrl: v.optional(v.string()),
  languages: v.array(v.string()),
  categories: v.array(v.string()),
  year: v.optional(v.number()),
  captureType: v.union(
    v.literal("terminal-recording"),
    v.literal("ios-simulator"),
    v.literal("web-embed"),
    v.literal("screen-recording"),
    v.literal("photo-gallery"),
    v.literal("mixed"),
  ),
  media: v.array(v.object({
    assetId: v.id("mediaAssets"),
    label: v.string(),
    featured: v.optional(v.boolean()),
  })),
  tier: v.union(v.literal(1), v.literal(2), v.literal(3)),
  layout: v.optional(v.union(
    v.literal("editorial"),
    v.literal("grid"),
    v.literal("filmstrip"),
    v.literal("longform"),
  )),
  visible: v.boolean(),
  order: v.number(),
})
  .index("by_tier", ["tier"])
  .index("by_order", ["order"])
  .index("by_slug", ["slug"])
  .index("by_visible", ["visible", "order"]),

photoCollections: defineTable({
  slug: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  coverAssetId: v.optional(v.id("mediaAssets")),
  assetIds: v.array(v.id("mediaAssets")),
  layout: v.optional(v.union(
    v.literal("masonry"),
    v.literal("grid"),
    v.literal("filmstrip"),
    v.literal("editorial"),
  )),
  visible: v.boolean(),
  order: v.number(),
})
  .index("by_order", ["order"])
  .index("by_slug", ["slug"]),
```

### Convex Functions Pattern (Rails-style)

Every table gets the same function set:

```typescript
// convex/mediaAssets.ts — follows the convention

// Public queries
export const getVisible = query(...)         // visible=true, ordered
export const getByType = query(...)          // filter by type
export const getById = query(...)            // single asset

// Admin queries
export const getAll = query(...)             // all, including hidden

// Mutations
export const create = mutation(...)
export const update = mutation(...)
export const remove = mutation(...)           // renamed from delete (reserved word)
export const toggleVisibility = mutation(...)
export const reorder = mutation(...)
```

Same pattern for `projectShowcases.ts`, `photoCollections.ts`.

---

## Components

### New Components

| Component | Path | Lines (est) | Purpose |
|-----------|------|-------------|---------|
| `SectionShell.svelte` | components/layout/ | ~80 | Universal section wrapper: header, dividers, content slot, footer |
| `LayoutSwitcher.svelte` | components/layout/ | ~50 | Layout toggle icons for switchable sections |
| `PhotoViewer.svelte` | components/media/ | ~120 | Color-accurate `<picture>` with P3/sRGB, blur-up, EXIF |
| `AnimationPlayer.svelte` | components/media/ | ~150 | GIF/Lottie/Rive/embed unified player |
| `DeviceFrame.svelte` | components/media/ | ~80 | iOS/terminal/browser chrome (CSS-only) |
| `MediaGrid.svelte` | components/media/ | ~200 | Responsive grid with virtual scroll, layout-aware |
| `ProjectShowcase.svelte` | components/media/ | ~180 | Showcase card with editorial layout |
| `FilterBar.svelte` | components/ui/ | ~60 | Reusable filter chips |
| `Pagination.svelte` | components/ui/ | ~40 | Page dots, load more, scroll trigger |
| `MediaAdmin.svelte` | admin/ | ~250 | Admin CRUD for all media types |
| `ProjectShowcaseAdmin.svelte` | admin/ | ~200 | Admin for project showcases |
| `PhotoCollectionAdmin.svelte` | admin/ | ~150 | Admin for photo collections |

### Modified Components

| Component | Change |
|-----------|--------|
| `MuxVideo.svelte` | Add device frames, chapters, viewport-aware playback, poster pipeline |
| `GallerySection.svelte` | Use SectionShell, MediaGrid, FilterBar. Support layout switching. |
| `WorksSection.svelte` | Integrate ProjectShowcase cards. Link to /works/[slug] detail. |
| `OnePageView.svelte` | Register new section types in componentMap |
| `registry.ts` | Add media section types: photos, videos, showcases |

### New Section Components

| Section | Path | Purpose |
|---------|------|---------|
| `PhotosSection.svelte` | sections/ | Photography collections page |
| `VideosSection.svelte` | sections/ | Video showcase page |

---

## Stores

### Store Definitions

```typescript
// src/lib/stores/media.ts

import { writable, derived } from 'svelte/store';

/** Core media asset subscription */
export function createMediaStore(client: ConvexClient) {
  const assets = writable<MediaAsset[]>([]);
  
  // Subscribe to Convex
  client.onUpdate(api.mediaAssets.getVisible, {}, (data) => assets.set(data));
  
  return {
    subscribe: assets.subscribe,
    photos: derived(assets, $a => $a.filter(a => a.type === 'photo')),
    videos: derived(assets, $a => $a.filter(a => a.type === 'video')),
    gifs: derived(assets, $a => $a.filter(a => a.type === 'gif')),
    lotties: derived(assets, $a => $a.filter(a => a.type === 'lottie')),
    embeds: derived(assets, $a => $a.filter(a => a.type === 'embed')),
    byTag: (tag: string) => derived(assets, $a => $a.filter(a => a.tags?.includes(tag))),
  };
}

/** Display capability detection */
export function createColorProfileStore() {
  const gamut = writable<'p3' | 'srgb'>('srgb');
  const hdr = writable(false);
  const reducedMotion = writable(false);
  
  if (typeof window !== 'undefined') {
    // Detect wide gamut
    if (window.matchMedia('(color-gamut: p3)').matches) gamut.set('p3');
    
    // Detect HDR
    if (window.matchMedia('(dynamic-range: high)').matches) hdr.set(true);
    
    // Detect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.set(mq.matches);
    mq.addEventListener('change', (e) => reducedMotion.set(e.matches));
  }
  
  return { gamut, hdr, reducedMotion };
}

/** Viewport-based playback governance */
export function createViewportMediaStore() {
  const activeVideoId = writable<string | null>(null);
  const activeGifIds = writable<Set<string>>(new Set());
  const activeEmbedId = writable<string | null>(null);
  
  // IntersectionObserver registration
  function register(element: HTMLElement, id: string, type: 'video' | 'gif' | 'embed') {
    // ... observer logic that enforces max simultaneous limits
  }
  
  return { activeVideoId, activeGifIds, activeEmbedId, register };
}

/** Per-section layout preference */
export function createLayoutStore() {
  // Reads default from Convex pages.sections[].config.layout
  // Visitor override stored in localStorage
  const layouts = writable<Record<string, LayoutType>>({});
  
  return {
    subscribe: layouts.subscribe,
    get: (sectionId: string) => derived(layouts, $l => $l[sectionId] ?? 'grid'),
    set: (sectionId: string, layout: LayoutType) => {
      layouts.update(l => ({ ...l, [sectionId]: layout }));
      localStorage.setItem(`layout-${sectionId}`, layout);
    },
  };
}
```

---

## Routes & IA Map

### New Route Files

```
src/routes/
├── photos/
│   ├── +page.svelte          → PhotosSection (list of collections)
│   ├── +page.ts              → redirectIfOnePage
│   └── [slug]/
│       ├── +page.svelte      → PhotoCollection detail
│       └── +page.ts          → load collection by slug
├── videos/
│   ├── +page.svelte          → VideosSection (video grid)
│   └── +page.ts              → redirectIfOnePage
└── works/
    └── [slug]/
        ├── +page.svelte      → ProjectShowcase detail (NEW)
        └── +page.ts          → load showcase by slug
```

### Section Registry Additions

```typescript
// In registry.ts
{
  'photos-masonry': {
    label: 'Photos',
    icon: 'camera',
    category: 'media',
    component: 'photos',
    dataTable: 'photoCollections',
    defaultLayout: 'masonry',
    layouts: ['masonry', 'grid', 'filmstrip', 'editorial'],
  },
  'videos-grid': {
    label: 'Videos',
    icon: 'play',
    category: 'media',
    component: 'videos',
    dataTable: 'mediaAssets',
    defaultLayout: 'grid',
    layouts: ['grid', 'filmstrip', 'list'],
  },
}
```

---

## Admin Integration

### Media Admin Panel

Accessible from `/admin` → media management tab. Three sub-sections:

1. **Media Assets** — CRUD for all media types. Upload, set metadata, assign to projects/collections.
2. **Project Showcases** — manage showcase entries, assign media, set tiers, reorder.
3. **Photo Collections** — create/manage collections, assign photos, set cover image.

### Admin Workflow

```
Upload photo → Sharp pipeline runs → srcset + AVIF + blur generated →
  → mediaAsset created in Convex → assign to collection or showcase →
  → visible on site immediately (Convex real-time)
```

For videos: upload to Mux (external) → paste playback ID → mediaAsset created → assign.

For GIFs: upload → gifsicle optimization → poster frame extracted → mediaAsset created.

---

## Common Lisp Moat (Phase 2)

### Vision

Common Lisp as the **build-time orchestrator** for the media pipeline. Not replacing Sharp/Mux — orchestrating them.

```lisp
;; media-pipeline.lisp — the portfolio's secret weapon

(defpipeline hero-photo
  "Process a hero photo for full-bleed display"
  (:input :raw-photo)
  (read-icc-profile)
  (generate-srcset :widths '(640 1024 1536 2048 3840))
  (when (wide-gamut-p *current-profile*)
    (encode :avif :quality 80 :color-space :display-p3))
  (encode :webp :quality 85 :color-space :srgb)
  (encode :jpeg :quality 90 :color-space :srgb)
  (blur-placeholder :width 32)
  (extract-exif)
  (:output :media-asset))

(defpipeline terminal-capture
  "Process a terminal animation capture"
  (:input :screen-recording)
  (extract-poster-frame :time 2.0)
  (process-poster (hero-photo))
  (optimize-gif :colors 256 :lossy 80)
  (:output :media-asset))

;; Compose pipelines
(defpipeline showcase-bundle
  "Process all media for a project showcase"
  (:input :project-dir)
  (map-assets
    (:photos    (hero-photo))
    (:videos    (mux-upload))
    (:gifs      (terminal-capture))
    (:embeds    (validate-url)))
  (generate-fixture-json)
  (:output :showcase-entry))
```

### Implementation Path

1. SBCL as build dependency (optional, pipeline falls back to plain Node scripts)
2. CL orchestrates Sharp via shell commands or FFI
3. Pipeline definitions live in `media-pipeline/` directory
4. `bun run pipeline:photo path/to/photo.jpg` invokes CL → Sharp → Convex

### Why CL for This

- **Macros** — pipeline composition is a macro problem. Each `defpipeline` generates optimized, static code.
- **REPL** — iterate on pipeline transformations interactively. See results before committing.
- **Statement piece** — "my portfolio's image pipeline is a Common Lisp DSL" is memorable.
- **Expandable** — same macro system later drives generative art, content generation, CI automation.

---

## White-Label Foundation

The media infrastructure is built with eventual white-labeling in mind:

- **All content from Convex** — zero hardcoded content
- **All styles via CSS custom properties** — theme-switchable already
- **All layouts data-driven** — Convex stores layout preferences
- **Convention-based file structure** — Rails-style, predictable for any developer
- **Component library is framework-agnostic in design** — Svelte 5 implementation, but interfaces are portable

This is your voice first. White-label later means: swap Convex data, swap CSS variables, same infrastructure.

---

## Responsive Design

### Breakpoints

Using the existing portfolio breakpoints:

| Name | Width | Columns | Layout Behavior |
|------|-------|---------|----------------|
| `mobile` | 320–640px | 1 | Stack everything. Filmstrip → vertical scroll. Editorial → single column. |
| `tablet` | 641–1024px | 2 | Masonry 2-col. Grid 2-col. Editorial side-by-side. |
| `desktop` | 1025–1536px | 3–4 | Full layouts. Masonry 3-col. Grid 3–4 col. |
| `wide` | 1537–3840px | 4–6 | Masonry 4-col. Grid up to 6-col. Full-bleed hero. |

### Layout Responsive Behavior

| Layout | Mobile | Tablet | Desktop | Wide |
|--------|--------|--------|---------|------|
| editorial | single col stack | 2 col (60/40) | 2 col (66/33) | 2 col (66/33), wider gutters |
| masonry | 1 col | 2 col | 3 col | 4 col |
| filmstrip | vertical stack | horizontal scroll | horizontal scroll | horizontal scroll, larger items |
| longform | full width, 16px pad | centered 600px | centered 720px | centered 720px |
| grid | 1 col | 2 col | 3–4 col | 4–6 col |
| list | full width | full width | max 900px centered | max 900px centered |
| hero-split | stacked | side-by-side | side-by-side | side-by-side, taller |
| carousel | swipe | swipe + arrows | arrows + keyboard | arrows + keyboard |

### Touch Interactions

| Interaction | Mobile/Tablet | Desktop |
|------------|---------------|---------|
| Photo zoom | Pinch + double-tap | Click to lightbox |
| Video play | Tap poster | Click poster or hover-reveal play button |
| GIF play | Tap to toggle | Hover to play, tap to toggle |
| Layout switch | Dropdown | Icon toggle bar |
| Filter | Bottom sheet | Inline chips |
| Showcase detail | Full-screen slide | Side panel or new page |

---

## Acceptance Criteria

### Phase 1: Media Kernel (MVP)

1. `SectionShell` wraps all existing sections with consistent header/divider/footer
2. `PhotoViewer` renders single photo with P3 AVIF on supported displays, sRGB WebP fallback, blur-up placeholder
3. `MuxVideo` (expanded) plays video in device frame (iOS, terminal, browser)
4. `AnimationPlayer` renders GIF with play/pause, respects viewport limits
5. `MediaGrid` renders 6 items in grid layout, 24 items with pagination, 100 with virtual scroll
6. `LayoutSwitcher` toggles between at least 3 layouts per section, persists to localStorage
7. `colorProfileStore` correctly detects P3, HDR, and reduced-motion
8. `viewportMediaStore` enforces max 1 video, max 3 GIFs simultaneously

### Phase 2: Routes & Data

9. `/photos` route renders photo collections in masonry layout
10. `/photos/[slug]` renders single collection with editorial layout
11. `/videos` route renders video grid with poster-first loading
12. `/works/[slug]` renders project showcase detail with editorial layout
13. All new routes register in Convex `pages` table and appear in nav
14. `projectShowcases` table populated with fixture data (6 showcases: 2×T1, 4×T2)
15. `mediaAssets` table populated with fixture data (photo-set-6, video-set-4, gif-set-4)

### Phase 3: Admin & Pipeline

16. `MediaAdmin` provides CRUD for all 5 media types
17. `ProjectShowcaseAdmin` manages showcase entries with media assignment
18. `PhotoCollectionAdmin` manages collections with drag-to-reorder
19. Build-time photo pipeline: input JPEG → output AVIF + WebP + blur + EXIF in Convex
20. EXIF overlay toggleable on PhotoViewer

### Phase 4: Common Lisp (optional)

21. `defpipeline` macro compiles to Sharp invocations
22. `bun run pipeline:photo` processes a photo via CL → Sharp → Convex
23. At least one generative art piece rendered by CL displayed on portfolio

### Performance Gates (all phases)

24. LCP < 2.5s on any page with media (Lighthouse, simulated 4G)
25. CLS < 0.1 (blur-up placeholders prevent layout shift)
26. photo-collection-100 fixture: < 3MB in viewport, virtual scroll active
27. video-grid-16 fixture: only 1 video playing at any time
28. All above-fold images preloaded, all below-fold lazy

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| AVIF browser support gaps | Medium | WebP/JPEG fallback chain, feature detection |
| ICC profile edge cases in Sharp | Low | Test with dcal-calibrated display, ProPhoto RGB test fixture |
| Mux free tier limits | Low | 10GB storage sufficient for initial showcase, monitor usage |
| CL build dependency (Phase 2) | Low | CL layer is optional, Node pipeline works standalone |
| Static adapter + srcset | Medium | Build-time processing generates all URLs, no runtime transforms |
| Layout switching complexity | Medium | CSS-only layouts (no JS layout engines), progressive enhancement |
| Virtual scroll accessibility | Medium | Proper ARIA roles, keyboard navigation, screen reader announcements |
| Large fixture data in Convex | Low | Fixtures are dev-only seed data, production uses real content |

---

## Non-Goals

- No CDN service (Cloudinary/imgix) — self-hosted pipeline, zero cost
- No video recording/capture within the portfolio — capture externally, display here
- No real-time video transcoding — Mux handles adaptive bitrate
- No 3D model viewer — separate scope
- No CMS migration — Convex is the only backend
- No server-side rendering — static adapter stays
- No custom video player UI — Mux player handles playback UX
