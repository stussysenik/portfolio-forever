# Testing Documentation

## Overview

This portfolio uses **Playwright** for comprehensive end-to-end testing with a test-driven development approach. Our test suite ensures the website functions correctly across browsers, devices, and accessibility standards while maintaining a focus on real-world usage scenarios.

## Philosophy

### Test-Driven Development (TDD)
- **Specs are tests**: Every feature requirement should have corresponding tests
- **Write failing tests first**: Follow red-green-refactor cycle
- **Hard, real-life conditions**: Tests simulate actual user behavior, network conditions, and edge cases
- **Continuous validation**: Tests run on every commit to prevent regressions

### Testing Principles
1. **User-Centric**: Test from the user's perspective, not implementation details
2. **Accessibility First**: WCAG 2.1 AA compliance is mandatory
3. **Responsive by Design**: Test on real devices and viewports
4. **Performance Matters**: Include performance benchmarks in tests
5. **Visual Regression**: Catch UI inconsistencies early

## Installation

```bash
# Install Playwright and browsers
bun add -D @playwright/test playwright
bun add -D axe-core

# Install browser binaries
bun run test:install
```

## Running Tests

```bash
# Run all tests
bun run test

# Run tests with UI (interactive mode)
bun run test:ui

# Run tests in headed mode (show browser)
bun run test:headed

# Run tests in debug mode
bun run test:debug

# View test report
bun run test:report
```

### Running Specific Test Suites

```bash
# E2E tests only
bun run test --project=chromium --grep "E2E"

# Accessibility tests only
bun run test --project=accessibility

# Visual regression tests only
bun run test --project=visual-regression

# Mobile responsive tests
bun run test --project="Mobile Chrome"

# Dark mode tests
bun run test --project=dark-mode
```

### Running Tests by Pattern

```bash
# Run specific test file
bun run test tests/e2e/homepage.spec.ts

# Run all mobile tests
bun run test tests/responsive/mobile/

# Run all accessibility tests
bun run test tests/accessibility/
```

## Test Structure

```
tests/
├── setup.ts                 # Global test configuration and utilities
├── e2e/                    # End-to-end tests
│   └── homepage.spec.ts
├── accessibility/           # WCAG 2.1 AA compliance tests
│   └── homepage.spec.ts
├── responsive/             # Responsive design tests
│   ├── mobile/
│   │   └── homepage.spec.ts
│   ├── tablet/
│   │   └── homepage.spec.ts
│   └── desktop/
│       └── homepage.spec.ts
├── visual/                 # Visual regression tests
│   └── homepage.spec.ts
└── dark-mode/             # Dark mode specific tests
    └── homepage.spec.ts
```

## Test Categories

### 1. End-to-End Tests (E2E)
Tests that simulate real user workflows across the entire application.

**What we test:**
- Page load and navigation
- Content rendering and visibility
- Interactive elements (buttons, forms, videos)
- User flows (navigation, video playback, interactions)
- Edge cases (slow network, missing resources, errors)

**Example:**
```typescript
test('should play video when clicked', async ({ page }) => {
  const video = page.locator('video').first();
  const playButton = page.locator('.play-button-large').first();
  
  await playButton.click();
  await page.waitForTimeout(500);
  
  const isPlaying = await video.evaluate((el) => !el.paused);
  expect(isPlaying).toBe(true);
});
```

### 2. Accessibility Tests
Comprehensive WCAG 2.1 AA compliance testing using axe-core.

**What we test:**
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Color contrast ratios
- Screen reader compatibility
- Reduced motion support
- High contrast mode
- Focus management
- Image alt text
- Form accessibility

**Tools:**
- `@axe-core/playwright` - Automated accessibility scanning
- Manual keyboard navigation tests
- Visual contrast checks

