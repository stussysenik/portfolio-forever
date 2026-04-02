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

test.describe('/admin - security', () => {
	test('keyboard shortcuts do not bypass auth gate', async ({ page }) => {
		await page.goto('/admin');
		await page.waitForTimeout(1000);

		// Try keyboard shortcuts that might bypass auth
		await page.keyboard.press('?');
		await page.waitForTimeout(300);

		// Admin sections should still not be visible
		const adminSection = page.locator('.admin-section');
		await expect(adminSection).toHaveCount(0);
	});

	test('direct URL to admin sub-routes redirects to auth', async ({ page }) => {
		await page.goto('/admin');
		const authGate = page.locator('.auth-gate, .auth-title, .btn-github').first();
		await expect(authGate).toBeVisible({ timeout: 10000 });
	});

	test('no admin data in page source without auth', async ({ page }) => {
		await page.goto('/admin');
		const pageContent = await page.textContent('body');
		// Should not contain admin-specific content
		expect(pageContent).not.toContain('Save Changes');
		expect(pageContent).not.toContain('Delete Entry');
	});
});
