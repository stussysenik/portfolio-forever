/**
 * Page Auto-Scroll Tests - Bottom Scroll Detection
 *
 * Tests to verify no unexpected auto-scrolling occurs on page load,
 * specifically checking for "scroll to bottom" behavior.
 */

import { test } from "../setup";
import { expect } from "@playwright/test";
import { TestUtils, testData } from "../setup";

test.describe("Page Auto-Scroll to Bottom Detection", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);
	});

	test("should not scroll to bottom on initial page load", async ({ page }) => {
		const scrollY = await page.evaluate(() => window.scrollY);
		const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
		const viewportHeight = await page.evaluate(() => window.innerHeight);

		// Should NOT be scrolled to bottom (leaving only ~viewport height remaining)
		const isAtBottom = scrollY + viewportHeight >= scrollHeight - 10;
		expect(isAtBottom).toBe(false);

		// Should be at top
		expect(scrollY).toBe(0);
	});

	test("should load at top even with terminal section rendered", async ({ page }) => {
		// Check if terminal section exists in DOM
		const hasTerminal = await page.locator('.terminal-section, #terminal').count();

		const scrollY = await page.evaluate(() => window.scrollY);

		// Even if terminal exists, should not be scrolled to it
		expect(scrollY).toBeLessThan(100);
	});

	test("should have consistent scroll position across reloads", async ({ page }) => {
		const positions: number[] = [];

		for (let i = 0; i < 3; i++) {
			await page.reload();
			await TestUtils.waitForPageStable(page);

			const scrollY = await page.evaluate(() => window.scrollY);
			positions.push(scrollY);
		}

		// All should be at top (0)
		positions.forEach(pos => {
			expect(pos).toBe(0);
		});
	});

	test("should not auto-scroll after terminal welcome message", async ({ page }) => {
		// Wait for terminal to potentially load and trigger scroll
		await page.waitForTimeout(2000);

		const scrollY = await page.evaluate(() => window.scrollY);
		const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
		const viewportHeight = await page.evaluate(() => window.innerHeight);

		// Should NOT be at bottom
		const isAtBottom = scrollY + viewportHeight >= scrollHeight - 10;
		expect(isAtBottom).toBe(false);
	});
});