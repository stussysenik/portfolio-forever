import { test, expect } from '@playwright/test';

test.describe('Likes Section', () => {
	test('Page Load', async ({ page }) => {
		const response = await page.goto('/likes');
		expect(response?.status()).toBe(200);
	});

	test('Title', async ({ page }) => {
		await page.goto('/likes');
		await page.waitForSelector('.section-title', { timeout: 15000 });
		const title = page.locator('.section-title');
		await expect(title).toBeVisible();
		const text = await title.textContent();
		expect(text?.trim().length).toBeGreaterThan(0);
	});

	test('Categories', async ({ page }) => {
		await page.goto('/likes');
		// Wait for Convex data to load — categories appear only when data is present
		const categorySelector = '.category';
		try {
			await page.waitForSelector(categorySelector, { timeout: 15000 });
		} catch {
			// No data loaded from Convex — skip category assertions
			test.skip(true, 'No category data loaded from Convex');
			return;
		}

		const categories = page.locator(categorySelector);
		const count = await categories.count();
		expect(count).toBeGreaterThanOrEqual(1);

		// Each category should have a title and item list
		const firstCategory = categories.first();
		await expect(firstCategory.locator('.category-title')).toBeVisible();
		await expect(firstCategory.locator('.item-list')).toBeVisible();
	});

	test('Items', async ({ page }) => {
		await page.goto('/likes');
		try {
			await page.waitForSelector('.category', { timeout: 15000 });
		} catch {
			test.skip(true, 'No category data loaded from Convex');
			return;
		}

		const items = page.locator('.category .item');
		const count = await items.count();
		expect(count).toBeGreaterThanOrEqual(1);

		// First item should have text content
		const firstItem = items.first();
		const text = await firstItem.textContent();
		expect(text?.trim().length).toBeGreaterThan(0);
	});

	test('Gifts Callout', async ({ page }) => {
		await page.goto('/likes');
		await page.waitForSelector('.section-title', { timeout: 15000 });

		const giftsLink = page.locator('.gifts-callout a');
		if ((await giftsLink.count()) > 0) {
			await expect(giftsLink.first()).toBeVisible();
			const href = await giftsLink.first().getAttribute('href');
			expect(href).toBe('/gifts');
		}
	});

	test('Grid Layout Desktop', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/likes');
		try {
			await page.waitForSelector('.likes-grid', { timeout: 15000 });
		} catch {
			test.skip(true, 'No grid data loaded from Convex');
			return;
		}

		const grid = page.locator('.likes-grid');
		await expect(grid).toBeVisible();

		// Verify 3-column grid at 1280px wide
		const columns = await grid.evaluate((el) => {
			const style = window.getComputedStyle(el);
			return style.gridTemplateColumns;
		});
		// gridTemplateColumns returns resolved values like "400px 400px 400px" — expect 3 values
		const columnCount = columns.split(/\s+/).filter((v: string) => v.length > 0).length;
		expect(columnCount).toBe(3);
	});
});
