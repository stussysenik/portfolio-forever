import { test, expect } from '../../setup';
import { TestUtils } from '../../setup';

test.describe('Desktop critical flows', () => {
	test('works grid shows multiple columns at desktop width', async ({ page }) => {
		await page.goto('/works');
		await TestUtils.waitForPageStable(page);
		const cards = page.locator('.project-card');
		const count = await cards.count();
		expect(count).toBeGreaterThan(0);

		if (count >= 2) {
			const first = await cards.nth(0).boundingBox();
			const second = await cards.nth(1).boundingBox();
			if (first && second) {
				const onSameRow = Math.abs(first.y - second.y) < 4;
				expect(onSameRow).toBe(true);
			}
		}
	});

	test('cv page renders', async ({ page }) => {
		await page.goto('/cv');
		await TestUtils.waitForPageStable(page);
		await expect(page.locator('main').first()).toBeVisible();
	});
});
