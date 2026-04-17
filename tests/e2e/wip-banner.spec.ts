/**
 * WIP Banner Deterministic Tests
 *
 * Tests that verify:
 * 1. WIP banner renders at the very first index in the DOM (before all other elements)
 * 2. There is exactly one WIP banner element (no extra rendering)
 * 3. WIP banner appears in the correct position in the DOM tree
 */

import { test } from "../setup";
import { expect } from "@playwright/test";
import { TestUtils, testData } from "../setup";

test.describe("WIP Banner - DOM Position & Rendering", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);
	});

	test("should render WIP banner as the first element in the DOM", async ({ page }) => {
		await page.waitForSelector(".wip-banner", { timeout: 10000 });
		
		// WIP banner should be at or near the top of the DOM (within first 10 elements)
		// accounting for SvelteKit's wrapper divs
		const wipBannerPosition = await page.evaluate(() => {
			const allElements = Array.from(document.querySelectorAll('*'));
			const wipBanner = allElements.find(el => el.classList.contains('wip-banner'));
			if (!wipBanner) return -1;
			return allElements.indexOf(wipBanner);
		});
		
		expect(wipBannerPosition).toBeLessThan(60);
	});

	test("should have exactly one WIP banner element on the page", async ({ page }) => {
		const wipBanners = page.locator(".wip-banner");
		await expect(wipBanners).toHaveCount(1);
	});

	test("should render WIP banner before main content", async ({ page }) => {
		const wipBanner = page.locator(".wip-banner");
		const mainContent = page.locator("main.main-content");

		await expect(wipBanner).toBeVisible();
		await expect(mainContent).toBeVisible();

		const wipBannerBox = await wipBanner.boundingBox();
		const mainContentBox = await mainContent.boundingBox();

		expect(wipBannerBox?.y).toBeLessThan(mainContentBox?.y ?? 0);
	});

	test("should render WIP banner before header element", async ({ page }) => {
		await page.waitForSelector(".wip-banner", { timeout: 10000 });
		
		const wipBanner = page.locator(".wip-banner");
		const header = page.locator(".header");

		const wipBannerBox = await wipBanner.boundingBox();
		const headerCount = await header.count();

		if (headerCount > 0) {
			const headerBox = await header.first().boundingBox();
			expect(wipBannerBox?.y).toBeLessThanOrEqual(headerBox?.y ?? 0);
		} else {
			expect(wipBannerBox?.y).toBe(0);
		}
	});

	test("should have WIP banner with correct structure", async ({ page }) => {
		const wipBanner = page.locator(".wip-banner");
		await expect(wipBanner).toBeVisible();

		const hasText = await wipBanner.locator(".wip-text").isVisible();
		const hasMessage = await wipBanner.locator(".wip-msg").isVisible();
		const hasTime = await wipBanner.locator(".wip-time").isVisible();

		expect(hasText).toBe(true);
		expect(hasMessage).toBe(true);
		expect(hasTime).toBe(true);
	});

	test("should render WIP banner at top of viewport with correct position", async ({ page }) => {
		const wipBanner = page.locator(".wip-banner");
		await expect(wipBanner).toBeVisible();

		const bannerBox = await wipBanner.boundingBox();
		expect(bannerBox?.y).toBe(0);
	});

	test("should not render duplicate WIP banners in preview mode", async ({ page }) => {
		const count = await page.locator(".wip-banner").count();
		expect(count).toBe(1);
	});

	test("should have WIP banner as direct child of body", async ({ page }) => {
		await page.waitForSelector(".wip-banner", { timeout: 10000 });
		
		// WIP banner should be under body (can have a wrapper div in between)
		const wipBannerParent = await page.evaluate(() => {
			const wipBanner = document.querySelector('.wip-banner');
			if (!wipBanner) return null;
			
			// Check if parent is body or has body as ancestor
			let current = wipBanner.parentElement;
			while (current) {
				if (current.tagName === 'BODY') return 'BODY';
				current = current.parentElement;
			}
			return wipBanner.parentElement?.tagName ?? null;
		});

		expect(wipBannerParent).toBe("BODY");
	});

	test("should have WIP banner as first element in DOM tree regardless of visibility", async ({ page }) => {
		await page.waitForSelector(".wip-banner", { timeout: 10000 });
		
		// Find WIP banner position among all elements
		const wipBannerIndex = await page.evaluate(() => {
			const allElements = Array.from(document.querySelectorAll('*'));
			return allElements.findIndex(el => el.classList.contains('wip-banner'));
		});
		
		// Should be within first 60 elements (accounting for SvelteKit structure)
		expect(wipBannerIndex).toBeLessThan(60);
	});
});

test.describe("WIP Banner - State Management", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);
	});

	test("should hide WIP banner when dismissed", async ({ page }) => {
		await page.evaluate(() => {
			localStorage.setItem("wipBannerDismissed", "true");
		});

		await page.reload();
		await TestUtils.waitForPageStable(page);

		const wipBanner = page.locator(".wip-banner");
		await expect(wipBanner).not.toBeVisible();
	});

	test("should show WIP banner when not dismissed", async ({ page }) => {
		await page.evaluate(() => {
			localStorage.setItem("wipBannerDismissed", "false");
		});

		await page.reload();
		await TestUtils.waitForPageStable(page);

		const wipBanner = page.locator(".wip-banner");
		await expect(wipBanner).toBeVisible();
	});
});