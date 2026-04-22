# Design: Finish Sanity Live Studio

## Scope

This change finishes the editorial host surface, not the entire preview ecosystem.

The important distinction is:

- the Studio route itself already exists
- the missing piece is the operating workspace around it

## Decisions

### 1. `/admin/content` becomes the editorial cockpit

Instead of acting as a page of links plus a preview deck, `/admin/content` should become a composed editorial cockpit:

- readiness/status strip
- focused document handoff
- embedded workspace with two modes:
  - `studio`
  - `presentation`
- route-true preview deck below

### 2. Workspace mode is server-rendered via query param

Avoid unnecessary client state.

Decision:

- `?tool=studio` and `?tool=presentation` drive the embedded surface
- `?document=<type>` continues to drive focus context

This keeps the page shareable and deterministic.

### 3. Embed the actual Studio and Presentation routes

Do not mock or re-skin the Studio.

Decision:

- embed `/admin/content/studio`
- embed `/admin/content/studio/presentation`
- use the resolved document intent href when focused document context is available and the selected tool is `studio`

### 4. Readiness should be explicit

The editorial lane should state the truth of its own environment:

- Sanity project/dataset configured or fallback mode
- draft-mode token available or not
- visual editing allowed or not
- Studio route available
- Presentation route available

## Relationship to Existing Changes

- Closes the editorial-host gap left open by `astro-full-migration-foundation`
- Supports the still-open preview-trust tasks in `finish-astro-parity`
- Strengthens the `/admin` to public-shell relationship required by `reference-superset-standardization`
