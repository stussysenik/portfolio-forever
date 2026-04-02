import { test, expect } from '@playwright/test';

const routes = [
	{ path: '/', title: /Stüssy Senik/i },
	{ path: '/works', title: /Works/i },
	{ path: '/talks', title: /Talks/i },
	{ path: '/academia', title: /Re:mix Research/i },
	{ path: '/cv', title: /CV/i },
	{ path: '/terminal', title: /Terminal/i },
	// Blog depends on Sanity env vars — skip in basic health check
	// { path: '/blog', title: /Blog/i },
	{ path: '/gifts', title: /Gifts/i },
	{ path: '/process', title: /Process/i },
	{ path: '/likes', title: /Likes/i },
];

test.describe('Route health', () => {
	for (const route of routes) {
		test(`${route.path} returns 200`, async ({ page }) => {
			const response = await page.goto(route.path);
			expect(response?.status()).toBe(200);
		});
	}
});

test.describe('Navigation', () => {
	test('nav contains all main links', async ({ page }) => {
		await page.goto('/');
		const nav = page.locator('nav');
		await expect(nav.locator('a[href="/works"]')).toBeVisible();
		await expect(nav.locator('a[href="/talks"]')).toBeVisible();
		await expect(nav.locator('a[href="/academia"]')).toBeVisible();
		await expect(nav.locator('a[href="/cv"]')).toBeVisible();
		await expect(nav.locator('a[href="/terminal"]')).toBeVisible();
	});

	test('re:mix link in nav goes to academia', async ({ page }) => {
		await page.goto('/');
		const remixLink = page.locator('nav a[href="/academia"]');
		await expect(remixLink).toContainText('re:mix');
		await remixLink.click();
		await expect(page).toHaveURL(/\/academia/);
	});
});

test.describe('Error page', () => {
	test('404 shows error page not crash', async ({ page }) => {
		const response = await page.goto('/this-does-not-exist');
		expect(response?.status()).toBe(404);
		await expect(page.locator('.error-page')).toBeVisible();
	});
});

test.describe('Extended route health', () => {
	const extendedRoutes = [
		{ path: '/blog', title: /Short notes|Blog/i },
		{ path: '/gallery', title: /Gallery/i },
		{ path: '/minor', title: /Minor/i },
		{ path: '/labs', title: /Lab/i },
		{ path: '/os', title: /OS/i },
		{ path: '/scratchpad', title: /Scratchpad/i },
	];

	for (const route of extendedRoutes) {
		test(`${route.path} returns 200`, async ({ page }) => {
			const response = await page.goto(route.path);
			expect(response?.status()).toBe(200);
		});
	}
});
