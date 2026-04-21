# Design: Unify Public Shell, Works Backbone, and Clean Writer Port

## Context

This is not a redesign-from-zero task. The correct output is a consolidation:
- shell behavior from the strongest recent production build,
- content density from the current Astro branch,
- works/media behavior from the legacy portfolio,
- actual product code from the standalone `clean-writer` app.

## Decisions

### 1. Canonical shell

The public shell should be:
- desktop: fixed left rail with profile, nav, connections, and availability marker
- mobile/tablet: compact top bar with expandable nav drawer
- footer: fixed terminal/status strip across public routes

This preserves the stronger portfolio framing without requiring the old SvelteKit layout runtime.

### 2. Unified works model

The Astro public routes need one mapping layer that can consume Convex `worksEntries` and enrich them with portfolio-specific fallback metadata.

Each normalized work should support:
- title
- slug
- summary
- year
- category/client/status
- live href
- optional static preview
- optional video preview
- optional Mux playback ID
- optional accent/surface styling
- optional internal route override

Rendering priority:
1. internal route override
2. Mux playback
3. video preview
4. static preview
5. iframe/live surface

### 2a. Interaction contract for each work

Every work can expose up to three public surfaces:

- **preview surface**
  The thing visible inside `/works` or homepage cards. This may be:
  - a real interactive internal iframe
  - a Mux player
  - a video loop
  - a static preview
  - a branded placeholder/embed card

- **internal full route**
  The portfolio-hosted version of the project. This is the “touch it here” destination when a work is imported into the repo.

- **external/original link**
  The canonical external deployment when it still exists outside the portfolio.

For `clean-writer`, all three surfaces should exist.

### 3. Clean writer port

`clean-writer` should be imported as an isolated React app surface, not rewritten.

Implementation model:
- copy the app source into a dedicated portfolio submodule directory
- preserve its internal component/hook structure
- provide Vite define globals required by the imported source
- mount it on a dedicated Astro route with route-scoped head assets
- keep the portfolio shell off that route so the app can run fullscreen

### 4. Isolation strategy

The clean-writer route must not leak styles into the main portfolio.

Isolation layers:
- separate route layout
- route-scoped stylesheet import
- route-scoped external font + Tailwind CDN setup
- dedicated static assets namespace for favicons/PWA icons used by the imported app

### 5. Scope order

The user clarified that the goal is broader than `/works`, but `/works` is urgent because it defines the live-demo pattern that other portfolio surfaces can reuse.

Implementation order:
1. shell
2. works model
3. `/works` interactive cards
4. `clean-writer` full route
5. homepage reuse of the same work model
6. broader rollout to other imported works

## Acceptance Gates

### Gate A: Shell fidelity
- desktop uses the left rail
- mobile uses the top bar/drawer
- footer remains fixed and readable
- preview/admin runtime affordances still function

### Gate B: Works fidelity
- `/works` shows real previews where possible
- internal and external links are explicit
- typewriter entry points to the in-repo route
- homepage and `/works` consume the same normalized work data

### Gate C: Clean Writer fidelity
- app mounts without shell bleed
- interaction works inside the full route
- route can be embedded inside `/works`
- local persistence still works
- missing Supabase env degrades gracefully

## Non-Goals

- Rebuilding clean-writer in Astro-native primitives
- Converting clean-writer away from its current React structure
- Fully completing every Mux/admin media workflow in this same pass
- Reinterpreting the portfolio into a brand-new visual system
