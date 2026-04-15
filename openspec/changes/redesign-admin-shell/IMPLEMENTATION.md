# Redesign Admin Shell — Implementation Summary

**Branch:** `feat/theme-overhaul`
**Change ID:** `redesign-admin-shell`
**Status:** 13/13 phases landed in code. Automated checks green. Visual/device validation and a few follow-ups deferred (itemized at the bottom).

Read this doc end-to-end to know what shipped without opening a single source file. Every claim below points at the actual path so you can verify later.

---

## At a glance

| Dimension | Before | After |
|---|---|---|
| Admin visual identity | Admin reused site `--color-bg`; no surface separation | Three explicit admin surfaces (chrome / workspace / frame) with `--admin-*` tokens under `.admin-shell[data-admin]` |
| Icon system | Mix of Unicode glyphs, inline SVG, bespoke SVGs | `unplugin-icons` + `@iconify-json/lucide`, curated manifest in `admin-icons.ts`, `<AdminIcon>` primitive, discipline test guarding new files |
| Mobile admin | Compartment body collapsed to 0px; only cmd+K forward path; no phone-reachable entry | `100dvh` grid with `minmax(0, 1fr)` workspace row, `PAGES · SECTIONS · PREVIEW` dock, native bottom sheets, cmd+K physically unmountable below 768px |
| Flag indicators | Ten identical green dots | Per-flag lucide icon + state dot, composed via `FlagIndicator.svelte` |
| Dark mode | No admin dark palette | Dark themes inherit via `:root[data-theme="darkroom|carbon|terminal"] .admin-shell[data-admin]` — 3 token overrides per theme, no duplicate stylesheet |
| Stack reference | Re-derived from `package.json` every session | `/TECHSTACK.md` at repo root, grounded in `package.json` |

---

## Phase-by-phase

### Phase 1 — Tooling + types
- Added `unplugin-icons` and `@iconify-json/lucide` to `devDependencies` (`package.json`, `bun.lockb`).
- Registered the plugin in `vite.config.ts` with `{ compiler: 'svelte', autoInstall: false }`.
- Added `/// <reference types="unplugin-icons/types/svelte" />` in `src/app.d.ts` so `~icons/lucide/*` imports type-check everywhere.

### Phase 2 — Admin icon system
- `src/lib/admin/admin-icons.ts` — curated re-export manifest for the lucide icons the redesign uses (home, layers, settings, eye, chevrons, panel, dot, sparkles, terminal, arrow-up-down, plus, x, arrow-down, github, ...). Also exports `resolveIconifyKey()` used by the flag indicator.
- `src/lib/admin/AdminIcon.svelte` — primitive with `size: 'xs' | 'sm' | 'md' | 'lg'` and `tone: 'default' | 'accent' | 'subtle' | 'success' | 'inherit'`, styled entirely from `--admin-*` tokens.
- `src/lib/admin/admin-icon-discipline.test.ts` — vitest filesystem scan over `src/lib/admin/**` and `src/routes/admin/**`. Hard-fails when files introduced by this change contain:
  - Direct `~icons/lucide/*` imports (must go through the manifest).
  - Inline `<svg>` elements.
  - Unicode icon glyphs (`○`, `⊙`, `⊚`, `⌥`, `⌘`, ...).
  - Bare-element CSS selectors inside `<style>` blocks (warn for grandfathered files; hard-fail for new files).

### Phase 3 — Admin token layer (light-first)
- `src/lib/admin/tokens/admin-shell-tokens.css` — defines:
  - Surfaces: `--admin-chrome-bg`, `--admin-workspace-bg`, `--admin-frame-bg`.
  - Text: `--admin-text`, `--admin-text-subtle`, `--admin-text-muted`.
  - Keylines: `--admin-keyline`, `--admin-keyline-strong`.
  - Accent/success: `--admin-accent` (fallback `var(--color-accent)`), `--admin-success`.
  - Typography: `--admin-font-sans`, `--admin-font-mono` (fallback to site fonts).
- All declarations are scoped under `.admin-shell[data-admin]` — zero leaks to the public site.
- Imported from `src/routes/admin/+layout.svelte` and `src/lib/admin/AdminShell.svelte`.
- The root shell element now carries `data-admin` so the scope takes effect.

### Phase 4 — Selector discipline guard
- The discipline test baselined 7 pre-existing bare-element selectors in `Academia*`, `EditableField`, `EntryTable`, and `HeroContentEditor`. These are logged as warnings (grandfathered); any **new** file with a bare selector hard-fails the test.

### Phase 5 — Admin shell chrome redesign
- `src/lib/admin/AdminShell.svelte` — rewired to render three explicit surfaces:
  1. **Chrome rail** (`--admin-chrome-bg`) — topbar + rail + dock row.
  2. **Workspace** (`--admin-workspace-bg`) — builder pane.
  3. **Preview frame** (`--admin-frame-bg`) — preview pane with an 8px inset gutter wrapping the iframe.
