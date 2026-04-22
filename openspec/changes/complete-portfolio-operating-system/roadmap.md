# Roadmap: Complete Portfolio Operating System

## Truth First

Before any blind execution:

- do not assume old `openspec` checkboxes equal reality
- do not use `openspec apply` as if the repo were fully reconciled
- use this roadmap plus the active alignment specs as the steering layer

Related grounding changes:

- `align-openspec-with-repo-reality`
- `stabilize-live-embed-admin-runtime`
- `finish-sanity-live-studio`
- `spec-inventory.md` in this same master change

## Track A: Planning Truth

Goal:

- make the planning layer trustworthy on the active path

Tasks:

- reconcile `backfill-responsive-stories`
- reconcile `command-palette-os`
- keep `reference-superset-standardization` and `finish-astro-parity` marked as mixed until verified

Done when:

- the specs we are actively relying on match code reality closely enough to guide work

## Track B: Public Shell Quality

Goal:

- make the public shell feel fully intentional and portfolio-grade

Targets:

- `src/layouts/BaseLayout.astro`
- `src/lib/components/OnePageView.svelte`
- footer/status rail
- lobby/control strip
- sidebar/mobile dock coherence
- homepage section labeling and separation

Notes:

- this is the most visible hiring surface
- use `impeccable` as the execution bar
- every non-hero homepage section should read as an independent titled module

## Track C: Mobile Responsiveness

Goal:

- make responsiveness intrinsic and production-trustworthy

Targets:

- fixed-type pockets
- narrow layouts
- admin/public shell behaviors
- embed/card/grid behavior
- one-swipe homepage section comprehension on mobile

Verification:

- tablet + desktop responsive suites
- mobile route sanity
- homepage section scan test: each non-hero section is visibly named and distinguishable in sequence

## Track D: Editorial CMS Completion

Goal:

- make `/admin/content` and Sanity a real daily-use CMS

Targets:

- route-by-route preview verification for:
  - `/`
  - `/works`
  - `/cv`
  - `/process`
  - `/blog`
- identify remaining hard-coded editorial content and move it into Sanity when appropriate
- keep Presentation and Studio flowing through route-true Astro previews
- keep homepage section titles and ordering aligned with the data model that drives admin composition

## Track E: Runtime/System CMS Completion

Goal:

- make `/admin/system` a fully coherent live operating console

Targets:

- remaining admin shell verification
- system controls mapped to public tokens and route models
- section/page composition truth
- preview breakpoint and live-control closure

## Track F: Design System and Tooling Truth

Goal:

- make tooling support the product rather than lag behind it

Targets:

- fix Storybook framework mismatch
- install missing addon references if still canonical
- document token workflow truth
- decide whether Token Studio / Figma variable sync is in or explicitly out

## Track G: Optional Architecture Widening

Goal:

- only adopt new abstractions when they reduce complexity in the finished product

Targets:

- XState decision
- Remeda decision

Current truth:

- neither is installed today
- neither should be backfilled just to satisfy an abstract ideal

## De-Hardcoding Rule

When deciding whether to remove hard-coded content:

- if it is authored/editorial and should be changed via CMS, move it to Sanity
- if it is live operational/config/state, move it to Convex
- if it is local shell UI state, keep it in Nano Stores or local state

That rule should decide the remaining extraction work.
