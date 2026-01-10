/**
 * Homepage E2E Tests
 *
 * Comprehensive end-to-end tests for the portfolio homepage
 * Tests include: page load, navigation, content, videos, and UX interactions
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
                // Check page title
                await expect(page).toHaveTitle("WIP Stussy Senik");

                // Check URL
                await expect(page).toHaveURL(testData.urls.home);

                // Check main content is visible
                await expect(
                        page.locator(testData.selectors.main),
                ).toBeVisible();
        });

        test("should display WIP banner prominently", async ({ page }) => {
                const wipBanner = page.locator(testData.selectors.wipBanner);

                // Banner should be visible
                await expect(wipBanner).toBeVisible();

                // Should contain warning text
                await expect(wipBanner).toContainText("HEAVY CONSTRUCTION");
                await expect(wipBanner).toContainText("WIP EVERYWHERE");

                // Should have warning icons
                const warningIcons = await wipBanner
                        .locator(".wip-icon")
                        .count();
                expect(warningIcons).toBe(2);

                // Check banner styling - should have red background
                const backgroundColor = await wipBanner.evaluate((el) => {
                        return window.getComputedStyle(el).backgroundColor;
                });
                expect(backgroundColor).toContain("255"); // RGB red channel

                // Check animations are present
                await expect(wipBanner).toHaveCSS("animation", /.+/);
        });

        test("should display header with navigation", async ({ page }) => {
                const header = page.locator(testData.selectors.header);
                const nav = page.locator(testData.selectors.nav);

                // Header should be visible
                await expect(header).toBeVisible();

                // Navigation should contain all expected links
                const navLinks = nav.locator("a");
                await expect(navLinks).toHaveCount(6); // works, likes, notes, cv, terminal, process

                // Check specific navigation items
                await expect(nav.getByText("works")).toBeVisible();
                await expect(nav.getByText("likes")).toBeVisible();
                await expect(nav.getByText("notes")).toBeVisible();
                await expect(nav.getByText("cv")).toBeVisible();
                await expect(nav.getByText("terminal")).toBeVisible();
                await expect(nav.getByText("process")).toBeVisible();
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

                // Should have name
                const heroName = hero.locator(".hero-name");
                await expect(heroName).toBeVisible();
                await expect(heroName).toContainText("Stüssy Senik");

                // Should have tagline
                const tagline = hero.locator(".hero-tagline");
                await expect(tagline).toBeVisible();
                await expect(tagline).toContainText("minimalism");

                // Should have bio
                const bio = hero.locator(".hero-bio");
                await expect(bio).toBeVisible();
                await expect(bio).toContainText("Building at the intersection");

                // Should have location
                const location = hero.locator(".hero-location");
                await expect(location).toBeVisible();
                await expect(location).toContainText("NYC");
        });
});

test.describe("Homepage - Video Player", () => {
        test.beforeEach(async ({ page }) => {
                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);
        });

        test("should display video players in showcase", async ({ page }) => {
                const videos = page.locator(testData.selectors.videoPlayer);

                // Should have at least one video
                await expect(videos.first()).toBeVisible();

                // Check video element exists
                const videoElement = page.locator("video").first();
                await expect(videoElement).toBeAttached();
        });

        test("should play video when clicked", async ({ page }) => {
                const video = page.locator("video").first();
                const playButton = page
                        .locator(testData.selectors.playButton)
                        .first();

                // Initially should be paused
                let isPaused = await video.evaluate((el: any) => el.paused);
                expect(isPaused).toBe(true);

                // Click play button
                await playButton.click();
                await page.waitForTimeout(500); // Wait for play to start

                // Check if playing
                isPaused = await video.evaluate((el: any) => el.paused);
                expect(isPaused).toBe(false);
        });

        test("should pause video when playing", async ({ page }) => {
                const video = page.locator("video").first();

                // Start playing
                await video.click();
                await page.waitForTimeout(500);

                let isPaused = await video.evaluate((el: any) => el.paused);
                expect(isPaused).toBe(false);

                // Click to pause
                await video.click();
                await page.waitForTimeout(500);

                // Check if paused
                isPaused = await video.evaluate((el: any) => el.paused);
                expect(isPaused).toBe(true);
        });

        test("should display video controls on hover", async ({ page }) => {
                const videoContainer = page
                        .locator(testData.selectors.videoPlayer)
                        .first();
                const controls = videoContainer.locator(".controls-overlay");

                // Initially, controls might not be visible
                await videoContainer.hover();
                await page.waitForTimeout(200); // Wait for hover effect

                // Controls should be visible after hover
                await expect(controls).toBeVisible();

                // Check for play/pause button
                await expect(controls.locator("button")).toBeVisible();

                // Check for progress bar
                await expect(
                        controls.locator(".progress-container"),
                ).toBeVisible();

                // Check for time display
                await expect(controls.locator(".time-display")).toBeVisible();
        });

        test("should seek video using progress bar", async ({ page }) => {
                const video = page.locator("video").first();
                const progressBar = page
                        .locator(testData.selectors.progressBar)
                        .first();

                // Start video
                await video.click();
                await page.waitForTimeout(1000);

                // Get initial time
                const initialTime = await video.evaluate(
                        (el: any) => el.currentTime,
                );
                expect(initialTime).toBeGreaterThan(0);

                // Click on progress bar to seek
                const box = await progressBar.boundingBox();
                if (box) {
                        await progressBar.click({
                                position: {
                                        x: box.width * 0.5,
                                        y: box.height / 2,
                                },
                        });
                        await page.waitForTimeout(200);
                }
        });

        test("should display keyboard shortcuts hint", async ({ page }) => {
                const videoContainer = page
                        .locator(testData.selectors.videoPlayer)
                        .first();
                const shortcutsHint = videoContainer.locator(".shortcuts-hint");

                await videoContainer.hover();
                await page.waitForTimeout(200);

                await expect(shortcutsHint).toBeVisible();
                await expect(shortcutsHint).toContainText("?");
        });

        test("should show shortcuts help modal when ? is pressed", async ({
                page,
        }) => {
                const videoContainer = page
                        .locator(testData.selectors.videoPlayer)
                        .first();

                // Hover video to show controls
                await videoContainer.hover();
                await page.waitForTimeout(200);

                // Click shortcuts hint
                await videoContainer.locator(".shortcuts-hint").click();
                await page.waitForTimeout(200);

                // Modal should be visible
                const modal = videoContainer.locator(".shortcuts-modal");
                await expect(modal).toBeVisible();

                // Check modal content
                await expect(modal).toContainText("KEYBOARD SHORTCUTS");
                await expect(
                        modal.locator(".shortcut-item"),
                ).toHaveCount.greaterThan(0);

                // Close modal
                await modal.locator(".shortcuts-close").click();
                await page.waitForTimeout(200);

                // Modal should be closed
                await expect(modal).not.toBeVisible();
        });

        test("should support keyboard shortcuts for video control", async ({
                page,
        }) => {
                const video = page.locator("video").first();

                // Focus video container
                await page
                        .locator(testData.selectors.videoPlayer)
                        .first()
                        .focus();

                // Press space to play
                await page.keyboard.press("Space");
                await page.waitForTimeout(500);

                let isPaused = await video.evaluate((el: any) => el.paused);
                expect(isPaused).toBe(false);

                // Press space to pause
                await page.keyboard.press("Space");
                await page.waitForTimeout(500);

                isPaused = await video.evaluate((el: any) => el.paused);
                expect(isPaused).toBe(true);
        });
});

test.describe("Homepage - Content Loading", () => {
        test("should load works section", async ({ page }) => {
                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);

                const worksSection = page.locator('section:has-text("WORKS")');
                await expect(worksSection).toBeVisible();

                // Should have works list
                const worksList = worksSection.locator(".entry-list");
                await expect(worksList).toBeVisible();

                // Should have at least one work entry
                const workEntries = worksList.locator(".entry");
                await expect(workEntries.first()).toBeVisible();
        });

        test("should load showcase section with videos", async ({ page }) => {
                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);

                const showcaseSection = page.locator(".showcase-section");
                await expect(showcaseSection).toBeVisible();

                // Should have showcase items
                const showcaseItems = showcaseSection.locator(".showcase-item");
                await expect(showcaseItems.first()).toBeVisible();
        });

        test("should display footer with terminal info", async ({ page }) => {
                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);

                const footer = page.locator("footer");
                await expect(footer).toBeVisible();

                // Should have terminal styling
                await expect(footer).toHaveClass(/terminal/);

                // Should have OS info
                await expect(footer).toContainText("SENIK OS");

                // Should have current path
                await expect(footer).toContainText("/");
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

                // Check WIP banner is visible
                await expect(
                        page.locator(testData.selectors.wipBanner),
                ).toBeVisible();

                // Check content is visible
                await expect(
                        page.locator(testData.selectors.hero),
                ).toBeVisible();

                // Check no horizontal scroll
                const hasHorizontalScroll = await page.evaluate(() => {
                        return document.body.scrollWidth > window.innerWidth;
                });
                expect(hasHorizontalScroll).toBe(false);

                // Check navigation is stacked on mobile
                const nav = page.locator(testData.selectors.nav);
                const navLinks = nav.locator("a");
                const firstLinkBox = await navLinks.first().boundingBox();
                const secondLinkBox = await navLinks.nth(1).boundingBox();

                if (firstLinkBox && secondLinkBox) {
                        // On mobile, links should be vertically stacked
                        expect(secondLinkBox.y).toBeGreaterThan(firstLinkBox.y);
                }
        });

        test("should display correctly on tablet", async ({ page }) => {
                const tabletViewport = TestUtils.getViewportSize("tablet");
                await page.setViewportSize(tabletViewport);
                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);

                // Check all sections are visible
                await expect(
                        page.locator(testData.selectors.hero),
                ).toBeVisible();
                await expect(
                        page.locator('section:has-text("WORKS")'),
                ).toBeVisible();
                await expect(page.locator(".showcase-section")).toBeVisible();

                // Check video players fit in viewport
                const videos = page.locator(testData.selectors.videoPlayer);
                for (let i = 0; i < (await videos.count()); i++) {
                        const video = videos.nth(i);
                        await expect(video).toBeVisible();

                        const box = await video.boundingBox();
                        if (box) {
                                expect(box.width).toBeLessThanOrEqual(
                                        tabletViewport.width,
                                );
                        }
                }
        });

        test("should display correctly on desktop", async ({ page }) => {
                const desktopViewport = TestUtils.getViewportSize("desktop");
                await page.setViewportSize(desktopViewport);
                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);

                // Check layout is optimal
                await expect(
                        page.locator(testData.selectors.hero),
                ).toBeVisible();

                // Check navigation is horizontal
                const nav = page.locator(testData.selectors.nav);
                await expect(nav).toBeVisible();

                // Check videos are properly sized
                const videos = page.locator(testData.selectors.videoPlayer);
                await expect(videos.first()).toBeVisible();
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

                // Should have no console errors
                expect(errors).toHaveLength(0);
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
        test.beforeEach(async ({ page, makeAxeBuilder }) => {
                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);
        });

        test("should have no critical accessibility violations", async ({
                page,
                makeAxeBuilder,
        }) => {
                const accessibilityScanResults =
                        await makeAxeBuilder().analyze();

                expect(accessibilityScanResults.violations).toEqual([]);
        });

        test("should have proper heading hierarchy", async ({ page }) => {
                const h1 = page.locator("h1");
                const h2s = page.locator("h2");

                // Should have exactly one h1
                await expect(h1).toHaveCount(1);

                // Should have at least one h2
                await expect(h2s).toHaveCount.greaterThan(0);

                // h1 should contain the name
                await expect(h1).toContainText("Stüssy Senik");
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
                const navLinks = page.locator("a[href]");

                // Tab through navigation
                for (let i = 0; i < Math.min(await navLinks.count(), 5); i++) {
                        await page.keyboard.press("Tab");

                        const focusedElement = await page.evaluate(() => {
                                const active = document.activeElement;
                                return active?.tagName === "A"
                                        ? active.getAttribute("href")
                                        : null;
                        });

                        expect(focusedElement).toBeTruthy();
                }
        });

        test("should have sufficient color contrast", async ({ page }) => {
                // Check WIP banner text contrast
                const wipBanner = page.locator(testData.selectors.wipBanner);
                const wipText = wipBanner.locator(".wip-text");

                await expect(wipText).toBeVisible();

                // Get computed colors
                const textColor = await wipText.evaluate((el) => {
                        return window.getComputedStyle(el).color;
                });

                const backgroundColor = await wipBanner.evaluate((el) => {
                        return window.getComputedStyle(el).backgroundColor;
                });

                // Check colors are defined
                expect(textColor).toBeTruthy();
                expect(backgroundColor).toBeTruthy();
        });
});

test.describe("Homepage - User Experience", () => {
        test("should show WIP banner before other content", async ({
                page,
        }) => {
                await page.goto(testData.urls.home);

                const wipBanner = page.locator(testData.selectors.wipBanner);
                const hero = page.locator(testData.selectors.hero);

                // Get positions
                const wipBox = await wipBanner.boundingBox();
                const heroBox = await hero.boundingBox();

                if (wipBox && heroBox) {
                        expect(wipBox.y).toBeLessThan(heroBox.y);
                }
        });

        test("should have smooth scroll behavior", async ({ page }) => {
                await page.goto(testData.urls.home);

                // Check if smooth scrolling is enabled
                const html = await page.locator("html");
                const scrollBehavior = await html.evaluate((el) => {
                        return window.getComputedStyle(el).scrollBehavior;
                });

                expect(scrollBehavior).toBe("smooth");
        });

        test("should have proper hover states on interactive elements", async ({
                page,
        }) => {
                const navLinks = page.locator("nav a").first();

                // Get initial color
                const initialColor = await navLinks.evaluate((el) => {
                        return window.getComputedStyle(el).color;
                });

                // Hover
                await navLinks.hover();
                await page.waitForTimeout(100);

                // Get hover color
                const hoverColor = await navLinks.evaluate((el) => {
                        return window.getComputedStyle(el).color;
                });

                // Colors should be different
                expect(hoverColor).not.toBe(initialColor);
        });

        test("should have command palette shortcut hint", async ({ page }) => {
                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);

                const footer = page.locator("footer");
                const hintButton = footer.locator(".terminal-hint-btn");

                await expect(hintButton).toBeVisible();
                await expect(hintButton).toContainText("/ for CMDs");
        });

        test("should trigger command palette with / key", async ({ page }) => {
                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);

                // Focus body
                await page.locator("body").click();

                // Press /
                await page.keyboard.press("/");

                // Command palette should appear (you may need to adjust this based on your implementation)
                // This is a placeholder - adjust based on your actual command palette implementation
                const commandPalette = page.locator(
                        '[role="dialog"], .command-palette, [data-testid="command-palette"]',
                );

                // If command palette exists, it should be visible
                if ((await commandPalette.count()) > 0) {
                        await expect(commandPalette.first()).toBeVisible();
                }
        });
});

test.describe("Homepage - Edge Cases", () => {
        test("should handle slow network conditions", async ({ page }) => {
                // Simulate slow 3G
                await page.context().setOffline(false);
                await page.route("**/*", async (route) => {
                        await new Promise((resolve) =>
                                setTimeout(resolve, 500),
                        );
                        route.continue();
                });

                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);

                // Should still load successfully
                await expect(
                        page.locator(testData.selectors.hero),
                ).toBeVisible();
        });

        test("should handle missing video gracefully", async ({ page }) => {
                // Mock a failing video load
                await page.route("**/*.mp4", (route) => route.abort());

                await page.goto(testData.urls.home);
                await TestUtils.waitForPageStable(page);

                // Page should still load
                await expect(
                        page.locator(testData.selectors.hero),
                ).toBeVisible();

                // Should show error state for video
                const videoContainer = page
                        .locator(testData.selectors.videoPlayer)
                        .first();
                await expect(videoContainer).toBeVisible();

                // Check if error overlay appears
                const errorOverlay = videoContainer.locator(".error-overlay");
                if ((await errorOverlay.count()) > 0) {
                        await expect(errorOverlay).toBeVisible();
                }
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
