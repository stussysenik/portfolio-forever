---
created: 2026-03-xx
updated: 2026-04-11
category: design
tags: [design-system, colors, typography, spacing, a11y]
---

# Design System

## Philosophy

The design system exists to serve two audiences simultaneously: visitors who experience the portfolio
as a cohesive, considered surface, and the admin user (Stüssy Senik) who needs to move through
controls at velocity without friction. Every token, every constraint, and every interaction pattern
serves one or both of those audiences.

The governing principle: specificity over flexibility. A constrained palette of tokens applied
consistently beats an unlimited set applied inconsistently.


## Admin Chrome

The admin UI uses exactly three colors beyond neutral grays:

- `#2563EB` — blue, for active states, primary actions, and focused controls.
- `#44D62C` — electric green, for visible/enabled states and live entry counts.
- Black and white — for all structure, text, and borders.

No other colors appear in admin chrome. Section content (entry colors, theme previews) can display
the full palette, but the interface itself never does. This constraint makes the admin readable at a
glance and prevents visual noise from drowning out content signals.


## WYSIWYG Label Contract

Display strings must equal stored strings. No case normalization, no capitalization, no template
transformation on render. If the database stores `re:mix`, the tab label reads `re:mix`. If it
stores `Works`, the tab reads `Works`. Validation trims whitespace and rejects empty strings; it
does not alter casing. This contract is enforced at the component layer — no `toUpperCase()`,
`capitalize()`, or string interpolation that transforms a stored value before display.


## Color

All themes use the OKLCH color space. OKLCH provides perceptual uniformity: equal numeric steps
in lightness are equally perceptible across hues. This makes theme construction predictable and
contrast calculations reliable.

The 60/30/10 color rule applies across all themes: 60% dominant neutral, 30% secondary surface,
10% accent. Accent colors are theme-specific and carry semantic weight (active, interactive, error).

Named palette for entry accents: `orange`, `green`, `electric-green`, `ocean`, `gold`, `pink`,
`cloud`, `red`, `yellow`. These are defined as CSS custom properties with OKLCH values and are the
only colors assignable to content entries.


## Typography

Primary typefaces:
- **Inter** — sans-serif, UI and body text.
- **JetBrains Mono** — monospace, code blocks and terminal.

Additional switchable faces: Crimson Pro, Fira Code, Space Grotesk. All loaded via Google Fonts
with variable weight support where available.

Scale:
- 7 weight stops: 100 through 700.
- 4 line-height tokens: tight (1.1), snug (1.3), normal (1.5), relaxed (1.7).
- 6 letter-spacing tokens: tighter through widest.

Type size tokens (12 total, implemented via CSS clamp()):

| Token | Role |
|-------|------|
| 3xs   | captions, metadata |
| 2xs   | labels, badges |
| xs    | secondary body |
| sm    | body |
| base  | default body |
| md    | lead / large body |
| lg    | subheadings |
| xl    | section headings |
| 2xl   | page headings |
| 3xl   | display |
| 4xl   | large display |
| hero  | hero / full-bleed text |

All sizes scale fluidly between minimum (320px viewport) and maximum (3840px viewport) with no
breakpoint jumps.


## Spacing

Base unit: 4px. All spacing tokens are multiples of this unit.

| Token | Value |
|-------|-------|
| 2xs   | 4px   |
| xs    | 8px   |
| sm    | 12px  |
| md    | 16px  |
| lg    | 24px  |
| xl    | 32px  |
| 2xl   | 48px  |
| 3xl   | 64px  |
| 4xl   | 96px  |

Spacing tokens are exposed as CSS custom properties and used exclusively — no raw pixel values in
component styles.


## Layout

CSS Grid is the primary layout primitive. Column counts are responsive:

- Mobile (320–767px): 1–2 columns.
- Tablet (768–1199px): 2–4 columns.
- Desktop (1200px+): 4–12 columns depending on content density.

Container queries are used where a component's layout depends on its container width rather than the
viewport (admin panels, entry tables, section previews).


## Motion

Rules:
- GPU-accelerated properties only: `transform`, `opacity`. Never animate `width`, `height`,
  `top`, `left`, or `background-color` directly.
- All motion respects `prefers-reduced-motion: reduce`. When set, transitions collapse to
  `duration: 0ms` and the Lua pixel engine does not run.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` as the default (material standard). Entrances use
  deceleration; exits use acceleration.
- The Lua pixel engine (PixelCanvas component) is a creative layer, not a UI layer. It runs in a
  `<canvas>` behind content and never intercepts pointer events.


## Accessibility

- WCAG AA is the minimum for all themes.
- The `accessible` theme targets WCAG AAA: 7:1 contrast ratio for text, 4.5:1 for UI components.
- No decorative emojis in functional controls. Text labels only for buttons, toggles, and tabs.
- Full keyboard navigation: all interactive elements are focusable, with visible focus rings.
- Keyboard shortcuts: `T` (theme cycle), `F` (font cycle), `/` (command palette), `?` (help).
- ARIA labels on icon-only controls. Live regions for real-time Convex data updates.
- Tested with axe-core via Playwright on every CI run.


## Responsive Range

The system is tested and verified from 320px (iPhone SE) to 3840px (4K monitor). Font scaling,
spacing, and grid columns adjust continuously across this range via clamp() and CSS Grid. No fixed
breakpoint jumps for typography or spacing — only for structural layout changes.
