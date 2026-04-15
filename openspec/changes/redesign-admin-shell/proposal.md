# Proposal: Redesign Admin Shell

## Why
The admin today reads as "the site with extra columns" — the editor, the chrome, and the previewed public site all share the same off-white background with hairline dividers, so a user cannot tell at a glance where the tool ends and the content begins. On mobile, the admin is effectively unusable past the first tap: a grid-sizing bug collapses the `BookmarkTabs` editor region to zero height, and the only forward path the UI offers is a `cmd+K` prompt that no phone can reach. Iconography is a mix of Unicode glyphs, one-off SVGs, and identical green dots that make every feature flag look the same. And there is no `TECHSTACK.md` — every new agent re-derives the stack from `package.json` on first contact. This change fixes all four together because they are one coherent shell-level concern.

## What Changes
Give `/admin` its own visual identity so the editor reads as a distinct surface from the site it previews, swap the ad-hoc glyph/emoji/unicode icon mix for a single compile-time icon system via `unplugin-icons` + `@iconify-json/lucide`, and repair mobile admin so it is self-contained — no cmd+K dependency, no dead zone below the compartments. Light-mode-first; dark-mode cascades from the active site theme with strict CSS scoping so the preview iframe and the admin shell cannot leak styles into each other. Ship `TECHSTACK.md` at the repo root as the authoritative stack reference.

## Problem Statement

### 1. Admin chrome has no surface identity
`src/lib/admin/AdminShell.svelte` renders the three-column workspace (sidebar 220px, builder, preview pane with a 3px blue left-border at line 486) on the same off-white `--color-bg` the public site uses. The only separation between editor and preview is a hairline `--border-color-subtle` plus one blue keyline, so visually the admin reads as "the site with extra columns" rather than "a tool looking at the site." Admins lose their sense of where chrome ends and content begins, which is exactly the friction the user flagged in image #2.

### 2. Iconography is inconsistent
- `src/lib/components/FlagIndicator.svelte:38-50` renders every one of the ten flags as an identical 6px green dot — `pixel-engine`, `ascii-donut`, `terminal-matrix`, and `social-links` are visually the same shape, so `add-flag-visual-indicators` can ship parity but cannot ship legibility.
- `SectionCompartment.svelte`, `BookmarkTabs.svelte`, `PageBar.svelte`, and the command dock use a mix of Unicode glyphs (`○`, `⊙`, `⊚`, `⌥`, `⌘`), text labels, and bespoke SVGs with no shared source of truth.
- There is no icon package installed: new icons today mean hand-authoring SVG or pasting glyphs, which is why the system is drifting.

### 3. Mobile admin has a dead zone and leans on cmd+K
`AdminShell.svelte` gives the builder pane a grid row that assumes desktop preview-pane height math. On mobile (<768px), after `PageBar` + `GlobalCompartment` + the active `SectionCompartment` header render, **the compartment body never mounts the `BookmarkTabs` children** — the tabs + editor pane collapse to zero height because `overflow-y: auto` is applied to a container whose computed height has already been consumed by sibling rows. The result is image #3: an active section card, a blank mid-viewport, and a bottom cmd dock advertising `cmd+K` as the only way forward. A mobile user has no keyboard, so the admin is effectively unusable past the first tap.

### 4. No single source of truth for the stack
The repository has no `TECHSTACK.md`. Onboarding agents (and humans) re-derive the stack from `package.json` every session. `openspec/project.md` has a minimal tech-stack section but is not authoritative for deployment, testing, AI, or the 26-table Convex schema.

## Proposed Solution

### 1. Admin shell chrome (light-first, theme-aware, strictly scoped)

Rework `AdminShell.svelte` and its tokens so the admin becomes a framed workspace the preview lives *inside*, not *beside*.

