# Tasks: Precision Monolith Replatform

## 1. Provenance and documentation
- [ ] 1.1 Create `PROGRESS.md` with a dated timeline of the repo's SvelteKit, Squint, Astro, Convex, and Sanity eras
- [ ] 1.2 Update `TECHSTACK.md` to reflect current runtime truth from `package.json`
- [ ] 1.3 Update `TECHSTACK.md` to distinguish legacy reference architecture from the target monolith architecture
- [ ] 1.4 Add a provenance section to `README.md` that explains which docs are authoritative when they disagree
- [x] 1.5 Record the three Vercel reference deployments as named design baselines with their strongest traits (`references.md`)

## 2. Reference-version decision log
- [ ] 2.1 Create a surface inventory for home, works, nav, footer, command palette, blog, and CV
- [ ] 2.2 Score each surface across the three references using the weighted rubric in `design.md`
- [ ] 2.3 Choose the canonical base and secondary borrowed traits for each surface
- [ ] 2.4 Freeze that decision log before writing Rails UI code

## 3. Git and deployment preservation
- [ ] 3.1 Use `gh` to audit remote branches, tags, and any missing archival references
- [ ] 3.2 Create a branch/tag strategy that preserves the current Astro state and the future monolith state cleanly
- [ ] 3.3 Use `vercel` to keep reference previews accessible during migration
- [ ] 3.4 Document which environment remains on Vercel and which target environment moves to container hosting

## 4. Rails readiness
- [ ] 4.1 Upgrade the Ruby toolchain to 3.2+ in a reproducible way
- [ ] 4.2 Bootstrap Rails 8 inside the repo's chosen migration boundary
- [ ] 4.3 Add Inertia Rails and Solid client wiring
- [ ] 4.4 Add Kobalte as the default Solid primitive layer
- [ ] 4.5 Configure Vite for the Rails + Solid build path
- [ ] 4.6 Confirm the Rails app boots locally before any route porting

## 5. Data-boundary definition
- [ ] 5.1 Define which content remains canonical in Sanity
- [ ] 5.2 Define which real-time surfaces remain in Convex
- [ ] 5.3 Define what Rails persists or denormalizes locally for search and page props
- [ ] 5.4 Write the serializer/prop contract for the first migrated page

## 6. Superset homepage proof
- [ ] 6.1 Implement the canonical homepage shell using the chosen reference traits
- [ ] 6.2 Preserve existing copy, spacing logic, and route semantics wherever possible
- [ ] 6.3 Port the works ledger/showcase treatment with minimal diff from the chosen references
- [ ] 6.4 Build key controls with Kobalte primitives rather than ad hoc custom semantics
- [ ] 6.5 Add the unified command palette over Rails + Sanity content
- [ ] 6.6 Add one Convex-backed live metric such as views or likes

## 7. Animation-engine comparison layer
- [ ] 7.1 Create a tiny animation adapter that can target Motion JS or GSAP
- [ ] 7.2 Add a lab/debug UI using Kobalte switch, checkbox, or segmented control to swap animation engines
- [ ] 7.3 Implement one shared interaction in both engines to compare feel directly
- [ ] 7.4 Choose a default production engine per interaction after comparison

## 8. Verification
- [ ] 8.1 Verify Rails build/dev boot on the upgraded Ruby toolchain
- [ ] 8.2 Verify the homepage matches the chosen superset design direction
- [ ] 8.3 Verify command search spans both Rails-hosted and Sanity-hosted content
- [ ] 8.4 Verify Convex sidecar features do not become the primary content path
- [ ] 8.5 Verify the migration path still preserves the current independent repo history
- [ ] 8.6 Verify Kobalte controls remain accessible with either animation engine selected

## 9. Closeout gate for implementation
- [ ] 9.1 Do not start bulk route migration until provenance docs, decision log, homepage proof, and animation-adapter proof are complete
- [ ] 9.2 Confirm the first Rails slice is more finished, not less finished, than the current strongest shipped reference
