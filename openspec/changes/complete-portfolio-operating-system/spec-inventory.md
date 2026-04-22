# Spec Inventory: Complete Portfolio Operating System

## Purpose

This document turns the current `openspec/changes/` directory into one readable map.

It exists because the repo no longer has a single problem. It has a portfolio-wide completion problem:

- some changes are real and trustworthy
- some are mixed and need verification
- some are stale and need reconciliation
- some are backlog and should stay backlog

The goal is not to relitigate every historical checkbox. The goal is to know what each change means for forward steering.

## Status Legend

- `trusted`: strong alignment with current repo reality
- `mixed`: real implementation exists, but the spec cannot be treated as fully closed
- `stale`: implementation and task sheet have drifted apart
- `backlog`: keep out of the active path until promoted
- `active-master`: current steering-layer changes

## Active Master Changes

These are the changes that should currently steer execution.

| Change | Status | Role |
|---|---|---|
| `complete-portfolio-operating-system` | `active-master` | top-level roadmap for the full product |
| `align-openspec-with-repo-reality` | `active-master` | truth pass on planning vs codebase |
| `stabilize-live-embed-admin-runtime` | `active-master` | runtime/embed/CORS recovery and adjacent audit |
| `finish-sanity-live-studio` | `active-master` | editorial cockpit and Sanity route integration |

## Trusted Foundations

These changes are currently the strongest base layer.

| Change | Status | Notes |
|---|---|---|
| `add-crop-truth-table` | `trusted` | implementation and intent are aligned |
| `add-theme-customization` | `trusted` | theme architecture is materially present |
| `data-driven-overhaul` | `trusted` | core data-driven direction is real |
| `media-infrastructure` | `trusted` | media lane has solid implementation weight |
| `mobile-admin-kernel` | `trusted` | admin mobile foundation is materially present |
| `polish-admin-final` | `trusted` | meaningful polish landed and remains useful |
| `stabilize-live-embed-admin-runtime` | `trusted` | validated fix path plus audit context |

## Mixed / Partially Closed Changes

These have enough implementation to matter, but should not be treated as fully done without qualification.

| Change | Status | Notes |
|---|---|---|
| `astro-full-migration-foundation` | `mixed` | foundation exists, parity/verification still uneven |
| `finish-admin-cms` | `mixed` | admin CMS direction is real, not fully closed |
| `finish-astro-parity` | `mixed` | parity claims still need route-level verification |
| `overhaul-admin-ux` | `mixed` | substantial UX work exists, closure remains incomplete |
| `redesign-admin-shell` | `mixed` | shell direction is good, deferred items remain |
| `reference-superset-standardization` | `mixed` | standardization direction exists, full reconciliation pending |
| `unify-shell-works-clean-writer` | `mixed` | meaningful integration exists, not closure-grade yet |
| `precision-monolith-replatform` | `mixed` | architecture intent is real, completion is not total |

## Stale Changes Needing Reconciliation

These are specifically dangerous if read literally.

| Change | Status | Notes |
|---|---|---|
| `backfill-responsive-stories` | `stale` | task sheet understates current code; Storybook layer is still broken |
| `command-palette-os` | `stale` | substantial implementation exists despite unchecked task sheet |
| `add-stress-testing` | `stale` | intent overlaps later work and needs reclassification |

## Strategic Backlog

These should remain optional or deferred until pulled onto the active path.

| Change | Status | Notes |
|---|---|---|
| `add-carbon-theme` | `backlog` | not critical to current product closure |
| `add-flag-visual-indicators` | `backlog` | worthwhile, not on the critical path |
| `draggable-ascii-donut` | `backlog` | experimental/front-facing garnish, not core closure |
| `experimental-3d-cube-frontend` | `backlog` | experimental work, not current priority |
| `fold-header-oneliner` | `backlog` | narrow enhancement, not master-track work |
| `katex-primitive` | `backlog` | niche surface, not central to hire-me system completion |
| `works-page-editability` | `backlog` | likely to be revisited under editorial/runtime tracks |

## Track Mapping

This maps the existing change set onto the master roadmap.

### Track A: Planning Truth

- `align-openspec-with-repo-reality`
- `complete-portfolio-operating-system`
- `reference-superset-standardization`
- `finish-astro-parity`
- `backfill-responsive-stories`
- `command-palette-os`

### Track B: Public Shell Quality

- `unify-shell-works-clean-writer`
- `add-theme-customization`
- `data-driven-overhaul`
- `polish-admin-final`
- `fold-header-oneliner`

### Track C: Mobile Responsiveness

- `mobile-admin-kernel`
- `backfill-responsive-stories`
- `stabilize-live-embed-admin-runtime`

### Track D: Editorial CMS Completion

- `finish-sanity-live-studio`
- `finish-admin-cms`
- `media-infrastructure`
- `works-page-editability`

### Track E: Runtime / System CMS Completion

- `overhaul-admin-ux`
- `redesign-admin-shell`
- `data-driven-overhaul`
- `precision-monolith-replatform`

### Track F: Design-System / Tooling Truth

- `add-stress-testing`
- `backfill-responsive-stories`
- `reference-superset-standardization`

### Track G: Optional Architecture Widening

- no current change should force `xstate` or `remeda` adoption
- evaluate only after public, admin, and tooling tracks are coherent

## Tooling Reality Snapshot

| Topic | Current Reality |
|---|---|
| `nanostores` | installed and appropriate for shared local shell state |
| `ts-pattern` | installed and available |
| `xstate` | not installed |
| `remeda` | not installed |
| Storybook | present but currently broken/misaligned |
| Token Studio | not integrated in current checked repo state |
| Figma CSS variable sync | not implemented as a live pipeline in current checked repo state |

## `tmp/` Context Inventory

These artifacts matter because they show the repo is already carrying verification and exploratory traces outside pure source files.

| Artifact | Meaning |
|---|---|
| `tmp/portfolio-homepage.png` | public shell screenshot reference |
| `tmp/portfolio-works.png` | works surface screenshot reference |
| `tmp/terminal-theme-verify.png` | theme/system verification artifact |
| `tmp/convergence-test.html` | local test harness artifact |
| `tmp/convergence-test.mjs` | local convergence runner |
| `tmp/convergence-test-results.png` | convergence verification output |
| `tmp/walkthrough.mjs` | local walkthrough helper |
| `tmp/sessions/SESSION.md` | narrative session trace |
| `tmp/sessions/SESSION.json` | structured session trace |
| `tmp/sessions/SESSION.sqlite` | persisted trace database |

## Steering Rule

Use this order when deciding what to trust:

1. current validated repo behavior
2. active-master changes
3. trusted changes
4. mixed changes with explicit qualification
5. stale changes only after reconciliation
6. backlog only when intentionally promoted

This is the rule that turns `openspec` from historical paperwork into an actual operating layer.
