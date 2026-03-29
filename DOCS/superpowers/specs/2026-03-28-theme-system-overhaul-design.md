# Theme System Overhaul — Design Spec

**Date:** 2026-03-28
**Phase:** 1 of N (tiny increments)
**Branch:** `feat/theme-overhaul` (test branch, user verifies before merge)

## Context

The current dark theme (`terminal`) uses GitHub's #0D1117 — a blue-tinted gray that violates color science principles for professional dark interfaces. Per SMPTE ST 2080-3 and the user's research, professional calibration tools (5/6 including CalMAN, ColourSpace, Flanders, Atomos, SmallHD) use true neutral dark modes with R=G=B achromatic grays.

The portfolio targets senior engineering/design positions at studios like Pentagram, baek+baek, and companies like Apple. The theme system should demonstrate color science literacy — the kind of rigor Leica, Hasselblad, and ARRI apply to their software UIs.

**Goals:**
- Light theme (Minimal) becomes the default
- Add "Studio" light theme — achromatic, color-as-data
- Redesign "Terminal" → "Darkroom" — one definitive dark theme, SMPTE-grade
- Keep "Accessible" — WCAG AAA
- All tokens in OKLCH where possible
- WCAG AA minimum across all themes, AAA for Accessible
- Website-wide changes via CSS custom properties

## Architecture

```mermaid
mindmap
  root((Theme System))
    app.css
      :root — Minimal default
      [data-theme=studio] — Achromatic light
      [data-theme=darkroom] — SMPTE dark
      [data-theme=accessible] — WCAG AAA
      @media prefers-color-scheme dark — Darkroom fallback
    ThemeSwitcher.svelte
      Type union: 4 themes
      Theme metadata: name, icon, description
      Cycle order: minimal → studio → darkroom → accessible
      Keyboard: T to cycle
      localStorage persistence
      Migration: terminal → darkroom
    app.html
      data-theme=minimal — new default
    tokens.ts
      Update theme list for programmatic access
```

## Theme Definitions

### 1. Minimal (Light, DEFAULT)

**Kept as-is.** Warm off-white with full-saturation Pantone highlights. This is the signature identity — colorful, personality-forward.

```
No CSS changes. Just becomes the default via app.html.
```

### 2. Studio (Light, NEW)

**Design principle:** Achromatic R=G=B base. Color is data, never decoration. Following APCA Lc 90+ for body text.

**Character profile (Divers):** Muted. Quiet confidence.

```css
[data-theme="studio"] {
  /* 60% — Backgrounds: true achromatic (R=G=B) */
  --color-bg: #FAFAFA;              /* oklch(0.984 0 0) */
  --color-bg-alt: #F5F5F5;          /* oklch(0.968 0 0) */
  --color-surface: #FFFFFF;          /* oklch(1.000 0 0) */
  --color-surface-raised: #FFFFFF;

  /* 30% — Text: pure achromatic grays */
  --color-text: #111111;             /* oklch(0.132 0 0) — APCA Lc 97 on #FAFAFA */
  --color-text-secondary: #555555;   /* oklch(0.395 0 0) — APCA Lc 66 */
  --color-text-muted: #888888;       /* oklch(0.588 0 0) — APCA Lc 42 */
  --color-text-subtle: #BBBBBB;      /* oklch(0.774 0 0) — APCA Lc 22 */

  /* 10% — Accent: no decorative accent. Functional only. */
  --color-accent: #333333;           /* Dark gray for links — not blue */
  --color-accent-hover: #111111;
  --color-accent-subtle: #F0F0F0;

  /* Category colors preserved at reduced opacity (used via 10-20% wash) */
  /* Entry highlight backgrounds use: linear-gradient(90deg, color 10%, transparent) */

  /* Borders: achromatic */
  --border-color: #E8E8E8;
  --border-color-strong: #AAAAAA;
  --border-color-subtle: #F0F0F0;

  /* Shadows: neutral */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.08);
}
```

**Entry highlight behavior in Studio:** Featured entries keep their Pantone colors but rendered as:
- Left border: 3px solid [pantone-color]
- Background: linear-gradient(90deg, [pantone-color] at 10% opacity, transparent 60%)
- Text remains achromatic

### 3. Darkroom (Dark, REPLACES Terminal)

**Design principle:** SMPTE ST 2080-3 reference. True neutral R=G=B. ~5 cd/m² surround luminance. The kind of dark UI ARRI ALEXA's menu uses, Hasselblad Phocus runs, Leica puts on their digital backs. Zero blue tint.

**Character profile (Divers):** Deep. Zero noise. Content-only.

**Pantone highlights at 20% opacity as subtle washes — because even ARRI uses color for status signals.**

```css
[data-theme="darkroom"] {
  /* 60% — Backgrounds: true neutral R=G=B */
  --color-bg: #141414;              /* oklch(0.132 0 0) — ~5 cd/m² target */
  --color-bg-alt: #0F0F0F;          /* oklch(0.098 0 0) */
  --color-surface: #1C1C1C;         /* oklch(0.166 0 0) */
  --color-surface-raised: #242424;  /* oklch(0.200 0 0) */

  /* 30% — Text: achromatic, high readability */
  --color-text: #E8E8E8;            /* oklch(0.929 0 0) — APCA Lc 89 on #141414 */
  --color-text-secondary: #A0A0A0;  /* oklch(0.680 0 0) — APCA Lc 61 */
  --color-text-muted: #737373;      /* oklch(0.511 0 0) — APCA Lc 38 */
  --color-text-subtle: #4A4A4A;     /* oklch(0.340 0 0) — APCA Lc 18 */

  /* 10% — Accent: cyan for navigation signals only */
  --color-accent: #00D9FF;          /* oklch(0.824 0.157 209) — Tron cyan */
  --color-accent-hover: #33E0FF;
  --color-accent-subtle: #0A1E24;   /* oklch(0.132 0.020 209) */

  /* Signal colors — functional only */
  --color-success: #22C55E;
  --color-warning: #EAB308;
  --color-danger: #EF4444;

  /* Category colors preserved for featured entries */
  /* Applied as 20% opacity washes: background: linear-gradient(...) */

  /* Borders: achromatic */
  --border-color: #2A2A2A;          /* oklch(0.220 0 0) */
  --border-color-strong: #4A4A4A;
  --border-color-subtle: #1C1C1C;

  /* Shadows: deep */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.7);
}
```

