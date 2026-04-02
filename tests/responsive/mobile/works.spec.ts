/**
 * Mobile /works Page Tests
 *
 * Tests the works page on mobile viewports.
 */

import { test, expect } from '@playwright/test';

test.describe('/works on mobile', () => {
	test.use({ viewport: { width: 375, height: 667 } });

	test('page loads successfully', async ({ page }) => {
		const response = await page.goto('/works');
		expect(response?.status()).toBe(200);
	});

	test('project cards render', async ({ page }) => {
		await page.goto('/works');
		await page.waitForSelector('.project-card', { timeout: 15000 });
		const cards = page.locator('.project-card');
		const count = await cards.count();
		expect(count).toBeGreaterThan(0);
	});

	test('project titles visible', async ({ page }) => {
		await page.goto('/works');
		await page.waitForSelector('.project-title', { timeout: 15000 });
		const firstTitle = page.locator('.project-title').first();
		await expect(firstTitle).toBeVisible();
	});

	test('no horizontal overflow', async ({ page }) => {
		await page.goto('/works');
		await page.waitForLoadState('networkidle');
		const hasOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
		expect(hasOverflow).toBe(false);
	});

	test('section title shows WORKS', async ({ page }) => {
		await page.goto('/works');
		await page.waitForSelector('.section-title', { timeout: 15000 });
		await expect(page.locator('.section-title')).toContainText('WORKS');
	});

	test('can scroll through all projects', async ({ page }) => {
		await page.goto('/works');
		await page.waitForSelector('.project-card', { timeout: 15000 });

		const lastCard = page.locator('.project-card').last();
		await lastCard.scrollIntoViewIfNeeded();
		await expect(lastCard).toBeVisible();
	});

	test('project categories visible', async ({ page }) => {
		await page.goto('/works');
		await page.waitForSelector('.project-category', { timeout: 15000 });
		const categories = page.locator('.project-category');
		expect(await categories.count()).toBeGreaterThan(0);
	});
});
