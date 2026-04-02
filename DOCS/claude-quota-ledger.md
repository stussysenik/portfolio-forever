# Claude Quota Ledger

This is a local 7-day experiment harness for testing whether an early Claude Code warmup changes when the practical session window becomes useful.

## Why this shape

- Local only. No inbound service, no webhook surface, no extra database outside your machine.
- Least privilege. The probe disables slash commands, strips MCP, disables session persistence, and uses an empty local settings scope.
- Append-only evidence. Every run writes raw JSONL, a normalized JSONL summary, and SQLite rows.
- Scheduler-ready. The experiment can install a user-level `launchd` agent with explicit per-day calendar entries.

This follows the zero-trust ideas IBM calls out: continuous validation, least privilege, and breach assumption. It also avoids adding n8n before there is enough evidence to justify a second control plane. n8n can be scaled well, but its own docs describe queue mode as a main instance plus worker instances, which is unnecessary for this single-user experiment.

## What gets collected

- Raw Claude stream events in `.claude-quota-ledger/raw/YYYY-MM-DD/*.jsonl`
- Normalized run summaries in `.claude-quota-ledger/runs.jsonl`
- SQLite tables in `.claude-quota-ledger/ledger.sqlite`
- Scheduler decisions in `.claude-quota-ledger/scheduler.jsonl`

Each run captures:

- UTC and local timestamps
- Run kind: `warmup`, `observe`, or `manual`
- Control or treatment phase
- Exit code and duration
- Session ID
- Model and Claude Code version
- Cost and token usage
- Any `rate_limit_event` emitted by Claude Code

## Default 7-day design

When you run `quota:init`, the harness creates:

- 2 control days: observation probes only
- 5 treatment days: one automated warmup plus observation probes

Default local times:

- Warmup: `06:00`
- Observe: `08:20`, `10:50`, `11:10`, `13:10`

The warmup is only scheduled on treatment days.

## Commands

```bash
bun run quota:init
bun run quota:doctor
bun run quota:probe
bun run quota:report
bun run quota:install
bun run quota:uninstall
```

Manual probes default to `manual` kind. You can force:

```bash
bun scripts/claude-quota-ledger.ts probe warmup
bun scripts/claude-quota-ledger.ts probe observe
```

## Recommended operating model

1. Run `bun run quota:init`.
2. Run `bun run quota:doctor` and confirm it sees your Claude subscription auth.
3. Run `bun run quota:install` to register the 7-day `launchd` agent.
4. Let the scheduler run for a week.
5. If you personally hit a visible limit during normal use, also run a manual probe right then:
   `bun scripts/claude-quota-ledger.ts probe manual`
6. At the end, run `bun run quota:report`.

## Why not n8n first

Use n8n later if you need:

- multi-user coordination
- branching workflows across different services
- approvals or UI-level audit flows
- remote execution workers

For this experiment it is not the minimal option:

- n8n persists credentials, executions, and workflows in its own database
- n8n user management and RBAC become additional policy surface area
- scaling guidance introduces extra instances and workers long before they are needed

The local harness keeps authority narrow: one user, one binary, one scheduler, one ledger.
