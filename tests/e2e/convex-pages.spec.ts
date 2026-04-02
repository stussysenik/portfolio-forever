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

test.describe('/cv (deep)', () => {
	test('displays profile name from Convex', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForSelector('.cv-name', { timeout: 15000 });
		const name = await page.locator('.cv-name').textContent();
		expect(name?.length).toBeGreaterThan(0);
	});

	test('education shows Computer Engineering at Cooper Union', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForSelector('.timeline-title', { timeout: 15000 });
		const titles = await page.locator('.timeline-title').allTextContents();
		expect(titles.some(t => t.includes('Computer Engineering'))).toBe(true);
		const orgs = await page.locator('.timeline-org').allTextContents();
		expect(orgs.some(o => o.includes('Cooper Union'))).toBe(true);
	});

	test('languages section shows 4 languages', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForSelector('.language-name', { timeout: 15000 });
		const count = await page.locator('.language-name').count();
		expect(count).toBe(4);
	});
});

test.describe('/likes', () => {
	test('loads likes page with categories', async ({ page }) => {
		await page.goto('/likes');
		await page.waitForSelector('.category', { timeout: 15000 });
		const count = await page.locator('.category').count();
		expect(count).toBeGreaterThanOrEqual(1);
	});
});

test.describe('/gifts', () => {
	test('loads gifts page', async ({ page }) => {
		const response = await page.goto('/gifts');
		expect(response?.status()).toBe(200);
	});
});
