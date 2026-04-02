/**
 * Simple Smoke Test
 *
 * Minimal test to verify Playwright setup is working correctly.
 * This test uses no custom fixtures - just basic Playwright functionality.
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should connect to dev server', async ({ page }) => {
    await page.goto('/');

    const status = await page.evaluate(() => document.readyState);
    expect(['interactive', 'complete']).toContain(status);
  });

  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should find main content element', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hasContent = await page.locator('body').isVisible();
    expect(hasContent).toBe(true);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });
});
