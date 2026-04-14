---
created: 2026-04-11
category: today
tags: [tests, stress-testing, playwright, storybook]
---

# Add Comprehensive Stress Testing

## Overview
Overwhelm the portfolio with interaction tests, responsive layout verification, theme system validation, and Storybook component isolation.

## Gaps Identified
1. **Theme system untested** — 4 themes with zero switching/persistence/contrast tests
2. **9/16 routes have zero coverage** — blog, gallery, labs, talks, gifts, os, minor, scratchpad
3. **No tablet/desktop tests** — configured but directories empty
4. **No overlap detection tests** — overlap-detector.ts never tested
5. **Keyboard shortcuts partially tested** — only `/` tested, `T` and `F` untested
6. **No component isolation** — no Storybook

## Proposed Capabilities
1. **Playwright Interaction Stress Tests** — All nav, keyboard, theme/font switcher, command palette, social toggle, rapid sequences
2. **Responsive Layout Tests** — Mobile/tablet/desktop, cross-breakpoint, overlap detection
3. **Theme System Tests** — All 4 themes, CSS custom properties, contrast ratios, persistence, migration
4. **Storybook Setup** — Component isolation for ThemeSwitcher, FontSwitcher, CommandPalette, Elevator, AsciiDonut