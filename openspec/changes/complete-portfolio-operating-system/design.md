# Design: Complete Portfolio Operating System

## Canonical Product Model

The repo should be treated as one product with four coordinated systems.

## 1. Public Experience

Owns:

- homepage shell
- homepage section choreography and section identity
- route identity
- works/hero/process/cv/blog/talks/media/etc.
- typography, spacing, motion, footer/status rail, lobby/control strip
- responsive behavior from 320px to large desktop
- embedded works preview behavior

Primary constraints:

- must feel portfolio-first, not CMS-first
- must be route-true under preview
- must be intrinsically responsive, not breakpoint-patched
- must allow a low-context viewer, especially on mobile, to understand each section in one swipe

### Homepage Section Contract

The homepage is already composed from independent Svelte sections inside `OnePageView`. That implementation shape should become a product rule, not an incidental detail.

Rules:

- every homepage section must correspond to one independently controllable unit in page composition
- every non-hero section must expose a visible title or label on the public homepage
- the title should be the public-facing name of the module, not an internal schema term
- hero is the only allowed exception to the visible-title rule
- section IDs, minimap labels, public titles, and admin controls should map cleanly enough that a user can understand the relationship without guessing

Implication:

- the homepage should behave like a swipeable proof deck for HR or hiring leads on mobile
- each section should have a clear start, clear identity, and clear reason to exist
- admin checkboxes and ordering controls should operate on the same units the public page presents

## 2. Editorial CMS

Owns authored content that should not stay hard-coded:

- hero/profile copy
- blog posts
- case studies and works editorial metadata where Sanity is the right tool
- long-form process/cv/media text
- media metadata

Canonical surface:

- `/admin/content`
- embedded Studio and Presentation
- document-focused handoff to previewed public routes

Boundary:

- editorial state lives in Sanity
- React is allowed here because it is part of the Sanity integration boundary

## 3. Runtime / System CMS

Owns live operating state:

- page visibility
- nav order
- feature flags
- runtime history / pending changes
- section composition and control surfaces
- preview breakpoints
- live system toggles

Canonical surface:

- `/admin/system`

Boundary:

- runtime/system state lives in Convex
- this lane should never become the long-form editorial store

## 4. Design-System / Tooling Truth Layer

Owns:

- token discipline
- Storybook
- responsive suites
- preview/testing expectations
- visual parity verification
- route-truth assertions

Current truth:

- parts of this layer are present
- parts are stale
- Storybook is currently broken and therefore not yet a trustworthy contract

## State Ownership Rules

### Sanity

Use for:

- durable editorial documents
- authored copy
- structured content meant for preview/review/versioning

Do not use for:

- live flags
- transient UI state
- runtime composition toggles that belong to the operating console

### Convex

Use for:

- live page composition
- route and section ordering
- admin/system state
- runtime flags and event history
- audience-specific live reconfiguration

Do not use for:

- long-form editorial writing that benefits from Sanity workflows

### Nano Stores

Use for:

- shared local UI state across Astro/Svelte surfaces
- theme/font shell state
- ephemeral cross-island state

Do not use for:

- canonical durable content
- durable runtime backend state

### Component Local State

Use for:

- transient UI interaction
- focused presentation concerns

## FRP / Immutability Guidance

The user comes from an FRP/ClojureScript world. The repo should reflect that bias without cargo-culting it.

Practical translation for this stack:

- keep ownership boundaries explicit
- prefer typed data flow over ad hoc mutation
- use immutable records and narrow update surfaces where possible
- avoid hidden cross-layer coupling
- do not introduce XState/Remeda only as aesthetic moves; introduce them only where they reduce real complexity

## Current Reality Notes

- `tmp/` contains convergence screenshots, walkthrough helpers, and session tracing that reinforce the current direction rather than contradicting it
- the planning layer is improved but not fully reconciled
- the product can now be steered forward, but only by using the roadmap intentionally rather than assuming every historical spec is ready for blind apply

## Execution Model

The roadmap should be executed in seven tracks.

### Track A: Planning Truth

- reconcile stale/mixed specs on the critical path
- maintain one truthful roadmap

### Track B: Public Shell Quality

- finish the footer/status rail
- finish the lobby/control strip
- sharpen layout hierarchy and visual identity
- use `impeccable` as the bar
- make non-hero homepage sections read as titled modules rather than anonymous scroll blocks

### Track C: Mobile Responsiveness

- remove remaining fixed 13px pockets
- push intrinsic layouts deeper into public and admin
- close responsive verification gaps
- make the homepage legible as a one-swipe-per-section sequence on mobile

### Track D: Editorial CMS Completion

- finish Sanity live studio workflow
- de-hardcode remaining editorial content into Sanity where appropriate
- close route-by-route preview trust

### Track E: Runtime/System CMS Completion

- finish `/admin/system` standardization
- finish `/admin` as one coherent operating console
- ensure public preview remains route-true

### Track F: Design System and Tooling

- fix Storybook
- reconcile responsive-story specs
- decide the real token workflow
- explicitly document Token Studio / Figma sync status

### Track G: Optional Architecture Widening

- decide whether XState is actually warranted
- decide whether Remeda is actually warranted

These are last, not first.
