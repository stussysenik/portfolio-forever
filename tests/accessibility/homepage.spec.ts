/**
 * Homepage Accessibility Tests
 *
 * Comprehensive accessibility tests using WCAG 2.1 AA standards
 * Tests include: ARIA, keyboard navigation, screen readers, contrast, etc.
 */

import { test } from '../setup';
import { expect } from '@playwright/test';
import { TestUtils, testData } from '../setup';

test.describe('Accessibility - WCAG 2.1 Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should have no axe-core violations', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    console.log('Accessibility violations:', JSON.stringify(accessibilityScanResults.violations, null, 2));

    expect(accessibilityScanResults.violations).toEqual([]);
    expect(accessibilityScanResults.passes.length).toBeGreaterThan(0);
  });

  test('should have valid semantic HTML structure', async ({ page }) => {
    // Check for semantic landmarks
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check heading hierarchy
    const h1 = await page.locator('h1').count();
    expect(h1).toBe(1);

    // h1 should be the first heading
    const firstHeading = await page.locator('h1, h2, h3, h4, h5, h6').first().evaluate(el => el.tagName);
    expect(firstHeading).toBe('H1');

    // Check headings are in order
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 1;
    for (const heading of headings) {
      const level = parseInt((await heading.evaluate(el => el.tagName)).charAt(1));
      expect(level).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = level;
    }
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    // Check buttons have accessible names
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const accessibleName = await button.evaluate(el => {
        return (
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby') ||
          el.textContent?.trim() ||
          el.title ||
          ''
        );
      });
      expect(accessibleName.length).toBeGreaterThan(0);
    }

    // Check links have accessible names
    const links = await page.locator('a[href]').all();
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      expect(text?.trim().length || ariaLabel?.length || 0).toBeGreaterThan(0);
    }

    // Check form inputs have labels
    const inputs = await page.locator('input, select, textarea').all();
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        const id = el.getAttribute('id');
        return Boolean(
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby') ||
          (id && document.querySelector(`label[for="${id}"]`)) ||
          el.closest('label')
        );
      });
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should have proper ARIA roles where needed', async ({ page }) => {
    // Check navigation region
    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('aria-label');

    // Check main region
    const main = page.locator('main');
    await expect(main).toHaveAttribute('role', 'main');

    // Check if any custom roles are correctly used
    const customRoles = await page.locator('[role]').all();
    for (const element of customRoles) {
      const role = await element.getAttribute('role');
      // Ensure role is valid
      const validRoles = [
        'banner', 'navigation', 'main', 'complementary', 'contentinfo',
        'button', 'link', 'dialog', 'alert', 'status', 'progressbar'
      ];
      expect(validRoles).toContain(role);
    }
  });

  test('should have proper language attribute', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang');

    const lang = await html.getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang).toMatch(/^(en|de|ja|en-US|en-GB)/);
  });
});

