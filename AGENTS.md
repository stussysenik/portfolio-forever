# Repo Agent Instructions

This file is the Codex-native repo contract and the single source of truth for local agent instructions.

`GEMINI.md` should mirror this file exactly. If the two paths ever drift, restore them to a single shared source instead of choosing one ad hoc.

## 0. Operating Default: Addy Osmani Skills
- Every non-trivial task is a skill-driven operation.
- When the environment supports local skills, prefer the Addy Osmani skill pack at `/Users/s3nik/.config/opencode/skills/addyosmani-agent-skills/skills`.
- Use the smallest relevant skill instead of forcing the entire pack.
- Once a relevant skill is selected, follow its instructions as the procedural backbone for the task.
- Common defaults:
  - planning -> `planning-and-task-breakdown`
  - implementation -> `incremental-implementation`
  - tests -> `test-driven-development`
  - review -> `code-review-and-quality`
  - frontend -> `frontend-ui-engineering`
  - API/contract work -> `api-and-interface-design`
  - release/CI -> `ci-cd-and-automation`

## 1. Default Design Reference
- For UI, frontend, design-system, motion, spacing, typography, color, or admin-shell work, read `DESIGN.md` before changing code.
- In this repo, `DESIGN.md` is the repo-root gateway to the canonical design system document at `DOCS/design/DESIGN.md`.
- Treat that design document as the default visual and interaction contract unless the user explicitly asks to break from it.

## 2. Core Axiom
- This repo follows the Artisan-MTS mandate.
- Code is a sacred liability. Minimize LOC.
- Aim for atomic batches, ideally under ~100 LOC per task when practical.
- Prefer thinking over acting: research first, then make the smallest surgical change.
- No drive-by refactors. Match the existing style exactly.
- For directive-style tasks, every response should start with a concise plan that maps Research, Red, Green, and Validation.

## 3. Execution Modes
- Builder mode: short, frequent Research -> Red -> Green loops for incremental work, UI polish, and feature exploration.
- Principal mode: deep Research -> `openspec/` definition -> atomic execution for larger refactors, new subsystems, and multi-file architecture changes.
- For principal-mode work, finalize the relevant `openspec/` change before editing `src/`.

## 4. Execution Protocol

### Research
- Research should do most of the work. Build a real mental model before editing.
- If search fails, broaden the query or pivot sources instead of assuming the information does not exist.
- Failure to find information is a research failure, not a tool limitation.
- For principal-mode changes, create or update `openspec/changes/<feature>/` as part of the research pass.

### Red
- Prove the problem first when practical.
- Empirically demonstrate the bug, failing path, or need for the feature before declaring the fix complete.

### Green
- Apply the smallest surgical change that satisfies the proven requirement.
- Preserve existing style and local architecture. Do not widen scope casually.

### Validation
- Validate with the real build, checks, repro, or tests before handoff.
- Before any handoff, the project must build cleanly with zero errors using the relevant project command (`npm run build`, `bun run check`, or equivalent).
- A claim about behavior is not done until it has been checked directly.

## 5. Context Engineering And Tracing
- Keep logging and session traces aligned with the existing `tmp/sessions` workflow when the task uses it.
- Maintain `tmp/sessions/SESSION.md`, `.json`, and `.sqlite` via `bun run session:log` when the task or workflow calls for session tracing.
- Every such log should include the correct phase flag, such as `research`, `red`, `green`, or `strategy`.

## 6. Project-Specific Requirements
- When working on Convex code, read `convex/_generated/ai/guidelines.md` first. Those rules override generic Convex assumptions.
- You can run `npx convex dev` to sync Convex schema and functions when the task requires it.
- Use Zellij for external sessions and multi-pane management when the task depends on that environment.

## 7. Tech And Architecture
- Host stack: Astro 6, Svelte 5, React 19, Convex, Sanity.
- Styling: pure CSS + OKLCH.
