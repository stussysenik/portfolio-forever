/**
 * Page Auto-Scroll Tests
 *
 * Tests to verify no unexpected auto-scrolling occurs on page load.
 * "Auto-zoom to center" issue - page shouldn't auto-scroll to a specific position
 * unless explicitly triggered by user interaction.
 */

import { test } from "../setup";
import { expect } from "@playwright/test";
import { TestUtils, testData } from "../setup";

test.describe("Page Auto-Scroll Behavior", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);
	});

	test("should not auto-scroll on initial page load", async ({ page }) => {
		const scrollPosition = await page.evaluate(() => ({
			x: window.scrollX,
			y: window.scrollY
		}));

		// Page should load at scroll position 0,0 (top-left)
		expect(scrollPosition.x).toBe(0);
		expect(scrollPosition.y).toBe(0);
	});

	test("should not auto-scroll to any specific section on load", async ({ page }) => {
		// Get all section elements
		const sectionPositions = await page.evaluate(() => {
			const sections = document.querySelectorAll('section[id]');
			return Array.from(sections).map(section => ({
				id: section.id,
				offsetTop: (section as HTMLElement).offsetTop
			}));
		});

		// Get current scroll position
		const scrollY = await page.evaluate(() => window.scrollY);

		// Scroll position should NOT match a section that's NOT at the top (hero)
		// Being at 0 matching hero is acceptable, but being at 50 matching a section below hero is not
		const nonTopSections = sectionPositions.filter(s => s.offsetTop > 10);
		const matchesNonTopSection = nonTopSections.some(s => Math.abs(s.offsetTop - scrollY) < 50);
		expect(matchesNonTopSection).toBe(false);
	});

	test("should not auto-scroll to random position when hash in URL", async ({ page }) => {
		// Navigate with direct URL format
		await page.goto(`http://portfolio.localhost:1355/#hero`);
		await TestUtils.waitForPageStable(page);

		const scrollPosition = await page.evaluate(() => window.scrollY);
		const viewportHeight = await page.evaluate(() => window.innerHeight);

		// On mobile, browsers may auto-scroll to anchor but shouldn't go to random position
		// Allow for browser hash scrolling behavior (often scrolls to element)
		// Should NOT be at an arbitrary position in middle of page
		expect(scrollPosition).toBeLessThan(viewportHeight * 2);
	});

	test("should have viewport showing top of page content", async ({ page }) => {
		const viewportContent = await page.evaluate(() => {
			const viewportHeight = window.innerHeight;
			const scrollY = window.scrollY;
			
			// Get element at top of viewport
			const topElement = document.elementFromPoint(10, 10);
			
			return {
				scrollY,
				viewportHeight,
				topElementTag: topElement?.tagName,
				topElementId: topElement?.id,
				topElementClass: topElement?.className
			};
		});

		// Should be at top (scrollY = 0) and showing content from top
		expect(viewportContent.scrollY).toBe(0);
	});

	test("should not have unexpected scroll-triggering elements", async ({ page }) => {
		// Check for elements with scroll-related attributes that might cause auto-scroll
		const scrollTriggers = await page.evaluate(() => {
			const triggers: string[] = [];
			
			// Check for scroll-margin-top which can cause scrolling
			const withScrollMargin = document.querySelectorAll('[style*="scroll-margin"], [style*="scroll-margin-top"]');
			withScrollMargin.forEach(el => triggers.push(`scroll-margin: ${el.id || el.className}`));
			
			// Check for tabindex on root elements
			const focusableRoots = document.querySelectorAll('body[tabindex], html[tabindex]');
			focusableRoots.forEach(el => triggers.push(`tabindex on ${el.tagName}`));
			
			// Check autofocus attributes
			const autofocusElements = document.querySelectorAll('[autofocus]');
			if (autofocusElements.length > 0) {
				triggers.push(`autofocus: ${autofocusElements.length} elements`);
			}
			
			return triggers;
		});

		// Log if any triggers found, but don't fail (informational)
		if (scrollTriggers.length > 0) {
			console.log('Potential scroll triggers found:', scrollTriggers);
		}
	});

	test("should maintain scroll position after page stability", async ({ page }) => {
		// Get initial position
		const initialPosition = await page.evaluate(() => ({
			x: window.scrollX,
			y: window.scrollY
		}));

		// Wait more time for any async scroll to complete
		await page.waitForTimeout(2000);

		// Get final position
		const finalPosition = await page.evaluate(() => ({
			x: window.scrollX,
			y: window.scrollY
		}));

		// Position should remain at top
		expect(initialPosition.x).toBe(0);
		expect(initialPosition.y).toBe(0);
		expect(finalPosition.x).toBe(0);
		expect(finalPosition.y).toBe(0);
	});
});

test.describe("Visual Viewport - Zoom Detection", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);
	});

	test("should not have visual viewport offset indicating zoom", async ({ page }) => {
		const visualViewportInfo = await page.evaluate(() => {
			const vv = window.visualViewport;
			if (!vv) return null;
			
			return {
				width: vv.width,
				height: vv.height,
				offsetTop: vv.offsetTop,
				offsetLeft: vv.offsetLeft
			};
		});

		// Visual viewport should match window dimensions and have no offset
		expect(visualViewportInfo?.offsetTop).toBe(0);
		expect(visualViewportInfo?.offsetLeft).toBe(0);
	});

	test("should have consistent scroll behavior across reloads", async ({ page }) => {
		// Test multiple reloads to check consistency
		for (let i = 0; i < 3; i++) {
			await page.reload();
			await TestUtils.waitForPageStable(page);
			
			const scrollY = await page.evaluate(() => window.scrollY);
			expect(scrollY).toBe(0);
		}
	});
});