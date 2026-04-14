# Content Rules

**Read this before making any change in this repository.**

This file is the **canonical, non-negotiable contract** for how content is handled in the stussysenik live portfolio. It applies to every human, every LLM session (including Claude Code), every automated script, every CI job, every tool that touches the repo or the production CMS.

If these rules and any other instructions conflict, **these rules win**.

---

## The First Principle

> **Content is sacred. Configuration is malleable.**
>
> The owner (senik / stussysenik) authors every word, image, video, caption, headline, bio, blog post, CV entry, and copy block in their own voice. Automated systems — LLMs, scripts, agents, CI — may help with *configuration* (variants, layouts, modes, toggles, presentation knobs) but must **never silently write to content fields**.

When content must change, automation **proposes**. The owner **disposes.**

---

## Content vs Configuration — the split

Every field in every schema is classified as one of:

| Classification | Meaning | Who can write |
|---|---|---|
| **`owner-only`** | Owner-authored content (words, captions, bios, asset selections, blog posts, CV entries) | Owner only, via Sanity Studio UI or the `/admin` panel UI. Never via automation. |
| **`llm-assisted`** | Configuration and presentation (variants, layouts, columns, colors, modes, speeds, grid density, section order) | Owner, admins, AND automation (LLMs, scripts). Free game. |
| **`system`** | System-managed metadata (audit timestamps, view counters, last-modified, build hashes) | Only the system itself. Humans and LLMs must not write these by hand. |

**Default for any new field: `owner-only`.** If you create a field and don't classify it, treat it as owner-only until the owner reviews the classification.

## The Five Guardrails

### 1. Classification is in the schema

Every Sanity schema and every Convex table declares the classification inline:

```typescript
// Example Sanity schema
{
  name: 'headline',
  type: 'string',
  _authorship: 'owner-only',  // ← required
}
```

No field ships without a classification. CI fails the build if any field is missing `_authorship`.

### 2. LLMs and scripts write to drafts only — never to published content

- All automated writes go to Sanity **draft** documents. Never to published.
- The owner promotes draft → published through Sanity Studio UI or the `/admin` publish button. **That button is the only code path allowed to touch published state.**
- Any automated mutation that tries to write a published document throws and logs loudly.

### 3. Review Mode — the kill switch

The `/admin` dashboard has a **Review Mode** toggle (backed by a Convex boolean flag).

When Review Mode is **ON**:
- **All writes to `owner-only` fields are rejected**, regardless of source.
- Sanity Studio, `/admin`, programmatic mutations, CI jobs, LLM tools — every write path checks the flag and refuses.
- Configuration writes (`llm-assisted`) still work, so presentation can be tuned without touching content.
- A prominent visual indicator appears on every `/admin` screen so the owner always knows it's on.

Use case: *"Someone is reviewing my CV right now. I flipped Review Mode on. Nothing can touch my content until I flip it off, even if I ask Claude to help with something else in the repo."*

### 4. Audit log — every content change is recorded

A Convex table `auditLog` records every mutation with:

- timestamp
- source (`owner` / `admin-ui` / `studio` / `llm` / `system` / `script`)
- actor (Clerk userId, tool name, or session ID)
- field path
- operation (create / update / delete)
- old value
- new value
- whether Review Mode was on at the time

The `/admin` Audit screen shows a reverse-chronological feed with **one-click rollback** per entry. Rollbacks are themselves audit entries.

### 5. The LLM boundary contract (this file)

Any LLM — including but not limited to Claude Code, Claude API agents, Copilot, Cursor, and future tooling — working in this repo **MUST**:

1. **Read this file before making any change.** If your tooling auto-loads repo-level instructions (`CLAUDE.md`, `AGENTS.md`, etc.), those files must reference this one.
2. **Never edit or propose changes to `owner-only` fields without explicit per-change owner approval.** Proposing means: show the diff, ask before writing, wait for the owner to say yes.
3. **Never bypass Review Mode.** If Review Mode is on and the owner asks you to change content, respond: *"Review Mode is on. I won't write to content fields until you turn it off."*
4. **Never modify `.sanity` project data, Convex `content/*` tables, or the `CONTENT_RULES.md` file itself without an explicit, specific instruction.** Ambiguous instructions like "clean this up" or "refactor" never count as consent to edit content.
5. **When unsure whether a field is content or configuration, assume content.** Ask the owner to confirm before writing.
6. **Log your intended changes.** If you're about to edit a file that touches Sanity schemas, Convex content tables, or any component that renders `owner-only` fields, state in your response what you're about to do and why *before* making the edit.

---

## Practical examples

**OK — configuration, free to edit:**
- Changing `hero.variant` from `photo-full-bleed` to `donut-centerpiece`
- Changing `gallery.config.columns` from 3 to 4
- Reordering sections in the page document
- Switching from `cargo` mode to `reader` mode
- Tweaking donut `idleSpeed` or `renderTier`
- Adjusting spacing tokens, adding new variants to the registry

**NOT OK — content, owner-only:**
- Rewriting the hero headline
- Changing the bio in the About section
- Editing blog post body text
- Modifying CV entry descriptions
- Changing photo captions
- Swapping which photo is shown in a given project tile (this is a content decision — which *asset* represents the work)
- Touching "voice-first" copy blocks

**Gray area — ask first:**
- Adding a new gallery project entry (it's a new content document — owner must author it)
- Changing an asset reference on a project (which Mux video represents this work — that's an editorial choice)
- Generating alt text for an image (new content, even if auto-generated)

When in doubt, **ask**.

---

## Enforcement

- **Build-time:** CI checks every Sanity schema and Convex table for `_authorship` metadata. Missing = build fails.
- **Runtime:** Every write path in the app (`/admin` mutations, Sanity Studio hooks, programmatic Convex mutations) runs through a classification check. `owner-only` writes during Review Mode throw; `owner-only` writes from non-owner sources throw; `system` writes from anyone other than the system throw.
- **Git hook:** Pre-commit hook scans staged diffs for obvious Sanity content file modifications and warns loudly.
- **This file:** immutable by convention. Changes to `CONTENT_RULES.md` itself require explicit owner approval in the commit message and must be reviewed before merge.

---

## Why this file exists

The owner has been burned before: they ask an LLM for help with a styling tweak, and the LLM — trying to be helpful — rewrites the headline copy at the same time. The content change is invisible until someone who was reviewing the live site points it out. This file exists so that never happens again.

The architecture enforces the principle. This file documents the principle so every future contributor, human or machine, knows the rules before they touch anything.

*Last updated: 2026-04-14.*
