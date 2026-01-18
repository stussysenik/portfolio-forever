# Tasks: Add Theme Customization System

## Overview
Ordered task list for implementing theme customization with color palettes, font switching, and enhanced footer.

---

## Phase 1: Color Theme System (High Priority)

### Task 1.1: Define New Color Palettes in CSS
**File**: `src/app.css`

- [ ] Remove existing theme definitions (minimal, terminal, paper)
- [ ] Add Accessible theme CSS custom properties
  - High contrast colors (--color-bg: #FFFFFF, --color-text: #000000)
  - WCAG AAA compliant accent color (--color-accent: #0066CC)
- [ ] Add Minimal theme CSS custom properties
  - Warm neutral palette (--color-bg: #FAFAF9)
  - Refined blue accent (--color-accent: #2563EB)
- [ ] Add Terminal theme CSS custom properties
  - Dark background (--color-bg: #0D1117)
  - Electric cyan or matrix green accent (--color-accent: #00D9FF)
- [ ] Verify all category colors work in each theme

**Validation**: Visual inspection in browser, verify no broken styles

**Dependencies**: None

---

### Task 1.2: Update ThemeSwitcher Component
**File**: `src/lib/components/ThemeSwitcher.svelte`

- [ ] Update theme array from `['minimal', 'terminal', 'paper']` to `['accessible', 'minimal', 'terminal']`
- [ ] Update theme labels/descriptions in UI
- [ ] Add migration logic for legacy "paper" theme → "minimal"
- [ ] Add screen reader announcement for theme changes

**Validation**:
- Press 'T' key, verify themes cycle correctly
- Check localStorage for correct theme IDs
- Test with screen reader (should announce "Theme changed to [name]")

**Dependencies**: Task 1.1 (palettes must exist)

---

### Task 1.3: Test Color Contrast Compliance
**File**: Manual testing with tools

- [ ] Test Accessible theme with WebAIM contrast checker (all text >7:1)
- [ ] Test Minimal theme with WebAIM (all text >4.5:1)
- [ ] Test Terminal theme with WebAIM (all text >4.5:1)
- [ ] Verify focus indicators visible in all themes
- [ ] Run Lighthouse accessibility audit

**Validation**: All themes pass WCAG AA minimum, Accessible passes AAA

**Dependencies**: Task 1.1, 1.2

---

## Phase 2: Font Switching System (Medium Priority)

### Task 2.1: Load Additional Fonts
**File**: `src/app.css`

- [ ] Update Google Fonts import to include:
  - Crimson Pro (weights: 300, 400, 600)
  - Fira Code (weights: 300, 400, 500)
  - Space Grotesk (weights: 300, 400, 500, 700)
- [ ] Add `display=swap` parameter to prevent FOIT
- [ ] Verify fonts load in Network tab (DevTools)

**Validation**: Check browser Network tab shows font requests, test loading with cache disabled

**Dependencies**: None (can run in parallel with Phase 1)

---

### Task 2.2: Create Font Switching CSS Rules
**File**: `src/app.css`

- [ ] Add `:root[data-font="inter"]` ruleset with --font-sans
- [ ] Add `:root[data-font="crimson"]` ruleset
- [ ] Add `:root[data-font="jetbrains"]` ruleset (update both --font-sans and --font-mono)
- [ ] Add `:root[data-font="fira"]` ruleset
- [ ] Add `:root[data-font="space"]` ruleset
- [ ] Include fallback font stacks for each

**Validation**: Manually set `data-font` attribute in DevTools, verify font changes apply

**Dependencies**: Task 2.1 (fonts must be loaded)

---

### Task 2.3: Build FontSwitcher Component
**File**: `src/lib/components/FontSwitcher.svelte` (new file)

- [ ] Create component with font options array
- [ ] Build UI (dropdown or modal) with font previews
- [ ] Add keyboard shortcut listener ('F' key)
- [ ] Implement localStorage read/write for `preferred-font`
- [ ] Apply font by setting `data-font` attribute on `document.documentElement`
- [ ] Add screen reader announcement on font change
- [ ] Style component to match existing design system

**Validation**:
- Press 'F' key, verify selector opens
- Select each font, verify site updates immediately
- Reload page, verify font persists
- Test keyboard navigation (Tab, Arrow keys, Enter)

**Dependencies**: Task 2.2 (CSS rules must exist)

---

### Task 2.4: Integrate FontSwitcher into Layout
**File**: `src/routes/+layout.svelte`

- [ ] Import FontSwitcher component
- [ ] Add FontSwitcher to layout (near ThemeSwitcher or in command palette)
- [ ] Initialize font from localStorage on mount
- [ ] Test interaction between ThemeSwitcher and FontSwitcher

**Validation**: Font switcher accessible on all pages, works with theme changes

**Dependencies**: Task 2.3

---

### Task 2.5: Test Font Loading Performance
**File**: Manual testing

- [ ] Run Lighthouse performance audit
- [ ] Check CLS (Cumulative Layout Shift) < 0.1
- [ ] Verify font-display: swap prevents FOIT
- [ ] Test slow 3G network throttling
- [ ] Verify fonts cached on subsequent loads

**Validation**: Lighthouse score > 90, no visible text flash, CLS within limits

**Dependencies**: Task 2.4

---

## Phase 3: Footer Enhancement (Low Priority)

### Task 3.1: Add Copyright Footer Markup
**File**: `src/routes/+page.svelte`

- [ ] Locate existing `.page-footer` section (around line 600)
- [ ] Add `<div class="copyright">© 2026 Made with <span class="heart">💙</span> in BedStuy</div>`
- [ ] Position above existing `<div class="eof-comment">/* EOF */</div>`
- [ ] Verify markup structure

**Validation**: Visual inspection, copyright text appears on homepage

**Dependencies**: None (can run in parallel)

---

### Task 3.2: Style Copyright Footer
**File**: `src/app.css`

- [ ] Add `.page-footer .copyright` styles
  - Center alignment, --font-size-sm
  - --color-text-secondary
  - Margin bottom: --space-md
- [ ] Add `.page-footer .heart` styles
  - Blue color (#3B82F6)
  - Inline-block display
- [ ] Add optional `@keyframes heartbeat` animation
- [ ] Test responsive sizing (mobile, tablet, desktop)

**Validation**: Footer styled correctly, heart is blue, animation works

**Dependencies**: Task 3.1

---

### Task 3.3: Test Footer in All Themes
**File**: Manual testing

- [ ] Test footer in Accessible theme (high contrast)
- [ ] Test footer in Minimal theme (light)
- [ ] Test footer in Terminal theme (dark)
- [ ] Verify blue heart (#3B82F6) has adequate contrast in each theme
- [ ] Check spacing with terminal footer (no overlap)

**Validation**: Footer readable and visually appealing in all themes

**Dependencies**: Task 3.2, Phase 1 complete

---

## Phase 4: Integration & Polish (Final)

### Task 4.1: Cross-Theme Font Testing
**File**: Manual testing matrix

- [ ] Test all 5 fonts in Accessible theme
- [ ] Test all 5 fonts in Minimal theme
- [ ] Test all 5 fonts in Terminal theme
- [ ] Verify readability in each combination (15 combinations total)
- [ ] Check no layout breaks or overflow issues

**Validation**: All 15 theme+font combinations work correctly

**Dependencies**: Phase 1 and Phase 2 complete

---

### Task 4.2: Accessibility Audit
**File**: Manual testing with tools

- [ ] Run automated axe-core tests
- [ ] Test keyboard navigation (Tab, Shift+Tab, Enter, Esc)
- [ ] Test with NVDA or JAWS screen reader
  - Theme changes announced
  - Font changes announced
- [ ] Verify focus indicators visible in all themes
- [ ] Check color contrast on all interactive elements

**Validation**: No accessibility violations, screen reader works correctly

**Dependencies**: All features complete

---

### Task 4.3: Browser Compatibility Testing
**File**: Manual testing

- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)
- [ ] Verify localStorage works in all browsers
- [ ] Check font rendering quality in each browser

**Validation**: Works correctly in all major browsers

**Dependencies**: All features complete

---

### Task 4.4: Performance Baseline
**File**: Manual testing

- [ ] Run Lighthouse audit (Performance, Accessibility, Best Practices, SEO)
- [ ] Record metrics: LCP, FID, CLS, TTI
- [ ] Verify performance score > 90
- [ ] Check bundle size hasn't increased significantly
- [ ] Test font loading on slow 3G

**Validation**: Lighthouse scores green, performance meets standards

**Dependencies**: All features complete

---

### Task 4.5: Update Documentation (if needed)
**File**: README.md or docs

- [ ] Document theme options (accessible, minimal, terminal)
- [ ] Document font options (inter, crimson, jetbrains, fira, space)
- [ ] Document keyboard shortcuts ('T' for theme, 'F' for font)
- [ ] Add screenshots of each theme (optional)

**Validation**: Documentation clear and accurate

**Dependencies**: All features complete

---

## Task Summary

**Total Tasks**: 19
**Estimated Complexity**: Medium
**Parallelizable Work**: Phase 1 and Phase 2 can run concurrently, Phase 3 is independent

**Critical Path**:
1. Task 1.1 → 1.2 → 1.3 (Color themes)
2. Task 2.1 → 2.2 → 2.3 → 2.4 → 2.5 (Font switching)
3. Task 3.1 → 3.2 → 3.3 (Footer)
4. Task 4.1 → 4.2 → 4.3 → 4.4 → 4.5 (Integration)

**User-Visible Progress**:
- After Task 1.2: New themes available
- After Task 2.4: Font switching works
- After Task 3.2: Footer visible
- After Phase 4: Fully polished experience