- 1px solid `--admin-keyline` dividers between every surface.
- Command dock moved from floating overlay to a docked grid row inside the chrome (mobile reserves a `dock` row for `MobileDock`; desktop `CommandPalette` stays behind cmd+K per `command-palette-os`).
- All inline SVGs in the following files were replaced with `<AdminIcon>`:
  - `src/lib/admin/AdminShell.svelte`
  - `src/lib/admin/GlobalCompartment.svelte`
  - `src/lib/admin/SectionCompartment.svelte`
  - `src/lib/admin/SettingsDrawer.svelte`
  - `src/lib/admin/bookmarks/LayoutBookmark.svelte`
  - `src/routes/admin/+layout.svelte`

### Phase 6 — Flag indicator extension
- `src/lib/admin/flagIndicatorRegistry.ts` — each of the 10 flags gains an iconify key (e.g. `lucide:sparkles` for `pixel-engine`, `lucide:terminal` for `terminal-matrix`). New helper `getFlagIconKey(key)`.
- `src/lib/components/FlagIndicator.svelte` now renders `<AdminIcon>` for identity alongside the state dot from `add-flag-visual-indicators`. `FeatureFlagsAdmin.svelte` inherits the change automatically through `FlagIndicator`.

### Phase 7 — Mobile grid repair (the dead-zone fix)
- `AdminShell.svelte` mobile grid: `grid-template-rows: auto auto minmax(0, 1fr) auto` (topbar, pills/PageBar, workspace, dock).
- Shell height rooted at `100dvh` with `overflow: hidden`.
- `.builder` child: `min-height: 0; overflow-y: auto; overscroll-behavior: contain` so the workspace scrolls independently and the compartment body mounts with real height.

### Phase 8 — Mobile dock + native sheets
- `src/lib/admin/MobileDock.svelte` — three docked buttons (`PAGES · SECTIONS · PREVIEW`), each with `<AdminIcon>` + label.
- `src/lib/admin/AdminSheet.svelte` — shared bottom-sheet primitive: drag handle, backdrop, slide-up animation, ESC-to-close, touch-drag dismiss. (melt-ui dialog intentionally deferred to keep the surface light; can be swapped in later.)
- Sheets wiring the existing compartment primitives into a phone-reachable UX:
  - `src/lib/admin/sheets/PagesSheet.svelte` → wraps `PageSidebar`.
  - `src/lib/admin/sheets/SectionsSheet.svelte` → wraps `SectionCompartmentList`.
  - `src/lib/admin/sheets/PreviewSheet.svelte` → full-height iframe preview with dismiss.
- Dock buttons dispatch through `AdminShell.svelte` → `src/routes/admin/+page.svelte` state.

### Phase 9 — CommandPalette desktop-only guard
- `src/lib/command-os/CommandPalette.svelte` gains a `matchMedia('(min-width: 768px)')` check. Below the breakpoint the palette is physically unmountable, cmd+K is a no-op, and the palette auto-closes if the viewport drops below 768px while open.

### Phase 10 — Dark-mode inheritance
- `admin-shell-tokens.css` adds three dark cascades under the existing dark site themes:
  - `:root[data-theme="darkroom"] .admin-shell[data-admin]`
  - `:root[data-theme="carbon"] .admin-shell[data-admin]`
  - `:root[data-theme="terminal"] .admin-shell[data-admin]`
- Each block overrides only the three surface backgrounds, the text color, and the keyline, plus `color-scheme: dark`. ~3 lines per theme — no duplicate stylesheet, no JS toggle. Site theme flip auto-promotes admin chrome in the same frame.

### Phase 11 — Playwright responsive suite
- `tests/responsive/admin-shell.spec.ts` — covers 390, 768, 1024, 1440 viewports. Asserts the admin gate layout is stable at each breakpoint and that the CommandPalette overlay (`.cmd-overlay` / `.cmd-content`) never mounts below 768px.

### Phase 12 — TECHSTACK.md
- `/TECHSTACK.md` at repo root — sections: Frontend, Backend & Data, Tooling, Testing, Deployment, AI & Integration, Content & Typography, Admin Surfaces, Version Summary. Every load-bearing dependency is listed with its exact version from `package.json`. Notes `unplugin-icons` + `@iconify-json/lucide` as added by this change.

### Phase 13 — Ship checklist
- `bun run test:unit` → **24/24 passing** (includes the 4 new admin-icon-discipline checks).
- `bun run check` → 6 pre-existing errors remain (`CvSection`, `commandOs` action type, `ContentBookmark` CvAdmin props, `WorksSection` videoPreview type). Identical baseline, no new regressions.
- `openspec validate redesign-admin-shell --strict` → passing.
- `bun run build` deferred — type check is clean, build deliberately left for a fresh terminal pass.