- **Surface zones.** Three named zones with distinct token backgrounds: `--admin-chrome-bg` (rail + topbar + dock), `--admin-workspace-bg` (builder pane), `--admin-frame-bg` (preview pane outer frame). Light mode defaults: chrome `#F8F8F6`, workspace `#FFFFFF`, frame `#EEEEEC`. Divider treatment: 1px solid `--admin-keyline` between zones, plus a 4px `--admin-accent` rule on the active zone.
- **Preview frame.** The iframe gets a device-chrome header row inside the frame: `URL · responsive switcher · open-in-new`. The iframe itself sits inset with an 8px gutter inside the frame so the user physically sees "this is a window into the site."
- **Command dock.** The floating cmd bar in image #2 becomes a docked strip inside the chrome rail at the bottom, with a keyline above it. Never overlaps the preview or the workspace.
- **Theme inheritance (the parent/node concern).** Admin tokens live under `.admin-shell[data-admin]` with their own `--admin-*` namespace. Admin CSS never targets bare elements (`button`, `h1`, `a`) — every selector is scoped. The admin reads the active theme's accent color and mono/sans families via `var(--color-accent, <admin-fallback>)` so a dark site theme auto-promotes chrome to dark, but layout/spacing/sizing tokens stay pinned to admin defaults. The preview iframe is a separate document: the cascade physically cannot leak in or out.
- **Dark-mode inheritance.** No hard-coded dark palette. When the user activates a dark site theme, `.admin-shell` picks up `color-scheme: dark` via `:root[data-theme="darkroom"] .admin-shell` and swaps three token values (chrome, workspace, frame backgrounds) — nothing else moves.

### 2. Admin icon system (`unplugin-icons` + `@iconify-json/lucide`)

Install `unplugin-icons` and `@iconify-json/lucide` per the user-requested GitHub repo (`unplugin/unplugin-icons`). This gives compile-time tree-shakeable icon imports with zero runtime — `import IconHome from '~icons/lucide/home'` compiles to an inline SVG component, no icon-font fetch, no runtime registry.

- **Registry extension.** `src/lib/admin/flagIndicatorRegistry.ts` gains an `icon: string` field (iconify key, e.g. `'lucide:sparkles'` for `pixel-engine`, `'lucide:terminal'` for `terminal-matrix`). `add-flag-visual-indicators` keeps the green-dot vocabulary for state; this change adds semantic glyphs for identity. Both layers stack on one component.
- **Unicode cleanup.** Replace every ad-hoc Unicode glyph in `AdminShell.svelte`, `SectionCompartment.svelte`, `BookmarkTabs.svelte`, `PageBar.svelte`, and the command dock with a `~icons/lucide/*` import. No exceptions in admin surfaces.
- **Icon primitive.** `src/lib/admin/AdminIcon.svelte` wraps an iconify component with size/color props scoped to `--admin-*` tokens so icons always inherit the chrome palette. Size presets: `xs` (12px), `sm` (14px), `md` (16px), `lg` (20px).

### 3. Mobile admin navigation (fix the dead zone, replace cmd+K dependency)

- **Fix the layout bug.** Repair the grid template in `AdminShell.svelte` so mobile gets `grid-template-rows: auto auto 1fr auto` (topbar, PageBar, workspace, dock) with the workspace row taking `minmax(0, 1fr)` and a `100dvh`-rooted overall height. The current bug: the workspace row is implicitly sized by content, and with `overflow-y: auto` applied higher up, the compartment's `BookmarkTabs` and body mount into a zero-height container. Confirmed via the Explore subagent's read of `AdminShell.svelte:279-322, 464-477`.
- **Native mobile dock.** Replace the cmd+K entry point on mobile with a persistent 3-button dock inside the chrome: `PAGES · SECTIONS · PREVIEW`. Each button opens a native bottom sheet (not the CommandPalette). No LLM round-trip, no Zod parsing, no network cost — pure local navigation. The desktop CommandPalette from `command-palette-os` stays untouched and remains a power-user tool from tablet-up.
- **Sheet anatomy.**
  - `PAGES` sheet — full page list with the same `PageSidebar` logic lifted into a reusable component, no horizontal overflow pills.
  - `SECTIONS` sheet — the currently-active page's `SectionCompartmentList` in an expandable sheet, with the active compartment pre-scrolled into view.
  - `PREVIEW` sheet — full-height iframe preview with a dismiss handle. Replaces `PreviewDrawer.svelte` (which is a tiny 70vh modal today).
- **CmdPalette scoping.** `CommandPalette.svelte` gains a `min-width` media guard so it is physically unmountable below 768px. Mobile's entry point is the dock, never the palette.

### 4. `TECHSTACK.md` at repo root

