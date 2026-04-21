# Decision Log: Component Selection Matrix

## Goal

Pick the strongest reusable public components from the current Astro branch, prior production snapshots, and legacy Svelte routes without re-authoring them from scratch.

This log is the “decision store” for the change. If implementation drifts later, this file is the source of truth for what won and why.

## Scoring Model

Each candidate is scored from `1-5` on:

- `fidelity`: how strongly it reflects the intended portfolio identity
- `reuse`: how broadly it can anchor multiple routes
- `uniqueness`: how memorable or portfolio-specific it feels
- `portability`: how easy it is to carry into Astro without regression

Weighted score:

`score = fidelity*0.4 + reuse*0.25 + uniqueness*0.2 + portability*0.15`

## Winners

### 1. Navigation stacks / shell

| Candidate | Source | Fidelity | Reuse | Uniqueness | Portability | Score | Decision |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Left-rail stacked shell | `k1cldpkpz` production lineage / legacy nav stack | 5 | 5 | 4 | 4 | 4.65 | **Primary desktop shell** |
| Top masthead with inline nav/connections | current Astro home | 4 | 3 | 3 | 5 | 3.85 | Secondary: reuse as intro content, not as global shell |
| Drawer/hybrid mobile nav | legacy nav components | 4 | 4 | 3 | 4 | 3.85 | **Primary mobile shell** |

Decision:
- Desktop keeps the left-rail stacked navigation feel.
- Mobile uses a compact header plus drawer/hybrid stack.
- The current Astro masthead survives only as homepage intro content, not the global shell.

### 2. Colored works table

| Candidate | Source | Fidelity | Reuse | Uniqueness | Portability | Score | Decision |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Colored ledger table | current Astro `ColorfulWorksTable` + older portfolio behavior | 5 | 5 | 5 | 5 | 5.00 | **Canonical works index component** |
| Plain project grid/cards | generic works surfaces | 2 | 3 | 2 | 4 | 2.55 | Reject as primary index |

Decision:
- The colored works table is the canonical scanning/index surface.
- Cards and embeds support it, but do not replace it.

### 3. Process page

| Candidate | Source | Fidelity | Reuse | Uniqueness | Portability | Score | Decision |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Current Astro `process.astro` | current branch | 4 | 4 | 4 | 5 | 4.20 | **Preserve and tune, not rewrite** |
| Legacy dynamic fallback (`ProcessSection`) | Svelte route fallback | 3 | 3 | 3 | 3 | 3.00 | Keep as reference only |

Decision:
- Keep the current Astro process structure.
- Only align shell rhythm and spacing with the new public shell.
- Do not replace it with a more generic section grid.

### 4. CV page

| Candidate | Source | Fidelity | Reuse | Uniqueness | Portability | Score | Decision |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Current Astro `cv.astro` timeline | current branch | 5 | 4 | 4 | 5 | 4.65 | **Preserve and extract patterns from it** |
| Legacy dynamic fallback (`CvSection`) | Svelte route fallback | 3 | 3 | 3 | 3 | 3.00 | Keep as reference only |

Decision:
- Preserve the current Astro CV timeline and contact split.
- Reuse its density and typographic rhythm as a benchmark for other editorial routes.

### 5. Typewriter / clean-writer

| Candidate | Source | Fidelity | Reuse | Uniqueness | Portability | Score | Decision |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Full imported app | `~/Desktop/clean-writer` | 5 | 4 | 5 | 3 | 4.45 | **Import as real route** |
| External-only link | `clean-writer.mxzou.com` | 2 | 2 | 3 | 5 | 2.60 | Insufficient alone |
| Static/video preview only | current work metadata | 3 | 4 | 2 | 5 | 3.35 | Supporting layer only |

Decision:
- `clean-writer` becomes the reference implementation for the new works contract:
  - preview inside `/works`
  - full internal route in the portfolio
  - preserved external/original link

## Locked Decisions

1. The public shell is stack-first, not masthead-first.
2. The colored works table is the anchor component for the whole works system.
3. `process` and `cv` are already strong and should be preserved, not reimagined.
4. Imported works should follow the same three-surface contract:
   - preview
   - internal route
   - external/original link
5. `clean-writer` is the first full import and becomes the benchmark for future imported works.

## Implementation Updates

### 2026-04-20

- Phase 1 landed in the Astro public shell:
  - the shared shell now owns the left-rail desktop frame and compact mobile drawer/header
  - the old Astro masthead was removed from the global layout and preserved as homepage-only intro content
  - preview ribbon, runtime sync, WIP banner, and fixed terminal footer were preserved inside the unified shell

- Phase 2 landed in the public works model:
  - works are normalized through an explicit contract for `previewSurface`, `primaryAction`, `internalRoute`, and `externalLink`
  - render priority now follows the locked order: internal route, Mux, video, static, then branded embed placeholder
  - homepage, `/works`, and `/embed/[slug]` now read from the same normalized works layer
  - the colored works table and embedded cards now expose internal route vs external/original links explicitly instead of collapsing everything into one generic `liveHref`
