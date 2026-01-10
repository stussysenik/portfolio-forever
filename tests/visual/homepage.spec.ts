/**
 * Visual Regression Tests
 *
 * Comprehensive visual regression tests to ensure UI consistency
 * Tests cover: full page screenshots, component snapshots,
 * interactive states, and cross-browser compatibility
 */

import { test } from '../setup';
import { expect } from '@playwright/test';
import { TestUtils, testData } from '../setup';

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  desktopHD: { width: 1920, height: 1080 },
};

test.describe('Visual Regression - Full Page', () => {
  test('should match full page screenshot on desktop', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    // Full page screenshot
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match full page screenshot on tablet', async ({ page }) => {
    await page.setViewportSize(viewports.tablet);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match full page screenshot on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match full page screenshot on desktop HD', async ({ page }) => {
    await page.setViewportSize(viewports.desktopHD);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    await expect(page).toHaveScreenshot('homepage-desktop-hd.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - WIP Banner', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should match WIP banner screenshot', async ({ page }) => {
    const wipBanner = page.locator(testData.selectors.wipBanner);

    await expect(wipBanner).toBeVisible();
    await expect(wipBanner).toHaveScreenshot('wip-banner.png', {
      animations: 'disabled',
    });
  });

  test('should show WIP banner animations', async ({ page }) => {
    const wipBanner = page.locator(testData.selectors.wipBanner);

    // Wait for animation to be visible
    await page.waitForTimeout(500);

    await expect(wipBanner).toHaveScreenshot('wip-banner-animated.png', {
      animations: 'allowed',
      maxDiffPixels: 150, // Allow some pixel diff for animated state
    });
  });
});

