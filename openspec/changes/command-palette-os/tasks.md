# Tasks: Command Palette OS

## Overview
Ordered task list for implementing the cmd+K NLP action registry, Convex LLM proxy, and admin-gated palette overlay. Blocker: **static-site waiver sign-off** is required before Phase 2 can start.

---

## Phase 0: Waiver sign-off (blocker)

### Task 0.1: Static-site constraint waiver
**Files**: `openspec/project.md` (no edit yet), `design.md` (this change)

- [ ] Project owner reviews the narrow waiver argument in `design.md` §"Static-site waiver justification"
- [ ] Explicit approval captured (comment in this tasks.md or in `DOCS/plans/2026/04/15/portfolio-os-grounding.md` Decisions Log)
- [ ] If approved: document the narrow waiver in `openspec/project.md` as a side note to line 48

---

## Phase 1: Typed Action Registry

### Task 1.1: Create registry module
**File**: `src/lib/command-os/registry.ts`

- [ ] Create `src/lib/command-os/` directory
- [ ] Install `zod` if not already in deps
- [ ] Define `ActionSpec<TArgs>` TypeScript interface matching `design.md` §"Registry shape"
- [ ] Export a typed `registry` object literal using `as const satisfies Record<string, ActionSpec>`

---

### Task 1.2: Seed initial action set
**File**: `src/lib/command-os/registry.ts`

- [ ] `createWork` — binds to `api.works.createEntry`
- [ ] `updateWork` — binds to `api.works.updateEntry`, supports partial `styleOverrides` (depends on `works-page-editability` change landing first)
- [ ] `deleteWork` — binds to `api.works.deleteEntry`
- [ ] `createBlogPost` — binds to `api.blog.createPost`
- [ ] `updateBlogPost` — binds to `api.blog.updatePost`
- [ ] `setTheme` — binds to `api.themes.setDefault` or page-level `themeOverrides` via `api.pages.updateSectionThemeOverrides`
- [ ] `setFont` — updates `localStorage` + dispatches the existing FontSwitcher custom event
- [ ] `toggleFlag` — binds to `api.siteConfig.setFeatureFlag`
- [ ] `navigateTo` — client-side route navigation via `goto` from `$app/navigation`

---

### Task 1.3: JSON schema generation
**File**: `src/lib/command-os/schema.ts`

- [ ] Install `zod-to-json-schema`
- [ ] Export `getRegistrySchema()` that serializes each registry entry into Anthropic tool-call format
- [ ] Unit test: schema round-trips for every registry entry

---

## Phase 2: Convex LLM proxy

### Task 2.1: Create Convex action
**File**: `convex/commandOs.ts`

- [ ] Create `routeCommand` Convex **action** (not mutation — must call external services)
- [ ] Args: `v.object({ input: v.string() })`
- [ ] Install Anthropic SDK (or AI Gateway client) as a Convex-side dep
- [ ] Store API key via `npx convex env set ANTHROPIC_API_KEY`

---

### Task 2.2: Prompt assembly
**File**: `convex/commandOs.ts`

- [ ] System prompt enforces tool-call-only behavior (no free-form prose)
- [ ] Inject registry JSON schema from `src/lib/command-os/schema.ts` (share code across client + Convex)
- [ ] User turn is `args.input` verbatim
- [ ] Use Anthropic `tool_choice: { type: "any" }` (or provider equivalent)

---

### Task 2.3: Response validation
**File**: `convex/commandOs.ts`

- [ ] Parse Anthropic response; reject if not a tool call → `{ success: false, error: "model_refused_tool" }`
- [ ] Look up registry entry; reject `unknown_action`
- [ ] Run `registry[name].parameters.safeParse`; reject `schema_validation_failed` with Zod issues
- [ ] Return `{ success: true, action, args }` on success
- [ ] Unit test: each error path returns the correct structured response

---

## Phase 3: UI Overlay

### Task 3.1: Install melt-ui
**File**: `package.json`

