# Proposal: Finish Astro Parity

## Why
The Astro migration foundation is correct, but the public site is still in an in-between state:
- Astro is the active host runtime, but only part of the public route surface has been ported.
- The migrated pages preserve shared tokens and some interactions, but they do not yet inherit the full visual and behavioral language of the legacy SvelteKit site.
- Sanity preview and visual editing are wired, but the stack still needs a strict “closeout” pass so the preview loop is trusted, route parity is completed, and runtime controls like the WIP banner work on the Astro public shell.

This change turns the migration from “architecturally valid” into “shippable and stylistically faithful.”

## Problem Statement
The current Astro site can build and preview, but three important gaps remain:

1. **Route parity is incomplete**
   Astro currently covers `/`, `/works`, `/process`, `/cv`, `/blog`, and `/blog/[slug]`, while legacy public routes still exist only in `src/routes`.

2. **Style inheritance is partial**
   The migrated pages use shared global tokens, but the old site’s real look lived in route-level Svelte layout logic, section components, and page-specific composition. Rebuilding only the shell produced an output that reads cleaner than a scaffold, but still not like the actual site being migrated.

3. **Runtime parity is incomplete**
   The old SvelteKit host handled layout config, feature flags, and WIP banner behavior in the public shell. The Astro public shell does not yet consume those same runtime controls, so admin/system controls are not fully reflected in the live public host.

## What Changes
Finish the Astro migration by closing four parity tracks in order:

1. **Canonical visual system extraction**
   Define the real public shell, type hierarchy, spacing rhythm, and section-level patterns from the legacy SvelteKit implementation as the migration source of truth.

2. **Public route parity**
   Port all remaining public routes from `src/routes` into Astro routes, reusing Svelte components where fidelity is already embodied in component code.

3. **Runtime control parity**
   Make the Astro public host consume Convex-backed site config, flags, and WIP banner state so `/admin/system` changes affect the actual public site.

4. **Preview trustworthiness**
   Finish the Sanity preview loop with route-by-route acceptance criteria so “what the editor sees” and “what the public route renders” are treated as the same product surface.

## Principles

### 1. Port, do not cosmetically reinterpret
If the legacy Svelte route or section already contains the right interaction and visual treatment, migrate that implementation or its logic directly instead of re-authoring a simplified Astro-only approximation.

### 2. Astro owns routing, not design authorship
Astro is the correct host runtime, but it should not be used as a reason to flatten the site into generic static pages. The design language remains defined by the portfolio’s existing section system and route composition.

### 3. Sanity and Convex boundaries stay intact
- Sanity remains the editorial source for authored content and preview.
- Convex remains the source of truth for composition, flags, nav order, and live runtime state.
- Astro renders the combined result.

### 4. Preview is a release gate
No public route is considered migrated until draft-mode preview, visual-editing handoff, and published rendering are all verified for that route.

## Success Criteria
- [ ] Every legacy public route has an Astro equivalent or an explicit removal decision.
- [ ] The Astro public shell consumes Convex runtime controls used by the live site, including the WIP banner.
- [ ] The migrated Astro pages preserve the legacy site’s visual hierarchy, spacing rhythm, and route-specific styling instead of fallback shell styling.
- [ ] Sanity preview works for all Sanity-backed public routes and routes editors back into the correct editorial surface.
- [ ] Legacy SvelteKit host routing can be removed without losing public behavior.
