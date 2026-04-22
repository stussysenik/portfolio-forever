# Tasks: Media Infrastructure — Phase 2: Routes & Data

## Goal
Implement the core routes for media showcases, project details, and seed the database with high-fidelity fixtures.

## 2.1 Convex Schema Update
- [x] Add `mediaAssets`, `projectShowcases`, and `photoCollections` tables to `convex/schema.ts`.
- [x] Implement CRUD functions in `convex/mediaAssets.ts`, `convex/works.ts` (expansion), and `convex/gallery.ts` (expansion).

## 2.2 Route Implementation (Astro)
- [x] Create `src/pages/photos/index.astro`.
- [x] Create `src/pages/photos/[slug].astro`.
- [x] Create `src/pages/videos.astro`.
- [x] Create `src/pages/works/[slug].astro`.

## 2.3 Component Integration
- [x] Build `src/lib/components/media/ProjectShowcaseDetail.svelte` for the `/works/[slug]` page.
- [x] Build `src/lib/components/media/PhotoCollectionDetail.svelte` for the `/photos/[slug]` page.
- [x] Ensure all detail pages use the magazine-editorial layout system.

## 2.4 Data Seeding
- [x] Create `convex/seedMedia.ts` to populate tables with fixture data.
- [x] Include T1 Anchor, T2 Feature, and T3 Mention showcases.
- [x] Verify data appears correctly in both OnePageView and dedicated routes.

## 2.5 Navigation & Registry
- [x] Update `src/lib/data/registry.ts` with new media sections.
- [x] Ensure Convex `pages` table reflects the new navigation order.
