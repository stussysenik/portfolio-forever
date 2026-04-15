import { test, expect } from '../../setup';
import { TestUtils } from '../../setup';

test.describe('Tablet critical flows', () => {
	test('hero renders on /', async ({ page }) => {
		await page.goto('/');
		await TestUtils.waitForPageStable(page);
		await expect(page.locator('.hero-name, main').first()).toBeVisible();
	});

	test('works grid renders entries on /works', async ({ page }) => {
		await page.goto('/works');
		await TestUtils.waitForPageStable(page);
		const cards = page.locator('.project-card');
		const count = await cards.count();
		expect(count).toBeGreaterThan(0);
	});
});