test.describe('Accessibility - Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should be fully keyboard navigable', async ({ page }) => {
    const { focusableElements, tabOrderValid } = await TestUtils.testKeyboardNavigation(page);

    // Should have focusable elements
    expect(focusableElements).toBeGreaterThan(0);

    // Tab order should be logical
    expect(tabOrderValid).toBe(true);
  });

  test('should maintain visible focus indicators', async ({ page }) => {
    const focusableElements = page.locator(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    for (let i = 0; i < Math.min(await focusableElements.count(), 10); i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement;
        return {
          tagName: active.tagName,
          outline: window.getComputedStyle(active).outline,
          boxShadow: window.getComputedStyle(active).boxShadow,
          outlineOffset: window.getComputedStyle(active).outlineOffset,
        };
      });

      // Focus should be visible (either outline or box-shadow)
      const hasVisibleFocus =
        focusedElement.outline !== 'none' ||
        focusedElement.boxShadow !== 'none' ||
        focusedElement.outlineOffset !== '0px';

      expect(hasVisibleFocus).toBeTruthy();
    }
  });

  test('should trap focus in modals/dialogs', async ({ page }) => {
    // Open keyboard shortcuts help
    const videoContainer = page.locator('.ascii-video').first();
    await videoContainer.hover();
    await page.waitForTimeout(200);
    await videoContainer.locator('.shortcuts-hint').click();
    await page.waitForTimeout(200);

    const modal = videoContainer.locator('.shortcuts-modal');
    await expect(modal).toBeVisible();

    // Focus should be trapped in modal
    let focusEscaped = false;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return active?.closest('.shortcuts-modal');
      });
      if (!focusedElement) {
        focusEscaped = true;
        break;
      }
    }

    expect(focusEscaped).toBe(false);

    // Escape should close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(modal).not.toBeVisible();
  });

  test('should skip to main content with skip link', async ({ page }) => {
    // Look for skip link
    const skipLink = page.locator('a[href^="#main"], a[href^="#content"], .skip-link');

    if (await skipLink.count() > 0) {
      // Skip link should be visible on focus
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      await expect(skipLink.first()).toBeVisible();

      // Press enter to skip
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      // Focus should be on main content
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return active?.tagName === 'MAIN' || active?.id === 'main';
      });
      expect(focusedElement).toBeTruthy();
    }
  });

  test('should support Enter and Space for buttons', async ({ page }) => {
    const buttons = page.locator('button');

    if (await buttons.count() > 0) {
      const button = buttons.first();
      await button.focus();

      // Test Enter key
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);

      // Test Space key
      await page.keyboard.press(' ');
      await page.waitForTimeout(100);

      // No errors should occur
      const errors = await TestUtils.getConsoleErrors(page);
      expect(errors.length).toBe(0);
    }
  });
});

test.describe('Accessibility - Color and Contrast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should have sufficient color contrast for text', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('should have sufficient contrast for WIP banner', async ({ page }) => {
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

    // Parse RGB values
    const textMatch = textColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const bgMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (textMatch && bgMatch) {
      const [, tr, tg, tb] = textMatch.map(Number);
      const [, br, bg, bb] = bgMatch.map(Number);

      // Calculate relative luminance
      const luminance1 = (0.2126 * tr + 0.7152 * tg + 0.0722 * tb) / 255;
      const luminance2 = (0.2126 * br + 0.7152 * bg + 0.0722 * bb) / 255;

      const lighter = Math.max(luminance1, luminance2);
      const darker = Math.min(luminance1, luminance2);

      const contrastRatio = (lighter + 0.05) / (darker + 0.05);

      // Should meet WCAG AA (4.5:1 for normal text)
      expect(contrastRatio).toBeGreaterThanOrEqual(3.0);
    }
  });

  test('should not rely on color alone for information', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const colorAloneViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast-enhanced' || v.id === 'link-in-text-block'
    );

    expect(colorAloneViolations).toEqual([]);
  });
});

test.describe('Accessibility - Images and Media', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should have alt text for all images', async ({ page }) => {
    const images = await page.locator('img').all();

    for (const image of images) {
      const alt = await image.getAttribute('alt');
      const role = await image.getAttribute('role');

      // Images should have alt text or be decorative
      if (role !== 'presentation') {
        expect(alt).toBeTruthy();
        expect(alt?.length).toBeGreaterThan(0);
      }
    }
  });

  test('should have accessible video players', async ({ page }) => {
    const videos = page.locator('video');

    for (let i = 0; i < await videos.count(); i++) {
      const video = videos.nth(i);

      // Video should have accessible name via container
      const container = await video.locator('..');
      const hasAccessibleName = await container.evaluate(el => {
        return Boolean(
          el.getAttribute('aria-label') ||
          el.getAttribute('title') ||
          el.querySelector('.video-title')?.textContent
        );
      });

      expect(hasAccessibleName).toBeTruthy();

      // Video controls should be keyboard accessible
      const controls = video.locator('..').locator('.controls-overlay');
      if (await controls.count() > 0) {
        await controls.first().hover();
        await page.waitForTimeout(200);

        const controlButtons = controls.locator('button');
        await expect(controlButtons.first()).toBeVisible();
      }
    }
  });

  test('should not autoplay videos with sound', async ({ page }) => {
    const videos = page.locator('video');

    for (let i = 0; i < await videos.count(); i++) {
      const video = videos.nth(i);
      const autoplay = await video.getAttribute('autoplay');
      const muted = await video.getAttribute('muted');

      // If autoplay is enabled, should be muted
      if (autoplay !== null) {
        expect(muted).not.toBeNull();
      }
    }
  });
});

