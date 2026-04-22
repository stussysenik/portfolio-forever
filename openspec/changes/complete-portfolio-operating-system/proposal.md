# Proposal: Complete Portfolio Operating System

## Why

The repository now has enough architecture, tooling, and planning history that forward motion should stop being reactive.

The user's actual problem is not one isolated bug. It is that the portfolio is meant to be a coherent operating system:

- public shell as proof of craft
- `/admin` as the operating console
- Sanity as the editorial CMS
- Convex as the live/runtime CMS
- Astro as the host
- Svelte islands as the primary interaction layer
- React only at the Sanity/editorial boundary
- route-true preview as a release gate

The current repo is close enough that a full master roadmap is now more useful than another narrow spec. But it is also uneven enough that the roadmap must be honest about what is already true, what is partially true, and what is still backlog.

This change is that roadmap.

## What Changes

- Establish one top-level execution contract for the whole portfolio.
- Reconcile the major vision threads already present across `openspec/`, `DOCS/`, and `tmp/`.
- Define the portfolio as four coordinated systems:
  - public experience
  - editorial CMS
  - runtime/system CMS
  - design-system/testing/tooling layer
- Provide a phased dependency-aware path for finishing the product without relying on stale historical task sheets.

## Vision Statement

The portfolio is a composable operating system for hiring proof, not a static brochure and not a collection of disconnected experiments.

That means:

- every meaningful public surface should be steerable without code edits
- the homepage must read as a sequence of independent modules, not a blur of one long page
- public and admin should feel like one product with different responsibilities
- editorial content should not remain hard-coded if it belongs in a CMS
- live state should not leak into the editorial domain
- the planning layer must stay truthful enough to steer the boat

## Success Criteria

- [ ] There is one master spec that covers the whole portfolio vision and execution order.
- [ ] The roadmap explicitly defines what belongs in Sanity, Convex, Nano Stores, and local component state.
- [ ] The roadmap covers public shell quality, `/admin` standardization, mobile responsiveness, route parity, de-hardcoding, Storybook/design-system truth, testing, and deployment.
- [ ] The roadmap defines a homepage section contract where each non-hero block is independently legible, titled, and mappable to admin controls.
- [ ] Historical spec drift is acknowledged instead of hidden.
- [ ] The next implementation batches can be executed from this roadmap without blind `openspec apply`.

## Non-Goals

- Pretending all historical changes are fully complete
- Forcing XState or Remeda into the stack before the product surfaces are coherent
- Rewriting the entire history of `openspec`
