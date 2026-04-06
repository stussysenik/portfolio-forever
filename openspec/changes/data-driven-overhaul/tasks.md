# Tasks: Data-Driven Portfolio Overhaul

## Phase 1: Labs Cleanup
- [x] Remove LEGEND section markup from LabsSection.svelte
- [x] Remove BROWSER REQUIREMENTS section markup from LabsSection.svelte
- [x] Remove associated CSS rules for both sections

## Phase 2: Fix Blog + Remove Sanity
- [x] Add `seedBlog` mutation to `convex/seedAll.ts`
- [x] Wire `seedBlog` into admin init in `src/routes/admin/+page.svelte`
- [x] Delete `src/lib/sanity/` directory (client.ts, queries.ts, types.ts)
- [x] Remove `@sanity/client` from package.json + run `bun install`

## Phase 3: Hero ASCII Art
- [x] Add `showAsciiWave` to heroConfig in `convex/schema.ts`
- [x] Update `convex/hero.ts` upsertHeroConfig with showAsciiWave
- [x] Create `src/lib/components/AsciiWave.svelte` — sine-wave ASCII animation
- [x] Wire HeroSection to render AsciiDonut + AsciiWave from heroConfig
- [x] Add ASCII DONUT + ASCII WAVE toggles in InlineSectionConfig

## Phase 4: Generalized Typography Controls
- [x] Add `LINE_HEIGHT_SCALE`, `FONT_SIZE_SCALE`, `TYPOGRAPHY_DEFAULTS` to constants.ts
- [x] Create `src/lib/admin/TypographyControls.svelte` — reusable component
- [x] Refactor InlineSectionConfig to use TypographyControls for ALL section types
- [x] Create `src/lib/utils/section-typography.ts` utility

## Phase 5: Data-Driven Content
- [x] Add `heroCaseStudies` table to `convex/schema.ts`
- [x] Create `convex/heroCaseStudies.ts` with CRUD mutations
- [x] Add `seedHeroCaseStudies` mutation to `convex/seedAll.ts`
- [x] Wire seed + subscription in admin `+page.svelte`
- [x] Replace hardcoded case studies in HeroSection with Convex loop
- [x] Make nav name come from cvProfile in `+layout.svelte`
- [x] Rewrite CvSection to render structured CV from Convex data

## Phase 6: Admin Completeness
- [x] Register heroCaseStudies in `section-editors.ts`
- [x] Create `HeroCaseStudyAdmin.svelte` for inline case study editing
- [x] Export HeroCaseStudyAdmin from admin index.ts
- [x] Build verification (`vite build`)
- [x] Type check (`npx tsc --noEmit`)
