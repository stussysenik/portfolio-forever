# Tasks: Unify Public Shell, Works Backbone, and Clean Writer Port

## 1. Shell

- [x] 1.1 Replace the interim Astro masthead layout with the unified left-rail desktop shell
- [x] 1.2 Add mobile/top-bar drawer behavior for the public shell
- [x] 1.3 Preserve preview ribbon, runtime sync, WIP banner, and terminal footer behavior
- [ ] 1.4 Verify the shell does not regress draft-mode preview or `/admin` handoff links

## 2. Works backbone

- [x] 2.1 Add a server-side works normalization layer backed by Convex data
- [x] 2.2 Define per-work surface fields:
  `preview surface`, `internal route`, `external/original link`, `muxPlaybackId`, `videoPreview`, `static preview`
- [x] 2.3 Update homepage to consume the normalized works layer
- [x] 2.4 Update `/works` to consume the normalized works layer
- [x] 2.5 Teach public works rendering to prefer internal route, then Mux, then video, then static preview, then placeholder/live embed
- [x] 2.6 Add explicit UI affordances for internal route vs external/original link

## 3. Clean writer port

- [ ] 3.1 Vendor the clean-writer source into the portfolio repo
- [ ] 3.2 Add the Vite/Astro integration needed for its build globals and dependencies
- [ ] 3.3 Mount the app on a dedicated Astro route
- [ ] 3.4 Make the route embeddable inside `/works`
- [ ] 3.5 Point the typewriter work entry to the in-repo route while preserving an external/original link
- [ ] 3.6 Verify CSS/runtime isolation so the imported app does not leak into the portfolio shell

## 4. Broader rollout

- [ ] 4.1 Reuse the same preview/internal/external contract for additional works where feasible
- [ ] 4.2 Identify which remaining works should stay external-only versus become imported internal routes

## 5. Verification

- [ ] 5.1 Run `bun run build`
- [ ] 5.2 Run focused route checks for `/`, `/works`, and `/works/typewriter`
- [ ] 5.3 Verify interactive embed behavior inside `/works`
- [ ] 5.4 Verify graceful degradation when optional media or Supabase env is missing
