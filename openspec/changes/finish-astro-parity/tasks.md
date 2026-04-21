# Tasks: Finish Astro Parity

## 1. Lock the migration reference

- [x] 1.1 Create a route parity matrix from `src/routes` to `src/pages`
- [x] 1.2 Mark each unmatched legacy public route as `ported`, `merged`, or `removed`
- [ ] 1.3 Freeze the legacy SvelteKit public routes as the visual parity reference until closeout

### Route Parity Matrix

| Legacy route | Astro route | Status |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | ported |
| `/works` | `src/pages/works.astro` | ported |
| `/process` | `src/pages/process.astro` | ported |
| `/cv` | `src/pages/cv.astro` | ported |
| `/blog` | `src/pages/blog/index.astro` | ported |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | ported |
| `/academia` | `src/pages/academia.astro` | ported |
| `/gallery` | `src/pages/gallery.astro` | ported |
| `/gifts` | `src/pages/gifts.astro` | ported |
| `/labs` | `src/pages/labs.astro` | ported |
| `/likes` | `src/pages/likes.astro` | ported |
| `/media` | `src/pages/media.astro` | ported |
| `/minor` | `src/pages/minor.astro` | ported |
| `/os` | `src/pages/os.astro` | ported |
| `/scratchpad` | `src/pages/scratchpad.astro` | ported |
| `/talks` | `src/pages/talks.astro` | ported |
| `/terminal` | `src/pages/terminal.astro` | ported |

## 2. Restore canonical public shell behavior

- [x] 2.1 Audit `src/routes/+layout.svelte` for public-shell behavior still missing in Astro
- [x] 2.2 Port missing shell behavior into `src/layouts/BaseLayout.astro`
- [x] 2.3 Move any remaining public-only shell styling out of temporary placeholders and into the canonical Astro shell
- [x] 2.4 Make the Astro public shell consume Convex-backed public site config, not just nav items

## 3. Restore runtime visual controls

- [x] 3.1 Expose the public feature flags needed by the Astro host through server utilities
- [x] 3.2 Port WIP banner visibility/message behavior to the Astro public host
- [x] 3.3 Verify `/admin/system` mutations affect the Astro public surface where intended

## 4. Finish route parity

- [x] 4.1 Port `/academia`
- [x] 4.2 Port `/gallery`
- [x] 4.3 Port `/gifts`
- [x] 4.4 Port `/labs`
- [x] 4.5 Port `/likes`
- [x] 4.6 Port `/media`
- [x] 4.7 Port `/minor`
- [x] 4.8 Port `/os`
- [x] 4.9 Port `/scratchpad`
- [x] 4.10 Port `/talks`
- [x] 4.11 Port `/terminal`

## 5. Prefer fidelity over rewrites

- [x] 5.1 Reuse existing Svelte section/components where the old implementation already contains the right styling and behavior
- [x] 5.2 Eliminate temporary Astro-only route treatments that do not match the legacy route identity
- [ ] 5.3 Update shared tokens only where needed to support actual parity, not speculative redesign

## 6. Finish preview trust

- [ ] 6.1 Verify Sanity preview and visual editing for `/`
- [ ] 6.2 Verify Sanity preview and visual editing for `/works`
- [ ] 6.3 Verify Sanity preview and visual editing for `/cv`
- [ ] 6.4 Verify Sanity preview and visual editing for `/process`
- [ ] 6.5 Verify Sanity preview and visual editing for `/blog`
- [x] 6.6 Add route-level preview acceptance tests for the migrated Sanity-backed pages

Note: query-driven preview state and editorial handoff are now covered by Playwright. Full Sanity visual-editing overlay verification still requires `SANITY_API_READ_TOKEN` in the local environment.

## 7. Clean up and remove legacy host ownership

- [x] 7.1 Update stale Astro tests to reflect current route/data expectations
- [x] 7.2 Remove obsolete SvelteKit host-routing/bootstrap files once parity is complete
- [x] 7.3 Update migration docs to state that Astro is now the only production host
