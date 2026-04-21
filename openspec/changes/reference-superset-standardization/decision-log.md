# Decision Log: Surface Inventory and Reference Freeze

## Goal

Freeze the canonical reference choice for each parent surface before substantial UI rewrites begin.

This file is the task `1.x` source of truth for:

- the current missing-state inventory
- the primary reference per surface
- the secondary traits explicitly borrowed
- the implementation freeze line that should prevent taste churn

## Reference Map

| Reference | Date | Role in the superset |
| --- | --- | --- |
| `Reference A` | April 3, 2026 | cleaner restraint, works readability, stronger CV/document finish |
| `Reference B` | April 18, 2026 | shell hierarchy, route framing, admin console structure |
| `Reference C` | February 3, 2026 | homepage proof, showcase density, command-surface energy |

## Cross-Surface Shell Freeze

Even though task `1.1` is tracked per surface, every surface below inherits the same shell decision:

- public shell primary: `Reference B`
- secondary shell traits:
  - `Reference A`: restraint, cleaner ledger pacing, less visual spill
  - `Reference C`: command/footer energy and proof-friendly showcase attitude

Freeze:

- do not replace the Astro host
- do not widen React beyond the Sanity/editorial boundary
- do not let any route reintroduce a top-masthead-first shell as the desktop canonical frame

## Surface Decisions

### 1. Hero

Current Astro owner:

- `src/pages/index.astro`

Current missing-state inventory:

- the page has a strong ledger skeleton, but the hero still reads as a masthead plus adjacent modules instead of one concentrated front door
- proof exists, but much of it is pushed into separate sections below the identity block instead of being composed into the hero itself
- location, status, connections, and works cues are not yet unified into one authoritative hero surface
- the donut is present as a cue, but the command-surface energy from the February reference is still muted
- the homepage still explains the rebuild in copy instead of fully embodying the finished reference confidence

Primary reference:

- `Reference B`

Why `Reference B` wins:

- it is the strongest shipped hero for combining identity, status, selected works, and connection cues into one coherent first-read surface
- it already behaves like a route-aware front door rather than a standalone splash

Secondary borrowed traits:

- `Reference A`: calmer hierarchy, identity/domain restraint, less visual clutter around the main introduction
- `Reference C`: richer proof density, showcase momentum, stronger command-surface feel

Freeze:

- hero implementation should start from a `Reference B` composition model, then trim with `Reference A` discipline and enrich with `Reference C` proof
- do not treat the current Astro masthead layout as the final hero baseline

### 2. Works

Current Astro owner:

- `src/pages/works.astro`

Current missing-state inventory:

- the route already has the right ledger-plus-embed shape, but it still reads partially like a migration note rather than the canonical finished works system
- readable rows exist, but the page does not yet fully lock the per-entry contract for preview surface, internal route, external link, and optional media emphasis
- route framing is serviceable, but not yet as confident or opinionated as the best shipped references
- showcase energy exists through embeds, but it is not yet selectively prioritized the way the strongest earlier homepage/works surfaces did it
- the home and `/works` surfaces are close, but the presentation hierarchy is not yet frozen as one deliberate model

Primary reference:

- `Reference A`

Why `Reference A` wins:

- it has the strongest readable ledger behavior and the cleanest public frame for scanning projects quickly
- it preserves confidence without turning the works route into a product-card grid

Secondary borrowed traits:

- `Reference B`: stronger route framing and tighter shell integration
- `Reference C`: selective showcase/media proof where it adds signal

Freeze:

- works stays ledger-first, not gallery-first
- richer embeds support the ledger; they do not replace it

### 3. Process

Current Astro owner:

- `src/pages/process.astro`

Current missing-state inventory:

- the Astro route now has a diagram, but the explanatory depth is still too shallow relative to the stronger system-reading versions
- the step cards are legible, but they flatten into generic content blocks too quickly after the initial diagram
- the route does not yet carry enough structured visual grammar beyond the main cycle to feel like a real systems page
- the current implementation is missing a frozen answer for what belongs in the diagrammatic layer versus the prose layer

Primary reference:

- `Reference B`

Why `Reference B` wins:

- it carries the strongest process baseline among the references for a reusable, structured system route rather than a single decorative diagram
- it aligns best with the more opinionated route-model era that this change is standardizing around

Secondary borrowed traits:

- `Reference C`: stark cycle-diagram clarity and directness

Freeze:

- process must remain visibly diagrammatic
- do not reduce the route to text cards plus headings, even if that is faster to ship

### 4. CV

Current Astro owner:

- `src/pages/cv.astro`

Current missing-state inventory:

- the current route has a solid timeline, but the top-of-document identity and utility framing are still below the strongest shipped finish level
- the route is missing a stronger public-document header with clearer download/print intent and more explicit contact/domain context
- scanability is decent, but the route does not yet recover the fuller sense of sections, supporting metadata, and document confidence found in the better references
- disciplines are present, but the broader skills/languages/document-support layer is still thinner than it should be

Primary reference:

- `Reference A`

Why `Reference A` wins:

- it has the strongest CV/document finish, including summary framing, print/download awareness, and a more complete professional-document rhythm
- it reads like a public artifact, not only a route inside a website

Secondary borrowed traits:

- `Reference C`: visible discipline/proficiency signal near the top of the route
- `Reference B`: shell alignment so the CV remains part of the same public system

Freeze:

- CV should keep the current Astro timeline strengths, but its document framing should be pulled toward `Reference A`
- print/export awareness is mandatory, not optional polish

### 5. /admin

Current Astro owners:

- `src/pages/admin/index.astro`
- `src/pages/admin/content.astro`
- `src/pages/admin/system.astro`
- `src/layouts/AdminLayout.astro`

Current missing-state inventory:

- `/admin` is currently split into an overview host, a Sanity/editorial lane, and a Convex/system lane, but the boundary is not yet frozen as one truthful operating console
- the admin shell uses its own chrome and token feel instead of clearly proving that it governs the same public system the site renders
- preview truth is fragmented across editorial and runtime surfaces instead of resolved into one dependable public-preview model
- the current overview explains architecture well, but it does not yet expose enough direct control over the actual public shell, themes, typography, and route-specific output
- React containment at the editorial boundary is implied by the code, but not yet reinforced by the surface design itself

Primary reference:

- `Reference B`

Why `Reference B` wins:

- it is the strongest shipped admin console, with the clearest system-shell, compartments, and preview-oriented structure
- it best matches the requirement that admin govern the public system instead of acting like a separate product

Secondary borrowed traits:

- `Reference A`: simpler linear editing affordances where the `Reference B` console becomes too abstract

Freeze:

- `/admin` remains a public-system console, not a second design language
- React stays constrained to the Sanity/editorial boundary
- Convex remains the live/runtime sidecar, not the canonical editorial route owner

## Locked Implementation Order

The next implementation phases should assume these primaries are frozen:

1. recover shared design system behavior against the `B + A + C` shell blend already locked above
2. rebuild `hero` from a `Reference B` composition baseline
3. rebuild `works` from a `Reference A` ledger baseline
4. rebuild `process` from a `Reference B` system-route baseline
5. rebuild `cv` from a `Reference A` public-document baseline
6. align `/admin` to the `Reference B` console model while keeping Sanity/React isolated to the editorial boundary

## Freeze Confirmation

As of April 20, 2026:

- task `1.1` is satisfied by the missing-state inventories above
- task `1.2` is satisfied by the primary reference assignment per surface
- task `1.3` is satisfied by the explicit secondary borrowed traits per surface
- task `1.4` is satisfied by treating this document as the required pre-implementation freeze
