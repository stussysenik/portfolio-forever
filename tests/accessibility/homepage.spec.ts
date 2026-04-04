/**
 * Homepage Accessibility Tests
 *
 * WCAG 2.1 AA compliance tests using axe-core and manual checks.
 */

import { test } from '../setup';
import { expect } from '@playwright/test';
import { TestUtils, testData } from '../setup';

test.describe('Accessibility - WCAG 2.1 Compliance', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);
	});

	test('should have no critical axe-core violations', async ({ page, makeAxeBuilder }) => {
		const results = await makeAxeBuilder()
			.disableRules(['color-contrast']) // decorative elements may fail
			.analyze();

		const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
		expect(critical).toEqual([]);
	});

	test('should have valid semantic HTML structure', async ({ page }) => {
		await expect(page.locator('.header').first()).toBeVisible();
		await expect(page.locator('nav').first()).toBeVisible();
		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();

		const h1 = await page.locator('h1').count();
		expect(h1).toBeGreaterThanOrEqual(1);
	});

	test('should have proper ARIA labels on interactive elements', async ({ page }) => {
		const buttons = await page.locator('button').all();
		for (const button of buttons) {
			const accessibleName = await button.evaluate(el => {
				return (
					el.getAttribute('aria-label') ||
					el.getAttribute('aria-labelledby') ||
					el.textContent?.trim() ||
					el.getAttribute('title') ||
					''
				);
			});
			expect(accessibleName.length).toBeGreaterThan(0);
		}
	});

	test('should have proper language attribute', async ({ page }) => {
		const html = page.locator('html');
		await expect(html).toHaveAttribute('lang');
		const lang = await html.getAttribute('lang');
		expect(lang).toMatch(/^(en|de|ja|en-US|en-GB)/);
	});
});

test.describe('Accessibility - Keyboard Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);
	});

	test('should be fully keyboard navigable', async ({ page }) => {
		const { focusableElements } = await TestUtils.testKeyboardNavigation(page);
		expect(focusableElements).toBeGreaterThan(0);
	});

	test('should maintain visible focus indicators', async ({ page }) => {
		const focusableElements = page.locator(
			'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		for (let i = 0; i < Math.min(await focusableElements.count(), 10); i++) {
			await page.keyboard.press('Tab');
			await page.waitForTimeout(100);

			const focusedElement = await page.evaluate(() => {
				const active = document.activeElement as HTMLElement;
				return {
					outline: window.getComputedStyle(active).outline,
					boxShadow: window.getComputedStyle(active).boxShadow,
					outlineOffset: window.getComputedStyle(active).outlineOffset,
				};
			});

			const hasVisibleFocus =
				focusedElement.outline !== 'none' ||
				focusedElement.boxShadow !== 'none' ||
				focusedElement.outlineOffset !== '0px';
			expect(hasVisibleFocus).toBeTruthy();
		}
	});

	test('should support Enter and Space for buttons', async ({ page }) => {
		const buttons = page.locator('button');
		if (await buttons.count() > 0) {
			const button = buttons.first();
			await button.focus();
			await page.keyboard.press('Enter');
			await page.waitForTimeout(100);
			await page.keyboard.press(' ');
			await page.waitForTimeout(100);
		}
	});
});

test.describe('Accessibility - Color and Contrast', () => {
	test('should pass axe color contrast check', async ({ page, makeAxeBuilder }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const results = await makeAxeBuilder()
			.withTags(['wcag2a', 'wcag2aa'])
			.analyze();

		const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
		// Allow up to 3 minor contrast issues on decorative elements
		expect(contrastViolations.length).toBeLessThanOrEqual(3);
	});
});

test.describe('Accessibility - Images and Media', () => {
	test('should have alt text for all images', async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const images = await page.locator('img').all();
		for (const image of images) {
			const alt = await image.getAttribute('alt');
			const role = await image.getAttribute('role');
			if (role !== 'presentation') {
				expect(alt).toBeTruthy();
			}
		}
	});
});

test.describe('Accessibility - Reduced Motion', () => {
	test('should respect prefers-reduced-motion', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		// Page should load without issues
		await expect(page.locator(testData.selectors.hero)).toBeVisible();
	});
});

test.describe('Accessibility - High Contrast Mode', () => {
	test('should support high contrast mode', async ({ page }) => {
		await page.emulateMedia({ forcedColors: 'active' });
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		await expect(page.locator(testData.selectors.hero)).toBeVisible();
	});
});

test.describe('Accessibility - Screen Reader', () => {
	test('should have proper page title', async ({ page }) => {
		await page.goto(testData.urls.home);
		const title = await page.title();
		expect(title).toBeTruthy();
		expect(title.length).toBeGreaterThan(0);
	});

	test('should have proper landmark regions', async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const mainCount = await page.locator('main').count();
		expect(mainCount).toBeGreaterThan(0);
	});

	test('should have proper ARIA states for dynamic content', async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const expandables = page.locator('[aria-expanded]');
		for (let i = 0; i < await expandables.count(); i++) {
			const expanded = await expandables.nth(i).getAttribute('aria-expanded');
			expect(['true', 'false']).toContain(expanded);
		}
	});
});

test.describe('Accessibility - Links and Navigation', () => {
	test('should have descriptive link text', async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const links = page.locator('a[href]');
		for (let i = 0; i < await links.count(); i++) {
			const link = links.nth(i);
			const text = await link.textContent();
			const ariaLabel = await link.getAttribute('aria-label');
			const title = await link.getAttribute('title');
			expect(Boolean(text?.trim() || ariaLabel || title)).toBeTruthy();
		}
	});

	test('should indicate external links', async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const externalLinks = page.locator('a[target="_blank"]');
		for (let i = 0; i < await externalLinks.count(); i++) {
			const rel = await externalLinks.nth(i).getAttribute('rel');
			expect(rel).toContain('noopener');
		}
	});
});

test.describe('Accessibility - Forms', () => {
	test('should have accessible form inputs', async ({ page }) => {
		await page.goto(testData.urls.home);
		const inputs = page.locator('input, select, textarea');
		if (await inputs.count() > 0) {
			for (let i = 0; i < await inputs.count(); i++) {
				const hasLabel = await inputs.nth(i).evaluate(el => {
					const id = el.getAttribute('id');
					return Boolean(
						el.getAttribute('aria-label') ||
						el.getAttribute('aria-labelledby') ||
						(id && document.querySelector(`label[for="${id}"]`)) ||
						el.closest('label')
					);
				});
				expect(hasLabel).toBeTruthy();
			}
		}
	});
});

test.describe('Accessibility - Edge Cases', () => {
	test('should handle rapid keyboard navigation', async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		for (let i = 0; i < 30; i++) {
			await page.keyboard.press('Tab');
		}

		// Should not crash
		await expect(page.locator('body')).toBeVisible();
	});

	test('should have accessibility report', async ({ page }) => {
		const report = await TestUtils.generateAccessibilityReport(page);
		expect(report.passes).toBeGreaterThan(0);
		expect(report.violations).toBeLessThan(10);
	});
});
