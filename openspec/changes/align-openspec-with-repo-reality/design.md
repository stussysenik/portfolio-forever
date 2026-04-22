# Design: Align Openspec With Repo Reality

## Scope

This is a truth-alignment change.

It does not try to finish the entire backlog. It establishes a trustworthy baseline so future execution can be spec-driven again without relying on stale assumptions.

## Classification Model

Each `openspec` change belongs to one of four buckets:

### 1. Completed And Trustworthy

Code exists, task sheet closure broadly matches reality, and no major parity or verification gap was found during this pass.

### 2. Mixed / Partially Closed

A substantial amount of implementation landed, but important verification, parity, or follow-up tasks are still open.

### 3. Stale Task Sheet

The task sheet implies "not started" or under-developed status, but the current codebase already contains meaningful implementation. These specs need reconciliation before they can guide more work reliably.

### 4. Strategic Backlog

The change still represents a future direction rather than current repo reality.

## Decision: Favor Forward Reconciliation Over Historical Perfection

We should not try to retroactively make every old task sheet perfect before moving forward.

Instead:

- preserve history
- record drift explicitly
- choose the next 3 to 4 execution tracks that matter most to the portfolio vision
- reconcile the specs that are on the critical path for those tracks

## Vision-First Order

The next sequence should optimize for the portfolio the user actually wants to ship:

1. Public-shell polish and mobile responsiveness
2. Admin-system standardization and verification closure
3. Storybook/design-token/tooling alignment
4. Optional architectural widening such as XState/Remeda only after the shell and admin are coherent

## Tooling Truths Captured By This Audit

- Storybook is present and configured with `@storybook/svelte-vite`
- responsive tablet and desktop suites exist in `tests/responsive/`
- command-palette code exists in `src/lib/command-os/` and `convex/commandOs.ts`
- `nanostores` and `ts-pattern` are installed and in use
- `xstate` and `remeda` are not installed

That means several existing plans need reconciliation before they can serve as authoritative execution contracts again.
