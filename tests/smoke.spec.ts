/**
 * Simple Smoke Test
 *
 * Minimal test to verify Playwright setup is working correctly.
 * This test uses no custom fixtures - just basic Playwright functionality.
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should connect to dev server', async ({ page }) => {
    // Test that we can connect to the running dev server
    await page.goto('http://localhost:3000');

    // Should get a response
    const status = await page.evaluate(() => document.readyState);
    expect(['interactive', 'complete']).toContain(status);
  });

  test('should load homepage', async ({ page }) => {
    // Load the homepage
    await page.goto('http://localhost:3000');

    // Wait for page to be stable
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Get actual page title (whatever it is)
    const title = await page.title();

    // Just verify we got a title (not checking specific value)
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Verify URL
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('should find main content element', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Look for any main content (use flexible selector)
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

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });
});
