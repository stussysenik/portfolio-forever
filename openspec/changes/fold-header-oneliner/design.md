# Design: Adaptive Crease Fold for the Site Header

## Context

The public site header lives in `src/routes/+layout.svelte:328-365` and is rendered inside a fixed `.top-frame` (`:429-447`) with a blurred backdrop. It holds `.header-name` + a `.nav` that inlines five internal links, a separator, and up to seven external social links. The layout is pure flexbox with `flex-wrap: wrap` (`:461-471`), which wraps to a second row on any viewport narrower than ~1400px and flips to a two-row stacked column at ≤767px (`:863-913`).

The brief is to make the header a **oneliner at every viewport** from Galaxy S8 (360px) through iPad portrait/landscape through laptop through desktop, using a navigation "fold" metaphor in an editorial aesthetic — something that would pass a design review at a serious studio.

This document captures the design decisions behind the fold mechanism so a future reader can understand why the code is shaped the way it is, and what alternatives were rejected.

## The core problem

At 1340px, the current nav has more content than can fit on one line:

| Element              | Approx width          |
|----------------------|-----------------------|
| `senik` (name)       | ~55px                 |
| 4 primary nav items  | ~220px + gaps         |
| `.nav-sep` divider   | ~20px                 |
| 7 external socials   | ~380px + gaps         |
| `.header-inner` gaps | 48px (x2) + 24px (x5) |
| Container padding    | ~96px                 |

Rough total at `--font-size-xs` with default gaps: **~900–1200px**. Fits at 1440, fails at 1280, tight at 1340. At 768px (iPad portrait) with the smaller `--space-sm` gap, the primary nav + name fit (~470px) but the socials do not. At 360px nothing fits beyond the name and one short label.

The task is therefore not "shrink the nav" but "define what the oneliner *is* at each tier, and fold the rest."

## Three mechanisms considered

### A. The Crease — horizontal paper fold (chosen)

- Collapsed payload lives inline at the trailing edge of the header, in a reserved grid track.
- Collapsed transform: `perspective(800px) rotateY(-90deg)`, `transform-origin: left center`.
- Expanded transform: `rotateY(0deg)`.
- Reads as a book page turning out from behind the primary nav.
- Does not push anything because the track is always reserved at `minmax(0, max-content)`; `visibility: hidden` takes the payload out of the tab order when closed.

**Pros:** true inline unfold, zero layout shift, stays on the oneliner literally, editorial metaphor.

**Cons:** at <768px there is no horizontal room to unfold into — the header is already 360px wide and the `senik + index ↗` pair consumes ~180px of it.

### B. The Kicker — vertical accordion second row

- Collapsed state: second row with `grid-template-rows: 0fr`.
- Expanded state: `grid-template-rows: 1fr`.
- Primary nav on line 1, secondary content on line 2 when open.

**Pros:** simplest implementation, browser-native smooth.

**Cons:** adds a second visible row when open, which violates the "oneliner forever" brief. Reads less like "paper" and more like "accordion widget."

### C. The Hinge — 3D rotateX drop from top

- Collapsed state: `rotateX(-90deg)` on `transform-origin: top`.
- Expanded state: `rotateX(0deg)`.
- Drops downward from under the top-frame like a ticker unfurling.

**Pros:** distinctive, 3D, feels premium.

**Cons:** at ≥768px, dropping the socials downward occupies vertical space that competes with the page's `--space-3xl` top padding and can overlap content. Also interacts poorly with `.top-frame`'s `backdrop-filter: blur(12px)` — 3D transforms on a blurred fixed ancestor create GPU flicker in Safari.

## Decision: adaptive — A at ≥768px, C at <768px

Neither A nor C works at every width, but each is correct in its own range:

- **≥768px:** The socials need to unfold *into the unused horizontal space* at the trailing edge of the header. The header has 100–900px of horizontal slack at every width ≥768px (slack = container width minus name + primary nav + trigger + padding). Horizontal unfold lands there. (Mechanism A.)
- **<768px:** There is no horizontal slack. There is only vertical slack (main content starts ~80px below the top-frame bottom). Vertical unfold lands there. (Mechanism C, but scoped to the mobile range where it cannot overlap primary content because it is an overlay, not a push.)

Both use the same: `perspective(800px)`, the same `var(--duration-normal)` timing, the same `var(--easing-out)` curve, the same `↗`-tail trigger label. A user who opens the fold on a phone and then rotates to landscape sees the same word and the same motion idiom — only the axis changes. The metaphor holds.

## Rejected alternatives

- **Flexbox gap shrinking down to 0:** Makes the oneliner look cramped at 1024px and still breaks at 768px. Loses visual rhythm for a non-fix.
- **Icon hamburger + slideout drawer:** Breaks the editorial voice (too generic). The project memory explicitly forbids emojis for controls; a hamburger glyph drifts toward that territory in feel even if technically it is a character.
- **Dropdown menu with `<select>` semantics:** Wrong accessibility pattern. The fold is a disclosure containing a list of links, not a value-selection control.
- **Container queries sized to `.header-inner`:** Would let the fold respond to container width instead of viewport. Considered and rejected because the admin shell and preview iframe widths are not relevant here — the public site header is viewport-constrained by `--container-max` (2200px), which matches the viewport cutoff cleanly. Container queries add complexity without a concrete benefit for this change. Keep it for a future revision if the header moves into a sidebar-constrained layout.

