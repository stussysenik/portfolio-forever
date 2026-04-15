import { test, expect } from '../../setup';
import { TestUtils, testData } from '../../setup';

const routes = ['/', '/works', '/cv'];

for (const route of routes) {
	test.describe(`Tablet layout — ${route}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route);
			await TestUtils.waitForPageStable(page);
		});

		test('no horizontal scroll', async ({ page }) => {
			const overflow = await page.evaluate(() => {
				return document.documentElement.scrollWidth > window.innerWidth + 1;
			});
			expect(overflow).toBe(false);
		});

		test('hero / main content visible', async ({ page }) => {
			await expect(page.locator('main').first()).toBeVisible();
		});

		test('primary nav visible', async ({ page }) => {
			await expect(page.locator('nav').first()).toBeVisible();
		});
	});
}