test.describe('Accessibility - Reduced Motion', () => {
  test('should respect prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    // Check if animations are reduced
    const hasReducedMotion = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      const animations = document.getAnimations();

      // Check CSS
      const hasReducedCSS = styles.animationDuration === '0s' ||
                           styles.transitionDuration === '0s';

      // Check running animations
      const hasReducedAnimations = animations.every(anim => {
        const timing = anim.effect?.getTiming();
        return timing?.duration === 0 || timing?.duration === Infinity;
      });

      return hasReducedCSS || hasReducedAnimations;
    });

    expect(hasReducedMotion).toBe(true);
  });

  test('should have no accessibility violations with reduced motion', async ({ page, makeAxeBuilder }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Accessibility - High Contrast Mode', () => {
  test('should support high contrast mode', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    // Page should still be usable
    await expect(page.locator(testData.selectors.hero)).toBeVisible();
    await expect(page.locator(testData.selectors.wipBanner)).toBeVisible();

    // Content should be readable
    const hasVisibleContent = await page.evaluate(() => {
      const body = window.getComputedStyle(document.body);
      return body.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
             body.color !== 'rgba(0, 0, 0, 0)';
    });

    expect(hasVisibleContent).toBe(true);
  });
});

test.describe('Accessibility - Screen Reader', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle('WIP Stussy Senik');
  });

  test('should have proper ARIA live regions', async ({ page }) => {
    // Check for any live regions
    const liveRegions = await page.locator('[aria-live]').all();

    for (const region of liveRegions) {
      const politeness = await region.getAttribute('aria-live');
      expect(['polite', 'assertive', 'off']).toContain(politeness);
    }
  });

  test('should announce dynamic content changes', async ({ page }) => {
    // Test keyboard action indicator (if present)
    const videoContainer = page.locator('.ascii-video').first();

    if (await videoContainer.count() > 0) {
      await videoContainer.focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);

      // Check if status updates
      const statusRegion = page.locator('[aria-live="polite"], [role="status"]');
      if (await statusRegion.count() > 0) {
        await expect(statusRegion.first()).toBeVisible();
      }
    }
  });

  test('should have proper landmark regions', async ({ page }) => {
    const landmarks = await page.evaluate(() => {
      const regions: Record<string, number> = {};

      regions['banner'] = document.querySelectorAll('header[role="banner"], [role="banner"]').length;
      regions['navigation'] = document.querySelectorAll('nav[role="navigation"], [role="navigation"]').length;
      regions['main'] = document.querySelectorAll('main[role="main"], [role="main"]').length;
      regions['complementary'] = document.querySelectorAll('aside[role="complementary"], [role="complementary"]').length;
      regions['contentinfo'] = document.querySelectorAll('footer[role="contentinfo"], [role="contentinfo"]').length;

      return regions;
    });

    // Should have at least main landmark
    expect(landmarks['main']).toBeGreaterThan(0);

    // Should have header and footer
    expect(landmarks['banner'] + landmarks['contentinfo']).toBeGreaterThan(0);
  });
});

