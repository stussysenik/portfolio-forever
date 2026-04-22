# Proposal: Align Openspec With Repo Reality

## Why

The repository has reached the point where `openspec` is valuable enough that drift is now a real delivery risk.

The current state is not "fully finished":

- several changes are genuinely complete
- several changes are partially implemented and honestly marked mixed
- several changes are stale in the opposite direction, where code exists but task sheets were never updated
- several strategic proposals are still backlog, not implementation

This matters because the user now wants to align the repo with the actual vision, tools, and quality bar rather than keep stacking work on top of an increasingly unreliable planning layer.

## What Changes

- Create a repo-wide `openspec` reality audit that classifies every tracked change by actual state, not checkbox theater.
- Record where current code and tooling already exceed stale task sheets.
- Record where specs still overstate closure because verification or parity work is incomplete.
- Turn that audit into a vision-first execution order for the next tranche of work.

## Success Criteria

- [ ] There is one explicit audit artifact that answers "is openspec fully finished?" with evidence.
- [ ] The audit distinguishes:
  - completed and trustworthy
  - partially implemented / verification still open
  - stale task sheets where code already landed
  - strategic backlog not started
- [ ] Tooling reality is recorded for Storybook, responsive suites, command palette, `nanostores`, `ts-pattern`, `xstate`, and `remeda`.
- [ ] The next execution order is driven by the portfolio vision: public shell quality, mobile responsiveness, admin system coherence, design-system/tooling alignment.

## Non-Goals

- Pretending every historical task must be checked off before forward motion can continue
- Converting this audit change into a full implementation batch
- Rewriting old spec history to hide drift
