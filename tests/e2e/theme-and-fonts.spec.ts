import { test, expect } from '@playwright/test';

const THEMES = ['minimal', 'studio', 'terminal', 'darkroom', 'accessible'];
const FONTS = ['inter', 'rubik', 'helvetica', 'crimson', 'times', 'ibm-plex', 'jetbrains', 'fira', 'space'];

/**
 * Helper: wait for the footer controls to be ready.
 * The ThemeSwitcher and FontSwitcher render inside a fixed footer.
 * We wait for networkidle (SvelteKit hydration complete), then verify
 * the data-theme attribute is set on <html> (ThemeSwitcher onMount has fired).
 */
async function waitForControlsReady(page: import('@playwright/test').Page) {
	await page.waitForLoadState('networkidle');
	// Wait for ThemeSwitcher onMount to fire and set data-theme
	await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/, { timeout: 10000 });
	await expect(page.locator('.theme-toggle')).toBeVisible({ timeout: 5000 });
	await expect(page.locator('.font-toggle')).toBeVisible({ timeout: 5000 });
}

test.describe('Theme Switching', () => {
	test('Default Theme — html has data-theme attribute set', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		const theme = await page.locator('html').getAttribute('data-theme');
		expect(theme).toBeTruthy();
		expect(THEMES).toContain(theme);
	});

	test('Open Dropdown — click .theme-toggle, .theme-dropdown visible', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();
	});

	test('Close on Escape — open dropdown, press Escape, dropdown hidden', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.locator('.theme-dropdown')).toBeHidden();
	});

	test('Apply Theme — click a .theme-option, html data-theme changes, dropdown closes', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		const initialTheme = await page.locator('html').getAttribute('data-theme');
		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();

		// Pick a theme different from the current one
		const targetTheme = THEMES.find(t => t !== initialTheme) ?? THEMES[1];
		await page.locator(`.theme-option[data-theme="${targetTheme}"]`).click();

		const newTheme = await page.locator('html').getAttribute('data-theme');
		expect(newTheme).toBe(targetTheme);
		await expect(page.locator('.theme-dropdown')).toBeHidden();
	});

	test('Active Indicator — active theme has .theme-option.active', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		const currentTheme = await page.locator('html').getAttribute('data-theme');
		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();

		const activeOption = page.locator('.theme-option.active');
		await expect(activeOption).toBeVisible();
		const activeTheme = await activeOption.getAttribute('data-theme');
		expect(activeTheme).toBe(currentTheme);
	});

	test('Keyboard T Key — press "t" key, data-theme cycles to next value', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		const initialTheme = await page.locator('html').getAttribute('data-theme');
		await page.keyboard.press('t');
		// Wait briefly for the theme to cycle
		await page.waitForTimeout(300);
		const newTheme = await page.locator('html').getAttribute('data-theme');
		expect(newTheme).toBeTruthy();
		// Theme should have changed (cycled to next)
		expect(newTheme).not.toBe(initialTheme);
	});

	test('All Themes Valid — each theme click still renders page (hero visible)', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		for (const theme of THEMES) {
			await page.locator('.theme-toggle').click();
			await expect(page.locator('.theme-dropdown')).toBeVisible();
			await page.locator(`.theme-option[data-theme="${theme}"]`).click();

			const applied = await page.locator('html').getAttribute('data-theme');
			expect(applied).toBe(theme);
			// Verify the page still renders — hero section should be visible
			await expect(page.locator('.hero, .hero-section, [class*="hero"]').first()).toBeVisible({ timeout: 5000 });
		}
	});

	test('Persistence — set theme, reload, data-theme persisted', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		const targetTheme = 'terminal';
		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();
		await page.locator(`.theme-option[data-theme="${targetTheme}"]`).click();

		const applied = await page.locator('html').getAttribute('data-theme');
		expect(applied).toBe(targetTheme);

		await page.reload();
		// Wait for onMount to fire and apply saved theme from localStorage
		await expect(page.locator('html')).toHaveAttribute('data-theme', targetTheme, { timeout: 5000 });
	});
});