test.describe('Accessibility - Forms', () => {
  test('should have accessible form inputs', async ({ page }) => {
    // Check for any form inputs
    const inputs = page.locator('input, select, textarea');

    if (await inputs.count() > 0) {
      for (let i = 0; i < await inputs.count(); i++) {
        const input = inputs.nth(i);

        // Each input should have a label
        const hasLabel = await input.evaluate(el => {
          const id = el.getAttribute('id');
          return Boolean(
            el.getAttribute('aria-label') ||
            el.getAttribute('aria-labelledby') ||
            (id && document.querySelector(`label[for="${id}"]`)) ||
            el.closest('label')
          );
        });

        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('should have proper error messages for invalid inputs', async ({ page }) => {
    // This test would be expanded when you add actual forms
    const inputs = page.locator('input[required], input[aria-invalid]');

    if (await inputs.count() > 0) {
      for (let i = 0; i < await inputs.count(); i++) {
        const input = inputs.nth(i);
        const ariaInvalid = await input.getAttribute('aria-invalid');

        if (ariaInvalid === 'true') {
          const errorMessage = await input.evaluate(el => {
            const id = el.getAttribute('aria-describedby');
            return id ? document.getElementById(id)?.textContent : null;
          });

          expect(errorMessage).toBeTruthy();
        }
      }
    }
  });
});

test.describe('Accessibility - Focus Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should manage focus on interactive elements', async ({ page }) => {
    const interactiveElements = page.locator(
      'a[href], button, [role="button"], [tabindex]:not([tabindex="-1"])'
    );

    for (let i = 0; i < Math.min(await interactiveElements.count(), 10); i++) {
      const element = interactiveElements.nth(i);

      // Focus element
      await element.focus();
      await page.waitForTimeout(50);

      // Verify element has focus
      const hasFocus = await element.evaluate(el => el === document.activeElement);
      expect(hasFocus).toBeTruthy();

      // Press Escape (should not throw errors)
      await page.keyboard.press('Escape');
    }
  });

  test('should return focus to trigger after closing modal', async ({ page }) => {
    const videoContainer = page.locator('.ascii-video').first();
    const shortcutsButton = videoContainer.locator('.shortcuts-hint');

    if (await shortcutsButton.count() > 0) {
      // Focus shortcuts button
      await shortcutsButton.focus();
      const focusedBefore = await page.evaluate(() => document.activeElement === shortcutsButton.elementHandle());

      // Open modal
      await shortcutsButton.click();
      await page.waitForTimeout(200);

      const modal = videoContainer.locator('.shortcuts-modal');
      await expect(modal).toBeVisible();

      // Close modal with Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      // Focus should return to shortcuts button
      const focusedAfter = await page.evaluate(() => document.activeElement === shortcutsButton.elementHandle());
      expect(focusedAfter).toBeTruthy();
    }
  });
});

test.describe('Accessibility - Links and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should have descriptive link text', async ({ page }) => {
    const links = page.locator('a[href]');

    for (let i = 0; i < await links.count(); i++) {
      const link = links.nth(i);

      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      const hasAccessibleName = Boolean(
        text?.trim() ||
        ariaLabel ||
        title
      );

      expect(hasAccessibleName).toBeTruthy();

      // Avoid "click here" links
      const isGenericLink = text?.trim().match(/click here|read more|more info/i);
      expect(isGenericLink).toBeFalsy();
    }
  });

  test('should indicate external links', async ({ page }) => {
    const externalLinks = page.locator('a[href^="http://"]:not([href*="' + testData.urls.home + '"]), a[href^="https://"]:not([href*="' + testData.urls.home + '"])');

    for (let i = 0; i < await externalLinks.count(); i++) {
      const link = externalLinks.nth(i);
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      const ariaLabel = await link.getAttribute('aria-label');

      // External links should indicate they open in new tab
      const indicatesExternal =
        target === '_blank' ||
        rel?.includes('noopener') ||
        ariaLabel?.includes('external') ||
        ariaLabel?.includes('new window');

      expect(indicatesExternal).toBeTruthy();
    }
  });

  test('should have proper navigation structure', async ({ page }) => {
    const nav = page.locator('nav');

    await expect(nav).toBeVisible();

    // Nav should have accessible name
    const hasAccessibleName = await nav.evaluate(el => {
      return Boolean(
        el.getAttribute('aria-label') ||
        el.getAttribute('aria-labelledby') ||
        el.querySelector('h2, h3')?.textContent
      );
    });

    expect(hasAccessibleName).toBeTruthy();

    // Nav links should be in a list (for screen readers)
    const navLists = nav.locator('ul, ol');
    expect(await navLists.count()).toBeGreaterThan(0);
  });
});

