# Proposal: Finish Admin CMS — Command Palette + Preview + Change Tracking

## Overview
Ship the admin CMS to completion across three interconnected workstreams: (1) fix and finalize the cmd+K command palette so it actually works end-to-end, (2) make the live preview usable across mobile/iPad/desktop breakpoints from the palette, and (3) unify the change tracking story so every action — whether from cmd+K or from sidebar controls — shows clearly what changed, what's pending, and what the site looks like now.

## Problem Statement

1. **cmd+K is broken.** `convex/commandOs.ts` exists but `api.commandOs` throws a TypeScript error (missing from generated types). The Convex action needs `"use node"` for the Anthropic `fetch` call. The public layout mounts a *different* `CommandPalette` from `$lib/components/` creating confusion.
2. **No preview from command context.** When you type "set theme terminal" in cmd+K, you can't see what it looks like. The PreviewPane lives in the sidebar and isn't accessible from the palette flow.
3. **Change tracking is fragmented.** The admin has two disconnected systems: (a) `pending.ts` store used by cmd+K for staged changes, and (b) `adminHistory` Convex table + `ChangeBadge`/`HistoryPopover` used by sidebar controls. They don't talk to each other.
4. **Module boundaries are unclear.** `command-os/`, `admin/`, preview components, and pending state are tangled — no clear separation of concerns.

## Proposed Solution

### Workstream A: Fix cmd+K end-to-end
- Add `"use node"` to `convex/commandOs.ts` so the Anthropic fetch works in Node runtime
- Fix the TypeScript error so `api.commandOs.routeCommand` resolves
- Remove the duplicate `CommandPalette` from the public layout (`src/routes/+layout.svelte`) — it belongs only in admin
- Wire the local parser fallback so cmd+K works even without an API key (it already has `parser.ts`, just needs the error path cleaned up)

### Workstream B: Preview integration
- Add a "preview breakpoint" command to the registry: `previewAt 390`, `previewAt 768`, `previewAt 1440`
- After any visual change (theme, font, flag toggle), show a mini inline preview thumbnail in the cmd+K confirmation state
- Make the PreviewPane breakpoint controls accessible from a "preview" command in the palette

### Workstream C: Unified change tracking
- Every `execute()` call in the registry should write to the `adminHistory` Convex table (same table the sidebar controls use)
- The cmd+K pending store should show entries from `adminHistory` so you see *all* recent changes — not just ones from this session
- The "staged changes" card in cmd+K should pull from the same source of truth as the sidebar's `ChangeBadge`

### Architecture: Clean module boundaries

```
src/lib/command-os/       ← Command layer (palette UI, parser, registry, cache)
src/lib/admin/            ← CMS controls (sidebar, sections, flags, settings)
src/lib/admin/primitives/ ← Shared primitives (ChangeBadge, ResetButton, HistoryPopover)
src/lib/admin/previews/   ← Preview layer (PreviewPane, breakpoint controls)
convex/adminHistory.ts    ← Single source of truth for all change tracking
convex/commandOs.ts       ← LLM routing action (Node runtime)
```

## Success Criteria
- [ ] `cmd+K` opens on `/admin`, types a command, shows preview, executes — zero TS errors
- [ ] `cmd+K` does NOT appear on public routes (/, /works, etc.)
- [ ] Local parser handles theme/font/navigate/flag without needing ANTHROPIC_API_KEY
- [ ] Every command execution writes to `adminHistory` table
- [ ] cmd+K "staged changes" card reflects recent `adminHistory` entries
- [ ] `svelte-check` passes with no new errors in command-os or admin directories
- [ ] Preview breakpoints (390/768/1440) are accessible from cmd+K

## Non-Goals
- Voice input
- Multi-step agent chains (one command → one action)
- Public-facing command palette
- Lua escape hatch (deferred)
