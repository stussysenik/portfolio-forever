/**
 * Visual Regression Tests
 *
 * Visual regression tests for UI consistency.
 * Tests cover: full page screenshots, component snapshots,
 * interactive states, and cross-browser compatibility.
 */

import { test } from '../setup';
import { expect } from '@playwright/test';
import { TestUtils, testData } from '../setup';

const viewports = {
	mobile: { width: 375, height: 667 },
	tablet: { width: 768, height: 1024 },
	desktop: { width: 1280, height: 720 },
	desktopHD: { width: 1920, height: 1080 },
};

test.describe('Visual Regression - Full Page', () => {
	test('should match full page screenshot on desktop', async ({ page }) => {
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		await expect(page).toHaveScreenshot('homepage-desktop.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});

	test('should match full page screenshot on mobile', async ({ page }) => {
		await page.setViewportSize(viewports.mobile);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		await expect(page).toHaveScreenshot('homepage-mobile.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});
});

test.describe('Visual Regression - Hero Section', () => {
	test('should display hero section on desktop', async ({ page }) => {
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await page.waitForSelector('.hero-name', { timeout: 15000 });

		const hero = page.locator('.hero').first();
		await expect(hero).toBeVisible();
		const heroName = hero.locator('.hero-name');
		await expect(heroName).toBeVisible();
	});

	test('should display hero section on mobile', async ({ page }) => {
		await page.setViewportSize(viewports.mobile);
		await page.goto(testData.urls.home);
		await page.waitForSelector('.hero-name', { timeout: 15000 });

		const hero = page.locator('.hero').first();
		await expect(hero).toBeVisible();
	});
});

test.describe('Visual Regression - Header and Navigation', () => {
	test('should match header screenshot', async ({ page }) => {
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const header = page.locator(testData.selectors.header);
		await expect(header).toBeVisible();
		await expect(header).toHaveScreenshot('header.png', {
			animations: 'disabled',
		});
	});

	test('should match header on mobile', async ({ page }) => {
		await page.setViewportSize(viewports.mobile);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const header = page.locator(testData.selectors.header);
		await expect(header).toHaveScreenshot('header-mobile.png', {
			animations: 'disabled',
		});
	});
});

test.describe('Visual Regression - Footer', () => {
	test('should match footer screenshot', async ({ page }) => {
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(300);

		const footer = page.locator('footer');
		await expect(footer).toBeVisible();
		await expect(footer).toHaveScreenshot('footer.png', {
			animations: 'disabled',
		});
	});
});

test.describe('Visual Regression - Interactive States', () => {
	test('should show visible focus on nav link', async ({ page }) => {
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const navLink = page.locator('nav a').first();
		await navLink.focus();
		await page.waitForTimeout(100);

		const hasFocus = await navLink.evaluate(el => el === document.activeElement);
		expect(hasFocus).toBeTruthy();
	});

	test('should match page scrolled to bottom', async ({ page }) => {
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(300);

		await expect(page).toHaveScreenshot('page-scrolled-bottom.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});
});

test.describe('Visual Regression - Color Schemes', () => {
	test('should match page in dark mode', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});

	test('should match page in light mode', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light' });
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		await expect(page).toHaveScreenshot('homepage-light-mode.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});
});

test.describe('Visual Regression - Reduced Motion', () => {
	test('should match page with reduced motion', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		await expect(page).toHaveScreenshot('page-reduced-motion.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});
});

test.describe('Visual Regression - Component Snapshots', () => {
	test('should capture nav link states', async ({ page }) => {
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const links = page.locator('nav a');
		const count = Math.min(await links.count(), 3);
		for (let i = 0; i < count; i++) {
			await expect(links.nth(i)).toHaveScreenshot(`nav-link-${i}.png`, {
				animations: 'disabled',
			});
		}
	});
});

test.describe('Visual Regression - Accessibility', () => {
	test('should match high contrast mode', async ({ page }) => {
		await page.emulateMedia({ forcedColors: 'active' });
		await page.setViewportSize(viewports.desktop);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		await expect(page).toHaveScreenshot('page-high-contrast.png', {
			fullPage: true,
			animations: 'disabled',
			maxDiffPixels: 200,
		});
	});
});
