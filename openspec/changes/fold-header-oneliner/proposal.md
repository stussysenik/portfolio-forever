# Proposal: Fold Header to a True Oneliner (Adaptive Crease)

## Why

`src/routes/+layout.svelte:328-365` renders the public-site header as a wrap-able flex row: `.header-inner` is `display: flex; flex-wrap: wrap` with `gap: var(--space-2xl)` and holds `.header-name` + a `.header-nav-group` that contains `.nav` — five internal links (`home works process about …`), a `.nav-sep` divider, and up to seven external social links inlined as nav items. On any viewport narrower than ~1400px the social tail has no budget and the row breaks to a second line; on Galaxy S8 (360px) the mobile stack at `src/routes/+layout.svelte:863-913` flips the flexbox to `flex-direction: column`, turning the header into a two-row tower. There is no single breakpoint between 360px and 2200px where the header visibly reads as one line.

This change collapses every header state into a **true oneliner that holds from 360px (Galaxy S8) through iPad portrait (768px), iPad landscape (1024px), 1340px laptops, and 1920px+ desktops**. It does so with a single editorial metaphor — a paper crease — implemented as an *adaptive* fold whose axis follows the available space. On wide viewports the fold opens horizontally and pushes nothing; on narrow viewports the same fold drops downward as an overlay panel. One word, one gesture, one oneliner, every width.

As a scoped cleanup for the elements this change rewrites, it also replaces the `.nav-link.external` gradient-text hover (`src/routes/+layout.svelte:591-627`) with a solid brand color + underline crescendo. Gradient-clip text on text is an impeccable absolute-ban pattern; leaving it in would undermine the editorial read the rest of the change is meant to establish.

## What Changes

1. **Header markup refactor** (`src/routes/+layout.svelte:328-365`)
   - `.header-inner` becomes a 3-slot grid: `[name] [primary-nav] [fold-trigger]`.
   - A new `<button class="fold-trigger" aria-expanded aria-controls="header-fold">` replaces the in-flow rendering of the social-link tail. Label: `index ↗`.
   - A new `<div id="header-fold" class="header-fold">` holds the folded payload. Its children differ by viewport tier (see below).
   - The fold panel is an overlay: it never displaces main content, never changes header height, never triggers layout shift.

2. **Adaptive Crease fold mechanism**
   - **≥768px (tablet, desktop, ultrawide):** `.header-fold` sits inline at the trailing edge of `.header-inner`. Collapsed state: `transform: perspective(800px) rotateY(-90deg); transform-origin: left center; opacity: 0`. Expanded state: `rotateY(0deg); opacity: 1`. The socials unfold horizontally from a left-edge hinge, like a page turning out from behind the primary nav. Width of the payload is reserved in the grid track by a `minmax(0, max-content)` that is `visibility: hidden` when collapsed, so unfolding does not push anything and hovering does not reflow the layout.
   - **<768px (mobile, small phones, S8 at 360px):** `.header-fold` becomes a drop panel absolutely positioned below the top-frame bar. Collapsed state: `transform: perspective(800px) rotateX(-90deg); transform-origin: top center; opacity: 0; pointer-events: none`. Expanded state: `rotateX(0deg); opacity: 1; pointer-events: auto`. The panel drops downward like a ticker unfurling from the browser edge and overlays the top of main content.
   - Both axes share `transition: transform var(--duration-normal) var(--easing-out), opacity var(--duration-fast) linear`. `@media (prefers-reduced-motion: reduce)` strips the `transform` transition and keeps an opacity-only fade.

3. **Payload by viewport tier**
   - **≥768px:** The permanent oneliner shows `senik · home · works · process · about · index ↗`. The fold holds only the external social links.
   - **<768px:** The permanent oneliner shows `senik · index ↗`. The fold holds the primary nav links *and* the external social links, stacked as a vertical list inside the drop panel.
   - Breakpoint is enforced with `@media (min-width: 768px)` on the fold container — the markup stays identical, CSS decides which payload belongs on the oneliner vs. inside the fold.

