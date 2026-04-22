# Tasks: Finish Sanity Live Studio

## 1. Research / contract

- [x] Confirm Studio route mounts at `/admin/content/studio`
- [x] Confirm Presentation route mounts at `/admin/content/studio/presentation`
- [x] Confirm `/admin/content` is currently a handoff page rather than a finished workspace

## 2. Editorial workspace shell

- [x] Add a server-side status/readiness model for the Sanity editorial lane
- [x] Rework `/admin/content` to support `tool=studio|presentation`
- [x] Embed the selected workspace surface inside the editorial lane
- [x] Preserve focused document deep-linking when a document target is selected

## 3. Validation

- [x] `bun run check`
- [x] `bun run build`
- [x] Verify `/admin/content`, `/admin/content/studio`, and `/admin/content/studio/presentation` all resolve locally

## Validation Notes

- [x] `/admin/content` now renders a real editorial cockpit with readiness cards, embedded Studio/Presentation tabs, focused document routing, and the existing route-true preview deck
- [x] Local route checks confirmed `200 OK` for `/admin/content`, `/admin/content/studio`, and `/admin/content/studio/presentation`
- [x] `bun run check` passed with 0 errors and 1 existing hint (`src/pages/photos/index.astro` unused import)
- [x] `bun run build` passed; Sanity Studio route still emits the existing build warning from `@sanity/astro` about `getStaticPaths()` on the bundled studio route, but the build completes successfully