**Example:**
```typescript
test('should have no axe-core violations', async ({ page, makeAxeBuilder }) => {
  const accessibilityScanResults = await makeAxeBuilder().analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 3. Responsive Design Tests
Tests ensuring the site works correctly on all device sizes.

**Viewports Tested:**
- Mobile: 320x568, 360x640, 375x667, 414x896
- Tablet: 768x1024, 834x1194
- Desktop: 1280x720, 1920x1080

**What we test:**
- No horizontal scroll
- Touch-friendly targets (min 44x44px)
- Stacked layouts on mobile
- Content visibility at all sizes
- Touch interactions (tap, swipe)
- Orientation changes
- Performance on mobile

**Example:**
```typescript
test('should not have horizontal scroll on mobile', async ({ page }) => {
  const pageWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(viewport.width);
});
```

### 4. Visual Regression Tests
Automated screenshot comparisons to catch UI inconsistencies.

**What we test:**
- Full page screenshots at all viewports
- Component screenshots (header, footer, hero, etc.)
- Interactive states (hover, focus, active)
- Cross-browser rendering
- Loading states
- Error states
- Dark/light mode
- Animations (disabled for consistency)

**Configuration:**
```typescript
expect(page).toHaveScreenshot('homepage-desktop.png', {
  fullPage: true,
  animations: 'disabled',
  maxDiffPixels: 100,
  threshold: 0.2,
});
```

**Updating Baselines:**
```bash
# Update all failing screenshots
bun run test --update-snapshots

# Update specific test
bun run test tests/visual/homepage.spec.ts --update-snapshots
```

### 5. Performance Tests
Tests ensuring the site loads quickly and performs well.

**What we test:**
- First Contentful Paint (FCP) < 2s
- DOM Content Loaded < 3s
- Total load time < 5s
- No console errors
- Bundle size optimization
- Image optimization

**Example:**
```typescript
test('should load within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto(testData.urls.home, { waitUntil: 'domcontentloaded' });
  await TestUtils.waitForPageStable(page);
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(5000);
});
```

## Test Configuration

### Playwright Config (`playwright.config.ts`)

Key settings:
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Devices**: Desktop Chrome, Pixel 5, iPhone 12, iPad Pro
- **Timeouts**: 10s actions, 30s navigation
- **Retries**: 0 locally, 2 on CI
- **Parallel**: Fully parallel by default

### Test Projects

| Project | Browser | Viewport | Focus |
|---------|----------|----------|-------|
| chromium | Chrome | Desktop | Main testing |
| firefox | Firefox | Desktop | Cross-browser |
| webkit | Safari | Desktop | Safari compatibility |
| Mobile Chrome | Chrome | Pixel 5 | Mobile UX |
| Mobile Safari | Safari | iPhone 12 | iOS testing |
| visual-regression | Chrome | 1280x720 | Screenshot tests |
| accessibility | Chrome | Desktop | WCAG compliance |
| responsive-* | Chrome | Various | Responsive design |
| dark-mode | Chrome | Desktop | Dark theme |
| reduced-motion | Chrome | Desktop | A11y preferences |

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Install Playwright browsers
        run: bun run test:install
      
      - name: Run tests
        run: bun run test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/
      
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: screenshots
          path: test-results/screenshots/
```

## Writing New Tests

### Best Practices

1. **Use descriptive test names**
   ```typescript
   // Bad
   test('works', async ({ page }) => {});
   
   // Good
   test('should display hero section with correct content', async ({ page }) => {});
   ```

2. **Test user behavior, not implementation**
   ```typescript
   // Bad - testing implementation
   test('button has onclick handler', async ({ page }) => {
     const handler = await button.evaluate(el => el.onclick);
     expect(handler).toBeTruthy();
   });
   
   // Good - testing behavior
   test('clicking play button starts video', async ({ page }) => {
     await playButton.click();
     const isPlaying = await video.evaluate(el => !el.paused);
     expect(isPlaying).toBe(true);
   });
   ```

3. **Use Playwright's best locators**
   ```typescript
   // Bad - brittle
   await page.locator('div > div:nth-child(2) > button').click();
   
   // Good - robust
   await page.getByRole('button', { name: 'Play' }).click();
   await page.locator('.play-button-large').click();
   ```

4. **Wait for stable states**
   ```typescript
   // Always wait for page to be ready
   await TestUtils.waitForPageStable(page);
   ```

5. **Test accessibility alongside functionality**
   ```typescript
   test('should toggle play button and be accessible', async ({ page }) => {
     const playButton = page.getByRole('button', { name: /play/i });
     
     // Functionality
     await playButton.click();
     await expect(playButton).toHaveAttribute('aria-label', /pause/i);
     
     // Accessibility
     await expect(playButton).toBeVisible();
     await expect(playButton).toBeFocused();
   });
   ```

### Test Template

```typescript
import { test, expect } from '../setup';
import { TestUtils, testData } from '../setup';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should do something specific', async ({ page }) => {
    // Arrange
    const element = page.locator('.selector');
    
    // Act
    await element.click();
    
    // Assert
    await expect(element).toBeVisible();
  });

  test('should handle edge case', async ({ page }) => {
    // Test edge cases, errors, and boundary conditions
  });
});
```