4. **Trigger, affordance, and accessibility**
   - Trigger: `<button class="fold-trigger">index ↗</button>`. Editorial, lowercase, icon-free (the `↗` is a text character, not an emoji, consistent with the project's no-emoji-for-controls memory).
   - `aria-expanded` tracks open/closed. `aria-controls` points at `#header-fold`.
   - Hover on desktop opens the fold (`:hover` + `:focus-visible` with a 120ms intent delay to prevent hover flicker). Click/tap/Enter/Space opens and locks open until dismissed.
   - `Escape` closes the fold and returns focus to the trigger.
   - On mobile (<768px) the fold is click-only (no hover), click-outside closes it, and body scroll is *not* locked (the panel is short, scroll-lock would be overkill).
   - Focus order: trigger → fold payload items → trigger again (no focus trap required because there are no textareas; keyboard users Tab through naturally and Shift+Tab escapes).

5. **Solid-color socials (scoped cleanup)**
   - `src/routes/+layout.svelte:591-627` — the seven `.nav-link.external[data-brand=*]:hover` rules that set `background-image: linear-gradient(...)` with `background-clip: text` are removed.
   - Replaced with `color: var(--brand-*)` solid tokens plus the existing `::after` underline-crescendo pattern (`.nav-link::after`, `src/routes/+layout.svelte:538-559`). A seven-entry `--brand-*` token block is added under `.nav-link.external` so brand identity survives without gradient-clipped text.
   - Darkroom theme overrides (for GitHub and X, `src/routes/+layout.svelte:610-612, 622-624`) migrate to a `:global([data-theme="darkroom"]) .nav-link.external[data-brand=...]` solid-color rule.

6. **What does not change**
   - `.top-frame` (fixed, blurred) stays intact. The header still sits inside it.
   - `.wip-banner` stays intact and continues to sit above the header.
   - `.terminal` footer stays intact.
   - Admin routes (`/admin`) are unaffected — this is a public-site-only change.
   - The WIP banner check (`if wipEnabled`) keeps the same position in the template.
   - Existing `navItems` and `socialLinksData` shapes are untouched; they are re-rendered into new containers, no data-layer work.

## Non-Goals

- Not introducing a hamburger icon anywhere. The trigger is always the `index ↗` text label.
- Not touching the admin shell header (`AdminShell.svelte`).
- Not changing font choices, font weights, or color tokens outside the seven `--brand-*` additions for socials.
- Not adding keyboard shortcuts (e.g. `/` is already bound by the command palette).
- Not altering the WIP banner, terminal footer, or main-content padding math.
- Not introducing a new responsive breakpoint beyond the existing 768px public-site mobile cutoff.
- Not adding scroll-locking, focus-trapping, or modal semantics to the fold panel. It is a disclosure, not a dialog.

## Success Criteria

- The header reads as a single horizontal row at **360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1340, 1440, 1920, and 2200** CSS pixels. (S8 = 360, iPhone 15 = 393, iPhone 15 Pro Max = 430, iPad portrait = 768, iPad landscape = 1024, MacBook = 1280/1340/1440, desktop = 1920, container-max = 2200.)
- No flex-wrap at any width ≥320px. The only "break" is the fold's disclosure panel, which overlays rather than pushes.
- Opening/closing the fold triggers no cumulative layout shift (CLS = 0) on any of the above widths, verified via Chrome DevTools Performance trace.
- Keyboard-only users can reach every social link and every primary nav link via Tab from `senik` forward; Escape closes the fold and restores focus to the trigger.
- `prefers-reduced-motion: reduce` yields an opacity-only transition (no rotate, no perspective).
- Lighthouse Accessibility score on `/` does not drop from its current value.
- All internal nav links and all seven social links render with solid colors; no gradient-clipped text remains on the public site's header.

## Out-of-Scope (Deferred to Future Changes)

- Replacing gradient-clipped text elsewhere in the codebase (it may exist in `/works` or `/about` — those are separate changes).
- A full audit of `+layout.svelte` for other absolute-ban patterns (cards-in-cards, border-stripes, etc.).
- Container-query-driven responsive adjustment inside `.header-fold` (the viewport media query at 768px is sufficient for now).
