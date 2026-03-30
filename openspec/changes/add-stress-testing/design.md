# Design: Comprehensive Stress Testing & Component Infrastructure

## Architecture Overview

```
tests/
├── setup.ts                          # Existing: TestUtils, testData, fixtures
├── smoke.spec.ts                     # Existing: basic connectivity
├── essential.spec.ts                 # Existing: core functionality
├── ui-polish.spec.ts                 # Existing: layout checks
├── stress/
│   ├── interactions.spec.ts          # NEW: all buttons, links, keyboard shortcuts
│   ├── rapid-fire.spec.ts            # NEW: spam clicks, fast theme cycling, cold start
│   └── navigation.spec.ts           # NEW: all routes, deep linking, back/forward
├── themes/
│   ├── switching.spec.ts             # NEW: theme cycle, persistence, migration
│   ├── contrast.spec.ts             # NEW: axe-core per theme, APCA spot checks
│   └── highlights.spec.ts           # NEW: entry highlight rendering per theme
├── responsive/
│   ├── mobile/
│   │   ├── homepage.spec.ts          # Existing
│   │   └── works.spec.ts            # Existing
│   ├── tablet/
│   │   └── layout.spec.ts           # NEW: iPad Mini, iPad Pro, landscape
│   └── desktop/
│       └── layout.spec.ts           # NEW: 1280, 1920, HiDPI
├── overlap/
│   └── overlap.spec.ts              # NEW: programmatic overlap detection
├── e2e/
│   └── homepage.spec.ts             # Existing
├── accessibility/
│   └── homepage.spec.ts             # Existing
└── visual/
    └── homepage.spec.ts             # Existing

.storybook/
├── main.ts                           # NEW: Storybook config for SvelteKit
├── preview.ts                        # NEW: global decorators, theme provider
└── stories/
    ├── ThemeSwitcher.stories.svelte  # NEW
    ├── FontSwitcher.stories.svelte   # NEW
    ├── CommandPalette.stories.svelte # NEW
    ├── Elevator.stories.svelte       # NEW
    └── AsciiDonut.stories.svelte    # NEW
```

## Design Decisions

### 1. Playwright over Cypress for E2E
**Decision:** Keep Playwright as the sole E2E framework. Don't add Cypress.
**Rationale:** The project already has 13 configured Playwright projects, TestUtils, and fixtures. Adding Cypress introduces a second test runner, double the config, and CI complexity. Playwright 1.57 handles component interaction testing well enough via page-level tests. Add Cypress only if specific component isolation needs arise that Storybook can't cover.

### 2. Storybook for Component Isolation
**Decision:** Add @storybook/sveltekit for component stories and interaction tests.
**Rationale:** Storybook provides:
- Visual catalog of all states (open, closed, active, disabled)
- Interaction testing via @storybook/test
- Theme context wrapping (test each component in all 4 themes)
- Living documentation for the component library
This complements Playwright E2E (which tests full-page flows) with isolated component behavior.

### 3. Overlap Detection as Test
**Decision:** Import overlap-detector.ts programmatically in Playwright tests.
**Rationale:** The overlap detector already does DOM scanning for element collisions. Rather than duplicating that logic in tests, inject it into the page via `page.evaluate()` and assert zero overlaps. Run at each major breakpoint (375, 768, 1024, 1280, 1920).

### 4. Stress Test Patterns
**Decision:** Dedicated `tests/stress/` directory for overwhelming interaction tests.
**Rationale:** These tests intentionally push limits — rapid clicks, fast theme cycling, cold start (clear all localStorage + hard refresh). They catch race conditions, debounce failures, and state corruption that normal tests miss.

### 5. Theme Tests Separate from A11y
**Decision:** Dedicated `tests/themes/` directory, not merged into accessibility/.
**Rationale:** Theme tests cover UI behavior (switching, persistence, migration) and visual correctness (highlights, entry colors). Accessibility tests (axe-core) focus on WCAG compliance. They're different concerns that happen to overlap on contrast ratios.

## Test Data Extensions

```typescript
// Additions to testData in tests/setup.ts
themes: {
  all: ['minimal', 'studio', 'darkroom', 'accessible'],
  default: 'minimal',
  legacy: { terminal: 'darkroom', paper: 'minimal' },
  cssVars: ['--color-bg', '--color-text', '--color-accent', '--border-color'],
},
breakpoints: {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1280, height: 800 },
  desktopHD: { width: 1920, height: 1080 },
},
keyboard: {
  themeToggle: 'T',
  fontToggle: 'F',
  commandPalette: '/',
  help: '?',
  escape: 'Escape',
}
```

## Storybook Configuration

```typescript
// .storybook/main.ts
export default {
  stories: ['../src/**/*.stories.@(svelte|ts)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: '@storybook/sveltekit',
};
```

Each story wraps components in a theme provider that sets `data-theme` on the root, allowing visual verification across all 4 themes.

## Overlap Detection Strategy

```typescript
// In Playwright test, inject overlap detector:
const overlaps = await page.evaluate(() => {
  // Import and run overlap detection logic
  const elements = document.querySelectorAll('*');
  const rects = Array.from(elements).map(el => ({
    el: el.tagName,
    rect: el.getBoundingClientRect()
  }));
  // Check for overlapping bounding boxes > 100px²
  return findOverlaps(rects);
});
expect(overlaps).toHaveLength(0);
```

## Performance Benchmarks (from existing tests/README.md)
- FCP: < 2.0s
- LCP: < 2.5s
- TTI: < 3.5s
- CLS: < 0.1
- Bundle: < 100KB JS