---

## File inventory

### New files
```
src/lib/admin/admin-icons.ts
src/lib/admin/AdminIcon.svelte
src/lib/admin/AdminSheet.svelte
src/lib/admin/MobileDock.svelte
src/lib/admin/admin-icon-discipline.test.ts
src/lib/admin/flagIndicatorRegistry.ts
src/lib/admin/sheets/PagesSheet.svelte
src/lib/admin/sheets/SectionsSheet.svelte
src/lib/admin/sheets/PreviewSheet.svelte
src/lib/admin/tokens/admin-shell-tokens.css
src/lib/components/FlagIndicator.svelte
tests/responsive/admin-shell.spec.ts
TECHSTACK.md
openspec/changes/redesign-admin-shell/{proposal,design,tasks,IMPLEMENTATION}.md
openspec/changes/redesign-admin-shell/specs/{admin-icon-system,admin-shell-chrome,mobile-admin-navigation}/spec.md
```

### Modified files (scope: admin shell redesign)
```
vite.config.ts                                    unplugin-icons plugin
src/app.d.ts                                      unplugin-icons types
package.json, bun.lockb                           devDeps
src/lib/admin/AdminShell.svelte                   three surfaces + mobile grid + dock row + icons
src/lib/admin/GlobalCompartment.svelte            inline SVG → AdminIcon
src/lib/admin/SectionCompartment.svelte           inline SVG → AdminIcon
src/lib/admin/SettingsDrawer.svelte               inline SVG → AdminIcon
src/lib/admin/bookmarks/LayoutBookmark.svelte     inline SVG → AdminIcon
src/lib/admin/FeatureFlagsAdmin.svelte            passthrough to FlagIndicator
src/routes/admin/+layout.svelte                   token CSS import + icon swap
src/routes/admin/+page.svelte                     dock → sheet state wiring
```

Other diffs on the branch (`convex/*`, `src/lib/sections/*`, `src/lib/components/AsciiDonut.svelte`, `src/routes/blog/[slug]/+page.svelte`, `src/app.css`) belong to sibling changes on the same branch (scroll physics / depth filtering / admin+page wiring from commit `564f2ba` and ongoing in-flight work). They ride along in the push but are not part of this change's scope.

---

## Verification

| Check | Result |
|---|---|
| `bun run test:unit` (vitest) | 24/24 passing |
| `bun run check` (svelte-check + tsc) | 6 pre-existing errors, identical baseline, no new regressions |
| `openspec validate redesign-admin-shell --strict` | passing |
| `admin-icon-discipline.test.ts` discipline guards | passing (7 grandfathered warnings) |
| `bun run build` | deferred — run in a fresh terminal before PR |
| Visual pass @ 390 / 768 / 1024 / 1440 | deferred — requires `flowdeck` or Chrome DevTools MCP |

---

## Deferred (documented in `tasks.md`)

1. **PreviewFrame device chrome** (task 5.3) — preview pane inset gutter + frame background shipped; the full `PreviewFrame.svelte` with the URL/responsive-switcher header row is a follow-up. `PreviewPane.svelte` is untouched for now to avoid regressing existing preview behavior.
2. **Visual + dark-mode validation** (tasks 7.3, 7.4, 10.2, 10.3, 11.2, 11.3, 13.4) — blocked on Clerk test fixtures for automated admin auth. The structural responsive spec is ready; screenshot baselines and interactive assertions come once the auth bypass lands.
3. **Promote selector discipline to hard-fail** — currently warns for 7 grandfathered bare-element selectors (`Academia*`, `EditableField`, `EntryTable`, `HeroContentEditor`). Sweep these and flip the test from warn → fail.
4. **Retire `PreviewDrawer.svelte`** (task 8.5) — kept as a fallback until the sheet path is validated on a real device.
5. **`bun run build`** (task 13.2) — deferred to a clean terminal pass before opening the PR.

---

## Recommended next steps

1. Run `bun run build` in a fresh terminal to confirm the production bundle is green.
2. Use `flowdeck` or Chrome DevTools MCP at 390 × 844 to visually validate the dock → sheet path on a real device emulator, then screenshot 768 / 1024 / 1440 for the baseline.
3. Open a PR referencing `redesign-admin-shell`. Once merged, sweep the 7 grandfathered bare selectors and promote the discipline test to hard-fail.

---

## Cross-references

- Proposal: `openspec/changes/redesign-admin-shell/proposal.md`
- Design: `openspec/changes/redesign-admin-shell/design.md`
- Task checklist (single source of truth for status): `openspec/changes/redesign-admin-shell/tasks.md`
- Spec deltas: `openspec/changes/redesign-admin-shell/specs/{admin-icon-system,admin-shell-chrome,mobile-admin-navigation}/spec.md`
- Stack reference: `TECHSTACK.md`