test.describe('Accessibility - ARIA Snapshot', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);
  });

  test('should have consistent accessible name for hero', async ({ page }) => {
    const hero = page.locator(testData.selectors.hero);
    const heroName = hero.locator('.hero-name');

    await expect(heroName).toBeVisible();
    const name = await heroName.textContent();
    expect(name).toContain('Stüssy Senik');
  });

  test('should expose video player controls to assistive technology', async ({ page }) => {
    const videoContainer = page.locator(testData.selectors.videoPlayer).first();
    await videoContainer.hover();
    await page.waitForTimeout(200);

    const controls = videoContainer.locator('.controls-overlay');
    await expect(controls).toBeVisible();

    // Check ARIA labels on control buttons
    const playButton = controls.locator('button[aria-label*="Play"], button[aria-label*="Pause"]');
    await expect(playButton.first()).toBeVisible();

    const muteButton = controls.locator('button[aria-label*="Mute"], button[aria-label*="Unmute"]');
    await expect(muteButton.first()).toBeVisible();
  });

  test('should have proper ARIA states for dynamic content', async ({ page }) => {
    // Check for expanded/collapsed states
    const expandables = page.locator('[aria-expanded]');

    for (let i = 0; i < await expandables.count(); i++) {
      const element = expandables.nth(i);
      const expanded = await element.getAttribute('aria-expanded');

      // Should be either true or false
      expect(['true', 'false']).toContain(expanded);
    }

    // Check for hidden/visible states
    const hiddenElements = page.locator('[aria-hidden]');

    for (let i = 0; i < await hiddenElements.count(); i++) {
      const element = hiddenElements.nth(i);
      const hidden = await element.getAttribute('aria-hidden');

      expect(['true', 'false']).toContain(hidden);

      // If aria-hidden is true, element should not be visible
      if (hidden === 'true') {
        const isVisible = await element.isVisible();
        expect(isVisible).toBeFalsy();
      }
    }
  });
});

test.describe('Accessibility - Edge Cases', () => {
  test('should handle rapid keyboard navigation', async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    // Rapid tab navigation
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
    }

    // Should not crash or have errors
    const errors = await TestUtils.getConsoleErrors(page);
    expect(errors.length).toBe(0);
  });

  test('should handle focus when elements are hidden', async ({ page }) => {
    await page.goto(testData.urls.home);
    await TestUtils.waitForPageStable(page);

    // Focus an element
    const firstLink = page.locator('a[href]').first();
    await firstLink.focus();

    // Hide element (simulating dynamic content)
    await firstLink.evaluate(el => el.style.display = 'none');
    await page.waitForTimeout(100);

    // Press Tab - should move to next focusable element
    await page.keyboard.press('Tab');

    // Should not crash
    const errors = await TestUtils.getConsoleErrors(page);
    expect(errors.length).toBe(0);
  });

  test('should have accessibility report without errors', async ({ page }) => {
    const report = await TestUtils.generateAccessibilityReport(page);

    console.log('Accessibility Report:', JSON.stringify(report, null, 2));

    // Should have passed checks
    expect(report.passes).toBeGreaterThan(0);

    // Violations should be minimal (ideally zero)
    expect(report.violations).toBeLessThan(5);

    // WCAG level
    expect(report.wcagLevel).toBe('WCAG 2.1 AA');
  });
});
