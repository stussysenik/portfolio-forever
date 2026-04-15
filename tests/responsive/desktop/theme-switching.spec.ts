import { test, expect } from '../../setup';
import { TestUtils } from '../../setup';

const themes = ['minimal', 'studio', 'terminal', 'darkroom', 'accessible'];

test.describe('Desktop theme switching', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await TestUtils.waitForPageStable(page);
	});

	test('cycles themes via T key', async ({ page }) => {
		for (let i = 0; i < themes.length; i++) {
			await page.keyboard.press('t');
			await page.waitForTimeout(100);
			const dataTheme = await page.evaluate(() =>
				document.documentElement.getAttribute('data-theme')
			);
			expect(themes).toContain(dataTheme);
		}
	});
});