### 4. Accessible (WCAG AAA)

**Kept as-is.** Pure black on white with #0066CC accent. 7:1+ contrast minimum. No changes needed.

## Color Science Grounding

| Principle | Application |
|---|---|
| **OKLCH perceptual uniformity** | All Minimal theme tokens already OKLCH. Studio/Darkroom use hex (achromatic = no hue, so OKLCH adds no benefit over hex for grays) |
| **Character-first harmony (Divers)** | Minimal = vivid, Studio = muted, Darkroom = deep, Accessible = stark |
| **60/30/10 rule** | Background 60%, text/secondary 30%, accent/signal 10% |
| **APCA dual check** | Body text Lc 75+, headings Lc 60+, subtle text Lc 18+ |
| **True achromatic (R=G=B)** | Studio + Darkroom: zero chroma in backgrounds and text. No warm/cool tint. |
| **SMPTE ST 2080-3** | Darkroom surround: #141414 ≈ 5 cd/m² on calibrated display |
| **Color = data only** | Studio: no decorative accent color. Darkroom: cyan for navigation signals, Pantone washes for featured status |

## Files to Modify

### 1. `src/app.html` (1 change)
- Line 2: Change `data-theme="terminal"` → `data-theme="minimal"`

### 2. `src/app.css` (3 changes)
- **Add** `[data-theme="studio"]` block (~25 lines) after the Minimal `:root` block
- **Replace** `[data-theme="terminal"]` block with `[data-theme="darkroom"]` block (~25 lines)
- **Update** `@media (prefers-color-scheme: dark)` fallback to use Darkroom values instead of current blue-tinted HSL values

### 3. `src/lib/components/ThemeSwitcher.svelte` (4 changes)
- Update `Theme` type: `'accessible' | 'minimal' | 'studio' | 'darkroom'`
- Update `themes` array: add Studio, rename Terminal → Darkroom
- Update `currentTheme` default: `'terminal'` → `'minimal'`
- Add migration: `terminal` → `darkroom` (like existing `paper` → `minimal`)

### 4. `src/lib/data/tokens.ts` (if theme list exists there)
- Update any theme enumeration to include `studio` and rename `terminal` → `darkroom`

### 5. `src/routes/+layout.svelte` (if it references theme names)
- Update any hardcoded `terminal` references to `darkroom`

## Entry Highlight Behavior Per Theme

The colored entry highlights (orange, ocean, gold, pink, etc.) behave differently per theme:

| Theme | Highlight Style |
|---|---|
| **Minimal** | Full-saturation colored background bars (current behavior) |
| **Studio** | 3px left border + 10% opacity gradient wash |
| **Darkroom** | 20% opacity gradient wash on neutral background |
| **Accessible** | High-contrast border (2px solid) + bold text weight |

**Critical fix:** The current entry highlights (`app.css:790-888`) use `@media (prefers-color-scheme: dark)` for dark mode adaptation instead of `[data-theme]` selectors. This means highlights DON'T respond to the theme switcher — only to OS preference. This must be refactored.

**Selectors:** `.entry[data-highlight="1"]` through `.entry[data-highlight="9"]` in `src/app.css:790-888`

**Refactor:** Replace `@media (prefers-color-scheme: dark) { .entry[data-highlight="N"] }` blocks with theme-scoped selectors:
- `[data-theme="darkroom"] .entry[data-highlight="N"]` — 20% opacity washes, colored text, colored border
- `[data-theme="studio"] .entry[data-highlight="N"]` — 10% opacity wash + 3px left border, achromatic text
- `[data-theme="accessible"] .entry[data-highlight="N"]` — 2px solid border, bold text, high contrast
- Keep `@media (prefers-color-scheme: dark)` as fallback for when no theme is set, pointing to Darkroom values

## ThemeSwitcher UI Updates

```
Theme cycle order (T key): Minimal → Studio → Darkroom → Accessible → Minimal

Dropdown display:
  ○  Minimal     — "Warm & colorful"
  ◇  Studio      — "Achromatic precision"
  ◼  Darkroom    — "Reference dark"
  ◎  Accessible  — "WCAG AAA"
```

## Verification Plan

1. **Visual check:** Switch through all 4 themes on homepage, works, CV, talks, likes, blog pages
2. **Contrast audit:** Run axe-core accessibility scan on each theme
3. **Entry highlights:** Verify colored entries render correctly in all 4 themes
4. **Theme persistence:** Refresh page, verify localStorage saves and restores
5. **Migration:** Clear localStorage, set `theme=terminal`, refresh — should migrate to `darkroom`
6. **System preference fallback:** Remove `data-theme` attr, test with `prefers-color-scheme: dark`
7. **Keyboard shortcut:** Press `T` to cycle through all 4 themes
8. **Mobile:** Test theme switcher dropdown on mobile viewport
9. **Playwright:** Run existing test suite to catch regressions
10. **Color science:** Spot-check APCA contrast ratios for body text in Studio and Darkroom using apcacontrast.com
