# Tasks: Fold Header to a True Oneliner

All tasks live in `src/routes/+layout.svelte` unless otherwise noted. No other files are touched. Ordered so each step is visually verifiable before the next.

## 1. Preparation and token additions
- [ ] 1.1 Read current header markup (`:328-365`) and current header styles (`:449-913`) end-to-end; confirm no other file imports these selectors.
- [ ] 1.2 Grep the repo for `.header-inner`, `.header-name`, `.header-nav-group`, `.nav-link.external` usages outside `+layout.svelte`. Expected result: zero matches. If any found, flag before proceeding.
- [ ] 1.3 Add seven `--brand-*` CSS custom properties for the external social links inside `:root` in `src/app.css` (or inline in the component style block if they are header-local): `--brand-soundcloud`, `--brand-imdb`, `--brand-github`, `--brand-linkedin`, `--brand-instagram`, `--brand-x`, `--brand-email`. Light-mode values mirror the existing gradient start colors. A `:root[data-theme="darkroom"]` override supplies dark values for `--brand-github` and `--brand-x`.

## 2. Script: fold state and DOM wiring
- [ ] 2.1 Inside `<script>` in `+layout.svelte`, add a reactive state variable `let foldOpen = $state(false)` (Svelte 5 runes) and a derived `isMobileFold` bound to `window.matchMedia('(max-width: 767px)')`.
- [ ] 2.2 Add a `handleToggle()` function that flips `foldOpen`.
- [ ] 2.3 Add an `onMount` effect that attaches `window.keydown` → close on `Escape`; `document.click` → close when target is outside `#header-fold` and not the trigger. Effect returns a cleanup function.
- [ ] 2.4 Verify dev server still boots (`bun run dev`) before touching markup.

## 3. Markup: grid refactor of `.header-inner`
- [ ] 3.1 Replace the flex `.header-inner` children with a grid structure: `.header-name` (slot 1), `.header-primary-nav` (slot 2 — holds the 4 primary nav links unconditionally), `.header-fold-trigger` (slot 3 — the `<button>index ↗</button>`), `.header-fold` (slot 4 — holds the payload).
- [ ] 3.2 The `<button class="header-fold-trigger" aria-expanded={foldOpen} aria-controls="header-fold" onclick={handleToggle}>index ↗</button>`.
- [ ] 3.3 `<div id="header-fold" class="header-fold" class:open={foldOpen}>` — contains an inner wrapper `<div class="header-fold-inner">` and inside it two groups: `<div class="header-fold-primary">` (primary nav — only renders when viewport is <768px; use a Svelte `{#if}` driven by a reactive media-query store) and `<div class="header-fold-socials">` (external social links).
- [ ] 3.4 Primary nav links continue to render in their existing slot (`.header-primary-nav`) at ≥768px. At <768px they render inside `.header-fold-primary`. Use Svelte's snippet/conditional render rather than CSS display-swaps so the tab order is always correct.
- [ ] 3.5 Verify the header renders without errors at the default desktop width.

## 4. Styles: desktop fold (≥768px, horizontal unfold)
- [ ] 4.1 Rewrite `.header-inner` CSS to use `display: grid; grid-template-columns: auto auto auto minmax(0, max-content);` with `align-items: baseline; gap: var(--space-xl);`. Remove `flex-wrap: wrap`. Remove the `@media (min-width: 768px)` gap override — the grid gap already handles it.
- [ ] 4.2 `.header-primary-nav` is a flex row with `gap: var(--space-lg)`.
- [ ] 4.3 `.header-fold-trigger` inherits `.nav-link` font sizing, weight, color, letter-spacing, and tracking. Unstyle the default button chrome (background, border, padding reset).
- [ ] 4.4 `.header-fold` establishes the 3D context: `perspective: 800px; transform-style: preserve-3d;`. Children are transformed.
- [ ] 4.5 `.header-fold-inner` collapsed state: `display: flex; gap: var(--space-lg); transform: perspective(800px) rotateY(-90deg); transform-origin: left center; opacity: 0; visibility: hidden; transition: transform var(--duration-normal) var(--easing-out), opacity var(--duration-fast) linear, visibility 0s linear var(--duration-normal);`.
- [ ] 4.6 `.header-fold.open .header-fold-inner` expanded state: `transform: rotateY(0deg); opacity: 1; visibility: visible; transition: transform var(--duration-normal) var(--easing-out), opacity var(--duration-fast) linear, visibility 0s;`.
- [ ] 4.7 Verify by hand at 1340×1500 that the oneliner holds, clicking the trigger unfolds the socials horizontally from the left hinge, and clicking again folds them back.
- [ ] 4.8 Verify at 1024×768 and 768×1024 that the oneliner holds and the fold behaves identically.