test.describe('Font Switching', () => {
	test('Open Dropdown — click .font-toggle, .font-dropdown visible', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		await page.locator('.font-toggle').click();
		await expect(page.locator('.font-dropdown')).toBeVisible();
	});

	test('Close on Escape — open, Escape, close', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		await page.locator('.font-toggle').click();
		await expect(page.locator('.font-dropdown')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.locator('.font-dropdown')).toBeHidden();
	});

	test('Apply Font — click a .font-cell, html data-font changes', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);

		// First set a known font so data-font attribute exists
		await page.locator('.font-toggle').click();
		await expect(page.locator('.font-dropdown')).toBeVisible();
		await page.locator('.font-cell[data-font="inter"]').click();
		await expect(page.locator('html')).toHaveAttribute('data-font', 'inter');

		// Now switch to a different font
		const targetFont = 'rubik';
		await page.locator('.font-toggle').click();
		await expect(page.locator('.font-dropdown')).toBeVisible();
		await page.locator(`.font-cell[data-font="${targetFont}"]`).click();

		const newFont = await page.locator('html').getAttribute('data-font');
		expect(newFont).toBe(targetFont);
	});

	test('Active Indicator — active font has .font-cell.active', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);

		// Set a known font first so the data-font attribute is present on <html>
		await page.locator('.font-toggle').click();
		await expect(page.locator('.font-dropdown')).toBeVisible();
		await page.locator('.font-cell[data-font="inter"]').click();
		await expect(page.locator('html')).toHaveAttribute('data-font', 'inter');

		// Re-open the dropdown and check active indicator
		await page.locator('.font-toggle').click();
		await expect(page.locator('.font-dropdown')).toBeVisible();

		const activeCell = page.locator('.font-cell.active');
		await expect(activeCell).toBeVisible();
		const activeFont = await activeCell.getAttribute('data-font');
		expect(activeFont).toBe('inter');
	});

	test('Keyboard F Key — press "f" key, dropdown toggles', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		// Press "f" to open
		await page.keyboard.press('f');
		await expect(page.locator('.font-dropdown')).toBeVisible();
		// Press "f" again to close
		await page.keyboard.press('f');
		await expect(page.locator('.font-dropdown')).toBeHidden();
	});

	test('Persistence — set font, reload, data-font persisted', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);
		const targetFont = 'jetbrains';
		await page.locator('.font-toggle').click();
		await expect(page.locator('.font-dropdown')).toBeVisible();
		await page.locator(`.font-cell[data-font="${targetFont}"]`).click();

		const applied = await page.locator('html').getAttribute('data-font');
		expect(applied).toBe(targetFont);

		await page.reload();
		// Wait for onMount to fire and apply saved font from localStorage
		await expect(page.locator('html')).toHaveAttribute('data-font', targetFont, { timeout: 5000 });
	});
});

test.describe('Theme + Font Combined', () => {
	test('set both theme and font, reload, both persist independently', async ({ page }) => {
		await page.goto('/');
		await waitForControlsReady(page);

		// Set theme
		const targetTheme = 'darkroom';
		await page.locator('.theme-toggle').click();
		await expect(page.locator('.theme-dropdown')).toBeVisible();
		await page.locator(`.theme-option[data-theme="${targetTheme}"]`).click();
		await expect(page.locator('.theme-dropdown')).toBeHidden();

		// Set font
		const targetFont = 'fira';
		await page.locator('.font-toggle').click();
		await expect(page.locator('.font-dropdown')).toBeVisible();
		await page.locator(`.font-cell[data-font="${targetFont}"]`).click();

		// Verify both applied
		expect(await page.locator('html').getAttribute('data-theme')).toBe(targetTheme);
		expect(await page.locator('html').getAttribute('data-font')).toBe(targetFont);

		// Reload and verify persistence — wait for onMount to apply saved values
		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-theme', targetTheme, { timeout: 5000 });
		await expect(page.locator('html')).toHaveAttribute('data-font', targetFont, { timeout: 5000 });
	});
});