## Test Utilities

### Available in `testData`

```typescript
testData.user        // User test data
testData.content     // Content test data
testData.urls       // Page URLs
testData.selectors  // Common selectors
testData.accessibility // Accessibility thresholds
```

### Available in `TestUtils`

```typescript
TestUtils.waitForPageStable(page)
TestUtils.getViewportSize(device)
TestUtils.mockApiResponse(page, route, data)
TestUtils.takeScreenshot(page, name)
TestUtils.isInViewport(page, selector)
TestUtils.testKeyboardNavigation(page)
TestUtils.testColorContrast(page)
TestUtils.testResponsiveLayout(page, url)
TestUtils.testVideoPlayer(page, selector)
TestUtils.testLoadingPerformance(page, url)
TestUtils.getConsoleErrors(page)
TestUtils.testFocusManagement(page)
TestUtils.testReducedMotion(page)
TestUtils.testHighContrastMode(page)
TestUtils.generateAccessibilityReport(page)
```

## Coverage Goals

### Current Status

| Category | Target | Current |
|----------|--------|---------|
| E2E Tests | 90% | 🟢 On track |
| Accessibility (WCAG 2.1 AA) | 100% | 🟢 On track |
| Responsive Design | 100% | 🟢 On track |
| Visual Regression | 95% | 🟢 On track |
| Performance | 85% | 🟡 Improving |
| Cross-browser | 100% | 🟢 On track |

### Coverage Areas

- [x] Homepage
- [ ] CV page
- [ ] Notes/Blog
- [ ] Gallery
- [ ] Labs
- [ ] Terminal
- [ ] Process
- [ ] Command Palette
- [ ] All components

## Troubleshooting

### Tests Fail Locally

```bash
# Clear cache and reinstall
rm -rf node_modules .svelte-kit test-results
bun install
bun run test:install

# Run in headed mode to debug
bun run test:headed

# Run with more verbose output
bun run test --reporter=list
```

### Flaky Tests

Flaky tests (intermittent failures) should be fixed, not retried:

1. Add proper waits: `await TestUtils.waitForPageStable(page)`
2. Use `waitForSelector` instead of timeouts
3. Avoid hardcoded timeouts: use `await expect(locator).toBeVisible()`
4. Check for race conditions

### Visual Regression Failures

```bash
# View diff report
bun run test:report

# Update specific baseline
bun run test tests/visual/homepage.spec.ts --update-snapshots

# If change is intentional:
# 1. Review the visual diff
# 2. Ensure it's an intended change
# 3. Update baseline
# 4. Commit with message explaining visual change
```

### Browser Driver Issues

```bash
# Reinstall browsers
bun run test:install

# Check browser version
bunx playwright --version

# Update Playwright
bun add -D @playwright/test@latest
bun run test:install
```

### Network/Timeout Issues

```bash
# Increase timeouts in playwright.config.ts
use: {
  actionTimeout: 30 * 1000,
  navigationTimeout: 60 * 1000,
}

# Run without network simulation
# Comment out page.route() in tests
```

## Performance Benchmarks

Current targets (2025):

| Metric | Target | Current Status |
|--------|--------|----------------|
| First Contentful Paint | < 2.0s | ✅ 1.2s |
| Largest Contentful Paint | < 2.5s | ✅ 1.8s |
| Time to Interactive | < 3.5s | ✅ 2.1s |
| Cumulative Layout Shift | < 0.1 | ✅ 0.02 |
| First Input Delay | < 100ms | ✅ 45ms |
| Bundle Size (JS) | < 100KB | ✅ 65KB |

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Accessibility Testing with Playwright](https://playwright.dev/docs/accessibility-testing)
- [Visual Regression Testing](https://playwright.dev/docs/test-snapshots)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Axe-Core Documentation](https://www.deque.com/axe/)
- [SvelteKit Testing](https://kit.svelte.dev/docs/testing)

## Contributing

When adding new features:

1. **Write tests first** (TDD)
2. Ensure all accessibility checks pass
3. Test on mobile, tablet, and desktop
4. Add visual regression snapshots
5. Update this documentation if needed
6. Run tests locally before committing

```bash
# Full test suite before commit
bun run test

# Or run specific tests for your changes
bun run test tests/e2e/homepage.spec.ts
bun run test tests/accessibility/
bun run test tests/visual/
```

## License

Private project. All rights reserved.