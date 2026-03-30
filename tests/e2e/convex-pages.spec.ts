import { test, expect } from '@playwright/test';

test.describe('Convex-backed pages', () => {
	test.describe('/works', () => {
		test('loads and shows projects', async ({ page }) => {
			await page.goto('/works');
			// CSR page — wait for Svelte to hydrate and Convex to deliver data
			await page.waitForSelector('.section-title', { timeout: 15000 });
			await expect(page.locator('.section-title')).toContainText('WORKS');
			const cards = page.locator('.project-card');
			await expect(cards.first()).toBeVisible({ timeout: 15000 });
			const count = await cards.count();
			expect(count).toBeGreaterThanOrEqual(1);
		});

		test('project cards have titles', async ({ page }) => {
			await page.goto('/works');
			await page.waitForSelector('.project-title', { timeout: 15000 });
			const firstTitle = page.locator('.project-title').first();
			await expect(firstTitle).toBeVisible();
			const text = await firstTitle.textContent();
			expect(text?.length).toBeGreaterThan(0);
		});
	});

	test.describe('/academia (Re:mix Research)', () => {
		test('loads with correct branding', async ({ page }) => {
			await page.goto('/academia');
			await page.waitForSelector('.academia-name', { timeout: 15000 });
			await expect(page.locator('.academia-name')).toContainText('Re:mix Research');
		});

		test('shows research entries from Convex', async ({ page }) => {
			await page.goto('/academia');
			await page.waitForSelector('.paper', { timeout: 15000 });
			const count = await page.locator('.paper').count();
			expect(count).toBeGreaterThanOrEqual(1);
		});

		test('papers have title and authors', async ({ page }) => {
			await page.goto('/academia');
			await page.waitForSelector('.paper', { timeout: 15000 });
			await expect(page.locator('.paper-title').first()).toBeVisible();
			await expect(page.locator('.paper-authors').first()).toBeVisible();
		});
	});

	test.describe('/talks', () => {
		test('loads talks and interviews sections', async ({ page }) => {
			await page.goto('/talks');
			await page.waitForSelector('.section-title', { timeout: 15000 });
			const titles = await page.locator('.section-title').allTextContents();
			expect(titles.some(t => t.includes('TALKS'))).toBe(true);
			expect(titles.some(t => t.includes('INTERVIEWS'))).toBe(true);
		});

		test('shows entries', async ({ page }) => {
			await page.goto('/talks');
			await page.waitForSelector('.entry', { timeout: 15000 });
			const entries = page.locator('.entry');
			const count = await entries.count();
			expect(count).toBeGreaterThanOrEqual(1);
		});
	});

	test.describe('/cv', () => {
		test('loads CV page', async ({ page }) => {
			const response = await page.goto('/cv');
			expect(response?.status()).toBe(200);
			// CSR page — wait for content to render
			await page.waitForSelector('body', { timeout: 15000 });
		});
	});
});
