# Proposal: Astro Full Migration Foundation

## Why
The current repo has grown into two products inside one runtime: a public portfolio and a large Convex-backed admin. SvelteKit can keep carrying both, but the new target architecture is sharper: Astro owns the static-first public shell, Svelte 5 powers interactive islands and the `/admin` SPA, Convex remains the live system layer, and Sanity returns as the editorial archive with visual editing. That split better matches the portfolio's goals in 2026: instant initial paint, intentionally scoped interactivity, strong editorial tooling, and a custom admin surface that demonstrates design-engineering taste rather than default CMS chrome.

This change also resolves an architectural contradiction already present in the repo. `data-driven-overhaul` explicitly removed Sanity in favor of Convex-only content management. The new direction reverses that decision. The reversal needs to be documented as a first-class architecture change so future work does not oscillate between “Convex-only CMS” and “Sanity as archive” with no paper trail.

## What Changes
Migrate the repo from SvelteKit to Astro as the single app framework. Public pages become Astro routes with Svelte 5 islands where interaction is needed. `/admin` becomes an Astro route that mounts a client-side Svelte 5 SPA. Sanity is reintroduced for editorial content and visual editing. Convex continues to own page composition, live signals, flags, and system state. Nano Stores become the shared UI-state bridge between Astro layouts and Svelte islands.

## Architecture Decisions

### 1. Full framework migration now
- Astro replaces SvelteKit for the whole repo.
- Do not keep a dual-router hybrid beyond temporary migration work.
- The public site uses Astro pages/layouts; `/admin` is a client-side Svelte 5 app mounted inside Astro.

### 2. Content and runtime boundary
- **Sanity owns** long-lived editorial content: case studies, blog posts, profile/bio content, rich media metadata, SEO fields, and structured content blocks that benefit from versioning and editorial workflows.
- **Convex owns** live application state: page/section composition, navigation order, feature flags, presence, claps, chat, “Smalltalk” inspector/system data, and site live-status.
- This means content atoms live in Sanity while composition and runtime behavior remain in Convex.

### 3. `/admin` is a custom shell with tabs
- `/admin/content` embeds or hosts Sanity Studio for writing and structured editorial management.
- `/admin/system` hosts the custom Convex-backed control surface for live controls and real-time system features.
- `/admin` may redirect to a default tab, but the admin experience is one custom shell, not “just Sanity Studio.”

### 4. Visual editing is a public-site concern
- Astro public pages support Sanity Visual Editing / live preview overlays.
- “Edit” actions from the live preview route users into the editorial admin tab rather than a disconnected CMS screen.
- Preview fidelity matters more than Studio chrome customization.

### 5. Shared UI state uses Nano Stores
- Nano Stores are the single shared client-state layer for cross-island UI concerns such as theme, nav state, preview mode, and global admin shell state that must be readable from Astro-mounted Svelte islands.
- Convex is not used for transient local UI state.

## Proposed Solution

### Phase 1: Foundation
- Install and configure Astro, Svelte integration, Nano Stores, and the repo-wide routing/layout structure.
- Establish a top-level Astro layout with the existing design language preserved.
- Recreate the homepage shell and global navigation/footer in Astro.

### Phase 2: Data scaffold
- Add Sanity back with schemas for hero/profile, blog, and case-study content.
- Add Sanity client utilities and Astro-safe fetch helpers.
- Keep Convex as the source of truth for pages, sections, nav order, flags, and live widgets.

### Phase 3: Interaction bridge
- Mount Svelte 5 islands from Astro for interactive sections.
- Introduce Nano Stores for theme, navigation, preview context, and shell state shared across islands.
- Prove the bridge with a homepage hero/bio slice from Sanity and a Convex-backed live badge.

### Phase 4: Admin split
- Build the Astro `/admin` shell with two primary surfaces: Editorial and System.
- Mount Sanity Studio on the editorial route.
- Port the existing custom admin into the system route as a Svelte 5 SPA.

### Phase 5: Visual editing and preview loop
- Wire Astro pages to support Sanity visual editing and draft preview.
- Ensure live preview can deep-link back into the editorial surface for the corresponding document.

## Impact & Benefits
- **Performance clarity**: Astro owns fast initial paint and mostly-static delivery.
- **Experience-engineering signal**: Svelte 5 islands and Nano Stores show deliberate use of the right tool at the right layer.
- **Editorial durability**: Sanity restores versioning, media workflows, and long-form editing where Convex is not the ideal authoring tool.
- **Runtime flexibility**: Convex keeps the site structurally live and reconfigurable.
- **Admin differentiation**: the portfolio uses a custom admin shell rather than an off-the-shelf CMS alone.

## Risks
- Full framework migration is larger than an incremental route swap and can temporarily destabilize tests, styles, and previews.
- Reintroducing Sanity reopens a recently-closed architecture direction; old “remove Sanity” assumptions must be audited.
- Visual editing introduces draft-mode and preview complexity that does not exist in the current Convex-only setup.
- State ownership can get muddy if Nano Stores, Convex subscriptions, and Sanity preview state are not kept sharply separated.

## Relationship to Existing Changes
- **Reverses** the “remove Sanity” direction in `data-driven-overhaul` Phase 2.
- **Builds on** the current Convex-backed admin investment rather than deleting it.
- **Changes the app shell assumption** in all SvelteKit-oriented specs; route and component tasks in future changes should assume Astro as the host runtime.

## Success Criteria
- [ ] The repo builds and runs under Astro as the only app framework.
- [ ] The homepage shell renders from Astro with at least one Sanity-backed content slice and one Convex-backed live slice.
- [ ] `/admin/content` and `/admin/system` both exist under one coherent admin shell.
- [ ] Astro public pages support Sanity visual editing / draft preview.
- [ ] Nano Stores mediate shared UI state across Astro-mounted Svelte islands.
- [ ] Convex remains the source of truth for page composition and runtime state.
