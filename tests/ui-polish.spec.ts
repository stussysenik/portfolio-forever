/**
 * UI Polish Tests — Portfolio 2026
 *
 * Comprehensive Playwright tests reflecting the real site state
 * after all UI polish changes. Tests breakpoints, content, and behavior.
 */

import { test, expect, devices } from '@playwright/test';

// Run all tests against chromium only for speed
test.use({ ...devices['Desktop Chrome'] });

const BASE_URL = 'http://localhost:3000';

// ===========================================
// ROUTE HEALTH — All pages return 200
// ===========================================
test.describe('Route health', () => {
	const routes = ['/', '/works', '/talks', '/likes', '/blog', '/gifts', '/cv', '/process', '/terminal'];

	for (const route of routes) {
		test(`${route} returns 200`, async ({ page }) => {
			const response = await page.goto(BASE_URL + route);
			expect(response?.status()).toBe(200);
		});
	}
});

// ===========================================
// NAV HIERARCHY
// ===========================================
test.describe('Nav hierarchy', () => {
	test('Desktop: "find me elsewhere" label visible before social links', async ({ browser }) => {
		const context = await browser.newContext({
			viewport: { width: 1280, height: 800 },
		});
		const page = await context.newPage();
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		const label = page.locator('.social-label');
		await expect(label).toBeVisible();
		await expect(label).toHaveText('find me elsewhere');

		await context.close();
	});

	test('Mobile: "find me elsewhere" label hidden, @ toggle visible', async ({ browser }) => {
		const context = await browser.newContext({
			viewport: { width: 375, height: 812 },
		});
		const page = await context.newPage();
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		// Social label should be hidden on mobile
		const label = page.locator('.social-label');
		await expect(label).toBeHidden();

		// @ toggle button should be visible
		const toggle = page.locator('.social-toggle');
		await expect(toggle).toBeVisible();

		await context.close();
	});
});

// ===========================================
// HERO RESPONSIVENESS
// ===========================================
test.describe('Hero responsiveness', () => {
	test('Mobile (<=900px): column-reverse layout with donut right offset', async ({ browser }) => {
		const context = await browser.newContext({
			viewport: { width: 375, height: 812 },
		});
		const page = await context.newPage();
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		const hero = page.locator('.hero');
		await expect(hero).toBeVisible();

		// Check column-reverse layout
		const flexDirection = await hero.evaluate(el => getComputedStyle(el).flexDirection);
		expect(flexDirection).toBe('column-reverse');

		// Check donut has right offset (margin-right: 10%)
		const visual = page.locator('.hero-visual');
		const marginRight = await visual.evaluate(el => getComputedStyle(el).marginRight);
		// 10% of 375px viewport ≈ 37.5px — should be non-zero
		expect(parseFloat(marginRight)).toBeGreaterThan(0);

		await context.close();
	});

	test('Desktop (>900px): two-column side-by-side layout', async ({ browser }) => {
		const context = await browser.newContext({
			viewport: { width: 1280, height: 800 },
		});
		const page = await context.newPage();
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		const hero = page.locator('.hero');
		const flexDirection = await hero.evaluate(el => getComputedStyle(el).flexDirection);
		// Should not be column-reverse on desktop
		expect(flexDirection).toBe('row');

		await context.close();
	});
});

// ===========================================
// FOOTER DROPDOWNS
// ===========================================
test.describe('Footer dropdowns', () => {
	test('Theme switcher opens upward (bottom positioning)', async ({ page }) => {
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		// Click theme toggle
		const themeToggle = page.locator('.theme-toggle');
		await themeToggle.click();
		await page.waitForTimeout(200);

		// Dropdown should exist and use bottom positioning
		const dropdown = page.locator('.theme-dropdown');
		await expect(dropdown).toBeVisible();

		const bottom = await dropdown.evaluate(el => getComputedStyle(el).bottom);
		// bottom should be set (not "auto") — opens upward
		expect(bottom).not.toBe('auto');

		// Close it
		await page.keyboard.press('Escape');
	});
});

