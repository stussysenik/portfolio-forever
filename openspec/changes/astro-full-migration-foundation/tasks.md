# Tasks: Astro Full Migration Foundation

Ordered to prove the architecture before bulk porting.

## 1. Spec and dependency alignment

- [x] 1.1 Audit `data-driven-overhaul` and related docs for assumptions that Sanity was removed permanently
- [x] 1.2 Add a short note in migration docs that this change reverses the prior Sanity removal decision
- [x] 1.3 Confirm package-level additions needed for Astro, `@astrojs/svelte`, `nanostores`, Sanity client/studio/visual-editing packages

## 2. Astro foundation

- [x] 2.1 Install Astro and Svelte integration
- [x] 2.2 Create Astro config and top-level app structure
- [x] 2.3 Port the root layout shell into Astro with existing design tokens preserved
- [x] 2.4 Create Astro routes for `/` and `/admin`
- [ ] 2.5 Remove SvelteKit host-specific routing/bootstrap once Astro is the primary runtime

## 3. Shared UI state

- [x] 3.1 Add `src/stores/` Nano Store primitives for theme, nav state, preview mode, and admin shell state
- [ ] 3.2 Replace any host-level Svelte store assumptions that need to be read from Astro-mounted islands
- [x] 3.3 Verify one shared store can be read and mutated across multiple Svelte islands on the same Astro page

## 4. Sanity scaffold

- [x] 4.1 Reintroduce Sanity client configuration
- [x] 4.2 Add Sanity Studio route mounting for `/admin/content`
- [x] 4.3 Define initial schemas for profile/hero, blog post, case study, and media metadata
- [x] 4.4 Add Astro-side fetch utilities for published and preview content
- [x] 4.5 Add visual editing / draft preview support for Astro public routes

## 5. Convex boundary preservation

- [ ] 5.1 Keep Convex page composition as the source of truth for page/section order and flags
- [ ] 5.2 Define how Convex composition records reference Sanity documents
- [ ] 5.3 Keep live widgets and runtime state in Convex, not Nano Stores or Sanity
- [x] 5.4 Verify the homepage can render one Convex-backed live widget alongside Sanity-backed content

## 6. Homepage proof slice

- [x] 6.1 Port homepage layout and global shell to Astro
- [x] 6.2 Render hero/profile copy from Sanity
- [x] 6.3 Render a Convex-backed “live” badge or equivalent runtime widget
- [x] 6.4 Mount at least one Svelte 5 island on the Astro homepage
- [x] 6.5 Verify Nano Store state is shared between the layout and the island

## 7. Admin shell split

- [x] 7.1 Create the Astro `/admin` host shell
- [x] 7.2 Add `/admin/content` for Sanity Studio/editorial workflows
- [x] 7.3 Add `/admin/system` for the custom Convex-backed Svelte SPA
- [x] 7.4 Preserve the existing admin design language where it still serves the new shell
- [x] 7.5 Ensure visual-editing “edit” handoff routes into the editorial tab correctly

## 8. Verification

- [x] 8.1 Run typecheck/build for the Astro host
- [x] 8.2 Verify homepage static render + island hydration
- [x] 8.3 Verify Convex live data still subscribes correctly from Svelte islands
- [ ] 8.4 Verify Sanity preview mode renders draft content on Astro pages
  Wire-up is in place with cookie-backed draft mode, Studio Presentation config, and React visual-editing overlays; a credentialed manual pass is still required against a live Sanity project.
- [x] 8.5 Verify `/admin/content` and `/admin/system` are both reachable and coherent

## 9. Follow-up migration work

- [x] 9.1 Port blog routes
- [ ] 9.2 Port works/case-study routes
- [ ] 9.3 Port remaining public routes
- [ ] 9.4 Remove obsolete SvelteKit-only files and update docs/tests once parity is reached
