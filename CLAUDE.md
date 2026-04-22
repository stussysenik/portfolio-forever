<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

# Repo Agent Instructions

This file is the `CLAUDE.md` equivalent of the canonical project guidance in `/Users/s3nik/Desktop/portfolio-forever/GEMINI.md`.

## 0. Default Method Pack: Addy Osmani Skills
- When the environment supports local skills, prefer the Addy Osmani skill pack at `/Users/s3nik/.config/opencode/skills/addyosmani-agent-skills/skills`.
- Use the smallest relevant skill for the task instead of forcing the entire pack.
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

## Core Axiom
- This repo follows the Artisan-MTS mandate.
- Code is a sacred liability. Minimize LOC and keep batches atomic.
- Prefer thinking over acting: research first, then make the smallest surgical change.
- No drive-by refactors. Match the existing style exactly.
- For directive-style tasks, start with a concise plan that maps research, red, green, and validation.

## Execution Modes
- Builder mode: short research -> red -> green loops for incremental work.
- Principal mode: deep research -> `openspec/` definition -> atomic execution for larger architectural changes.
- For principal-mode work, finalize the relevant `openspec/` change before editing `src/`.

## Protocol
- Research should do most of the work. Build a real mental model before editing.
- If search fails, broaden the query or pivot sources instead of assuming the information does not exist.
- Prove the problem first when practical.
- Validate with the real build, checks, repro, or tests before handoff.

## Tech And Architecture
- Host stack: Astro 6, Svelte 5, React 19, Convex, Sanity.
- Styling: pure CSS + OKLCH.
- Keep logging and session traces aligned with the existing `tmp/sessions` workflow when the task uses it.

