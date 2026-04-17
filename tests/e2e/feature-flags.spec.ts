import { test, expect } from '@playwright/test';

test.describe('Feature flag toggle — single source of truth', () => {
	test('only one semantic toggle mechanism exists per flag row', async ({ page }) => {
		await page.goto('/');
		const flagRows = page.locator('.flag-row');
		const count = await flagRows.count();

		for (let i = 0; i < count; i++) {
			const row = flagRows.nth(i);

			const toggleSwitches = row.locator('[role="switch"]');
			await expect(toggleSwitches).toHaveCount(1);

			const toggleButtons = row.locator('button:not([role="switch"])');
			await expect(toggleButtons).toHaveCount(0);
		}
	});

	test('every flag row has exactly one dot, one label, one state, one toggle', async ({ page }) => {
		await page.goto('/');
		const flagRows = page.locator('.flag-row');
		const count = await flagRows.count();
		if (count === 0) return;

		for (let i = 0; i < count; i++) {
			const row = flagRows.nth(i);

			await expect(row.locator('.flag-dot')).toHaveCount(1);
			await expect(row.locator('.flag-label')).toHaveCount(1);
			await expect(row.locator('.flag-state')).toHaveCount(1);
			await expect(row.locator('[role="switch"]')).toHaveCount(1);
		}
	});

	test('flag dot active state matches toggle aria-checked', async ({ page }) => {
		await page.goto('/');
		const flagRows = page.locator('.flag-row');
		const count = await flagRows.count();

		for (let i = 0; i < count; i++) {
			const row = flagRows.nth(i);
			const toggle = row.locator('[role="switch"]');
			const dot = row.locator('.flag-dot');

			const isChecked = await toggle.getAttribute('aria-checked');
			const isActive = await dot.evaluate(el =>
				el.classList.contains('flag-dot--active')
			);

			const stateText = await row.locator('.flag-state').textContent();

			if (isChecked === 'true') {
				expect(isActive).toBe(true);
				expect(stateText).toBe('ON');
			} else {
				expect(isActive).toBe(false);
				expect(stateText).toBe('OFF');
			}
		}
	});

	test('no duplicate flag-row implementations coexist on any page', async ({ page }) => {
		const pagesToCheck = ['/', '/admin'];

		for (const path of pagesToCheck) {
			await page.goto(path);

			const allFlagRows = await page.locator('.flag-row').count();
			if (allFlagRows === 0) continue;

			const legacyToggleButtons = await page.locator('.flag-row .flag-toggle').count();
			expect(legacyToggleButtons, `Legacy .flag-toggle button found on ${path}`).toBe(0);

			const legacyFlagIndicators = await page.locator('.flag-row .flag-status').count();
			expect(legacyFlagIndicators, `Legacy .flag-status span found on ${path}`).toBe(0);
		}
	});
});
