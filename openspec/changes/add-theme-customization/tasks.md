# Tasks: Add Theme Customization System

## Overview
Ordered task list for implementing theme customization with color palettes, font switching, and enhanced footer.

---

## Phase 1: Color Theme System (High Priority)

### Task 1.1: Define New Color Palettes in CSS
**File**: `src/app.css`

- [x] Define theme CSS custom properties (5 themes: minimal, studio, terminal, darkroom, accessible)
- [x] Add Accessible theme (WCAG AAA: --color-bg: #FFFFFF, --color-text: #000000, --color-accent: #0066CC)
- [x] Add Minimal theme (warm neutral: --color-bg: oklch(0.985 0.002 80), --color-accent: #2563EB)
- [x] Add Terminal theme (dark: --color-bg: #0D1117, --color-accent: #00D9FF)
- [x] Add Studio theme (achromatic light: --color-bg: #FAFAFA)
- [x] Add Darkroom theme (reference dark: --color-bg: #141414, --color-accent: #00D9FF)
- [x] Verify all category colors work in each theme

**Evidence**: src/app.css lines 67-315

---

### Task 1.2: Update ThemeSwitcher Component
**File**: `src/lib/components/ThemeSwitcher.svelte`

- [x] Theme array: ['minimal', 'studio', 'terminal', 'darkroom', 'accessible']
- [x] Migration logic for legacy "paper" theme → "minimal"
- [x] Screen reader announcement for theme changes (aria-live="polite")
- [x] 'T' key keyboard shortcut cycles themes

**Evidence**: src/lib/components/ThemeSwitcher.svelte

---

### Task 1.3: Test Color Contrast Compliance
- [x] Automated axe-core contrast validation (tests/accessibility/homepage.spec.ts)
- [x] Focus indicators visible in all themes
- [x] High contrast mode support tested

**Evidence**: tests/accessibility/homepage.spec.ts lines 110-122

---

## Phase 2: Font Switching System (Medium Priority)

### Task 2.1: Load Additional Fonts
**File**: `src/app.css`

- [x] Google Fonts import: Inter, JetBrains Mono, Crimson Pro, Fira Code, Space Grotesk, Rubik, IBM Plex Mono
- [x] `display=swap` parameter to prevent FOIT

**Evidence**: src/app.css line 7

---

### Task 2.2: Create Font Switching CSS Rules
**File**: `src/app.css`

- [x] 9 font rulesets via `[data-font="..."]` selectors (inter, crimson, jetbrains, fira, space, rubik, ibm-plex, times, helvetica)
- [x] Fallback font stacks for each

**Evidence**: src/app.css lines 318-355

---

### Task 2.3: Build FontSwitcher Component
**File**: `src/lib/components/FontSwitcher.svelte`

- [x] Font options array with 9 fonts
- [x] Grid UI with font previews
- [x] 'F' key keyboard shortcut
- [x] localStorage persistence for `preferred-font`
- [x] Screen reader announcement on font change

**Evidence**: src/lib/components/FontSwitcher.svelte

---

### Task 2.4: Integrate FontSwitcher into Layout
**File**: `src/routes/+layout.svelte`

- [x] FontSwitcher imported and added to footer terminal-controls
- [x] Works alongside ThemeSwitcher

**Evidence**: src/routes/+layout.svelte lines 11, 315-316

---

### Task 2.5: Test Font Loading Performance
- [x] Automated E2E tests (tests/e2e/theme-and-fonts.spec.ts lines 119-202)
- [x] `display=swap` prevents FOIT
- [x] Persistence across page reload tested

---

## Phase 3: Footer Enhancement (Low Priority)

### Task 3.1: Add Copyright Footer Markup
**File**: `src/routes/+layout.svelte`

- [x] Footer with attribution in terminal bar (line 301)
- [x] Data-driven from Convex siteConfig.footerEdition + footerYear
- [x] Default: "Made with 💙 in Bed-Stuy by STÜSSY SENIK"

**Evidence**: src/routes/+layout.svelte:301, convex/schema.ts:130-131

---

### Task 3.2: Style Copyright Footer
- [x] Terminal bar styling with theme-aware colors (--color-text-secondary via .terminal-edition)
- [x] Mono font, consistent with design system

---

### Task 3.3: Test Footer in All Themes
- [x] Footer uses CSS variables, inherits from all 5 themes
- [x] No overlap — integrated into terminal status bar

---

## Phase 4: Integration & Polish (Final)

### Task 4.1: Cross-Theme Font Testing
- [x] Automated combined theme+font tests (tests/e2e/theme-and-fonts.spec.ts lines 204-231)
- [x] All theme+font combinations work

---

### Task 4.2: Accessibility Audit
- [x] Automated axe-core tests
- [x] Keyboard navigation tested (Tab, Shift+Tab, Enter, Esc)
- [x] Focus indicators visible in all themes
- [x] Screen reader announcements working

**Evidence**: tests/accessibility/homepage.spec.ts (257 lines)

---

### Task 4.3: Browser Compatibility Testing
- [x] Playwright infrastructure tests across Chromium, Firefox, WebKit
- [x] localStorage works in all browsers

---

### Task 4.4: Performance Baseline
- [x] Font display=swap prevents FOIT
- [x] Lightweight components, no JS overhead for theme switching
- [x] localStorage caching

---

### Task 4.5: Update Documentation
- [ ] Update README to document 5 actual themes (not 3) and 9 fonts
- [ ] Document keyboard shortcuts ('T' for theme, 'F' for font)

---

## Task Summary

**Total Tasks**: 19
**Completed**: 18/19 (95%)
**Remaining**: 1 task (README update — 5 themes + 9 fonts + shortcuts)
