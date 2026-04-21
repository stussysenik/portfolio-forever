# Proposal: Unify Public Shell, Works Backbone, and Clean Writer Port

## Why

The Astro migration is functional but still visually split across multiple branch eras:
- the current Astro shell carries stronger homepage content density,
- the April 18 production build carries the stronger desktop shell,
- `/works` still reads as an interim migration surface instead of the portfolio's real “show the thing” index,
- the portfolio already references `typewriter that doesn't delete, or can't go back`, but the full product still lives outside the repo.

This change consolidates those strengths into one public backbone and brings `clean-writer` into the repo as a first-class route.

## What Changes

1. Adopt the stronger public shell patterns from the best production build:
   - left-rail desktop framing
   - mobile top-bar fallback
   - fixed terminal/status footer
   - runtime-aware navigation and connections

2. Recompose the Astro homepage and all public work surfaces around a shared works backbone:
   - keep the denser hero/index feel already present in Astro
   - restore the works-first scanning behavior from the legacy site
   - support richer per-work media inputs, including Mux playback IDs
   - define a single interaction pattern for preview, internal route, and external/original link

3. Port `clean-writer` into the portfolio repo as a dedicated route and embeddable surface:
   - mount the actual React app source inside Astro
   - isolate its CSS/runtime dependencies so it does not contaminate the portfolio shell
   - make it available as:
     - an internal full route
     - an embeddable interactive preview inside `/works`
     - an external/original link back to `clean-writer.mxzou.com`

## Rollout Shape

### Phase 1: Canonical shell
- lock the new desktop/mobile shell behavior
- ensure preview ribbon, WIP banner, nav state, and footer still work

### Phase 2: Works backbone
- normalize Convex + fallback work data into one public model
- define rendering priority for each work surface
- update homepage and `/works` to consume that model

### Phase 3: Clean Writer import
- vendor the source
- mount it on a dedicated route
- enable the same route to power an in-card interactive preview

### Phase 4: Verification
- build
- route smoke checks
- focused regression checks for shell, `/works`, and `clean-writer`

## Success Criteria

- [ ] Desktop public pages use the unified left-rail shell without losing runtime nav/config behavior.
- [ ] Homepage and `/works` share a richer works data model instead of static placeholder-only rendering.
- [ ] `/works` can render live embeds, static previews, video previews, or Mux playback from one mapping layer.
- [ ] `clean-writer` runs inside this repo as a first-class route and is linked from the works index.
- [ ] The Astro build passes after the integration.
