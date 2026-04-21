# Proposal: Precision Monolith Replatform

## Why
As of April 20, 2026, this repository has a provenance split:
- `README.md`, `package.json`, and `openspec/project.md` describe the current app as an Astro-first portfolio with Svelte islands, Convex, and Sanity.
- `TECHSTACK.md` still documents an older SvelteKit + Squint-centric architecture.
- `PROGRESS.md` does not exist, so there is no single timeline that explains what changed, what is still authoritative, and what is now historical.

That mismatch is not just a documentation issue. It makes replatforming risky, because the repo now contains multiple valid eras:
- the earlier showcase-heavy homepage with embedded media,
- the denser left-rail/sidebar variant,
- the flatter “works + identity” layout that reads cleanly and ships fast.

The next version should not discard those strengths. The target is a stronger monolith that keeps the best visual and interaction traits from all three reference deployments while simplifying the application boundary:
- **Rails 8** for routing, controllers, jobs, and durable app structure
- **Inertia.js** to eliminate a bespoke API layer
- **Solid.js** for precise client interactivity
- **Kobalte** for accessible Solid-native UI primitives
- **Convex** only for real-time shared state where it actually adds value
- **Sanity** for editorial content and preview workflows

## Provenance Observations
These points are treated as first-class input to the plan:

1. **Current runtime truth**
   `package.json` runs `astro dev`, `astro build`, and `astro check`. The live repo is not a pure SvelteKit app anymore.

2. **Historical truth still matters**
   `TECHSTACK.md` and the remaining Squint/Clojure paths document a real prior architecture that still informs content shaping and component logic.

3. **The three reference deployments are materially different**
   Using `vercel curl` against the protected deployments shows:
   - one version emphasizes a simple top shell, strong works ledger, and identity strip,
   - one version emphasizes a desktop left rail with clearer navigation hierarchy,
   - one version emphasizes a denser homepage with showcase embeds and command-surface energy.

4. **The local machine is not Rails-ready yet**
   The current environment reports Ruby `2.6.10`, while Rails 8 requires Ruby `3.2.0+`.

## What Changes
This change plans the replatform in a way that preserves finish and minimizes destructive rewrites.

### 1. Establish provenance before architecture churn
- Add an authoritative `PROGRESS.md` that records the stack timeline and current truth.
- Update `TECHSTACK.md` so it distinguishes:
  - current stack,
  - legacy stack still present as reference,
  - target stack for the replatform.
- Freeze the three Vercel deployments as named visual references in the repo docs and OpenSpec artifacts.

### 2. Treat the next build as a superset, not a restart
- Do not rebuild the portfolio from a blank Rails app and “hope” parity returns later.
- Score the three reference versions surface-by-surface and keep the strongest traits:
  - navigation clarity,
  - information density,
  - perceived finish,
  - portability with minimal diff,
  - live-content compatibility.

### 3. Replatform toward the Precision Monolith
- Rails becomes the only application host on the target branch.
- Inertia replaces custom route-to-client glue and removes the need for a separate REST/GraphQL layer.
- Solid.js replaces ad hoc island logic for the interactive portfolio surface.
- Kobalte supplies headless, accessible primitives for toggles, menus, tabs, command surfaces, and other controls.
- Convex is reduced to the sidecar role: likes, view counts, cursors, presence, or chat-like shared state.
- Sanity remains the editorial source for long-form content, preview, and visual editing.

### 4. Make animation feel testable, not theoretical
- Introduce a small animation adapter boundary so Motion and GSAP can be tried on the same surface without rewriting the component tree.
- Use Kobalte `Switch`, `Checkbox`, `Tabs`, or `SegmentedControl` primitives to expose animation-engine selection in a local lab/debug surface.
- Default to one production-safe engine per interaction, but preserve the ability to compare implementations during refinement.

### 5. Preserve branch and deployment history intentionally
- Keep the current repo as the independent source repository.
- Use Git branches/tags to preserve the strongest prior states instead of treating protected Vercel previews as the only record.
- Keep Vercel for reference previews and freeze-frame validation during the migration.
- Plan the final Rails-hosted deployment for a container target such as Railway or Hetzner, because that better matches the monolith architecture.

## Architecture Decisions

### 1. Current-repo provenance beats stale narrative docs
When `README.md`, `TECHSTACK.md`, and code disagree, the tie-breaker is:
1. `package.json` and actual runnable scripts
2. current route/layout structure in the repo
3. updated provenance docs after this change lands

### 2. Minimal diff is a hard constraint
Prefer extraction, reuse, and porting over rewrites:
- keep copy, data shapes, and design tokens where they already work,
- preserve existing content models unless the new boundary makes them actively harmful,
- port proven markup/composition into the new host rather than redesigning by abstraction.

### 3. “More finished than less” is a requirement
The target branch is not allowed to ship with fewer strong surfaces than the current best references. If a route or pattern is not ready at the same quality bar, it stays in the staged migration set until it is.

## Proposed Phases

### Phase 0: Provenance freeze
- Write `PROGRESS.md`
- Reconcile `README.md` and `TECHSTACK.md`
- Capture the three reference versions and their trait matrix

### Phase 1: Rails readiness
- Upgrade local/runtime Ruby to 3.2+
- Add reproducible Ruby toolchain config
- Bootstrap Rails 8 with Inertia and Vite integration

### Phase 2: Canonical data boundary
- Define what lives in Rails, Sanity, and Convex
- Mirror only the content required for fast command search and initial page payloads

### Phase 3: Superset shell proof
- Rebuild the homepage shell first
- Preserve the best navigation, works density, and showcase behavior from the three references
- Port one route end-to-end with real content and one Convex-backed live metric

### Phase 4: Full route migration
- Move the remaining public routes into Rails/Inertia/Solid
- Preserve content richness and route identity

### Phase 5: Deployment split
- Keep Vercel previews for reference validation during migration
- Stand up container deployment for the Rails branch

## Risks
- Ruby 2.6.10 blocks Rails 8 immediately.
- The repo is currently dirty and ahead of `origin/main`, so history capture must avoid trampling in-flight work.
- Existing Astro-specific specs assume Astro is the final host; those assumptions become historical once the replatform starts.
- If the visual superset is not frozen early, the migration can devolve into subjective redesign instead of precise porting.

## Success Criteria
- [ ] `PROGRESS.md` exists and explains the repository timeline clearly.
- [ ] `TECHSTACK.md` accurately distinguishes current, legacy, and target architectures.
- [ ] The three reference deployments are documented as provenance inputs with named traits.
- [ ] Rails 8 boots locally on a supported Ruby toolchain.
- [ ] A first Rails/Inertia/Solid route proves parity with the chosen superset shell.
- [ ] Solid interaction controls are built on accessible Kobalte primitives.
- [ ] At least one key interaction can be previewed through a small Motion-vs-GSAP adapter boundary.
- [ ] Convex is reduced to real-time sidecar responsibilities only.
- [ ] Sanity remains the editorial source for long-form content and preview workflows.
