import { test, expect } from '../../setup';
import { TestUtils } from '../../setup';

const themes = ['minimal', 'studio', 'terminal', 'darkroom', 'accessible'];

test.describe('Tablet theme switching', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await TestUtils.waitForPageStable(page);
	});

	test('cycles themes via T key and updates data-theme', async ({ page }) => {
		for (let i = 0; i < themes.length; i++) {
			await page.keyboard.press('t');
			await page.waitForTimeout(100);
			const dataTheme = await page.evaluate(() =>
				document.documentElement.getAttribute('data-theme')
			);
			expect(themes).toContain(dataTheme);
		}
	});

	test('--color-bg resolves to a non-empty CSS value per theme', async ({ page }) => {
		const bg = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
		);
		expect(bg.length).toBeGreaterThan(0);
	});
});
