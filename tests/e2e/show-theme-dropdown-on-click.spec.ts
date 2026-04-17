import { test, expect } from '@playwright/test';

async function waitForThemeReady(page: import('@playwright/test').Page) {
	await page.waitForLoadState('networkidle');
	await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/, { timeout: 10000 });
	await expect(page.locator('.theme-toggle')).toBeVisible({ timeout: 5000 });
}

test.describe('show theme dropdown on click', () => {
	test('clicking theme-toggle shows only the theme-dropdown and does not change the active theme', async ({ page }) => {
		await page.goto('/');
		await waitForThemeReady(page);

		const initialTheme = await page.locator('html').getAttribute('data-theme');
		await expect(page.locator('.theme-dropdown')).toBeHidden();
		await expect(page.locator('.font-dropdown')).toBeHidden();

		await page.locator('.theme-toggle').click();

		await expect(page.locator('.theme-dropdown')).toBeVisible();
		const themeAfterClick = await page.locator('html').getAttribute('data-theme');
		expect(themeAfterClick).toBe(initialTheme);
		await expect(page.locator('.font-dropdown')).toBeHidden();
	});

	test('clicking theme-toggle again closes the theme-dropdown', async ({ page }) => {
		await page.goto('/');
		await waitForThemeReady(page);

		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();

		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeHidden();
	});

	test('clicking theme-toggle while font-dropdown is open closes font-dropdown', async ({ page }) => {
		await page.goto('/');
		await waitForThemeReady(page);

		await page.locator('.font-toggle').click();
		await expect(page.locator('.font-dropdown')).toBeVisible();

		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();
		await expect(page.locator('.font-dropdown')).toBeHidden();
	});

	test('clicking outside the theme-dropdown closes it', async ({ page }) => {
		await page.goto('/');
		await waitForThemeReady(page);

		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();

		await page.locator('main').click({ position: { x: 10, y: 10 } });
		await expect(page.locator('.theme-dropdown')).toBeHidden();
	});

	test('pressing Escape closes the theme-dropdown without changing the theme', async ({ page }) => {
		await page.goto('/');
		await waitForThemeReady(page);

		const initialTheme = await page.locator('html').getAttribute('data-theme');

		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.locator('.theme-dropdown')).toBeHidden();

		const themeAfterEscape = await page.locator('html').getAttribute('data-theme');
		expect(themeAfterEscape).toBe(initialTheme);
	});

	test('selecting a theme changes data-theme and closes the dropdown', async ({ page }) => {
		await page.goto('/');
		await waitForThemeReady(page);

		const initialTheme = await page.locator('html').getAttribute('data-theme');
		const targetTheme = initialTheme === 'studio' ? 'terminal' : 'studio';

		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();
		await page.locator(`.theme-option[data-theme="${targetTheme}"]`).click();

		expect(await page.locator('html').getAttribute('data-theme')).toBe(targetTheme);
		await expect(page.locator('.theme-dropdown')).toBeHidden();
		await expect(page.locator('.font-dropdown')).toBeHidden();
	});
});
