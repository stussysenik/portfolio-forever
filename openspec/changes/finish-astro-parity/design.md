# Design: Finish Astro Parity

## Context
The migration foundation solved the architecture problem:
- Astro is the host.
- Sanity is the editorial layer.
- Convex is the live system layer.
- Svelte remains available for high-fidelity islands and admin surfaces.

The remaining problem is parity, not architecture.

The legacy site’s design did not live in one global stylesheet. It was distributed across:
- `src/routes/+layout.svelte`
- route-level page components in `src/routes/**`
- shared section components in `src/lib/sections/**`
- admin/runtime stores and flags in `src/lib/core/**`, `src/lib/stores/**`, and related layout config

That is why a host-only port can look “generic” even if the fonts, colors, and shell are technically valid: the deeper composition rules and runtime-owned styling decisions are not yet in the Astro surface.

## Source of Truth Rules

### Rule 1: Legacy public behavior is the parity reference
For any route already present in `src/routes`, the legacy route remains the parity reference until the Astro route is verified against it.

### Rule 2: Existing shared components are preferred over rewrites
If the old site’s fidelity already exists in Svelte components or section primitives, the Astro route should reuse those components via islands or direct imports rather than rebuild from scratch.

### Rule 3: Runtime-controlled visuals must remain runtime-controlled
Anything previously driven by Convex-backed site config or feature flags must remain driven by Convex in Astro. That includes:
- navigation visibility/order
- site mode and composition-affecting controls
- feature flags exposed by `/admin/system`
- WIP banner visibility and message behavior

## Closeout Tracks

## Track A: Public route matrix

The route migration should be treated as a finite matrix:

### Migrated now
- `/`
- `/works`
- `/process`
- `/cv`
- `/blog`
- `/blog/[slug]`

### Remaining parity routes
- `/academia`
- `/gallery`
- `/gifts`
- `/labs`
- `/likes`
- `/media`
- `/minor`
- `/os`
- `/scratchpad`
- `/talks`
- `/terminal`

Each remaining route must end in one of three states:
- **ported**: Astro route implemented and verified
- **merged**: route intentionally consolidated into another Astro route
- **removed**: route intentionally dropped with a documented reason

## Track B: Visual system inheritance

The public visual system should be migrated in three layers:

### Layer 1: Canonical shell
Extract the true public shell behavior from the legacy layout into the Astro shell:
- public masthead structure
- footer/status bar behavior
- nav grouping and visibility rules
- WIP banner placement
- preview-mode shell affordances

### Layer 2: Canonical typography and spacing
Bring over the type hierarchy and spacing rhythm that actually drove the old site:
- display heading scale by route type
- body measure and vertical rhythm
- mono label cadence
- table/list density on works-like surfaces
- route-specific section spacing rules

This is not just token reuse. It is layout composition parity.

### Layer 3: Route-specific components
For routes whose identity depended on bespoke section composition, migrate the existing components instead of replacing them with simplified Astro templates.

Examples:
- works-style indexes and preview behavior
- terminal and command-surface interactions
- likes/labs/gallery compositions
- route-specific motion or visual affordances

## Track C: Runtime parity adapter

The Astro public shell needs a thin runtime adapter layer that reads Convex-backed public runtime state on the server and hydrates only where necessary on the client.

### Required reads
- nav items
- public site config
- feature flags needed by the public shell
- WIP banner configuration and visibility

### Rendering model
- Read public runtime state in Astro server utilities.
- Render non-interactive shell behavior statically where possible.
- Mount small Svelte islands only for controls or interactions that must remain client-side.

This preserves Astro’s static-first benefits while restoring runtime-owned visual behavior.

## Track D: Preview fidelity

Preview trust depends on route-level verification, not just global draft-mode plumbing.

Each Sanity-backed route must prove:
- published render works without draft cookies
- query-driven preview UI state works
- draft-mode content renders with cookies and read token
- visual editing overlay mounts on the actual public route
- edit handoff routes to the correct editorial surface and document context

## Acceptance Strategy

## Gate 1: Visual parity pass
For each route, compare:
- legacy SvelteKit output
- Astro output

The comparison should focus on:
- hierarchy
- spacing rhythm
- navigation behavior
- route identity
- content density
- runtime badges/flags/banner behavior

## Gate 2: Runtime parity pass
For the Astro public shell, verify that:
- Convex nav order changes appear publicly
- relevant feature flags alter the public shell
- the WIP banner and related runtime messaging appear correctly

## Gate 3: Preview parity pass
For each Sanity-backed route, verify:
- preview ribbon / state
- draft content loading
- presentation tool location targeting
- visual edit handoff

## Non-Goals
- Redesigning the site while porting it
- Moving runtime state into Sanity
- Rewriting stable Svelte components just to make them look “more Astro-native”
- Keeping the legacy SvelteKit host once public parity is reached
