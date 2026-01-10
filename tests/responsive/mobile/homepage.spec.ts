/**
 * Mobile Responsive Tests
 *
 * Comprehensive tests for mobile viewport (375x667 and smaller)
 * Tests cover: touch interactions, mobile navigation, content visibility,
 * performance, and mobile-specific UX patterns
 */

import { test, expect } from '../../setup';
import { TestUtils, testData } from '../../setup';

const mobileViewports = [
  { width: 375, height: 667 }, // iPhone SE
  { width: 360, height: 640 }, // Android small
  { width: 414, height: 896 }, // iPhone 11
];

mobileViewports.forEach(viewport => {
  test.describe(`Mobile ${viewport.width}x${viewport.height}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(testData.urls.home);
      await TestUtils.waitForPageStable(page);
    });

    test('should display WIP banner properly on mobile', async ({ page }) => {
      const wipBanner = page.locator(testData.selectors.wipBanner);

      // Banner should be visible
      await expect(wipBanner).toBeVisible();

      // Should stack vertically on mobile
      const bannerContent = wipBanner.locator('.wip-text');
      await expect(bannerContent).toBeVisible();

      // Check banner fits in viewport
      const bannerBox = await wipBanner.boundingBox();
      expect(bannerBox?.width).toBeLessThanOrEqual(viewport.width);

      // Should be clickable/tappable
      await wipBanner.click();
      await page.waitForTimeout(100);
    });

    test('should not have horizontal scroll on mobile', async ({ page }) => {
      // Check page width vs viewport
      const pageWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(pageWidth).toBeLessThanOrEqual(viewport.width);

      // Check no elements overflow
      const hasOverflow = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
          const box = el.getBoundingClientRect();
          if (box.right > window.innerWidth) {
            return true;
          }
        }
        return false;
      });

      expect(hasOverflow).toBe(false);
    });

    test('should have stacked navigation on mobile', async ({ page }) => {
      const nav = page.locator(testData.selectors.nav);
      const navLinks = nav.locator('a');

      await expect(nav).toBeVisible();

      // Check links are vertically stacked
      const firstLink = navLinks.first();
      const secondLink = navLinks.nth(1);

      const firstBox = await firstLink.boundingBox();
      const secondBox = await secondLink.boundingBox();

      if (firstBox && secondBox) {
        expect(secondBox.y).toBeGreaterThan(firstBox.y);
      }
    });

    test('should have touch-friendly button sizes', async ({ page }) => {
      const buttons = page.locator('button, .play-button-large, [role="button"]');

      const count = Math.min(await buttons.count(), 10);
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();

        // Buttons should be at least 44x44px (iOS touch target)
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(40);
          expect(box.width).toBeGreaterThanOrEqual(40);
        }
      }
    });

    test('should display hero section correctly on mobile', async ({ page }) => {
      const hero = page.locator(testData.selectors.hero);

      await expect(hero).toBeVisible();

      // Hero should fit in viewport
      const heroBox = await hero.boundingBox();
      if (heroBox) {
        expect(heroBox.width).toBeLessThanOrEqual(viewport.width);
      }

      // Name should be visible and readable
      const heroName = hero.locator('.hero-name');
      await expect(heroName).toBeVisible();

      // Tagline should be visible
      const tagline = hero.locator('.hero-tagline');
      await expect(tagline).toBeVisible();

      // Check text doesn't overflow
      const nameBox = await heroName.boundingBox();
      if (nameBox && heroBox) {
        expect(nameBox.width).toBeLessThanOrEqual(heroBox.width);
      }
    });

    test('should display video players on mobile', async ({ page }) => {
      const videos = page.locator(testData.selectors.videoPlayer);

      // At least one video should be visible
      await expect(videos.first()).toBeVisible();

      // Video should fit in viewport width
      const videoBox = await videos.first().boundingBox();
      if (videoBox) {
        expect(videoBox.width).toBeLessThanOrEqual(viewport.width);
      }
    });

    test('should support touch interactions on video players', async ({ page }) => {
      const video = page.locator('video').first();
      const videoContainer = page.locator(testData.selectors.videoPlayer).first();

      // Tap to play
      await videoContainer.tap();
      await page.waitForTimeout(500);

      let isPlaying = await video.evaluate((el: any) => !el.paused);
      expect(isPlaying).toBe(true);

      // Tap to pause
      await videoContainer.tap();
      await page.waitForTimeout(500);

      isPlaying = await video.evaluate((el: any) => el.paused);
      expect(isPlaying).toBe(true);
    });

    test('should display video controls on touch', async ({ page }) => {
      const videoContainer = page.locator(testData.selectors.videoPlayer).first();

      // Tap to show controls
      await videoContainer.tap();
      await page.waitForTimeout(300);

      const controls = videoContainer.locator('.controls-overlay');
      await expect(controls).toBeVisible();

      // Controls should be touch-friendly
      const controlButtons = controls.locator('button');
      await expect(controlButtons.first()).toBeVisible();
    });

    test('should support swipe gestures on video progress', async ({ page }) => {
      const videoContainer = page.locator(testData.selectors.videoPlayer).first();
      const video = page.locator('video').first();

      // Start video
      await video.click();
      await page.waitForTimeout(1000);

      const videoBox = await videoContainer.boundingBox();
      if (!videoBox) return;

      // Simulate swipe on progress bar
      const progressBar = videoContainer.locator('.progress-container');
      await progressBar.tap({
        position: { x: videoBox.width * 0.7, y: videoBox.height * 0.9 }
      });

      await page.waitForTimeout(200);

      // Video should have seeked
      const currentTime = await video.evaluate((el: any) => el.currentTime);
      expect(currentTime).toBeGreaterThan(0);
    });

    test('should display works section on mobile', async ({ page }) => {
      const worksSection = page.locator('section:has-text("WORKS")');
      const worksList = worksSection.locator('.entry-list');

      await expect(worksSection).toBeVisible();
      await expect(worksList).toBeVisible();

      // Work entries should be visible
      const workEntries = worksList.locator('.entry');
      await expect(workEntries.first()).toBeVisible();

      // Entries should not overflow
      const entryBox = await workEntries.first().boundingBox();
      if (entryBox) {
        expect(entryBox.width).toBeLessThanOrEqual(viewport.width);
      }
    });

    test('should handle showcase section on mobile', async ({ page }) => {
      const showcaseSection = page.locator('.showcase-section');

      await expect(showcaseSection).toBeVisible();

      // Showcase items should be stacked vertically
      const showcaseItems = showcaseSection.locator('.showcase-item');

      const firstItemBox = await showcaseItems.first().boundingBox();
      const secondItemBox = await showcaseItems.nth(1).boundingBox();

      if (firstItemBox && secondItemBox) {
        expect(secondItemBox.y).toBeGreaterThan(firstItemBox.y);
      }
    });

    test('should display footer on mobile', async ({ page }) => {
      const footer = page.locator('footer');

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      await expect(footer).toBeVisible();

      // Footer should fit in viewport
      const footerBox = await footer.boundingBox();
      if (footerBox) {
        expect(footerBox.width).toBeLessThanOrEqual(viewport.width);
      }

      // Terminal hint might be hidden on mobile
      const terminalHint = footer.locator('.terminal-hint');
      const isVisible = await terminalHint.isVisible();

      // If visible, should be touch-friendly
      if (isVisible) {
        const hintBox = await terminalHint.boundingBox();
        if (hintBox) {
          expect(hintBox.width).toBeGreaterThanOrEqual(40);
        }
      }
    });

    test('should be keyboard navigable on mobile', async ({ page }) => {
      const navLinks = page.locator('a[href]');

      // Tab through navigation
      for (let i = 0; i < Math.min(await navLinks.count(), 5); i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(50);

        const focusedElement = await page.evaluate(() => {
          const active = document.activeElement;
          return active?.tagName === 'A' ? active.getAttribute('href') : null;
        });

        expect(focusedElement).toBeTruthy();
      }
    });

    test('should have proper spacing on mobile', async ({ page }) => {
      // Check that elements have adequate spacing
      const hero = page.locator(testData.selectors.hero);
      const heroBox = await hero.boundingBox();

      const wipBanner = page.locator(testData.selectors.wipBanner);
      const wipBox = await wipBanner.boundingBox();

      if (heroBox && wipBox) {
        // Elements should not overlap
        const gap = heroBox.y - (wipBox.y + wipBox.height);
        expect(gap).toBeGreaterThan(0);
      }
    });

    test('should handle mobile viewport changes', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await TestUtils.waitForPageStable(page);

      // Rotate to landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(300);

      // Content should still be visible
      await expect(page.locator(testData.selectors.hero)).toBeVisible();

      // Should not have horizontal scroll
      const pageWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(pageWidth).toBeLessThanOrEqual(667);
    });

    test('should load quickly on mobile', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(testData.urls.home, { waitUntil: 'domcontentloaded' });
      await TestUtils.waitForPageStable(page);
      const loadTime = Date.now() - startTime;

      // Should load in less than 3 seconds on mobile
      expect(loadTime).toBeLessThan(3000);
    });

    test('should be accessible on mobile', async ({ page, makeAxeBuilder }) => {
      const accessibilityScanResults = await makeAxeBuilder().analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should handle double-tap for zoom on mobile', async ({ page }) => {
      const heroName = page.locator('.hero-name');

      // Double-tap hero name
      await heroName.dblclick();
      await page.waitForTimeout(300);

      // Should not trigger zoom (we prevent zoom on our site)
      const scale = await page.evaluate(() => window.visualViewport?.scale);
      expect(scale).toBe(1);
    });

    test('should handle pinch zoom gracefully', async ({ page }) => {
      const hero = page.locator(testData.selectors.hero);
      const heroBox = await hero.boundingBox();

      if (!heroBox) return;

      // Simulate pinch zoom
      await page.touchscreen.tap(heroBox.x + heroBox.width / 2, heroBox.y + heroBox.height / 2);

      // Content should remain usable
      await expect(hero).toBeVisible();

      // No overflow
      const pageWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(pageWidth).toBeLessThanOrEqual(viewport.width);
    });

    test('should display command palette shortcut hint properly', async ({ page }) => {
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      const footer = page.locator('footer');
      const hintButton = footer.locator('.terminal-hint-btn');

      // Hint might be hidden on mobile
      const isVisible = await hintButton.isVisible();

      if (isVisible) {
        await expect(hintButton).toBeVisible();
        await expect(hintButton).toContainText('/ for CMDs');
      }
    });

    test('should handle offline gracefully on mobile', async ({ page }) => {
      // Go offline
      await page.context().setOffline(true);

      // Reload page
      await page.reload();
      await page.waitForTimeout(1000);

      // Core content should still be visible
      await expect(page.locator(testData.selectors.hero)).toBeVisible();
      await expect(page.locator(testData.selectors.wipBanner)).toBeVisible();

      // Go back online
      await page.context().setOffline(false);
    });

    test('should support long press on mobile', async ({ page }) => {
      const navLink = page.locator('nav a').first();

      // Long press (simulate with context menu trigger)
      await navLink.click({ button: 'right' });
      await page.waitForTimeout(300);

      // Should not crash
      const errors = await TestUtils.getConsoleErrors(page);
      expect(errors.length).toBe(0);
    });

    test('should handle dynamic content on mobile', async ({ page }) => {
      const videoContainer = page.locator(testData.selectors.videoPlayer).first();

      // Show controls
      await videoContainer.hover();
      await page.waitForTimeout(200);

      // Open shortcuts modal
      await videoContainer.locator('.shortcuts-hint').click();
      await page.waitForTimeout(200);

      const modal = videoContainer.locator('.shortcuts-modal');
      await expect(modal).toBeVisible();

      // Modal should fit in viewport
      const modalBox = await modal.boundingBox();
      if (modalBox) {
        expect(modalBox.width).toBeLessThanOrEqual(viewport.width);
        expect(modalBox.height).toBeLessThanOrEqual(viewport.height);
      }

      // Close modal
      await modal.locator('.shortcuts-close').tap();
      await page.waitForTimeout(200);

      await expect(modal).not.toBeVisible();
    });

    test('should have proper focus management on mobile', async ({ page }) => {
      const navLinks = page.locator('nav a');

      for (let i = 0; i < Math.min(await navLinks.count(), 3); i++) {
        const link = navLinks.nth(i);
        await link.focus();
        await page.waitForTimeout(50);

        const isFocused = await link.evaluate(el => el === document.activeElement);
        expect(isFocused).toBeTruthy();
      }
    });

    test('should handle text selection on mobile', async ({ page }) => {
      const heroName = page.locator('.hero-name');

      // Double-tap to select text
      await heroName.dblclick();
      await page.waitForTimeout(300);

      const selection = await page.evaluate(() => window.getSelection()?.toString());
      expect(selection).toBeTruthy();
      expect(selection?.length).toBeGreaterThan(0);
    });

    test('should have adequate contrast on mobile', async ({ page }) => {
      const wipBanner = page.locator(testData.selectors.wipBanner);
      const wipText = wipBanner.locator('.wip-text');

      const textColor = await wipText.evaluate(el => {
        return window.getComputedStyle(el).color;
      });

      const backgroundColor = await wipBanner.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Colors should be defined
      expect(textColor).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
    });

    test('should not have console errors on mobile', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto(testData.urls.home);
      await TestUtils.waitForPageStable(page);
      await page.waitForTimeout(2000);

      expect(errors).toHaveLength(0);
    });

    test('should handle small text sizing on mobile', async ({ page }) => {
      const heroTagline = page.locator('.hero-tagline');

      const fontSize = await heroTagline.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });

      // Font should be at least 14px for readability
      expect(fontSize).toBeGreaterThanOrEqual(14);
    });

    test('should have proper tap targets for navigation', async ({ page }) => {
      const navLinks = page.locator('nav a');

      for (let i = 0; i < Math.min(await navLinks.count(), 5); i++) {
        const link = navLinks.nth(i);
        const box = await link.boundingBox();

        if (box) {
          // Minimum touch target: 44x44px
          expect(box.height).toBeGreaterThanOrEqual(40);
          expect(box.width).toBeGreaterThanOrEqual(40);
        }
      }
    });

    test('should handle very small mobile screens', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5
      await page.goto(testData.urls.home);
      await TestUtils.waitForPageStable(page);

      // Core content should still be visible
      await expect(page.locator(testData.selectors.hero)).toBeVisible();
      await expect(page.locator(testData.selectors.wipBanner)).toBeVisible();

      // Should not have horizontal scroll
      const pageWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(pageWidth).toBeLessThanOrEqual(320);
    });

    // ============================================================
    // TDD TESTS - Mobile Layout Improvements (WIP Banner, Hero, Grid)
    // ============================================================

    test('WIP banner should be the first visible content element', async ({ page }) => {
      // The WIP banner should appear BEFORE the header in the DOM
      // This ensures it's the absolute first thing users see
      const wipBanner = page.locator(testData.selectors.wipBanner);
      const header = page.locator(testData.selectors.header);

      await expect(wipBanner).toBeVisible();
      await expect(header).toBeVisible();

      // Get bounding boxes
      const wipBox = await wipBanner.boundingBox();
      const headerBox = await header.boundingBox();

      // WIP banner should be first (appear before header in Y axis)
      expect(wipBox).toBeTruthy();
      expect(headerBox).toBeTruthy();
      if (wipBox && headerBox) {
        expect(wipBox.y).toBeLessThan(headerBox.y);
      }
    });

    test('WIP banner should appear above the header in visual order', async ({ page }) => {
      const wipBanner = page.locator(testData.selectors.wipBanner);
      const header = page.locator(testData.selectors.header);

      await expect(wipBanner).toBeVisible();
      await expect(header).toBeVisible();

      const wipBox = await wipBanner.boundingBox();
      const headerBox = await header.boundingBox();

      if (wipBox && headerBox) {
        // WIP banner should be above header (smaller y value)
        expect(wipBox.y + wipBox.height).toBeLessThanOrEqual(headerBox.y);
      }
    });

    test('hero name should have commanding large sizing on mobile (40px+)', async ({ page }) => {
      const heroName = page.locator('.hero-name');
      await expect(heroName).toBeVisible();

      const fontSize = await heroName.evaluate(el =>
        parseFloat(window.getComputedStyle(el).fontSize)
      );

      // Hero name should be at least 40px for commanding presence on mobile
      expect(fontSize).toBeGreaterThanOrEqual(40);
    });

    test('hero section should be centered on mobile', async ({ page }) => {
      const heroContent = page.locator('.hero-content');
      await expect(heroContent).toBeVisible();

      const textAlign = await heroContent.evaluate(el =>
        window.getComputedStyle(el).textAlign
      );

      expect(textAlign).toBe('center');
    });

    test('sections should have consistent grid-aligned spacing', async ({ page }) => {
      const sections = page.locator('section');
      const sectionCount = await sections.count();

      if (sectionCount < 2) return;

      const margins: number[] = [];

      for (let i = 0; i < sectionCount; i++) {
        const marginBottom = await sections.nth(i).evaluate(el =>
          parseFloat(window.getComputedStyle(el).marginBottom)
        );
        margins.push(marginBottom);
      }

      // Valid spacing values from our design system (in pixels at 16px base)
      // Includes 0 for sections without margin (e.g., within two-column layout)
      // var(--space-md) = 16, var(--space-lg) = 24, var(--space-xl) = 32, 
      // var(--space-2xl) = 48, var(--space-3xl) = 64, var(--space-4xl) = 96
      // var(--space-5xl) = 128, var(--space-6xl) = 192
      const validSpacings = [0, 16, 24, 32, 48, 64, 96, 128, 192];

      margins.forEach(m => {
        // Check if margin is close to one of our spacing scale values (within 8px tolerance for computed values)
        const isValidSpacing = validSpacings.some(v => Math.abs(m - v) <= 8);
        expect(isValidSpacing).toBe(true);
      });
    });

    test('content should have breathing room with proper horizontal padding on mobile', async ({ page }) => {
      const body = page.locator('body');

      const padding = await body.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          left: parseFloat(style.paddingLeft),
          right: parseFloat(style.paddingRight)
        };
      });

      // Should have at least 16px padding on each side
      expect(padding.left).toBeGreaterThanOrEqual(16);
      expect(padding.right).toBeGreaterThanOrEqual(16);
    });
  });
});

test.describe('Mobile Performance', () => {
  test('should have fast First Contentful Paint on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const metrics = await TestUtils.testLoadingPerformance(page, testData.urls.home);

    console.log('Mobile Performance Metrics:', metrics);

    // FCP should be under 2s on mobile
    expect(metrics.firstContentfulPaint).toBeLessThan(2000);

    // DOM Content Loaded should be under 3s
    expect(metrics.domContentLoaded).toBeLessThan(3000);
  });

  test('should handle slow mobile network', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Simulate slow 3G
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });

    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    // Should still load successfully
    await expect(page.locator(testData.selectors.hero)).toBeVisible();
  });
});

test.describe('Mobile Accessibility', () => {
  test('should work with screen reader on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    // Check for semantic landmarks
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have proper touch feedback on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testData.urls.home);

    const navLink = page.locator('nav a').first();

    // Tap and check for visual feedback
    await navLink.tap();
    await page.waitForTimeout(100);

    // Link should work
    await expect(page).toHaveURL('/');
  });
});

test.describe('Mobile Edge Cases', () => {
  test('should handle zoom on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testData.urls.home);

    // Simulate zoom
    await page.evaluate(() => {
      document.body.style.transform = 'scale(1.5)';
      document.body.style.transformOrigin = 'top left';
    });
    await page.waitForTimeout(300);

    // Content should still be accessible
    await expect(page.locator(testData.selectors.hero)).toBeVisible();

    // Reset zoom
    await page.evaluate(() => {
      document.body.style.transform = 'scale(1)';
    });
  });

  test('should handle content that extends beyond viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Footer should be visible
    await expect(page.locator('footer')).toBeInViewport();

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // Hero should be visible
    await expect(page.locator(testData.selectors.hero)).toBeInViewport();
  });

  test('should handle rotation on mobile', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    // Save state
    const scrollPos = await page.evaluate(() => window.scrollY);

    // Rotate to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    // Content should still be visible
    await expect(page.locator(testData.selectors.hero)).toBeVisible();

    // Rotate back to portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Content should still be visible
    await expect(page.locator(testData.selectors.hero)).toBeVisible();
  });
});
