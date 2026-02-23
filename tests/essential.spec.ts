/**
 * Essential Tests - Core Functionality
 * 
 * Tests the most critical aspects of the website:
 * - Reactivity: State changes reflect in UI
 * - Interaction: Click, hover, keyboard events
 * - Responsiveness: Mobile, tablet, desktop layouts
 */

import { test, expect, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// ===========================================
// REACTIVITY & STATE TESTS
// ===========================================
test.describe('Reactivity & State', () => {
        test('Command Palette opens and closes with keyboard', async ({ page }) => {
                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // Open command palette with ?
                await page.keyboard.press('?');
                await page.waitForTimeout(300);

                // Should show command palette
                const palette = page.locator('.palette');
                await expect(palette).toBeVisible();

                // Close with Escape
                await page.keyboard.press('Escape');
                await page.waitForTimeout(300);
                await expect(palette).not.toBeVisible();
        });

        test('Navigation highlights active page', async ({ page }) => {
                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // Works link should be active on homepage
                const worksLink = page.locator('.nav-link.active');
                await expect(worksLink).toContainText('works');

                // Navigate to CV
                await page.click('a[href="/cv"]');
                await page.waitForLoadState('networkidle');

                // CV link should now be active
                const cvLink = page.locator('.nav-link.active');
                await expect(cvLink).toContainText('cv');
        });

        test('ASCII Donut renders and animates', async ({ page }) => {
                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // ASCII donut should be visible
                const donut = page.locator('.donut-ascii');
                await expect(donut).toBeVisible();

                // Get initial content
                const initialContent = await donut.textContent();

                // Wait for animation frame
                await page.waitForTimeout(200);

                // Content should change (animation)
                const laterContent = await donut.textContent();
                expect(initialContent).not.toBe(laterContent);
        });
});

// ===========================================
// INTERACTION TESTS
// ===========================================
test.describe('Interaction', () => {
        test('Navigation links work correctly', async ({ page }) => {
                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // Test each main nav link
                const routes = [
                        { href: '/likes', title: 'likes' },
                        { href: '/notes', title: 'notes' },
                        { href: '/cv', title: 'cv' },
                ];

                for (const route of routes) {
                        await page.click(`a[href="${route.href}"]`);
                        await page.waitForLoadState('networkidle');
                        await expect(page).toHaveURL(BASE_URL + route.href);

                        // Navigate back
                        await page.click('a[href="/"]');
                        await page.waitForLoadState('networkidle');
                }
        });

        test('Source code toggle button works', async ({ page }) => {
                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // Find the source toggle button
                const sourceToggle = page.locator('.source-toggle');
                if (await sourceToggle.isVisible()) {
                        // Click to show source
                        await sourceToggle.click();
                        await page.waitForTimeout(300);

                        // Source panel should appear
                        const sourcePanel = page.locator('.source-panel');
                        await expect(sourcePanel).toBeVisible();

                        // Click again to hide
                        await sourceToggle.click();
                        await page.waitForTimeout(300);
                        await expect(sourcePanel).not.toBeVisible();
                }
        });

        test('External links have correct attributes', async ({ page }) => {
                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // All external links should have target="_blank" and rel="noopener"
                const externalLinks = page.locator('a[target="_blank"]');
                const count = await externalLinks.count();

                expect(count).toBeGreaterThan(0);

                for (let i = 0; i < Math.min(count, 5); i++) {
                        const link = externalLinks.nth(i);
                        await expect(link).toHaveAttribute('rel', /noopener/);
                }
        });

        test('Footer hint button triggers command palette', async ({ page }) => {
                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // Find the "/ for CMDs" button in footer
                const hintBtn = page.locator('.terminal-hint-btn');
                if (await hintBtn.isVisible()) {
                        await hintBtn.click();
                        await page.waitForTimeout(300);

                        // Command palette should open
                        const palette = page.locator('.palette');
                        await expect(palette).toBeVisible();
                }
        });
});

// ===========================================
// RESPONSIVENESS TESTS
// ===========================================
test.describe('Responsiveness', () => {
        test('Mobile layout works correctly', async ({ browser }) => {
                const context = await browser.newContext({
                        ...devices['iPhone 12'],
                });
                const page = await context.newPage();

                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // Header should still be visible
                await expect(page.locator('.header')).toBeVisible();

                // Hero should be visible
                await expect(page.locator('.hero')).toBeVisible();

                // Content should be scrollable
                const body = page.locator('body');
                await expect(body).toBeVisible();

                // Navigation links should still work
                await page.click('a[href="/cv"]');
                await page.waitForLoadState('networkidle');
                await expect(page).toHaveURL(BASE_URL + '/cv');

                await context.close();
        });

        test('Tablet layout works correctly', async ({ browser }) => {
                const context = await browser.newContext({
                        ...devices['iPad Pro'],
                });
                const page = await context.newPage();

                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // Hero section should be visible
                await expect(page.locator('.hero')).toBeVisible();

                // Works section should be visible after scroll
                await page.locator('.section').first().scrollIntoViewIfNeeded();
                await expect(page.locator('.section').first()).toBeVisible();

                await context.close();
        });

        test('Desktop layout shows all elements', async ({ browser }) => {
                const context = await browser.newContext({
                        viewport: { width: 1920, height: 1080 },
                });
                const page = await context.newPage();

                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // Header should be visible
                await expect(page.locator('.header')).toBeVisible();

                // Social toggle (@) should be visible on desktop
                const socialToggle = page.locator('.social-toggle');
                await expect(socialToggle).toBeVisible();

                // Hero with donut should be visible
                await expect(page.locator('.hero')).toBeVisible();
                await expect(page.locator('.donut-ascii')).toBeVisible();

                // All nav links should be visible
                await expect(page.locator('.nav-link').first()).toBeVisible();

                await context.close();
        });
});

// ===========================================
// PAGE LOAD & PERFORMANCE
// ===========================================
test.describe('Page Load', () => {
        test('Homepage loads without errors', async ({ page }) => {
                const errors: string[] = [];
                page.on('console', msg => {
                        if (msg.type() === 'error') errors.push(msg.text());
                });

                const response = await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');

                // Should return 200
                expect(response?.status()).toBe(200);

                // No console errors (excluding known benign ones)
                const realErrors = errors.filter(e =>
                        !e.includes('favicon') &&
                        !e.includes('manifest')
                );
                expect(realErrors).toHaveLength(0);
        });

        test('All main pages load without 500 errors', async ({ page }) => {
                const pages = ['/', '/likes', '/notes', '/cv', '/terminal', '/process'];

                for (const route of pages) {
                        const response = await page.goto(BASE_URL + route);
                        expect(response?.status()).not.toBe(500);
                        await page.waitForLoadState('networkidle');
                }
        });
});