## 5. Styles: mobile fold (<768px, vertical unfold)
- [ ] 5.1 Inside `@media (max-width: 767px)`, override `.header-inner` back to `display: flex; justify-content: space-between; align-items: center;` — only `.header-name` and `.header-fold-trigger` are visible on the row.
- [ ] 5.2 Hide `.header-primary-nav` at <768px via `display: none` (it moves into `.header-fold-primary` inside the fold panel per task 3.4).
- [ ] 5.3 `.header-fold` at <768px becomes `position: absolute; top: 100%; left: 0; right: 0; padding: var(--space-md); background: color-mix(in srgb, var(--color-bg), transparent 10%); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color-subtle);`.
- [ ] 5.4 `.header-fold-inner` at <768px collapses to `flex-direction: column; gap: var(--space-sm); transform: perspective(800px) rotateX(-90deg); transform-origin: top center;`.
- [ ] 5.5 `.header-fold.open .header-fold-inner` expands to `transform: rotateX(0deg)`.
- [ ] 5.6 Verify by hand at 360×740 that the oneliner shows only `senik` and `index ↗`, that tapping the trigger drops the full nav down as an overlay, and that tapping again or tapping outside closes it.
- [ ] 5.7 Verify at 393×852 (iPhone 15) and 430×932 (iPhone 15 Pro Max) that behavior is identical.

## 6. Styles: solid-color social links (cleanup of gradient-text ban)
- [ ] 6.1 Delete the `.nav-link.external[data-brand=*]:hover` gradient rules at `+layout.svelte:591-627` — all seven brands plus the two darkroom overrides.
- [ ] 6.2 Add replacement rules: each `.nav-link.external[data-brand=*]:hover { color: var(--brand-*); }` uses the solid token from task 1.3. The `::after` underline from `.nav-link::after` stays.
- [ ] 6.3 Verify by hand that hovering each social link now shows a solid color shift and the underline crescendo, with no gradient text.

## 7. Reduced motion and intent delay
- [ ] 7.1 Add `@media (prefers-reduced-motion: reduce) { .header-fold-inner { transition: opacity var(--duration-fast) linear; } .header-fold-inner, .header-fold.open .header-fold-inner { transform: none; } }` to strip rotate/perspective for users who requested it.
- [ ] 7.2 Add a 120ms hover-intent delay to the desktop open path: `setTimeout` guarded by a `pointerenter`/`pointerleave` pair on `.header-inner`. Skip the delay on keyboard focus.
- [ ] 7.3 Verify in browser with `prefers-reduced-motion: reduce` forced via DevTools Rendering that the fold fades without rotating.

## 8. Visual verification (Chrome DevTools MCP) at every breakpoint
- [ ] 8.1 Start the dev server (`bun run dev`) and navigate to the localhost URL.
- [ ] 8.2 For each width in `[360, 393, 414, 430, 768, 820, 1024, 1280, 1340, 1440, 1920, 2200]`:
    - [ ] 8.2.1 Emulate the viewport.
    - [ ] 8.2.2 Take a screenshot of the resting header.
    - [ ] 8.2.3 Take a screenshot of the header with the fold open.
    - [ ] 8.2.4 Record header height — it must be identical in both screenshots.
    - [ ] 8.2.5 Confirm zero flex-wrap, zero stacked rows.
- [ ] 8.3 Run a Lighthouse accessibility pass on `/` at 1340 width. Score ≥ the pre-change baseline.
- [ ] 8.4 Collect a 5-second Performance trace while opening and closing the fold twice. CLS must be 0 for those frames.

## 9. Keyboard and screen-reader verification
- [ ] 9.1 With keyboard only, Tab through from the skip link to the fold trigger. Verify the button's accessible name is `index` and `aria-expanded` toggles on Space/Enter.
- [ ] 9.2 Open the fold with Enter, Tab through every child link, Shift+Tab backward — focus must reach the trigger without being trapped.
- [ ] 9.3 Press Escape from any focus state inside the fold — fold closes, focus returns to the trigger.
- [ ] 9.4 On mobile (via DevTools emulation), tap outside the fold — it closes. Tap inside and follow a link — the fold closes and navigation proceeds.

## 10. Grep hygiene and ban-pattern audit
- [ ] 10.1 Grep `src/routes/+layout.svelte` for `background-clip:\s*text` and `-webkit-background-clip:\s*text`. Expected: zero matches.
- [ ] 10.2 Grep for `border-left:` and `border-right:` with a width `> 1px` in `+layout.svelte`. Expected: zero matches in the touched selectors.
- [ ] 10.3 Grep for `flex-wrap:\s*wrap` inside `.header-*` selectors. Expected: zero matches.

## 11. Type check and Playwright smoke
- [ ] 11.1 Run `bunx svelte-check` (or the project's equivalent). Expected: zero new errors.
- [ ] 11.2 Run the existing Playwright smoke test for `/` at default width. Expected: pass with no new failures.

## 12. Validation and sign-off
- [ ] 12.1 Run `openspec validate fold-header-oneliner --strict --no-interactive`.
- [ ] 12.2 Share a short demo clip or screenshot set with the user showing the oneliner at 360, 768, 1340, and 1920, with the fold open and closed at each.
- [ ] 12.3 On approval, commit on `feat/theme-overhaul`.
