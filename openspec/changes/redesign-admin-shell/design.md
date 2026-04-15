# Design: Redesign Admin Shell

## Context
This change touches three independently-risky systems — CSS cascade scoping, a new build-time Vite plugin, and a mobile layout bug fix — so the trade-offs need to be explicit before implementation. The parent/node concern the user raised is real: without discipline, admin tokens will bleed into the public site or the public site's theme will overwrite admin chrome unpredictably.

## Architecture

```mermaid
flowchart TD
    Root["`:root`<br/>site tokens<br/>--color-bg, --color-text, --color-accent<br/>--font-family-sans, --font-family-mono"] --> Theme["`:root[data-theme=T]`<br/>theme override<br/>minimal / studio / darkroom / accessible"]
    Theme --> AdminShell["`.admin-shell[data-admin]`<br/>--admin-chrome-bg<br/>--admin-workspace-bg<br/>--admin-frame-bg<br/>--admin-keyline<br/>--admin-accent → var(--color-accent)"]
    Theme --> PublicSite["`main.site`<br/>public pages<br/>reads :root tokens directly"]
    AdminShell --> Chrome["chrome rail<br/>topbar + dock<br/>--admin-chrome-bg"]
    AdminShell --> Workspace["workspace<br/>builder pane<br/>--admin-workspace-bg"]
    AdminShell --> Frame["preview frame<br/>--admin-frame-bg"]
    Frame -. iframe boundary<br/>separate document .-> Iframe["iframe document<br/>inherits :root from<br/>top-level via srcdoc/URL"]
```

Three cascade rules that MUST hold:

1. **Admin tokens are namespaced.** Every admin variable starts with `--admin-`. They are defined once under `.admin-shell[data-admin]` and never on `:root`. Public site code cannot accidentally read them.
2. **Admin CSS selectors are scoped.** Every selector in `src/lib/admin/**/*.svelte` must start with `.admin-*` or be inside a `<style>` block on a `.admin-*` element. No `button { ... }`, no `h1 { ... }`, no `a { ... }`. Svelte's CSS scoping helps but is not sufficient because the admin uses global tokens; we forbid bare selectors explicitly.
3. **Preview isolation.** The preview `<iframe>` is a separate document. Its cascade cannot reach the admin shell and vice versa. This is the reason we use an iframe rather than a sibling `<div>` — it gives us a hard wall for free.

## Decision 1: Theme inheritance via fallback vars, not @media

**Options considered:**
- **A. Hardcoded light + `prefers-color-scheme` media query.** Admin ignores the site theme and uses system preference.
- **B. Duplicate stylesheets for each theme.** One file per theme (`admin-minimal.css`, `admin-darkroom.css`), loaded conditionally.
- **C. (chosen) Token inheritance via `var(--color-accent, <fallback>)`.** Admin defines `--admin-accent: var(--color-accent, #2563EB)`. When the active theme changes `--color-accent`, admin picks it up automatically.

**Why C.** The user's concern is "inherit based off the theme that's selected." Option A ignores the theme entirely, which is the opposite of what was asked. Option B duplicates CSS per theme and drifts over time. Option C is one line per token, one place to change, and the cascade does the work. The only restriction is that we cap inheritance to a short list of "safe" theme tokens (accent, mono family, sans family) — we never inherit color-bg or color-text because they would destroy admin legibility.

**The short safe list (v1):**
```css
.admin-shell[data-admin] {
  --admin-accent: var(--color-accent, #2563EB);
  --admin-font-sans: var(--font-family-sans, -apple-system, sans-serif);
  --admin-font-mono: var(--font-family-mono, 'JetBrains Mono', monospace);
}
```
Everything else (`--admin-chrome-bg`, `--admin-workspace-bg`, `--admin-keyline`, `--admin-text`) is locally declared and only overridden inside a `:root[data-theme="darkroom"] .admin-shell` block.

## Decision 2: Dark mode via theme selector, not `@media (prefers-color-scheme)`

The user said "dark mode next but like not necessary just like inherit based off the theme that's selected." So dark mode is **not** system-preference-driven. It is triggered by the active site theme being a dark theme. The implementation is a single selector block:

```css
:root[data-theme="darkroom"] .admin-shell[data-admin],
:root[data-theme="carbon"] .admin-shell[data-admin] {
  --admin-chrome-bg: #0E0E0C;
  --admin-workspace-bg: #141412;
  --admin-frame-bg: #1A1A18;
  --admin-text: #F4F4F2;
  --admin-keyline: #2A2A27;
  color-scheme: dark;
}
```

No new files. No conditional imports. Three lines per theme. This also means **light-mode-first ships immediately**, and dark-mode is an additive follow-up that cannot break existing code.

## Decision 3: `unplugin-icons` over `lucide-svelte`

**Options considered:**
- **A. `lucide-svelte`** — official Svelte wrapper, one component per icon, runtime registry.
- **B. (chosen) `unplugin-icons` + `@iconify-json/lucide`** — compile-time Vite plugin, inlines SVG as Svelte components at build.

