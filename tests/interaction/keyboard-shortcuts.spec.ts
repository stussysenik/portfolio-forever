import { test, expect } from '@playwright/test';

/**
 * Global Keyboard Shortcuts Tests
 *
 * Validates that single-key shortcuts (?, t, f) work across
 * all pages and are properly suppressed when form elements
 * have focus. Also tests Escape-to-close behavior for overlays.
 */

test.describe('Global Keyboard Shortcuts', () => {
	test('? toggles command palette', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Open palette with ?
		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();

		// Wait for palette to fully render and focus its internal input
		await page.waitForTimeout(200);

		// Close palette with ? again
		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).not.toBeVisible();
	});

	test('t cycles theme', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Capture the initial theme
		const initialTheme = await page.locator('html').getAttribute('data-theme');

		// Press t to cycle
		await page.keyboard.press('t');
		await page.waitForTimeout(300);

		// Theme should have changed
		const newTheme = await page.locator('html').getAttribute('data-theme');
		expect(newTheme).not.toEqual(initialTheme);
	});

	test('f toggles font picker', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Open font dropdown with f
		await page.keyboard.press('f');
		await page.waitForTimeout(300);
		await expect(page.locator('.font-dropdown')).toBeVisible();

		// Close font dropdown with f again
		await page.keyboard.press('f');
		await page.waitForTimeout(300);
		await expect(page.locator('.font-dropdown')).not.toBeVisible();
	});
});

test.describe('Shortcuts Suppressed in Inputs', () => {
	test('? suppressed in textarea', async ({ page }) => {
		await page.goto('/scratchpad');
		await page.waitForLoadState('networkidle');

		// Focus the textarea
		const textarea = page.locator('.scratch-textarea');
		await textarea.click();
		await expect(textarea).toBeFocused();

		// Type ? into the textarea using keyboard.type (not press)
		// keyboard.type sends text input events, producing the actual character
		await page.keyboard.type('?');
		await page.waitForTimeout(300);

		// Palette should NOT open
		await expect(page.locator('.palette')).not.toBeVisible();

		// The ? character should have been typed into the textarea
		const textareaValue = await textarea.inputValue();
		expect(textareaValue).toContain('?');
	});

	test('t suppressed in input', async ({ page }) => {
		await page.goto('/terminal');
		await page.waitForLoadState('networkidle');

		// Capture initial theme
		const initialTheme = await page.locator('html').getAttribute('data-theme');

		// Focus the terminal input
		const input = page.locator('.terminal-input');
		await input.click();
		await expect(input).toBeFocused();

		// Press t while input is focused
		await page.keyboard.press('t');
		await page.waitForTimeout(300);

		// Theme should NOT have changed
		const currentTheme = await page.locator('html').getAttribute('data-theme');
		expect(currentTheme).toEqual(initialTheme);

		// The t character should have been typed into the input
		const inputValue = await input.inputValue();
		expect(inputValue).toContain('t');
	});
});

test.describe('Escape Closes Overlays', () => {
	test('Escape closes command palette', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Open palette
		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();

		// Close with Escape
		await page.keyboard.press('Escape');
		await expect(page.locator('.palette')).not.toBeVisible();
	});

	test('Escape closes theme dropdown', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Open theme dropdown via click
		const themeToggle = page.locator('.theme-toggle');
		await themeToggle.click();
		await page.waitForTimeout(300);
		await expect(page.locator('.theme-dropdown')).toBeVisible();

		// Close with Escape
		await page.keyboard.press('Escape');
		await expect(page.locator('.theme-dropdown')).not.toBeVisible();
	});

	test('Escape closes font dropdown', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Open font dropdown via click
		const fontToggle = page.locator('.font-toggle');
		await fontToggle.click();
		await page.waitForTimeout(300);
		await expect(page.locator('.font-dropdown')).toBeVisible();

		// Close with Escape
		await page.keyboard.press('Escape');
		await expect(page.locator('.font-dropdown')).not.toBeVisible();
	});
});

test.describe('Cross-Page Shortcuts', () => {
	test('shortcuts work on /works', async ({ page }) => {
		await page.goto('/works');
		await page.waitForLoadState('networkidle');

		// Click body to ensure focus is on main page, not an iframe
		await page.locator('body').click();

		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();
	});

	test('shortcuts work on /cv', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();
	});

	test('shortcuts survive page navigation', async ({ page }) => {
		// Open palette on home page
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();

		// Close it
		await page.keyboard.press('Escape');
		await expect(page.locator('.palette')).not.toBeVisible();

		// Navigate to a different page
		await page.goto('/cv');
		await page.waitForLoadState('networkidle');

		// Palette should still work on the new page
		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();
	});
});
