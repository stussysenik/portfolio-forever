# Tasks: Reference Superset Standardization

## 1. Canonical decision log
- [x] 1.1 Record the current missing-state inventory for `hero`, `works`, `process`, `cv`, and `/admin`
- [x] 1.2 Assign a primary reference source for each surface (`Reference A`, `Reference B`, `Reference C`)
- [x] 1.3 Record which secondary traits are borrowed for each surface
- [x] 1.4 Freeze the per-surface decision log before substantial UI rewrites

## 2. Design system recovery
- [x] 2.1 Reconcile theme system behavior with the strongest shipped palette logic
- [x] 2.2 Reconcile font-switching behavior and typography hierarchy
- [x] 2.3 Reconcile highlight, entry-emphasis, and footer/status behaviors
- [x] 2.4 Reconcile spacing rhythm and section hierarchy across public routes
- [x] 2.5 Define the motion/interaction rules that belong to the canonical system

## 3. Public shell and route recovery
- [x] 3.1 Rebuild the canonical public shell from the chosen superset traits
- [x] 3.2 Restore `hero` to the chosen hierarchy, proof, and interaction standard
- [x] 3.3 Restore `works` to the chosen ledger/showcase/media standard
- [x] 3.4 Restore `process` with the stronger diagrammatic/system explanation behavior
- [x] 3.5 Restore `cv` to the stronger public and print-ready finish level

## 4. Admin and editorial boundary
- [x] 4.1 Align `/admin` controls to the real public design system tokens and route models
- [x] 4.2 Ensure admin preview reflects the actual public shell and route output
- [x] 4.3 Define the Sanity live preview path for the Astro-first app
- [x] 4.4 Restrict React usage to the Sanity/editorial boundary unless a later change explicitly widens that scope

## 5. Verification

Verification status note, April 21, 2026:

- local Astro verification still renders the in-between shell on `/`, including the `public index` sidebar and `Work first. Signals around it.` proof card
- the Vercel project had still been configured as `SvelteKit` with `vite build`, so production deploys were not validating the intended Astro host at all
- treat sections 3 and 4 as implemented-but-not-verified until the recovered `hero`, `works`, `process`, `cv`, and `/admin` surfaces are compared against References A, B, and C on actual Astro deployments

- [ ] 5.1 Verify the resulting shell is a superset rather than a partial clone of one reference
- [ ] 5.2 Verify `hero`, `works`, `process`, and `cv` each recover their identified missing traits
- [ ] 5.3 Verify `/admin` improves public-system control rather than diverging from it
- [ ] 5.4 Verify theme, font, color, spacing, footer, and motion now read as one coherent system
- [ ] 5.5 Verify the Astro-first architecture remains coherent with Sanity preview and Svelte public interactivity
