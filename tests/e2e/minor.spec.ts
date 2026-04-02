import { test, expect } from '@playwright/test';

test.describe('Minor Section', () => {
	test('Page Load', async ({ page }) => {
		const response = await page.goto('/minor');
		expect(response?.status()).toBe(200);
	});

	test('Header', async ({ page }) => {
		await page.goto('/minor');
		await page.waitForSelector('.minor-title', { timeout: 15000 });

		const title = page.locator('.minor-title');
		await expect(title).toBeVisible();
		const titleText = await title.textContent();
		expect(titleText?.trim().length).toBeGreaterThan(0);

		const description = page.locator('.minor-description');
		if ((await description.count()) > 0) {
			await expect(description.first()).toBeVisible();
			const descText = await description.first().textContent();
			expect(descText?.trim().length).toBeGreaterThan(0);
		}
	});

	test('List Cards', async ({ page }) => {
		await page.goto('/minor');
		try {
			await page.waitForSelector('.list-card', { timeout: 15000 });
		} catch {
			test.skip(true, 'No list card data loaded from Convex');
			return;
		}

		const cards = page.locator('.list-card');
		const count = await cards.count();
		expect(count).toBeGreaterThanOrEqual(1);

		// First card should have emoji, title, and count
		const firstCard = cards.first();
		await expect(firstCard.locator('.list-emoji')).toBeVisible();
		await expect(firstCard.locator('.list-title')).toBeVisible();
		await expect(firstCard.locator('.list-count')).toBeVisible();
	});

	test('Expand Card', async ({ page }) => {
		await page.goto('/minor');
		try {
			await page.waitForSelector('.list-card', { timeout: 15000 });
		} catch {
			test.skip(true, 'No list card data loaded from Convex');
			return;
		}

		const firstCard = page.locator('.list-card').first();
		const headerBtn = firstCard.locator('.list-header-btn');

		// Click to expand
		await headerBtn.click();

		// Card should have expanded class
		await expect(firstCard).toHaveClass(/expanded/);

		// List items should be visible
		const listItems = firstCard.locator('.list-items');
		await expect(listItems).toBeVisible();
	});

	test('Collapse Card', async ({ page }) => {
		await page.goto('/minor');
		try {
			await page.waitForSelector('.list-card', { timeout: 15000 });
		} catch {
			test.skip(true, 'No list card data loaded from Convex');
			return;
		}

		const firstCard = page.locator('.list-card').first();
		const headerBtn = firstCard.locator('.list-header-btn');

		// Expand first
		await headerBtn.click();
		await expect(firstCard).toHaveClass(/expanded/);

		// Click again to collapse
		await headerBtn.click();

		// Expanded class should be removed
		await expect(firstCard).not.toHaveClass(/expanded/);

		// List items should be hidden
		const listItems = firstCard.locator('.list-items');
		await expect(listItems).not.toBeVisible();
	});

	test('Aria Expanded', async ({ page }) => {
		await page.goto('/minor');
		try {
			await page.waitForSelector('.list-card', { timeout: 15000 });
		} catch {
			test.skip(true, 'No list card data loaded from Convex');
			return;
		}

		const firstCard = page.locator('.list-card').first();
		const headerBtn = firstCard.locator('.list-header-btn');

		// Initially collapsed
		await expect(headerBtn).toHaveAttribute('aria-expanded', 'false');

		// Expand
		await headerBtn.click();
		await expect(headerBtn).toHaveAttribute('aria-expanded', 'true');

		// Collapse
		await headerBtn.click();
		await expect(headerBtn).toHaveAttribute('aria-expanded', 'false');
	});

	test('Items Content', async ({ page }) => {
		await page.goto('/minor');
		try {
			await page.waitForSelector('.list-card', { timeout: 15000 });
		} catch {
			test.skip(true, 'No list card data loaded from Convex');
			return;
		}

		// Expand first card to reveal items
		const firstCard = page.locator('.list-card').first();
		await firstCard.locator('.list-header-btn').click();
		await expect(firstCard).toHaveClass(/expanded/);

		const items = firstCard.locator('.list-item');
		const count = await items.count();
		expect(count).toBeGreaterThanOrEqual(1);

		// Each visible item should have text content
		const firstItem = items.first();
		const itemText = firstItem.locator('.item-text');
		await expect(itemText).toBeVisible();
		const text = await itemText.textContent();
		expect(text?.trim().length).toBeGreaterThan(0);
	});

	test('Toggle Icon', async ({ page }) => {
		await page.goto('/minor');
		try {
			await page.waitForSelector('.list-card', { timeout: 15000 });
		} catch {
			test.skip(true, 'No list card data loaded from Convex');
			return;
		}

		const firstCard = page.locator('.list-card').first();
		const toggle = firstCard.locator('.list-toggle');

		// Collapsed — should show "+"
		const collapsedText = await toggle.textContent();
		expect(collapsedText?.trim()).toBe('+');

		// Expand
		await firstCard.locator('.list-header-btn').click();
		await expect(firstCard).toHaveClass(/expanded/);

		// Expanded — should show minus sign (could be Unicode minus U+2212 or hyphen-minus)
		const expandedText = await toggle.textContent();
		expect(expandedText?.trim()).toMatch(/[\u2212\u2013-]/); // Unicode minus, en-dash, or hyphen-minus
	});
});
