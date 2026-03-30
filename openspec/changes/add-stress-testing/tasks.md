# Tasks: Add Comprehensive Stress Testing & Component Infrastructure

## Phase 1: Playwright Test Expansion (no new dependencies)

### 1. Extend test fixtures in tests/setup.ts
- Add theme data (all themes, defaults, legacy mappings, CSS vars)
- Add breakpoint data (mobile, tablet, tabletLandscape, desktop, desktopHD)
- Add keyboard shortcut data (T, F, /, ?, Escape)
- **Validate:** Import works, TypeScript compiles

### 2. Write tests/stress/interactions.spec.ts
- Test all nav links (8 routes × click + verify content)
- Test T key theme cycling (minimal → studio → darkroom → accessible → minimal)
- Test F key font switching
- Test / command palette open, search, navigate
- Test @ social toggle open, links visible, security attrs
- Test all external links have rel="noopener"
- Test cold start (cleared localStorage)
- **Validate:** `npx playwright test tests/stress/interactions.spec.ts`

### 3. Write tests/stress/rapid-fire.spec.ts
- Rapid T key pressing (10x in 1 second)
- Fast theme dropdown clicking
- Theme switch + immediate page navigation
- Multiple keyboard shortcuts in sequence (T, F, /, Escape)
- **Validate:** `npx playwright test tests/stress/rapid-fire.spec.ts`

### 4. Write tests/stress/navigation.spec.ts
- Deep link to every route directly
- Browser back/forward through route history
- Navigate to all 16 routes sequentially
- Verify no console errors on any route
- **Validate:** `npx playwright test tests/stress/navigation.spec.ts`

## Phase 2: Theme System Tests

### 5. Write tests/themes/switching.spec.ts
- Switch to each theme via UI + keyboard
- Verify CSS custom properties change per theme
- Test persistence (set, refresh, verify)
- Test legacy migration (terminal → darkroom, paper → minimal)
- Test system dark preference fallback
- **Validate:** `npx playwright test tests/themes/switching.spec.ts`

### 6. Write tests/themes/contrast.spec.ts
- Run axe-core on homepage for each of 4 themes
- Spot-check APCA contrast for body text per theme
- **Validate:** `npx playwright test tests/themes/contrast.spec.ts`

### 7. Write tests/themes/highlights.spec.ts
- Verify entry highlight rendering per theme (9 highlights × 4 themes)
- Check background color, border, text color per theme
- **Validate:** `npx playwright test tests/themes/highlights.spec.ts`

## Phase 3: Responsive Layout Tests

### 8. Write tests/responsive/tablet/layout.spec.ts
- iPad Mini (768x1024), iPad Pro (1024x1366), landscape (1024x768)
- Works grid 2-column, nav spacing, container padding
- Overlap detection at tablet breakpoint
- Touch targets >= 44px
- **Validate:** `npx playwright test tests/responsive/tablet/layout.spec.ts`

### 9. Write tests/responsive/desktop/layout.spec.ts
- 1280x800, 1920x1080, 2560x1440 (HiDPI)
- Full nav, hover states (theme toggle, links)
- Grid columns (12 on desktop, 16 on 4K)
- Overlap detection at desktop breakpoints
- **Validate:** `npx playwright test tests/responsive/desktop/layout.spec.ts`

### 10. Write tests/overlap/overlap.spec.ts
- Import overlap-detector logic via page.evaluate()
- Run at 375px, 768px, 1024px, 1280px, 1920px
- Assert zero overlaps with area > 100px²
- Test with each of 4 themes active
- **Validate:** `npx playwright test tests/overlap/overlap.spec.ts`

## Phase 4: Storybook Setup

### 11. Install Storybook for SvelteKit
- `npx storybook@latest init --type sveltekit`
- Configure .storybook/main.ts and preview.ts
- Add @storybook/addon-a11y
- Add theme decorator for switching between 4 themes
- **Validate:** `npm run storybook` starts and loads

### 12. Write component stories
- ThemeSwitcher.stories.svelte: closed, open, each theme active
- FontSwitcher.stories.svelte: closed, open, each font active
- CommandPalette.stories.svelte: closed, open, with search
- Elevator.stories.svelte: visible, scrolling
- AsciiDonut.stories.svelte: rendering
- **Validate:** All stories render in Storybook UI

## Parallelization Notes
- Tasks 2-4 (stress tests) are independent and can be written in parallel
- Tasks 5-7 (theme tests) are independent and can be written in parallel
- Tasks 8-10 (responsive/overlap) are independent and can be written in parallel
- Task 11 must complete before task 12
- Phases 1-3 have zero new dependencies (Playwright only)
- Phase 4 requires new npm packages (@storybook/sveltekit)
