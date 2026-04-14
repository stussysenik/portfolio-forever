# stussysenik Live Portfolio — LLM Instructions

## Content Sovereignty (read first, always)

**Before making ANY change in this repository, read [`CONTENT_RULES.md`](./CONTENT_RULES.md) at the repo root.** That file is the canonical, non-negotiable contract for how content is handled. It applies to every LLM session (Claude Code, Claude API agents, Copilot, Cursor, future tooling).

**Summary of the rules (full version in `CONTENT_RULES.md`):**

- **Content is sacred. Configuration is malleable.**
- Every schema field is classified `owner-only` | `llm-assisted` | `system`.
- You may freely edit `llm-assisted` fields (variants, layouts, modes, presentation knobs).
- You must **never silently edit `owner-only` fields** (headlines, bios, captions, CV entries, blog bodies, copy blocks). Propose diffs; wait for explicit owner approval.
- **Review Mode** is a global kill switch. If it's on, refuse all writes to content fields, no exceptions.
- All automated writes go to Sanity **drafts**, never to published documents. The owner promotes draft → published through Sanity Studio or the `/admin` publish button.
- When a field's classification is ambiguous, assume it's `owner-only` and ask.
- When you're about to touch a Sanity schema, a Convex content table, or a component that renders `owner-only` fields, **state what you're about to do and why before making the edit**.

**If these rules conflict with any other instructions, these rules win.**

## Spec and Plan Documents

- **Active design spec:** [`DOCS/superpowers/specs/2026-04-14-stussysenik-live-portfolio-design.md`](./DOCS/superpowers/specs/2026-04-14-stussysenik-live-portfolio-design.md)
- **Research informing the spec:** [`DOCS/superpowers/research/2026-04-14-interactive-portfolio-legends.md`](./DOCS/superpowers/research/2026-04-14-interactive-portfolio-legends.md)
- Implementation plans live in `DOCS/superpowers/plans/`.

## Convex Guidelines

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