- [ ] `bun add @melt-ui/svelte`
- [ ] Verify Svelte 5 runes compatibility with the installed version

---

### Task 3.2: Create CommandPalette component
**File**: `src/lib/command-os/CommandPalette.svelte`

- [ ] Use melt-ui Dialog + Combobox builders
- [ ] Global `cmd+K` / `ctrl+K` keyboard shortcut listener (window-level)
- [ ] Input uses a `<pre>`-styled container to preserve whitespace (per `feedback_pretext_longform.md`)
- [ ] Debounce input → `routeCommand` call (300ms)
- [ ] States: idle, loading, preview, error, success
- [ ] Loading state renders a "thinking…" indicator while the LLM is working

---

### Task 3.3: Mount in admin layout only
**File**: `src/routes/admin/+layout.svelte` (or equivalent — verify path)

- [ ] Import and render `<CommandPalette />` gated by Clerk auth
- [ ] Do NOT mount in `src/routes/+layout.svelte` (public layout)
- [ ] Verify via Playwright that cmd+K does nothing on public routes

---

## Phase 4: Execution pipeline

### Task 4.1: Preview rendering
**File**: `src/lib/command-os/CommandPalette.svelte`

- [ ] Render action name in human-readable form
- [ ] Render parameters in pre-text (monospace, no-wrap) block
- [ ] For updates/deletes: fetch the current row via the existing Convex query and render a minimal diff
- [ ] Preview is always the last step before mutation — no auto-execute

---

### Task 4.2: Confirmation flow
**File**: `src/lib/command-os/CommandPalette.svelte`

- [ ] Enter key confirms and runs `registry[name].execute(args, ctx)`
- [ ] Escape cancels and closes the palette, clearing state
- [ ] Success → brief toast (reuse existing Toast component), close palette, clear input
- [ ] Error → show error inline, keep input for retry/edit

---

### Task 4.3: Local LRU cache
**File**: `src/lib/command-os/cache.ts`

- [ ] LRU cache (size ~20) mapping exact input string → validated tool call
- [ ] Cache hit avoids the LLM round-trip entirely
- [ ] Cache is per-session (in-memory), not persisted to localStorage
- [ ] Cache is cleared on sign-out

---

## Phase 5: Testing & Docs

### Task 5.1: Unit tests
**File**: `src/lib/command-os/registry.test.ts`

- [ ] Every registry entry: Zod schema rejects malformed input with a clear error
- [ ] Every `execute` fn: binds to the correct Convex mutation (mock `ctx.client`)
- [ ] JSON schema generation round-trips each entry

---

### Task 5.2: E2E tests
**File**: `tests/e2e/command-palette.spec.ts`

- [ ] `cmd+K` opens the palette on `/admin` routes
- [ ] `cmd+K` is a no-op on public routes (`/`, `/works`, `/cv`, etc.)
- [ ] Happy path: type → preview → confirm → works page updates via subscription
- [ ] Rejection path: unknown action shows structured error inline
- [ ] Full keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] axe-core accessibility scan passes

---

### Task 5.3: Storybook story
**File**: `src/lib/command-os/CommandPalette.stories.ts`

- [ ] Stories for: idle, loading, preview, error, success states
- [ ] Mock the `routeCommand` Convex action in Storybook context

---

### Task 5.4: Documentation
**File**: `openspec/controls-architecture.md`

- [ ] Add a §"Command Palette" subsection documenting the registry / Convex proxy / melt-ui overlay architecture
- [ ] Cross-reference "Double-Tap Live Editability" (`:40`) as the primitive this implements via natural-language surface

---

## Task Summary

**Total Tasks**: ~25
**Completed**: 0/25 (0%)
**Blocker**: Phase 0 — static-site waiver sign-off from project owner
**Dependencies**: `works-page-editability` should land first so `updateWork` can address the new fields (`linkLabel`, `styleOverrides.httpColor`, `styleOverrides.secondaryHighlight`)
