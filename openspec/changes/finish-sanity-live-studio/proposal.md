# Proposal: Finish Sanity Live Studio

## Why

The Sanity integration is architecturally present but editorially unfinished.

What is already true:

- Sanity Studio mounts under Astro at `/admin/content/studio`
- the Presentation tool mounts at `/admin/content/studio/presentation`
- draft-mode enable/disable routes exist
- public Astro routes already read Sanity content and support visual-editing overlays

What is not yet true:

- `/admin/content` is still mostly a handoff page, not a real live editorial workspace
- the admin shell does not expose a clear "Studio / Presentation / Route preview" operating flow in one place
- the current lane does not make readiness and environment truth visible enough for future agents or editors

The next build should treat the Sanity lane as finished enough to operate daily, not merely wired enough to demo.

## What Changes

- Turn `/admin/content` into a real editorial workspace with embedded Studio and Presentation surfaces.
- Make the selected editorial document drive the Studio focus target directly from the admin lane.
- Surface editorial readiness clearly: Sanity env, draft-mode capability, visual-editing capability, Studio route, Presentation route.
- Keep the route-true Astro preview deck in the same lane so editors do not leave the product to validate public output.

## Success Criteria

- [ ] `/admin/content` embeds the actual Studio route inside the admin lane.
- [ ] `/admin/content` can switch between embedded Studio and Presentation surfaces without leaving the lane.
- [ ] Focused document context still deep-links correctly into the selected Sanity document when available.
- [ ] Editorial readiness is visible from the page itself rather than buried in code assumptions.
- [ ] The page still builds cleanly and preserves the route-true preview deck.

## Non-Goals

- Completing every remaining Sanity preview verification task across all routes
- Rebuilding Sanity Studio itself beyond the workspace shell this repo hosts
- Expanding React usage beyond the existing Sanity/editorial boundary
