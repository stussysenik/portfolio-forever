# Reference Deployments and Cherry-Pick Summary

Captured on April 20, 2026.

## Deployment-to-git mapping

These are the three reference production snapshots the replatform work keeps referring to:

| Reference | Vercel short id / note | Full deployment id | URL | Git SHA | Created |
| --- | --- | --- | --- | --- | --- |
| `A` | `kSXofqbNz` | `dpl_kSXofqbNzPZuE7J91iPTwRa9zBKD` | `https://portfolio-forever-9em1hfsmq-senik.vercel.app/` | `9dd03ef7e0db0f45d4b63ac2f03fe39a52ef22bd` | April 3, 2026 |
| `B` | `7tZYJwP8J` | `dpl_7tZYJwP8J5rp8n8MyQuDBSgsz8rt` | `https://portfolio-forever-k1cldpkpz-senik.vercel.app/` | `12c6d760ea58e6e99d2428687609cda9089a3099` | April 18, 2026 |
| `C` | supplied as `EGCwNVFX2`, but the URL resolves to a different deployment id | `dpl_G7EBu4y43XjPWEA7izUPuX5uoV8k` | `https://portfolio-forever-3ncaxmavn-senik.vercel.app/` | `06311bafc974d46057ae5b32d70d1fbb09e635b4` | February 3, 2026 |

## Git truth

All three deployment SHAs are already ancestors of local `HEAD` (`663fcfe`) on April 20, 2026.

`git rev-list --left-right --count <sha>...HEAD` returned:

- `12c6d760...HEAD` -> `0 7`
- `9dd03ef7...HEAD` -> `0 76`
- `06311baf...HEAD` -> `0 130`

That means we are not missing these deployments from git history. The real task is to preserve or replay selected shipped surfaces into the current uncommitted migration state, not to "get them into git."

## Reference A: Clean shell, pixel background, works + identity

Base deployment:

- commit `9dd03ef` on April 3, 2026
- visible shell: top frame, WIP banner, pixel canvas background, dense works ledger, identity strip, theme/font controls

Best traits worth preserving:

- clean top-level shell with strong scanability
- dense works ledger without heavy chrome
- identity/domains section on the homepage
- pixel/shader background energy without taking over the layout

Best commits to replay if this surface is the target:

- `6331cd7` `feat: nav hierarchy with "find me elsewhere", command palette grid`
- `287c38d` `feat: terminal default theme, works simplification, page updates`
- `bbd958e` `feat: 4-theme system, camera framing, footer BedStuy, DRY highlights`
- `4c6ada0` `feat: 3x3 font grid + terminal showcase with 30 commands`
- `18672d0` `feat: pixel engine with Fengari Lua VM and Balatro shader pipeline`

## Reference B: Left rail, OS shell, dual-core era

Base deployment:

- commit `12c6d76` on April 18, 2026
- visible shell: desktop sidebar, grouped navigation tree, connections tree, split works/connect homepage, media route, dual-core state architecture

Best traits worth preserving:

- left-rail navigation clarity on desktop
- better grouping of internal navigation vs external identity links
- stronger "portfolio OS" framing
- media route and expanded shell surface
- dual-core state groundwork for more complex interactive shells

Best commits to replay if this surface is the target:

- `564f2ba` `feat(theme-overhaul): scroll physics, depth filtering, and admin/page wiring`
- `e440c7c` `feat(admin-shell): ship 13-phase redesign (tokens, icons, mobile dock)`
- `36d7cc9` `feat: admin CMS, command-os expansions, cube mode, media section, and layout overhaul`
- `460f175` `build: implement principal-grade immutable state and unified WIP engine`
- `4e384b8` `feat: implement dual-core state architecture`
- `3ede716` `feat: complete dual-core state architecture`
- `12c6d76` `feat: add dual-core architecture with AI agent integration`

## Reference C: Showcase-heavy homepage and command-surface energy

Base deployment:

- deployed from commit `06311ba` on February 3, 2026
- important nuance: `06311ba` itself is mostly docs; the visible UI traits come from earlier commits already below it on `main`
- visible shell: showcase embeds, denser home, command hint in terminal footer, stronger homepage energy

Best traits worth preserving:

- richer homepage density and media momentum
- showcase embeds as proof, not just link lists
- command-surface feel in the footer and shell
- slightly rougher, more experimental energy than the later cleaner shells

Closest feature commits behind that shipped surface:

- `26ce64c` `changed header with urls + updated work links`
- `8071c6f` `feat: add elevator back-to-top with music, floor counter, and design study`
- `df7b764` `style: refine header height, kbd styling for command hint`
- `ad46ad4` `feat: add theme customization with color palettes & live font switching`

## Recommended cherry-pick strategy

Do not cherry-pick the deployment head commits just to recreate history. They are already in history.

If the goal is to rehydrate shipped behavior into the current in-progress branch, cherry-pick focused batches into throwaway recovery branches first:

```bash
git switch -c rescue/reference-a-shell
git cherry-pick 6331cd7 287c38d bbd958e 4c6ada0 18672d0

git switch -c rescue/reference-b-shell
git cherry-pick 564f2ba e440c7c 36d7cc9 460f175 4e384b8 3ede716 12c6d76

git switch -c rescue/reference-c-shell
git cherry-pick 26ce64c 8071c6f df7b764 ad46ad4
```

That gives three clean provenance branches:

- `reference-a-shell` for the April 3 shell and pixel/works balance
- `reference-b-shell` for the April 18 sidebar/OS shell
- `reference-c-shell` for the earlier showcase-heavy energy

## Practical conclusion

For the current repo state, the most useful interpretation is:

- use `Reference B` for desktop shell and navigation hierarchy
- use `Reference A` for works readability and homepage restraint
- use `Reference C` selectively for showcase/media energy and command-surface cues

This is a recomposition problem, not a missing-history problem.
