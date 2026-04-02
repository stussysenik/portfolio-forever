import { test, expect } from '@playwright/test';

test.describe('Process Section', () => {
	test('Page Load', async ({ page }) => {
		const response = await page.goto('/process');
		expect(response?.status()).toBe(200);
	});

	test('SVG Renders', async ({ page }) => {
		await page.goto('/process');
		await page.waitForSelector('.process-svg', { timeout: 15000 });

		const svg = page.locator('.process-svg');
		await expect(svg).toBeVisible();
	});

	test('SVG Labels', async ({ page }) => {
		await page.goto('/process');
		await page.waitForSelector('.process-svg', { timeout: 15000 });

		const svg = page.locator('.process-svg');

		// The SVG should contain text elements for each label
		const svgContent = await svg.innerHTML();
		expect(svgContent).toContain('IMAGINE');
		expect(svgContent).toContain('RE-THINK');
		expect(svgContent).toContain('SHIP');
	});

	test('SVG Accessible', async ({ page }) => {
		await page.goto('/process');
		await page.waitForSelector('.process-svg', { timeout: 15000 });

		const svg = page.locator('.process-svg');
		const ariaLabel = await svg.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();
		expect(ariaLabel!.length).toBeGreaterThan(0);
	});

	test('Centered Layout', async ({ page }) => {
		await page.goto('/process');
		await page.waitForSelector('.process-cycle', { timeout: 15000 });

		const container = page.locator('.process-cycle');
		await expect(container).toBeVisible();

		const layout = await container.evaluate((el) => {
			const style = window.getComputedStyle(el);
			const rect = el.getBoundingClientRect();
			return {
				minHeight: style.minHeight,
				width: rect.width,
				left: rect.left,
				right: rect.right,
				viewportWidth: window.innerWidth,
			};
		});

		// Should have a min-height set (not "0px" or "auto")
		expect(layout.minHeight).not.toBe('0px');

		// Should be centered: left and right margins roughly equal
		const leftMargin = layout.left;
		const rightMargin = layout.viewportWidth - layout.right;
		const marginDiff = Math.abs(leftMargin - rightMargin);
		// Allow 2px tolerance for rounding
		expect(marginDiff).toBeLessThanOrEqual(2);
	});
});