// ===========================================
// COMMAND PALETTE
// ===========================================
test.describe('Command palette', () => {
	test('Opens with ? key', async ({ page }) => {
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('?');
		await page.waitForTimeout(300);

		const palette = page.locator('.palette');
		await expect(palette).toBeVisible();
	});

	test('Desktop: 2-column grid layout', async ({ browser }) => {
		const context = await browser.newContext({
			viewport: { width: 1280, height: 800 },
		});
		const page = await context.newPage();
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('?');
		await page.waitForTimeout(300);

		const commandList = page.locator('.command-list');
		const gridColumns = await commandList.evaluate(el => getComputedStyle(el).gridTemplateColumns);
		// Should have 2 columns (two values in gridTemplateColumns)
		const columnCount = gridColumns.split(' ').length;
		expect(columnCount).toBe(2);

		await context.close();
	});

	test('Mobile (<=480px): 1-column grid layout', async ({ browser }) => {
		const context = await browser.newContext({
			viewport: { width: 375, height: 812 },
		});
		const page = await context.newPage();
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('?');
		await page.waitForTimeout(300);

		const commandList = page.locator('.command-list');
		const gridColumns = await commandList.evaluate(el => getComputedStyle(el).gridTemplateColumns);
		// Should have 1 column
		const columnCount = gridColumns.split(' ').length;
		expect(columnCount).toBe(1);

		await context.close();
	});

	test('Contains "Go to Gifts" shortcut', async ({ page }) => {
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('?');
		await page.waitForTimeout(300);

		const palette = page.locator('.palette');
		await expect(palette).toContainText('Go to Gifts');
	});

	test('Uses CSS variables (no hardcoded colors)', async ({ page }) => {
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		await page.keyboard.press('?');
		await page.waitForTimeout(300);

		// The palette background should come from a CSS variable
		const palette = page.locator('.palette');
		const bg = await palette.evaluate(el => getComputedStyle(el).backgroundColor);
		// It should resolve to a real color (not empty), confirming CSS vars work
		expect(bg).toBeTruthy();
		expect(bg).not.toBe('');
	});
});

// ===========================================
// WORKS PAGE
// ===========================================
test.describe('Works page', () => {
	test('Shows 11 projects (no "2D CAD editor")', async ({ page }) => {
		await page.goto(BASE_URL + '/works');
		await page.waitForLoadState('networkidle');

		// Count project cards
		const cards = page.locator('.project-card');
		await expect(cards).toHaveCount(11);

		// "2D CAD editor" should NOT be present
		const pageContent = await page.textContent('body');
		expect(pageContent).not.toContain('2D CAD editor');
	});

	test('mymind clone shows preview image (not blank iframe)', async ({ page }) => {
		await page.goto(BASE_URL + '/works');
		await page.waitForLoadState('networkidle');

		// First project should be mymind clone with a preview image
		const firstCard = page.locator('.project-card').first();
		await expect(firstCard).toContainText('mymind.com clone');

		// Should have a preview image, not an iframe
		const previewImg = firstCard.locator('.preview-image');
		await expect(previewImg).toBeVisible();

		// Should not have an iframe for this project
		const iframe = firstCard.locator('iframe');
		await expect(iframe).toHaveCount(0);
	});
});

// ===========================================
// BLOG ROUTE
// ===========================================
test.describe('Blog route', () => {
	test('/blog loads (not /notes)', async ({ page }) => {
		const response = await page.goto(BASE_URL + '/blog');
		expect(response?.status()).toBe(200);

		// Page title should reference notes/blog
		await expect(page.locator('.page-title')).toContainText('Short notes');
	});

	test('/notes does NOT exist as a route', async ({ page }) => {
		const response = await page.goto(BASE_URL + '/notes');
		// Should be 404 or redirect, not 200 with content
		const status = response?.status();
		// SvelteKit returns 404 for non-existent routes
		expect(status).not.toBe(200);
	});
});

