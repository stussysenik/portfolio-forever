import { test, expect } from '@playwright/test';

/**
 * Command Palette Interaction Tests
 *
 * Validates the keyboard-driven command palette that provides
 * quick navigation and actions across the portfolio site.
 *
 * The palette opens with "?" (Shift+/) and supports vim-style
 * "g + letter" key sequences for page navigation.
 */

test.describe('Command Palette - Open/Close', () => {
	test('opens with ? key', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();
	});

	test('closes with ? key', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Open
		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();

		// Close with same key
		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).not.toBeVisible();
	});

	test('closes with Escape', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.locator('.palette')).not.toBeVisible();
	});

	test('closes with backdrop click', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();

		// Click the overlay backdrop (outside the palette dialog)
		const overlay = page.locator('.overlay');
		await overlay.click({ position: { x: 5, y: 5 } });
		await expect(page.locator('.palette')).not.toBeVisible();
	});

	test('has dialog role', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('Shift+/');
		const palette = page.locator('.palette');
		await expect(palette).toBeVisible();
		await expect(palette).toHaveAttribute('role', 'dialog');
	});
});

test.describe('Command Palette - Content', () => {
	test('shows command list', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();

		const commandItems = page.locator('.command-item');
		const count = await commandItems.count();
		expect(count).toBeGreaterThan(0);
	});

	test('shows key bindings', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();

		const keyBindings = page.locator('.command-keys');
		const count = await keyBindings.count();
		expect(count).toBeGreaterThan(0);

		// Each key binding element should be visible
		await expect(keyBindings.first()).toBeVisible();
	});

	test('shows labels', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('Shift+/');
		await expect(page.locator('.palette')).toBeVisible();

		const labels = page.locator('.command-label');
		const count = await labels.count();
		expect(count).toBeGreaterThan(0);

		// Each label should be visible and have text content
		await expect(labels.first()).toBeVisible();
		const firstLabelText = await labels.first().textContent();
		expect(firstLabelText?.trim().length).toBeGreaterThan(0);
	});
});

test.describe('Command Palette - Navigation Key Sequences', () => {
	/**
	 * Helper: press a "g + letter" key sequence and verify navigation.
	 * Keys are pressed individually with a short delay to simulate
	 * sequential typing as the component expects.
	 */
	async function pressKeySequence(page: import('@playwright/test').Page, keys: string[]) {
		for (const key of keys) {
			await page.keyboard.press(key);
			await page.waitForTimeout(200);
		}
		// Wait for navigation to complete
		await page.waitForTimeout(500);
	}

	test('g h navigates to home', async ({ page }) => {
		await page.goto('/works');
		await page.waitForLoadState('networkidle');

		// Click body to ensure focus is on main page, not an iframe
		await page.locator('body').click();

		await pressKeySequence(page, ['g', 'h']);
		await page.waitForURL('**/', { timeout: 5000 });
		expect(page.url()).toMatch(/\/$/);
	});

	test('g w navigates to works', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await pressKeySequence(page, ['g', 'w']);
		await page.waitForURL('**/works');
		expect(page.url()).toContain('/works');
	});

	test('g c navigates to cv', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await pressKeySequence(page, ['g', 'c']);
		await page.waitForURL('**/cv');
		expect(page.url()).toContain('/cv');
	});

	test('g n navigates to blog', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await pressKeySequence(page, ['g', 'n']);
		await page.waitForURL('**/blog');
		expect(page.url()).toContain('/blog');
	});

	test('g k navigates to likes', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await pressKeySequence(page, ['g', 'k']);
		await page.waitForURL('**/likes');
		expect(page.url()).toContain('/likes');
	});

	test('g t navigates to talks', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await pressKeySequence(page, ['g', 't']);
		await page.waitForURL('**/talks');
		expect(page.url()).toContain('/talks');
	});

	test('g p navigates to process', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await pressKeySequence(page, ['g', 'p']);
		await page.waitForURL('**/process');
		expect(page.url()).toContain('/process');
	});

	test('g m navigates to terminal', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await pressKeySequence(page, ['g', 'm']);
		await page.waitForURL('**/terminal');
		expect(page.url()).toContain('/terminal');
	});

	test('g g navigates to gifts', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await pressKeySequence(page, ['g', 'g']);
		await page.waitForURL('**/gifts');
		expect(page.url()).toContain('/gifts');
	});
});

test.describe('Command Palette - Input Suppression', () => {
	test('does not trigger when input focused', async ({ page }) => {
		await page.goto('/terminal');
		await page.waitForLoadState('networkidle');

		// Focus the terminal input
		const terminalInput = page.locator('.terminal-input');
		await terminalInput.click();
		await expect(terminalInput).toBeFocused();

		// Type the key sequence that would normally navigate to home
		await page.keyboard.press('g');
		await page.waitForTimeout(200);
		await page.keyboard.press('h');
		await page.waitForTimeout(500);

		// Should still be on /terminal, not navigated to /
		expect(page.url()).toContain('/terminal');
	});

	test('does not trigger when textarea focused', async ({ page }) => {
		await page.goto('/scratchpad');
		await page.waitForLoadState('networkidle');

		// Focus the scratchpad textarea
		const textarea = page.locator('.scratch-textarea');
		await textarea.click();
		await expect(textarea).toBeFocused();

		// Type the key sequence that would normally navigate to home
		await page.keyboard.press('g');
		await page.waitForTimeout(200);
		await page.keyboard.press('h');
		await page.waitForTimeout(500);

		// Should still be on /scratchpad, not navigated to /
		expect(page.url()).toContain('/scratchpad');
	});
});
