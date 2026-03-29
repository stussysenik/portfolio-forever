import { test, expect } from '@playwright/test';

test.describe('/admin', () => {
	test('shows auth gate when not signed in', async ({ page }) => {
		await page.goto('/admin');
		// Should show the auth gate, not the admin panel
		await expect(page.locator('.auth-gate, .auth-title, .btn-github').first()).toBeVisible({ timeout: 10000 });
	});

	test('does not expose admin data without auth', async ({ page }) => {
		await page.goto('/admin');
		// Should NOT show admin content
		const adminSection = page.locator('.admin-section');
		await expect(adminSection).toHaveCount(0);
	});
});