## Layout mechanics

### ≥768px (horizontal mode)

```css
.header-inner {
  display: grid;
  grid-template-columns: auto 1fr auto minmax(0, max-content);
  /* [name] [primary-nav] [trigger] [fold-payload] */
  align-items: baseline;
  gap: var(--space-xl);
}

.header-fold {
  transform-style: preserve-3d;
  perspective: 800px;
}

.header-fold-inner {
  display: flex;
  gap: var(--space-lg);
  transform: perspective(800px) rotateY(-90deg);
  transform-origin: left center;
  opacity: 0;
  visibility: hidden;
  transition:
    transform var(--duration-normal) var(--easing-out),
    opacity var(--duration-fast) linear,
    visibility 0s linear var(--duration-normal);
}

.header-fold[aria-expanded="true"] .header-fold-inner {
  transform: rotateY(0deg);
  opacity: 1;
  visibility: visible;
  transition:
    transform var(--duration-normal) var(--easing-out),
    opacity var(--duration-fast) linear,
    visibility 0s linear;
}
```

The `minmax(0, max-content)` grid track pre-reserves width for the payload, so unfolding is purely a cosmetic transform. The `visibility: hidden` transition is delayed by `var(--duration-normal)` so the payload stays out of the tab order while folding out, then the delay is zero on the way back in so it joins the tab order immediately.

### <768px (vertical mode)

```css
@media (max-width: 767px) {
  .header-inner {
    display: flex; /* revert to flex — only name + trigger on the oneliner */
    justify-content: space-between;
    align-items: center;
  }

  .header-fold {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: var(--space-md);
    background: color-mix(in srgb, var(--color-bg), transparent 10%);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color-subtle);
  }

  .header-fold-inner {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    transform: perspective(800px) rotateX(-90deg);
    transform-origin: top center;
  }
}
```

The trigger stays inline on the header oneliner; the `.header-fold` absolutely positions below the top-frame's bottom edge. Tapping the trigger flips `aria-expanded` on the trigger button and the fold rotates down.

## Motion and reduced-motion

- Duration: `var(--duration-normal)` = 220ms (see `src/app.css:129`).
- Easing: `var(--easing-out)` = `cubic-bezier(0.16, 1, 0.3, 1)` (see `src/app.css:133`) — the "expo out" curve the impeccable motion reference recommends for natural deceleration.
- Opacity uses `var(--duration-fast)` = 120ms so the payload fades in before the rotation completes, smoothing the perceived arrival.
- `@media (prefers-reduced-motion: reduce)` removes all `transform` from the transition list and keeps only `opacity`. No rotation, no perspective, just a fade.

## Accessibility

- Trigger is a semantic `<button>`, not an `<a>`, because it does not navigate.
- `aria-expanded` reflects state.
- `aria-controls` points at the fold panel's `id`.
- `role="region"` or `role="menu"` on the panel is **not** used — it is a plain list inside a div, and a list of links is the clearest semantic.
- `Escape` closes the fold and returns focus to the trigger. Implemented with a single `window`-level keydown handler that only fires when `open === true`.
- Click-outside closes the fold on mobile. On desktop it also closes on `mouseleave` of `.header-inner`.
- Hover opens on desktop with a 120ms intent delay to prevent accidental opens when moving the cursor across the header. The intent delay is skipped on keyboard focus.
- Focus order through the fold payload is linear; no focus trap because the fold is a disclosure, not a modal.

## Typography and tokens

No new tokens beyond the seven `--brand-*` solid-color additions. The trigger inherits `--font-sans` + `--font-size-xs` + `--font-weight-medium` + `--letter-spacing-tight`, matching `.nav-link`. The `↗` is a standard Unicode `NORTH EAST ARROW` (U+2197), rendered in the active font — not a glyph fallback, not an icon font. It sits at `font-variant-position: super` with a 1px optical lift.

## Observability and failure modes

- **Safari GPU flicker on fixed ancestor:** Mitigated by applying `transform-style: preserve-3d` only on `.header-fold`, not on `.top-frame`. The blur stays on the parent, the 3D context is scoped to the child.
- **iOS notch / dynamic island:** On <768px the fold drops below the top-frame, which already respects `env(safe-area-inset-top)` via the fixed positioning model. The fold panel does not cross the notch boundary.
- **Long social list overflow at 768px:** If the user adds more than ~7 socials (future data-layer change), the horizontal unfold may exceed `max-content`. Mitigation: the grid track is `minmax(0, max-content)` and `.header-fold-inner` uses `overflow: hidden` with `flex-wrap: nowrap`. Overflowing items are clipped, not wrapped. Long-term this is a capability gap that a future change should address (scrollable fold, or tiered fold-in-fold).
- **CLS measurement:** The reserved grid track prevents CLS during unfolding. A Playwright trace at each breakpoint will confirm.

## Rollback

This change only touches `+layout.svelte`. Rolling back is a single-file revert. No data migration, no config flag, no feature store, no env var. The old flex-wrap header is restored wholesale.

## Why this is worth the code

Because the current header wraps at 1340px and stacks at 767px, with nothing in between, there is no single viewport where it reads as "one line." The fold is not visual jewelry — it is the *only* way to present every nav item on a single row at every width without hiding content behind a hamburger. The editorial motion is a second-order win on top of the primary functional one.
