# Tasks: Media Infrastructure — Color-Accurate, Batteries-Included

## Phase 1: Media Kernel (MVP)

- [x] 1.1 Create `SectionShell.svelte` wrapper component.
- [x] 1.2 Integrate `SectionShell` into an existing section (`LikesSection.svelte`).
- [x] 1.3 Create `PhotoViewer.svelte` with P3 AVIF logic and color profile detection.
- [x] 1.4 Create `DeviceFrame.svelte` for CSS-only device chrome.
- [x] 1.5 Expand `HighFiMedia.svelte` to use `DeviceFrame` for videos.
- [x] 1.6 Create `AnimationPlayer.svelte` for GIF handling.
- [x] 1.7 Integrate `AnimationPlayer` into `HighFiMedia.svelte`.
- [x] 1.8 Create `MediaGrid.svelte` with multiple layout support (grid, masonry, filmstrip).
- [x] 1.9 Integrate `MediaGrid` into `GallerySection.svelte`.
- [x] 1.10 Create `LayoutSwitcher.svelte` component.
- [x] 1.11 Integrate `LayoutSwitcher` into `SectionShell` and wire up to sections.
- [x] 1.12 Create `viewportMediaStore.ts` for playback governance.
- [x] 1.13 Implement IntersectionObserver logic in `viewportMediaStore`.
- [x] 1.14 Apply `viewportMediaStore` to `MuxVideo` and `AnimationPlayer`.

## Phase 2: Routes & Data
- [x] 2.1 Implement `/photos` route.
- [x] 2.2 Implement `/photos/[slug]` detail route.
- [x] 2.3 Implement `/videos` route.
- [x] 2.4 Implement `/works/[slug]` showcase detail route.
- [x] 2.5 Populate Convex tables with fixture data.

## Phase 3: Admin & Pipeline
- [x] 3.1 Create `MediaAdmin.svelte` for CRUD operations.
- [x] 3.2 Create `ProjectShowcaseAdmin.svelte`.
- [x] 3.3 Create `PhotoCollectionAdmin.svelte`.
- [x] 3.4 Build Node/Sharp image processing pipeline.
