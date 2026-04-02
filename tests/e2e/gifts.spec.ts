import { test, expect } from '@playwright/test';

test.describe('Gifts Section', () => {
	test('Page Load', async ({ page }) => {
		const response = await page.goto('/gifts');
		expect(response?.status()).toBe(200);
	});

	test('Title', async ({ page }) => {
		await page.goto('/gifts');
		await page.waitForSelector('.letter-title', { timeout: 15000 });
		const title = page.locator('.letter-title');
		await expect(title).toBeVisible();
		const text = await title.textContent();
		expect(text?.trim().length).toBeGreaterThan(0);
	});

	test('Manifesto', async ({ page }) => {
		await page.goto('/gifts');
		try {
			await page.waitForSelector('.manifesto', { timeout: 15000 });
		} catch {
			test.skip(true, 'No manifesto content loaded from Convex');
			return;
		}

		const manifesto = page.locator('.manifesto');
		await expect(manifesto).toBeVisible();
		const text = await manifesto.textContent();
		expect(text?.trim().length).toBeGreaterThan(0);
	});

	test('Contact', async ({ page }) => {
		await page.goto('/gifts');
		await page.waitForSelector('.letter', { timeout: 15000 });

		const contactLink = page.locator('.gifts-contact a');
		if ((await contactLink.count()) > 0) {
			await expect(contactLink.first()).toBeVisible();
			const href = await contactLink.first().getAttribute('href');
			expect(href).toMatch(/^mailto:/);
		}
	});

	test('Layout', async ({ page }) => {
		await page.goto('/gifts');
		await page.waitForSelector('.letter', { timeout: 15000 });

		const letter = page.locator('.letter');
		await expect(letter).toBeVisible();

		// Verify centered with max-width constraint
		const layout = await letter.evaluate((el) => {
			const style = window.getComputedStyle(el);
			return {
				maxWidth: style.maxWidth,
				marginLeft: style.marginLeft,
				marginRight: style.marginRight,
			};
		});

		// max-width should be set (not "none")
		expect(layout.maxWidth).not.toBe('none');

		// Centering: marginLeft and marginRight should both be "auto" or equal computed values
		// For auto centering, computed values will be equal positive pixel values
		expect(layout.marginLeft).toBe(layout.marginRight);
	});
});