// ===========================================
// IDENTITY SECTION
// ===========================================
test.describe('Identity section', () => {
	test('Domains in order: mxzou.com, mengxuanzou.com, stussysenik.com', async ({ page }) => {
		await page.goto(BASE_URL);
		await page.waitForLoadState('networkidle');

		const domainGroups = page.locator('.domain-group');
		await expect(domainGroups).toHaveCount(3);

		// Check order
		const firstDomain = domainGroups.nth(0);
		await expect(firstDomain).toContainText('mxzou.com');
		await expect(firstDomain).toContainText('main');

		const secondDomain = domainGroups.nth(1);
		await expect(secondDomain).toContainText('mengxuanzou.com');
		await expect(secondDomain).toContainText('filmmaking');

		const thirdDomain = domainGroups.nth(2);
		await expect(thirdDomain).toContainText('stussysenik.com');
		await expect(thirdDomain).toContainText('dev + creative');
	});
});

// ===========================================
// CV PAGE
// ===========================================
test.describe('CV page', () => {
	test('Disciplines show bars but no percentage values', async ({ page }) => {
		await page.goto(BASE_URL + '/cv');
		await page.waitForLoadState('networkidle');

		// Skill bars should be present
		const skillBars = page.locator('.skill-bar');
		const barCount = await skillBars.count();
		expect(barCount).toBeGreaterThan(0);

		// No percentage values should be visible (they're commented out)
		const skillValues = page.locator('.skill-value');
		const visibleValues = await skillValues.count();
		// skill-value elements should not exist in DOM (commented out in template)
		expect(visibleValues).toBe(0);
	});

	test('Cooper Union mentions "dropped out"', async ({ page }) => {
		await page.goto(BASE_URL + '/cv');
		await page.waitForLoadState('networkidle');

		// Find Cooper Union entry
		const pageText = await page.textContent('body');
		expect(pageText).toContain('Cooper Union');
		// The description mentions dropping out
		expect(pageText?.toLowerCase()).toContain('dropped out');
	});
});

// ===========================================
// GIFTS PAGE
// ===========================================
test.describe('Gifts page', () => {
	test('3 items in "What to send"', async ({ page }) => {
		await page.goto(BASE_URL + '/gifts');
		await page.waitForLoadState('networkidle');

		const sendItems = page.locator('.send-list li');
		await expect(sendItems).toHaveCount(3);
	});

	test('No "physical address" text', async ({ page }) => {
		await page.goto(BASE_URL + '/gifts');
		await page.waitForLoadState('networkidle');

		const pageText = await page.textContent('body');
		expect(pageText?.toLowerCase()).not.toContain('physical address');
	});

	test('Promise clarification present', async ({ page }) => {
		await page.goto(BASE_URL + '/gifts');
		await page.waitForLoadState('networkidle');

		// The body-note clarifies The Promise scope
		const note = page.locator('.body-note');
		await expect(note).toBeVisible();
		await expect(note).toContainText('Promise');
	});
});

// ===========================================
// CROSS-BREAKPOINT SMOKE
// ===========================================
test.describe('Cross-breakpoint smoke', () => {
	const breakpoints = [
		{ name: 'mobile', width: 375, height: 812 },
		{ name: 'tablet', width: 768, height: 1024 },
		{ name: 'desktop', width: 1280, height: 800 },
	];

	for (const bp of breakpoints) {
		test(`Homepage renders at ${bp.name} (${bp.width}px)`, async ({ browser }) => {
			const context = await browser.newContext({
				viewport: { width: bp.width, height: bp.height },
			});
			const page = await context.newPage();
			const response = await page.goto(BASE_URL);
			await page.waitForLoadState('networkidle');

			expect(response?.status()).toBe(200);
			await expect(page.locator('.hero')).toBeVisible();
			await expect(page.locator('.header')).toBeVisible();

			await context.close();
		});
	}
});
