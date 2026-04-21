# Proposal: Reference Superset Standardization

## Why

As of April 20, 2026, the repository has an architecture that is more current than some of its older SvelteKit deployments, but several public surfaces no longer feel as finished as the best shipped versions.

The strongest prior production references are:

- February 3, 2026: `https://portfolio-forever-3ncaxmavn-senik.vercel.app/`
- April 3, 2026: `https://portfolio-forever-9em1hfsmq-senik.vercel.app/`
- April 18, 2026: `https://portfolio-forever-k1cldpkpz-senik.vercel.app/`

Those versions do not represent one linear improvement path. Each one shipped strengths that matter:

- February 3, 2026 carried more homepage energy, denser proof, and stronger showcase/media presence.
- April 3, 2026 carried cleaner design-system discipline, better works readability, and a tighter public frame.
- April 18, 2026 carried stronger shell/navigation hierarchy, a more opinionated OS-like structure, and a richer route model.

The current stack should not regress by trying to impersonate one old deployment wholesale. The correct next step is to standardize the current Astro app into a deliberate superset:

- one canonical public shell
- one design system
- one editorial/runtime boundary
- one coherent admin-to-public relationship

## Problem Statement

The current app still has strong ingredients, but the system is not fully recomposed. The main gaps are:

- `hero` no longer concentrates the strongest hierarchy, proof, and navigation cues into one surface
- `works` has lost some of the confidence, readability, and preview logic seen in the shipped references
- `process` is missing the stronger structured/diagrammatic explanation surface
- `cv` is below the best prior finish level
- `/admin` risks drifting into a separate product instead of governing the public system
- theme, font, highlight, footer, spacing, and motion behaviors do not yet read as one fully locked design language
- Sanity preview/editorial workflows need to stay first-class without forcing the whole site into a React-first runtime

## What Changes

This change defines the long-term standardization path for the current portfolio application.

### 1. The app stays Astro-first

This change does **not** introduce a new production host.

The canonical runtime remains:

- Astro for routes, layout composition, and page delivery
- Svelte for primary public interactivity and existing strong UI surfaces
- React only where it materially improves Sanity preview/editorial integration
- Sanity as the editorial source of truth
- Convex as a runtime/live-state sidecar where it still adds value

### 2. Public routes become a single superset system

The target is not “restore deployment A/B/C.”

The target is:

- April 18, 2026 shell and navigation clarity
- April 3, 2026 design-system discipline and works readability
- February 3, 2026 showcase density, homepage energy, and command-surface cues

### 3. One parent change covers the critical surfaces

This parent change covers:

- public shell
- hero
- works
- process
- cv
- admin
- design system
- Sanity live preview / editorial boundary

### 4. Admin must serve the public system

The admin surface should become the operating console for the public design system, not an unrelated interface.

That means:

- preview reflects the real public shell and route behavior
- controls map to canonical public tokens and content models
- preview/editorial workflows support fast iteration without forcing the public site into admin-only assumptions

## Non-Goals

- migrating the production host away from Astro in this change
- converting the entire public app to React
- preserving every historical branch behavior exactly as-is
- letting `/admin` define a parallel visual system that the public site does not actually use

## Success Criteria

- [ ] A single canonical public shell is defined and implemented from the three references
- [ ] `hero`, `works`, `process`, and `cv` each recover the strongest missing behaviors from the reference deployments
- [ ] `/admin` is aligned with the public design system and preview model
- [ ] themes, fonts, spacing, highlights, footer, and motion read as one deliberate design system
- [ ] Sanity live preview remains first-class without turning the public runtime into a React-first architecture
- [ ] the resulting Astro app is more finished than any one prior reference on its own