test.describe('Visual Regression - Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should match hero section screenshot', async ({ page }) => {
    const hero = page.locator(testData.selectors.hero);

    await expect(hero).toBeVisible();
    await expect(hero).toHaveScreenshot('hero-section.png', {
      animations: 'disabled',
    });
  });

  test('should match hero section on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    const hero = page.locator(testData.selectors.hero);
    await expect(hero).toHaveScreenshot('hero-section-mobile.png', {
      animations: 'disabled',
    });
  });

  test('should show ASCII donut visual', async ({ page }) => {
    const heroVisual = page.locator('.hero-visual');

    await expect(heroVisual).toBeVisible();
    await expect(heroVisual).toHaveScreenshot('ascii-donut.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Video Players', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should match video player in initial state', async ({ page }) => {
    const videoContainer = page.locator(testData.selectors.videoPlayer).first();

    await expect(videoContainer).toBeVisible();
    await expect(videoContainer).toHaveScreenshot('video-player-initial.png', {
      animations: 'disabled',
    });
  });

  test('should match video player with controls visible', async ({ page }) => {
    const videoContainer = page.locator(testData.selectors.videoPlayer).first();

    // Hover to show controls
    await videoContainer.hover();
    await page.waitForTimeout(300);

    await expect(videoContainer).toHaveScreenshot('video-player-controls.png', {
      animations: 'disabled',
    });
  });

  test('should match video player while playing', async ({ page }) => {
    const video = page.locator('video').first();
    const videoContainer = page.locator(testData.selectors.videoPlayer).first();

    // Start playing
    await video.click();
    await page.waitForTimeout(1000);

    // Take screenshot
    await expect(videoContainer).toHaveScreenshot('video-player-playing.png', {
      animations: 'disabled',
      maxDiffPixels: 200, // Allow more diff for video content
      threshold: 0.3, // Higher threshold for video content
    });
  });

  test('should match video player with progress bar', async ({ page }) => {
    const video = page.locator('video').first();
    const videoContainer = page.locator(testData.selectors.videoPlayer).first();

    // Play video for a bit
    await video.click();
    await page.waitForTimeout(2000);

    // Show controls
    await videoContainer.hover();
    await page.waitForTimeout(200);

    await expect(videoContainer).toHaveScreenshot('video-player-progress.png', {
      animations: 'disabled',
      maxDiffPixels: 200,
      threshold: 0.3,
    });
  });

  test('should match video player with shortcuts modal', async ({ page }) => {
    const videoContainer = page.locator(testData.selectors.videoPlayer).first();

    // Hover and open shortcuts
    await videoContainer.hover();
    await page.waitForTimeout(200);
    await videoContainer.locator('.shortcuts-hint').click();
    await page.waitForTimeout(200);

    await expect(videoContainer).toHaveScreenshot('video-player-shortcuts.png', {
      animations: 'disabled',
    });
  });

  test('should match video player on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    const videoContainer = page.locator(testData.selectors.videoPlayer).first();
    await expect(videoContainer).toHaveScreenshot('video-player-mobile.png', {
      animations: 'disabled',
    });
  });

  test('should match video player touch controls', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    const videoContainer = page.locator(testData.selectors.videoPlayer).first();

    // Tap to show controls
    await videoContainer.tap();
    await page.waitForTimeout(300);

    await expect(videoContainer).toHaveScreenshot('video-player-mobile-controls.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Works Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should match works section screenshot', async ({ page }) => {
    const worksSection = page.locator('section:has-text("WORKS")');

    await expect(worksSection).toBeVisible();
    await expect(worksSection).toHaveScreenshot('works-section.png', {
      animations: 'disabled',
    });
  });

  test('should match works section on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    const worksSection = page.locator('section:has-text("WORKS")');
    await expect(worksSection).toHaveScreenshot('works-section-mobile.png', {
      animations: 'disabled',
    });
  });

  test('should show work entry hover states', async ({ page }) => {
    const workEntry = page.locator('.entry').first();

    await workEntry.hover();
    await page.waitForTimeout(200);

    await expect(workEntry).toHaveScreenshot('work-entry-hover.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Showcase Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should match showcase section screenshot', async ({ page }) => {
    const showcaseSection = page.locator('.showcase-section');

    await expect(showcaseSection).toBeVisible();
    await expect(showcaseSection).toHaveScreenshot('showcase-section.png', {
      animations: 'disabled',
    });
  });

  test('should match showcase section on tablet', async ({ page }) => {
    await page.setViewportSize(viewports.tablet);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    const showcaseSection = page.locator('.showcase-section');
    await expect(showcaseSection).toHaveScreenshot('showcase-section-tablet.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Header and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should match header screenshot', async ({ page }) => {
    const header = page.locator(testData.selectors.header);

    await expect(header).toBeVisible();
    await expect(header).toHaveScreenshot('header.png', {
      animations: 'disabled',
    });
  });

  test('should show navigation hover states', async ({ page }) => {
    const navLink = page.locator('nav a').first();

    await navLink.hover();
    await page.waitForTimeout(200);

    await expect(navLink).toHaveScreenshot('nav-link-hover.png', {
      animations: 'disabled',
    });
  });

  test('should show navigation active states', async ({ page }) => {
    const navLink = page.locator('nav a[href="/"]');

    await expect(navLink).toHaveScreenshot('nav-link-active.png', {
      animations: 'disabled',
    });
  });

  test('should match header on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    const header = page.locator(testData.selectors.header);
    await expect(header).toHaveScreenshot('header-mobile.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Footer and Terminal', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
  });

  test('should match footer screenshot', async ({ page }) => {
    const footer = page.locator('footer');

    await expect(footer).toBeVisible();
    await expect(footer).toHaveScreenshot('footer.png', {
      animations: 'disabled',
    });
  });

  test('should match footer on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto(testData.urls.home);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer-mobile.png', {
      animations: 'disabled',
    });
  });

  test('should show status indicator animation', async ({ page }) => {
    const footer = page.locator('footer');
    const statusIndicator = footer.locator('.status-indicator');

    // Wait for animation
    await page.waitForTimeout(500);

    await expect(statusIndicator).toHaveScreenshot('status-indicator.png', {
      animations: 'allowed',
      maxDiffPixels: 50, // Allow some diff for pulsing animation
    });
  });
});

