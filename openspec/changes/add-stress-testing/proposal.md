# Proposal: Add Comprehensive Stress Testing & Component Infrastructure

## Overview
Overwhelm the portfolio with interaction tests, responsive layout verification, theme system validation, and Storybook component isolation — covering all buttons, links, overlaps, navigation folding, and breakpoint behavior across mobile/iPad/desktop.

## Why
The portfolio has 8 Playwright test files (4,545 lines) but critical gaps:
1. **Theme system untested** — 4 themes (minimal, studio, darkroom, accessible) with zero switching/persistence/contrast tests
2. **9/16 routes have zero or minimal coverage** — blog, gallery, labs, talks, gifts, os, minor, scratchpad
3. **No tablet or desktop-specific tests** — configured in playwright.config but test directories are empty
4. **No overlap detection tests** — overlap-detector.ts utility exists but is never tested
5. **Keyboard shortcuts partially tested** — only `/` tested, `T` and `F` untested
6. **No component isolation** — no Storybook, no way to test components independently
7. **Footer layout issues on mobile** — needs single-line design at small viewports (per user feedback)
8. **Theme icons not expressive enough** — should immediately communicate "color theme switching"

## Proposed Solution

### Capability 1: Playwright Interaction Stress Tests
Overwhelming E2E tests for every interactive element:
- All navigation links (8 routes × click + verify)
- All keyboard shortcuts (T, F, /, ?, Escape, Space)
- Theme switcher: open, select each theme, verify CSS changes, persistence, migration
- Font switcher: open, select each font, verify font-family changes
- Command palette: open, search, navigate, select
- Social toggle (@): open, verify links, close
- Elevator component: scroll-to-top behavior
- All external links: verify target="_blank" + rel="noopener"
- Rapid interaction sequences (click theme 5x fast, spam T key)

### Capability 2: Responsive Layout Tests
Fill the empty tablet/ and desktop/ test directories:
- **Mobile (375-430px)**: footer single-line, nav stacking, touch targets ≥44px
- **Tablet (768-1024px)**: 2-column works grid, nav spacing, iPad landscape
- **Desktop (1280-1920px)**: full nav, hover states, grid columns
- **Cross-breakpoint**: resize from mobile→desktop, verify no layout breaks
- **Overlap detection**: run overlap-detector programmatically, assert zero overlaps at each breakpoint

### Capability 3: Theme System Tests
Dedicated test suite for the 4-theme system:
- Switch to each theme via UI and keyboard (T)
- Verify CSS custom properties change (--color-bg, --color-text, --color-accent)
- Verify entry highlights render correctly per theme
- Contrast ratios: axe-core scan per theme
- Persistence: set theme, refresh, verify theme persists
- Migration: localStorage "terminal" → auto-migrates to "darkroom"
- System preference fallback: prefers-color-scheme: dark

### Capability 4: Storybook Setup
Component isolation and documentation:
- @storybook/sveltekit for SvelteKit integration
- Stories for: ThemeSwitcher, FontSwitcher, CommandPalette, Elevator, AsciiDonut
- Each story shows all states (open, closed, active, hover)
- Storybook interaction tests for click/keyboard behavior

## Impact & Benefits
- **Confidence**: catch regressions before deploy
- **Coverage**: from 8 test files to ~20+, covering all routes and components
- **Documentation**: Storybook serves as living component catalog
- **Responsive proof**: verified layout behavior at every breakpoint

## Dependencies
- Existing Playwright 1.57.0 setup
- @storybook/sveltekit (new dependency)
- Existing overlap-detector.ts utility
- Dev server running for E2E tests

## Alternatives Considered
1. **Cypress for component tests** — Rejected for Phase 1: Playwright can handle component-level interaction testing via E2E. Add Cypress later if needed.
2. **Vitest for unit tests** — Not rejected, but deferred: overlap-detector and utility functions could use unit tests later.
3. **Visual regression only** — Rejected: screenshots don't catch interaction bugs, keyboard nav issues, or theme persistence.
