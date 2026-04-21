# Design: Reference Superset Standardization

## Context

This is a consolidation change, not a rewrite-from-zero and not a host migration.

The working assumption is:

- the active runtime truth is Astro-first
- Svelte still holds many of the strongest interactive portfolio surfaces
- Sanity is too important to editorial flow to demote
- React should be treated as a boundary tool, not the default public runtime

The design problem is therefore narrower and more demanding:

recover the strongest finished qualities from the three reference deployments and standardize them into one coherent future-facing system.

## Reference Provenance

The three named provenance references are:

- **Reference C**: February 3, 2026
  `https://portfolio-forever-3ncaxmavn-senik.vercel.app/`
- **Reference A**: April 3, 2026
  `https://portfolio-forever-9em1hfsmq-senik.vercel.app/`
- **Reference B**: April 18, 2026
  `https://portfolio-forever-k1cldpkpz-senik.vercel.app/`

Supporting git and deployment mapping is already recorded in:

- `openspec/changes/precision-monolith-replatform/references.md`

## Core Decisions

### 1. The public shell is a superset, not a vote

The canonical shell should borrow:

- **from Reference B**
  desktop left-rail clarity, grouped internal/external navigation, stronger route identity, more opinionated shell
- **from Reference A**
  cleaner restraint, better ledger-like content readability, tighter visual discipline
- **from Reference C**
  more proof on the homepage, stronger showcase/media momentum, more visible command-surface energy

The result should feel intentional, not collage-like.

### 2. Design system recovery is part of the feature, not cleanup

The design system is not a secondary follow-up. It is one of the missing shipped features.

The recovered system must unify:

- named themes and palette logic
- font switching and font hierarchy
- highlight colors and entry emphasis behavior
- spacing rhythm and section hierarchy
- footer language and terminal/status framing
- motion and interaction rules

### 3. Route fidelity matters more than component reuse purity

For this change, route-level fidelity is the primary unit of success.

The routes that matter first are:

- `/`
- `/works`
- `/process`
- `/cv`
- `/admin`

If a route needs selective reuse of legacy Svelte logic to reach prior shipped quality, that is acceptable.

### 4. Admin is a system console, not a separate product

The admin should control and preview the same public system that ships.

That means:

- shared tokens
- shared content model assumptions
- shared route behaviors
- preview that is truthful to the public output

The admin may have its own chrome, but it must not invent a different underlying site.

### 5. React stays at the Sanity/editorial boundary

To keep the architecture coherent:

- Astro remains the host
- Svelte remains the primary public interaction layer
- React may be used for Sanity Studio, preview adapters, or live-editing integration
- React should not become the default implementation target for public routes unless a later change explicitly reopens that decision

This avoids another split-brain architecture while keeping Sanity live preview first-class.

## Surface Plan

### Public Shell

Canonical target:

- desktop uses the stronger left-rail/navigation hierarchy from Reference B
- mobile/tablet preserve compact clarity rather than forcing the entire desktop shell downscale
- footer/terminal strip remains a strong public framing device
- command-surface cues stay visible without dominating content

### Hero

The hero should combine:

- stronger hierarchy and framing from the cleaner April references
- enough proof and momentum from the February reference so it does not feel reduced
- links, location, status, and works preview cues that read as one surface rather than scattered metadata

The hero must become the front door to the whole system again.

### Works

`/works` and the homepage works treatment should share one normalized display model.

The recovered works system should preserve:

- readable ledger/list strength from Reference A
- shell integration and route framing from Reference B
- selective showcase/media energy from Reference C

Each work should be able to express:

- preview surface
- internal route or in-portfolio rendering
- external canonical link
- optional media/embed behavior
- optional accent/highlight treatment

### Process

The process route should recover a stronger explanatory visual grammar, including the diagrammatic behavior the user called out.

The route should not degrade into generic text sections. It should visibly explain systems, workflow, and structure.

### CV

The CV route should recover:

- stronger typographic finish
- clearer hierarchy and scanability
- public display fidelity plus print/export awareness
- alignment with the canonical shell rather than feeling like a leftover route

### Admin

The admin target for this change is:

- truthful preview of the real public surfaces
- controls tied to real tokens and content structures
- support for theme, typography, layout, and route-specific configuration where needed
- editorial workflows that complement, not compete with, Sanity

## Runtime Boundary

### Public runtime

- Astro routes and layouts
- Svelte public components and interactive islands
- shared token/data normalization layer

### Editorial/runtime integration

- Sanity remains canonical for editorial content and preview
- React may be introduced only where Sanity preview/editing integration is materially better with React tooling
- any React boundary should adapt into the Astro public system rather than redefine it

### Live runtime state

- Convex continues only where live/shared state is useful
- Convex should not silently become the canonical page-composition source for routes that are editorially owned

## Implementation Sequence

### Phase 1: Gap inventory and canonical decisions

- inventory what is missing across `hero`, `works`, `process`, `cv`, `/admin`
- declare which reference is primary per surface
- document borrowed traits explicitly

### Phase 2: Design system recovery

- recover canonical theme/font/token behavior
- re-lock spacing, footer, highlights, and interaction cues

### Phase 3: Public route recovery

- rebuild `hero`
- rebuild `works`
- rebuild `process`
- rebuild `cv`

### Phase 4: Admin and preview standardization

- align admin controls to public tokens and route models
- ensure preview reflects real public output
- preserve Sanity live preview/editorial usefulness

### Phase 5: Verification

- compare final output against all three references
- confirm no surface regressed in finish, clarity, or richness

## Risks

- without a hard per-surface decision log, the work can turn into taste churn
- overusing React would create another architectural split instead of solving the current one
- overfitting to one old deployment would lose strengths from the others
- admin complexity can consume time without improving public fidelity unless preview truthfulness stays central
