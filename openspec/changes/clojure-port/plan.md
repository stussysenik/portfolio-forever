# PLAN-001: Clojure Port Implementation

## Phase 1: Foundation (Data & Utils)
- [ ] Audit `clj/src/portfolio/data/` for parity with `src/lib/data/`
- [ ] Port `src/lib/utils/section-typography.ts` to `clj/src/portfolio/utils/section_typography.cljs`
- [ ] Port `src/lib/utils/parse-math.ts` to `clj/src/portfolio/utils/parse_math.cljs`
- [ ] Update `tests/clojure/convergence.test.ts` to include missing utils

## Phase 2: Reactive Logic (Stores & Core)
- [ ] Port `src/lib/stores/siteMode.ts` to `clj/src/portfolio/stores/site_mode.cljs` (complete port)
- [ ] Port `src/lib/stores/controls.ts` to `clj/src/portfolio/stores/controls.cljs` (complete port)
- [ ] Port `src/lib/stores/toast.ts` to `clj/src/portfolio/stores/toast.cljs`

## Phase 3: Section Logic (The Big Port)
- [ ] Port logic for `HeroSection.svelte` to `clj/src/portfolio/sections/hero.cljs`
- [ ] Port logic for `WorksSection.svelte` to `clj/src/portfolio/sections/works.cljs`
- [ ] Port logic for `CvSection.svelte` to `clj/src/portfolio/sections/cv.cljs`
- [ ] Port logic for `BlogSection.svelte` to `clj/src/portfolio/sections/blog.cljs`
- [ ] Port logic for `GallerySection.svelte` to `clj/src/portfolio/sections/gallery.cljs`
- [ ] Port logic for `TerminalSection.svelte` to `clj/src/portfolio/sections/terminal.cljs`

## Phase 4: Integration
- [ ] Swap imports in `src/routes/+page.svelte` to use `clj/out/portfolio/`
- [ ] Swap imports in `src/lib/sections/*.svelte` to use `clj/out/portfolio/`

## Phase 5: Verification
- [ ] Run `bun run test:unit -- tests/clojure/convergence.test.ts`
- [ ] Run `bun run test` (Playwright)
- [ ] Final visual check
