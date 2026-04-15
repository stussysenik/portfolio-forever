# Proposal: Command Palette OS — cmd+K NLP Action Registry

## Overview
Ship a `/admin`-gated command palette that accepts natural language, routes through a deterministic typed action registry, executes via Convex mutations, and provides preview + confirmation before commit. Implements the "Double-Tap Live Editability" primitive named in `openspec/controls-architecture.md:40` via a natural-language surface, and unblocks the "publish from a conference floor" use case that motivated the Portfolio OS vision (see `DOCS/plans/2026/04/15/portfolio-os-grounding.md`).

## Problem Statement

1. **Velocity tax.** Publishing a new work from a conference floor today requires navigating `/admin`, finding the right section compartment, and filling multiple form fields. Too slow for the "stand up at CVPR and ship" use case.
2. **Surface area growth.** The admin has 28+ editable Convex tables (grounding doc §4) and will keep growing. Even keyboard-savvy users hunt through compartments.
3. **Consistency tax.** Every new feature adds another admin UI surface. A command layer lets future features ride the same rail without adding bespoke UI.
4. **LLM determinism risk.** The project wants LLM-powered authoring, but doing it wrong (LLM emitting raw code, SQL, or Lua) is unsafe. This proposal pins LLM output to a deterministic typed schema at the boundary, not by prompt discipline.

## Proposed Solution

### Phase 1: Typed action registry
Create `src/lib/command-os/registry.ts` exporting a single object literal mapping action names to `{ description, parameters (Zod schema), execute (async fn calling a Convex mutation) }`. Seed with a minimal set covering the highest-velocity operations on shipped tables: `createWork`, `updateWork`, `deleteWork`, `createBlogPost`, `updateBlogPost`, `setTheme`, `setFont`, `toggleFlag`, `navigateTo`. Each entry binds to an existing Convex mutation — no new data plumbing.

### Phase 2: Convex LLM proxy
Create `convex/commandOs.ts` containing a Convex action `routeCommand` that accepts user input, builds the JSON Schema form of the registry, calls Anthropic (or Vercel AI Gateway) with tool-calling, and returns a validated structured call.

**Static-site constraint waiver.** `openspec/project.md:48` commits to "no server-side runtime." Convex actions run on Convex infrastructure, not a Node/SSR server. The admin surface is backend work, not part of the static public artifact. This proposal reads the constraint as protecting the *public* portfolio's static artifact, not the *admin* surface. **Requires explicit project-owner sign-off at proposal review.** See `design.md` for the narrow-waiver justification.

### Phase 3: UI overlay
Install `melt-ui` (headless Svelte 5 primitives). Create `src/lib/command-os/CommandPalette.svelte` using melt-ui's Dialog + Combobox builders. Global shortcut: `cmd+K` / `ctrl+K`. Mount at the admin layout root, Clerk-gated. The input surface uses `<pre>`/monospace formatting (per `feedback_pretext_longform.md`) so long inputs never wrap silently.

### Phase 4: Execution pipeline
1. User types → `routeCommand` Convex action → returns structured call
2. Palette renders a **preview**: action name, pre-text formatted parameters, and a minimal diff for updates/deletes
3. Enter to confirm, Escape to cancel
4. Confirmed call executes the mutation via `ctx.runMutation(...)`
5. Convex subscriptions propagate the change live to the public site

### Phase 5: Lua escape hatch (stretch, documented only)
For advanced multi-step operations that can't be expressed as a single tool call, allow the LLM to emit a Lua snippet compiled via the existing `src/lib/pixel-engine/lua-runtime.ts`. Out of MVP; documented only for future extension. See grounding doc Decision D4 for why Lua stays a stretch escape hatch and not the primary surface.

## Impact & Benefits
- **Velocity** — publishing a new work becomes one spoken sentence
- **Consistency** — all future admin features ride the same rail, zero new bespoke UI per feature
- **Determinism** — the LLM physically cannot emit anything the Zod schema doesn't allow; prompt injection cannot escape the registry
- **Realtime** — Convex subscriptions auto-propagate changes to the public site
- **Keyboard-first, accessible** — melt-ui primitives are axe-core clean out of the box

## Dependencies
- `melt-ui` (new) — headless Svelte 5 primitives
- `zod` + `zod-to-json-schema` (new) — schema validation and JSON Schema emission
- Anthropic SDK *or* Vercel AI Gateway client — LLM proxy on the Convex action side
- Existing Convex mutation infrastructure
- Clerk auth (existing) — gates the palette to signed-in admin only

## Risks
- **Static-site waiver** requires explicit sign-off from the project owner before implementation can start
- **LLM first-token latency** — mitigate with a "thinking..." state and an LRU cache of recent (input → tool call) pairs
- **Registry drift** — every new mutation requires a registry entry. Mitigate with a lint rule in a follow-up change; do not auto-generate the full registry (curation matters)
- **Prompt injection** — user text goes to an LLM; Zod is the safety net, not the prompt
- **Cost per command** — each cmd+K costs one LLM call; the local LRU cache is the primary mitigation

## Non-Goals
- Public-facing command palette (admin-only, Clerk-gated)
- onLook-style visual tree editor (separate future change, not scoped here)
- Lua as the primary command language (stays a stretch escape hatch)
- Voice input
- Multi-step agent chains — MVP is one input → one tool call → one mutation

## Success Criteria
- [ ] `cmd+K` / `ctrl+K` opens the overlay in <100ms perceived latency
- [ ] Natural-language → first token of structured response in <2s median
- [ ] 100% of LLM outputs pass Zod validation at the boundary or are rejected with a structured error
- [ ] Every shipped-table mutation (`works`, `blog`, `themes`, `siteConfig`, `featureFlags`, `pages`) has a registry entry
- [ ] Works-page CRUD is fully addressable through the palette end-to-end (verified via Playwright)
- [ ] Preview rendering preserves whitespace in identifiers and values (no silent wrap)
- [ ] Palette is keyboard-navigable and passes axe-core accessibility checks
- [ ] Zero regressions on the public portfolio (which must never see the palette)
