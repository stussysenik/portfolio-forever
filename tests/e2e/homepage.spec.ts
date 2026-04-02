/**
 * Homepage E2E Tests
 *
 * Comprehensive end-to-end tests for the portfolio homepage.
 * Tests: page load, navigation, hero content, sections, footer,
 * responsive design, performance, accessibility, and UX.
 */

import { test } from "../setup";
import { expect } from "@playwright/test";
import { TestUtils, testData } from "../setup";

test.describe("Homepage - Core Functionality", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);
	});

	test("should load homepage successfully", async ({ page }) => {
		// Page title set by +page.svelte <svelte:head>
		await expect(page).toHaveTitle("Stüssy Senik");

		// Check URL
		await expect(page).toHaveURL(testData.urls.home);

		// Check main content is visible
		await expect(page.locator(testData.selectors.main)).toBeVisible();
	});

	test("should display header with navigation", async ({ page }) => {
		const header = page.locator(testData.selectors.header);
		const nav = page.locator(testData.selectors.nav);

		// Header should be visible
		await expect(header).toBeVisible();

		// Navigation should contain all 9 expected links
		const navLinks = nav.locator("a");
		await expect(navLinks).toHaveCount(9);

		// Check all navigation items
		await expect(nav.getByText("re:mix")).toBeVisible();
		await expect(nav.getByText("terminal")).toBeVisible();
		await expect(nav.getByText("process")).toBeVisible();
		await expect(nav.getByText("works")).toBeVisible();
		await expect(nav.getByText("talks")).toBeVisible();
		await expect(nav.getByText("likes")).toBeVisible();
		await expect(nav.getByText("blog")).toBeVisible();
		await expect(nav.getByText("gifts")).toBeVisible();
		await expect(nav.getByText("cv")).toBeVisible();
	});

	test("should navigate between pages", async ({ page }) => {
		// Test navigation to CV
		await page.click('a[href="/cv"]');
		await TestUtils.waitForPageStable(page);
		await expect(page).toHaveURL("/cv");

		// Navigate back to home
		await page.click('a[href="/"]');
		await TestUtils.waitForPageStable(page);
		await expect(page).toHaveURL(testData.urls.home);
	});

	test("should display hero section correctly", async ({ page }) => {
		const hero = page.locator(testData.selectors.hero);

		// Hero should be visible
		await expect(hero).toBeVisible();

		// Should have name (default before Convex loads, or Convex name)
		const heroName = hero.locator(".hero-name");
		await expect(heroName).toBeVisible();
		// The hero name is populated from Convex or defaults to "Stüssy Senik"
		await expect(heroName).not.toBeEmpty();

		// Should have tagline
		const tagline = hero.locator(".hero-tagline");
		await expect(tagline).toBeVisible();

		// Should have bio
		const bio = hero.locator(".hero-bio");
		await expect(bio).toBeVisible();

		// Should have location
		const location = hero.locator(".hero-location");
		await expect(location).toBeVisible();
	});
});

test.describe("Homepage - Content Loading", () => {
	test("should load works section", async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		// Target the specific section with WORKS title (not the outer hero section)
		const worksSectionTitle = page.locator(".section-title", {
			hasText: "WORKS",
		});
		await expect(worksSectionTitle).toBeVisible();

		// Should have works list
		const worksList = page.locator(".entry-list");
		await expect(worksList).toBeVisible();
	});

	test("should display identity section", async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		// Target the specific section with IDENTITY title
		const identitySectionTitle = page.locator(".section-title", {
			hasText: "IDENTITY",
		});
		await expect(identitySectionTitle).toBeVisible();

		// Should have domain links
		const domains = page.locator(".domains");
		await expect(domains).toBeVisible();
	});

	test("should display footer", async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const footer = page.locator("footer");
		await expect(footer).toBeVisible();

		// Footer has terminal class
		await expect(footer).toHaveClass(/terminal/);

		// Should have current path
		const terminalPath = footer.locator(".terminal-path");
		await expect(terminalPath).toBeVisible();
		await expect(terminalPath).toContainText("/");
	});

	test("should display available status indicator", async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const footer = page.locator("footer");
		const statusIndicator = footer.locator(".status-indicator");

		await expect(statusIndicator).toBeVisible();
		await expect(footer).toContainText("available");
	});
});

test.describe("Homepage - Responsive Design", () => {
	test("should display correctly on mobile", async ({ page }) => {
		const mobileViewport = TestUtils.getViewportSize("mobile");
		await page.setViewportSize(mobileViewport);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		// Check hero content is visible
		await expect(page.locator(testData.selectors.hero)).toBeVisible();

		// Check main content is visible
		await expect(page.locator(testData.selectors.main)).toBeVisible();

		// Navigation should still be accessible
		const nav = page.locator(testData.selectors.nav);
		await expect(nav).toBeVisible();
	});

	test("should display correctly on tablet", async ({ page }) => {
		const tabletViewport = TestUtils.getViewportSize("tablet");
		await page.setViewportSize(tabletViewport);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		// Check hero is visible
		await expect(page.locator(testData.selectors.hero)).toBeVisible();

		// Check main content is visible
		await expect(page.locator(testData.selectors.main)).toBeVisible();

		// Navigation should still be accessible
		const nav = page.locator(testData.selectors.nav);
		await expect(nav).toBeVisible();
	});

	test("should display correctly on desktop", async ({ page }) => {
		const desktopViewport = TestUtils.getViewportSize("desktop");
		await page.setViewportSize(desktopViewport);
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		// Check layout is optimal
		await expect(page.locator(testData.selectors.hero)).toBeVisible();

		// Check navigation is visible
		const nav = page.locator(testData.selectors.nav);
		await expect(nav).toBeVisible();
	});
});