test.describe('Visual Regression - Interactive States', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should match page with focus states', async ({ page }) => {
    // Focus on first link
    const navLink = page.locator('nav a').first();
    await navLink.focus();
    await page.waitForTimeout(100);

    await expect(page).toHaveScreenshot('page-with-focus.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match page with multiple focus states', async ({ page }) => {
    // Tab through navigation
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
    }

    await expect(page).toHaveScreenshot('page-multiple-focus.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match page scrolled to middle', async ({ page }) => {
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 2);
    });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('page-scrolled-middle.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match page scrolled to bottom', async ({ page }) => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('page-scrolled-bottom.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Cross Browser', () => {
  test.describe('Chromium', () => {
    test('should match screenshots in Chromium', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'Chromium only test');

      await page.setViewportSize(viewports.desktop);
      await page.goto(testData.urls.home);
      await TestUtils.waitForPageStable(page);

      await expect(page).toHaveScreenshot('chromium-homepage.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('Firefox', () => {
    test('should match screenshots in Firefox', async ({ page, browserName }) => {
      test.skip(browserName !== 'firefox', 'Firefox only test');

      await page.setViewportSize(viewports.desktop);
      await page.goto(testData.urls.home);
      await TestUtils.waitForPageStable(page);

      await expect(page).toHaveScreenshot('firefox-homepage.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixels: 150, // Allow more diff for browser rendering differences
      });
    });
  });

  test.describe('WebKit', () => {
    test('should match screenshots in WebKit', async ({ page, browserName }) => {
      test.skip(browserName !== 'webkit', 'WebKit only test');

      await page.setViewportSize(viewports.desktop);
      await page.goto(testData.urls.home);
      await TestUtils.waitForPageStable(page);

      await expect(page).toHaveScreenshot('webkit-homepage.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixels: 150, // Allow more diff for browser rendering differences
      });
    });
  });
});

test.describe('Visual Regression - Loading States', () => {
  test('should match page before content loads', async ({ page }) => {
    // Navigate but don't wait for full load
    await page.goto(testData.urls.home, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(100);

    await expect(page).toHaveScreenshot('page-loading.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match video loading state', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);

    // Don't wait for videos to fully load
    await page.waitForTimeout(200);

    const videoContainer = page.locator(testData.selectors.videoPlayer).first();
    const loadingOverlay = videoContainer.locator('.loading-overlay');

    if (await loadingOverlay.isVisible()) {
      await expect(videoContainer).toHaveScreenshot('video-loading.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Regression - Color Schemes', () => {
  test('should match page in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match page in light mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    await expect(page).toHaveScreenshot('homepage-light-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Font Loading', () => {
  test('should match page with fonts loaded', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);

    // Wait for fonts to load
    await page.evaluate(async () => {
      return document.fonts.ready;
    });
    await TestUtils.waitForPageStable(page);

    await expect(page).toHaveScreenshot('page-fonts-loaded.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Reduced Motion', () => {
  test('should match page with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    await expect(page).toHaveScreenshot('page-reduced-motion.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Scroll Snapshots', () => {
  test('should capture scroll at different positions', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    const scrollPositions = [
      0,
      500,
      1000,
      1500,
      2000,
    ];

    for (let i = 0; i < scrollPositions.length; i++) {
      const pos = scrollPositions[i];
      await page.evaluate((y) => window.scrollTo(0, y), pos);
      await page.waitForTimeout(200);

      await expect(page).toHaveScreenshot(`scroll-position-${i}-${pos}.png`, {
        fullPage: false,
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Regression - Component Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should capture button states', async ({ page }) => {
    const buttons = page.locator('button');
    const count = Math.min(await buttons.count(), 3);

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      await expect(button).toHaveScreenshot(`button-${i}.png`, {
        animations: 'disabled',
      });
    }
  });

  test('should capture link states', async ({ page }) => {
    const links = page.locator('nav a');
    const count = Math.min(await links.count(), 3);

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await expect(link).toHaveScreenshot(`nav-link-${i}.png`, {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Regression - Error States', () => {
  test('should handle video error gracefully', async ({ page }) => {
    // Mock a failing video
    await page.route('**/*.mp4', route => route.abort());

    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    const videoContainer = page.locator(testData.selectors.videoPlayer).first();
    const errorOverlay = videoContainer.locator('.error-overlay');

    if (await errorOverlay.isVisible()) {
      await expect(videoContainer).toHaveScreenshot('video-error-state.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Regression - Accessibility', () => {
  test('should match high contrast mode', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize(viewports.desktop);
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    await expect(page).toHaveScreenshot('page-high-contrast.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 200, // Allow more diff for forced colors
    });
  });
});
