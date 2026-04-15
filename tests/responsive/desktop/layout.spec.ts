import { test, expect } from '../../setup';
import { TestUtils } from '../../setup';

const routes = ['/', '/works', '/cv'];

for (const route of routes) {
	test.describe(`Desktop layout — ${route}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route);
			await TestUtils.waitForPageStable(page);
		});

		test('no horizontal overflow at HiDPI', async ({ page }) => {
			const overflow = await page.evaluate(() => {
				return document.documentElement.scrollWidth > window.innerWidth + 1;
			});
			expect(overflow).toBe(false);
		});

		test('main landmark visible', async ({ page }) => {
			await expect(page.locator('main').first()).toBeVisible();
		});

		test('content fills expected container width', async ({ page }) => {
			const width = await page.evaluate(() => {
				const main = document.querySelector('main');
				return main ? main.getBoundingClientRect().width : 0;
			});
			expect(width).toBeGreaterThan(600);
		});
	});
}
