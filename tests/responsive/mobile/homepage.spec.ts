/**
 * Mobile Homepage Responsive Tests
 *
 * Tests for mobile viewport behavior on the homepage.
 * Covers: hero display, navigation, footer, keyboard nav, performance, and edge cases.
 */

import { test, expect } from '../../setup';
import { TestUtils, testData } from '../../setup';

const mobileViewports = [
	{ width: 375, height: 667 },
	{ width: 414, height: 896 },
];

mobileViewports.forEach(viewport => {
	test.describe(`Mobile ${viewport.width}x${viewport.height}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.setViewportSize(viewport);
			await page.goto(testData.urls.home);
			await TestUtils.waitForPageStable(page);
		});

		test('should display hero section correctly on mobile', async ({ page }) => {
			const hero = page.locator(testData.selectors.hero);
			await expect(hero).toBeVisible();

			const heroName = hero.locator('.hero-name');
			await expect(heroName).toBeVisible();

			const tagline = hero.locator('.hero-tagline');
			await expect(tagline).toBeVisible();
		});

		test('should display navigation on mobile', async ({ page }) => {
			const nav = page.locator('nav').first();
			await expect(nav).toBeVisible();

			const navLinks = page.locator('nav a');
			const count = await navLinks.count();
			expect(count).toBeGreaterThanOrEqual(5);
		});

		test('should display footer on mobile', async ({ page }) => {
			const footer = page.locator('footer');
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(300);
			await expect(footer).toBeVisible();
		});

		test('should be keyboard navigable on mobile', async ({ page }) => {
			for (let i = 0; i < 5; i++) {
				await page.keyboard.press('Tab');
				await page.waitForTimeout(50);
			}

			const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
			expect(['A', 'BUTTON']).toContain(focusedTag);
		});

		test('should handle viewport rotation', async ({ page }) => {
			await page.setViewportSize({ width: viewport.height, height: viewport.width });
			await page.waitForTimeout(300);
			await expect(page.locator(testData.selectors.hero)).toBeVisible();

			await page.setViewportSize(viewport);
			await page.waitForTimeout(300);
			await expect(page.locator(testData.selectors.hero)).toBeVisible();
		});

		test('should load quickly on mobile', async ({ page }) => {
			const startTime = Date.now();
			await page.goto(testData.urls.home, { waitUntil: 'domcontentloaded' });
			const loadTime = Date.now() - startTime;
			expect(loadTime).toBeLessThan(5000);
		});

		test('should handle scroll to bottom and back', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(300);
			await expect(page.locator('footer')).toBeInViewport();

			await page.evaluate(() => window.scrollTo(0, 0));
			await page.waitForTimeout(300);
			await expect(page.locator(testData.selectors.hero)).toBeInViewport();
		});

		test('should have touch-friendly button sizes', async ({ page }) => {
			const buttons = page.locator('button, [role="button"]');
			const count = Math.min(await buttons.count(), 5);

			for (let i = 0; i < count; i++) {
				const box = await buttons.nth(i).boundingBox();
				if (box) {
					expect(box.height).toBeGreaterThanOrEqual(20);
					expect(box.width).toBeGreaterThanOrEqual(20);
				}
			}
		});

		test('hero name should have large sizing on mobile', async ({ page }) => {
			const heroName = page.locator('.hero-name');
			await expect(heroName).toBeVisible();

			const fontSize = await heroName.evaluate(el =>
				parseFloat(window.getComputedStyle(el).fontSize)
			);
			expect(fontSize).toBeGreaterThanOrEqual(24);
		});

		test('should handle text selection on mobile', async ({ page }) => {
			const heroName = page.locator('.hero-name');
			await heroName.dblclick();
			await page.waitForTimeout(300);

			const selection = await page.evaluate(() => window.getSelection()?.toString());
			expect(selection?.length).toBeGreaterThan(0);
		});
	});
});

test.describe('Mobile Performance', () => {
	test('should have fast First Contentful Paint on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		const metrics = await TestUtils.testLoadingPerformance(page, testData.urls.home);
		expect(metrics.firstContentfulPaint).toBeLessThan(3000);
	});
});

test.describe('Mobile Accessibility', () => {
	test('should have semantic landmarks on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('nav').first()).toBeVisible();
		await expect(page.locator('.header').first()).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});
});