test.describe("Homepage - Performance", () => {
	test("should load within acceptable time", async ({ page }) => {
		const startTime = Date.now();
		await page.goto(testData.urls.home, {
			waitUntil: "domcontentloaded",
		});
		await TestUtils.waitForPageStable(page);
		const loadTime = Date.now() - startTime;

		// Should load in less than 5 seconds
		expect(loadTime).toBeLessThan(5000);
	});

	test("should not have console errors", async ({ page }) => {
		const errors: string[] = [];

		page.on("console", (msg) => {
			if (msg.type() === "error") {
				errors.push(msg.text());
			}
		});

		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		// Wait a bit more to catch any async errors
		await page.waitForTimeout(2000);

		// Filter out known non-critical errors (e.g. Convex connection in test env)
		const criticalErrors = errors.filter(
			(err) =>
				!err.includes("Convex") &&
				!err.includes("WebSocket") &&
				!err.includes("posthog") &&
				!err.includes("Failed to fetch"),
		);

		expect(criticalErrors).toHaveLength(0);
	});

	test("should have proper meta tags", async ({ page }) => {
		await page.goto(testData.urls.home);

		// Check viewport meta tag
		const viewport = await page.getAttribute(
			'meta[name="viewport"]',
			"content",
		);
		expect(viewport).toContain("width=device-width");
		expect(viewport).toContain("initial-scale=1");

		// Check description meta tag
		const description = await page.getAttribute(
			'meta[name="description"]',
			"content",
		);
		expect(description).toBeTruthy();
		expect(description?.length).toBeGreaterThan(0);
	});
});

test.describe("Homepage - Accessibility", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);
	});

	test("should have no critical accessibility violations", async ({
		page,
		makeAxeBuilder,
	}) => {
		const accessibilityScanResults = await makeAxeBuilder()
			// Exclude known non-critical issues (color contrast on decorative elements)
			.disableRules(["color-contrast"])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("should have proper heading hierarchy", async ({ page }) => {
		const h1 = page.locator("h1");

		// Should have exactly one h1
		await expect(h1).toHaveCount(1);

		// h1 should not be empty (contains profile name from Convex or default)
		await expect(h1).not.toBeEmpty();
	});

	test("should have focus indicators on interactive elements", async ({
		page,
	}) => {
		const navLinks = page.locator("a[href]");

		for (let i = 0; i < Math.min(await navLinks.count(), 5); i++) {
			const link = navLinks.nth(i);
			await link.focus();

			// Check if focus is on the element
			const focusedElement = await page.evaluate(
				() => document.activeElement?.tagName,
			);
			expect(focusedElement).toBe("A");
		}
	});

	test("should be keyboard navigable", async ({ page }) => {
		// Tab through navigation
		for (let i = 0; i < 5; i++) {
			await page.keyboard.press("Tab");

			const focusedTag = await page.evaluate(() => {
				return document.activeElement?.tagName;
			});

			// Should focus on interactive elements (A or BUTTON)
			expect(["A", "BUTTON"]).toContain(focusedTag);
		}
	});
});

test.describe("Homepage - User Experience", () => {
	test("should have smooth scroll behavior", async ({ page }) => {
		await page.goto(testData.urls.home);

		// Check if smooth scrolling is enabled
		const html = page.locator("html");
		const scrollBehavior = await html.evaluate((el) => {
			return window.getComputedStyle(el).scrollBehavior;
		});

		expect(scrollBehavior).toBe("smooth");
	});

	test("should have header name link to home", async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const headerName = page.locator(".header-name");
		await expect(headerName).toBeVisible();
		await expect(headerName).toHaveAttribute("href", "/");
	});

	test("should have social links toggle button", async ({ page }) => {
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		const socialToggle = page.locator(".social-toggle");
		await expect(socialToggle).toBeVisible();
		await expect(socialToggle).toHaveAttribute(
			"aria-label",
			"Toggle social links",
		);
	});
});

test.describe("Homepage - Edge Cases", () => {
	test("should handle slow network conditions", async ({ page }) => {
		// Simulate slow 3G
		await page.context().setOffline(false);
		await page.route("**/*", async (route) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			route.continue();
		});

		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		// Should still load successfully
		await expect(page.locator(testData.selectors.hero)).toBeVisible();
	});

	test("should handle JavaScript disabled gracefully", async ({
		page,
		context,
	}) => {
		// Note: This test would require creating a new context with JS disabled
		// For now, we'll skip it as it requires browser configuration
		test.skip(true, "Requires browser context with JS disabled");
	});

	test("should handle very long content gracefully", async ({ page }) => {
		// This test ensures the page handles scrolling with lots of content
		await page.goto(testData.urls.home);
		await TestUtils.waitForPageStable(page);

		// Scroll to bottom
		await page.evaluate(() =>
			window.scrollTo(0, document.body.scrollHeight),
		);
		await page.waitForTimeout(500);

		// Check footer is visible
		const footer = page.locator("footer");
		await expect(footer).toBeInViewport();

		// Scroll back to top
		await page.evaluate(() => window.scrollTo(0, 0));
		await page.waitForTimeout(500);

		// Check header is visible
		await expect(
			page.locator(testData.selectors.header),
		).toBeInViewport();
	});
});