**Why B.** The user linked `unplugin-icons` directly, so this is the stated preference. Technically B is also the right call: it supports Svelte 5 natively, has zero runtime cost (each import compiles to a static SVG component), gives us access to all 150+ iconify sets (not just lucide) for future flexibility, and the bundle contains only the icons actually imported. `lucide-svelte` ships a runtime lookup that bloats the payload unless manually tree-shaken.

**Vite config change** (in `vite.config.ts`):
```ts
import Icons from 'unplugin-icons/vite'
// ...plugins: [sveltekit(), Icons({ compiler: 'svelte', autoInstall: false })]
```

**Import shape** (in any `.svelte` file):
```svelte
<script lang="ts">
  import IconHome from '~icons/lucide/home'
  import IconLayers from '~icons/lucide/layers'
</script>
<IconHome class="admin-icon" />
```

**Type support.** `unplugin-icons` ships a `types/svelte.d.ts` declaration file that makes `~icons/lucide/*` imports type-safe in a SvelteKit project. We reference it from `src/app.d.ts`.

**Manifest.** To prevent icon sprawl, `src/lib/admin/admin-icons.ts` re-exports a curated set:
```ts
export { default as IconHome } from '~icons/lucide/home'
export { default as IconLayers } from '~icons/lucide/layers'
// etc.
```
All admin files import from `$lib/admin/admin-icons`, never from `~icons/lucide/*` directly. New icons require adding a line to the manifest first — this is the review gate.

## Decision 4: Mobile grid repair — `100dvh` root with explicit row sizes

The current bug is that `AdminShell.svelte` uses implicit grid rows on mobile. The fix:

```css
.admin-shell {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  height: 100dvh;           /* not 100vh — iOS safe area */
  overflow: hidden;
}

.admin-shell > .workspace {
  min-height: 0;            /* allows the child to shrink inside minmax(0, 1fr) */
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

Three things matter here:
1. `minmax(0, 1fr)` instead of `1fr` — the `0` minimum lets the row shrink below its content size, which is what allows `overflow-y: auto` on the child to actually produce a scrollable region instead of expanding the grid.
2. `min-height: 0` on the workspace child — same reason, applied to the child so flex/grid children can shrink.
3. `100dvh` over `100vh` — iOS Safari's dynamic viewport height accounts for the URL bar collapsing. Without it the bottom dock slides under the URL bar.

This is a three-line change with large behavioral impact. Verified by mounting the admin at 390×844 and scrolling the workspace independently of the dock.

## Decision 5: Mobile dock is native, not CommandPalette-based

**Why not reuse CommandPalette?** The palette from `command-palette-os` does an LLM round-trip per input. Mobile navigation is a solved problem — tap, open sheet, tap, close sheet. Running it through an NLP pipeline adds 1-3s of latency, a network dependency, and a cost per tap. The user explicitly said "for these kind of things i wouldn't use cmd + k." The dock is three buttons and three bottom sheets. Zero LLM. Zero network.

**Sheet implementation.** Use the existing `melt-ui` Dialog builder (already in the project for `CommandPalette.svelte`) to get accessible focus trapping and escape-to-close for free. Each sheet mounts a different child:
- `PAGES` → lifted `PageSidebar` with no width constraint
- `SECTIONS` → lifted `SectionCompartmentList`
- `PREVIEW` → full-height iframe

No new primitives. The sheet chrome (drag handle, backdrop, slide-up animation) is one shared `AdminSheet.svelte` component.

## Decision 6: TECHSTACK.md lives at repo root, not inside DOCS/

The user asked for `TECHSTACK.md` — not `DOCS/techstack.md`. Repo-root placement means:
- New agents find it on the first `ls`.
- `README.md` can link to it with a relative path.
- CI can gate on its existence.

The file is generated from `package.json` + Convex schema on first write, then maintained by hand. It is not auto-updated — auto-generation would risk drift on review. The tasks.md includes a "verify TECHSTACK.md matches package.json versions" step.

## Non-Goals

- Redesigning the individual admin compartments (`Content`/`Style`/`Layout` bookmarks) — that's `overhaul-admin-ux` territory
- Replacing `melt-ui` with a different primitive library
- Adding new icon sets beyond lucide in v1 (the plugin supports 150+ sets, we choose one)
- Animating the theme transition — instant swap is fine for v1
- Auto-generating `TECHSTACK.md` from `package.json` — human-maintained
- Converting the public site to the same icon system — admin only for v1

## Open Questions

1. **Should `accessible` (the AAA-contrast theme) map to light or dark admin?** Proposed: light. The theme is high-contrast but light-backgrounded in its current form. Revisit if that changes.
2. **Should the preview frame header show the full URL or just the path?** Proposed: path only (`/works`), with a small "open in new tab" icon that opens the absolute URL. Full URL is too long for narrow widths.
3. **Does `add-flag-visual-indicators` ship before or after this change?** Both modify `flagIndicatorRegistry`. Proposed order: `add-flag-visual-indicators` ships the green-dot vocabulary first; this change stacks the icon field on top. If it lands in the opposite order, we add the icon field here and it becomes the base shape for the indicators change to extend.