Write an authoritative tech-stack document at `/TECHSTACK.md` grounded in the Explore subagent's survey: SvelteKit 2.49.1 / Svelte 5 runes, Convex 1.34.1 + 26-table schema, Vercel adapter-static via Bun, Clerk 6.3.3, Sentry 10.46.0, PostHog 1.364.1, KaTeX, Mux Player, Melt UI, Playwright (13 test projects), Storybook 10.3.3, `unplugin-icons` (new). Organized by layer: Frontend / Backend / Data / Tooling / Testing / Deployment / AI / Content. Intended as the entry point for new agents and contributors — not a changelog.

## Impact & Benefits

- **Cognitive clarity** — the admin stops reading as "the site with extra columns" and becomes a tool with its own identity
- **Mobile usability** — the admin is actually usable on a phone without a keyboard; the cmd+K dependency is severed
- **Icon consistency** — one source of truth (lucide via iconify), compile-time tree-shaken, zero-runtime, matching the monochrome aesthetic
- **Theme safety** — scoped inheritance means no future theme can accidentally break the admin, and no admin change can leak into the public site
- **Stack clarity** — `TECHSTACK.md` is the one place to look for "what does this project run on"
- **Complements in-flight work** — layers cleanly on top of `overhaul-admin-ux`, `add-flag-visual-indicators`, and `command-palette-os` without duplicating them

## Dependencies & Relationship to In-Flight Changes

- **`overhaul-admin-ux`** (29/37) — covers Home card, breakpoints, flags pagination, change tracking, history, topbar overflow. **No overlap.** Those are control-level changes; this is shell-level. Lands on top without conflict.
- **`add-flag-visual-indicators`** (0/30) — adds green-dot vocabulary to the registry and a public-site indicator. **Extends it.** This change adds an `icon` field to the same `flagIndicatorRegistry` shape so state (dot color) and identity (glyph) compose on one component. Spec delta for `add-flag-visual-indicators` stays as-written; this one adds a requirement on top.
- **`command-palette-os`** (0/68) — ships the desktop NLP command palette. **Scopes it.** This change adds a `min-width: 768px` guard so the palette is desktop-primary and the mobile dock is the mobile-primary entry.

## Risks

- **Theme cascade surprises** — scoping admin under `.admin-shell[data-admin]` and forbidding bare-element selectors is a discipline, not a compile-time guarantee. Mitigation: a grep-based test in the Playwright admin spec that fails CI if any `src/lib/admin/**` CSS targets a bare element.
- **Icon bundle growth** — lucide has ~1400 icons. `unplugin-icons` is compile-time so only imported icons ship, but careless imports could still bloat the admin bundle. Mitigation: restrict iconify imports in `src/lib/admin/**` to a shared `admin-icons.ts` manifest; reject unknown imports at review.
- **Mobile dock duplicates CommandPalette work** — the sheets reuse existing primitives (`PageSidebar`, `SectionCompartmentList`, iframe mount) so there is no new data plumbing; the risk is visual drift, mitigated by shared tokens.
- **Regression in existing admin** — the grid-template repair is a behavior change. Mitigation: Playwright responsive spec for admin at 390px, 768px, 1024px, 1440px asserting that the builder pane actually contains visible BookmarkTabs children after mount.

## Success Criteria

- [ ] Admin at 1440px visually reads as a distinct surface from the previewed site (screenshot baseline diff)
- [ ] At 390px, after selecting a section, the CONTENT bookmark is mounted with non-zero height and its fields are interactable
- [ ] `cmd+K` does not open on mobile (<768px); the `PAGES · SECTIONS · PREVIEW` dock is the only entry point
- [ ] Every icon in `src/lib/admin/**` imports from `~icons/lucide/*` — zero Unicode glyphs, zero inline SVG, zero emoji
- [ ] Flag indicators render per-flag lucide icons alongside the state dot from `add-flag-visual-indicators`
- [ ] `.admin-shell` CSS contains no bare-element selectors (grep test passes)
- [ ] Switching the site theme between `minimal` (light) and `darkroom` (dark) auto-promotes admin chrome to the matching mode with no additional code
- [ ] `TECHSTACK.md` exists at repo root and lists every dependency from `package.json` with exact versions
- [ ] No regressions in `overhaul-admin-ux`, `add-flag-visual-indicators`, or `command-palette-os`
