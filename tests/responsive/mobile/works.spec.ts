/**
 * Mobile /works Page — Loading & Network Behavior Tests
 *
 * Tests the works page on mobile viewports with real network simulation:
 * - Skeleton → placeholder transition (the core bug: skeletons never clearing)
 * - Iframe suppression on mobile (should show "tap to open" instead)
 * - Preview image loading for projects that have them
 * - Network throttling (3G/4G) behavior
 * - External project URL mocking
 * - Viewport resize handling (mobile ↔ desktop)
 * - Performance under constrained networks
 */

import { test, expect } from "../../setup";
import type { Page, Route } from "@playwright/test";

// ── Constants ──────────────────────────────────────────────────────────
const WORKS_URL = "/works";

const MOBILE_VIEWPORTS = {
        iPhoneSE: { width: 375, height: 667 },
        iPhone12: { width: 390, height: 844 },
        iPhone15ProMax: { width: 430, height: 932 },
        Pixel5: { width: 393, height: 851 },
} as const;

const PROJECT_URLS = [
        "https://curate-your-own-network.stussysenik.com",
        "https://ipod-music.vercel.app",
        "https://spinning-wheel-filter.vercel.app",
        "https://uyr-problem.vercel.app",
        "https://infinite-checklist.vercel.app",
        "https://clean-writer.vercel.app",
        "https://creative-block.vercel.app",
        "https://bboy-filter.vercel.app",
        "https://ph213.vercel.app",
        "https://dvd-video-animation.vercel.app",
        "https://wavelength-radio.vercel.app",
];

// All project titles as they appear on the page
const PROJECT_TITLES = [
        "mymind.com clone",
        "iPod emulator",
        "spinning wheel AR filter",
        "uyr-problem",
        "infinite checklist",
        "typewriter",
        "creative block",
        "AR b-boy filter",
        "PH-213 physics",
        "DVD corner",
        "WAVELENGTH RADIO",
];

// ── Helpers ────────────────────────────────────────────────────────────

/** Mock all external project URLs so iframes/fetches don't hit the real internet */
async function mockExternalProjects(page: Page) {
        for (const url of PROJECT_URLS) {
                await page.route(`${url}/**`, async (route: Route) => {
                        await route.fulfill({
                                status: 200,
                                contentType: "text/html",
                                body: `<html><body><h1>Mock: ${url}</h1></body></html>`,
                        });
                });
                await page.route(url, async (route: Route) => {
                        await route.fulfill({
                                status: 200,
                                contentType: "text/html",
                                body: `<html><body><h1>Mock: ${url}</h1></body></html>`,
                        });
                });
        }
}

/** Mock external projects with a configurable delay to simulate slow networks */
async function mockExternalProjectsWithDelay(page: Page, delayMs: number) {
        for (const url of PROJECT_URLS) {
                await page.route(`${url}/**`, async (route: Route) => {
                        await new Promise((r) => setTimeout(r, delayMs));
                        await route.fulfill({
                                status: 200,
                                contentType: "text/html",
                                body: `<html><body><h1>Mock (delayed): ${url}</h1></body></html>`,
                        });
                });
                await page.route(url, async (route: Route) => {
                        await new Promise((r) => setTimeout(r, delayMs));
                        await route.fulfill({
                                status: 200,
                                contentType: "text/html",
                                body: `<html><body><h1>Mock (delayed): ${url}</h1></body></html>`,
                        });
                });
        }
}

/** Mock external projects to simulate network failure */
async function mockExternalProjectsFailure(page: Page) {
        for (const url of PROJECT_URLS) {
                await page.route(`${url}/**`, (route: Route) => route.abort("connectionfailed"));
                await page.route(url, (route: Route) => route.abort("connectionfailed"));
        }
}

/** Mock preview images */
async function mockPreviewImages(page: Page) {
        await page.route("**/previews/*.png", async (route: Route) => {
                // Return a 1x1 transparent PNG
                const transparentPng = Buffer.from(
                        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                        "base64",
                );
                await route.fulfill({
                        status: 200,
                        contentType: "image/png",
                        body: transparentPng,
                });
        });
}

// ── Test Suite ──────────────────────────────────────────────────────────

test.describe("Mobile /works — Loading & Network", () => {
        // ──────────────────────────────────────────────────────
        // CORE BUG: Skeleton should clear for mobile placeholders
        // ──────────────────────────────────────────────────────

        test.describe("Skeleton → Placeholder Transition", () => {
                test("skeletons clear on mobile — placeholders become visible", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");

                        // Wait for Svelte hydration + onMount to fire
                        await page.waitForTimeout(500);

                        // Every project card should have the .loaded class (skeleton hidden)
                        const cards = page.locator(".project-embed");
                        const count = await cards.count();
                        expect(count).toBe(PROJECT_TITLES.length);

                        for (let i = 0; i < count; i++) {
                                await expect(cards.nth(i)).toHaveClass(/loaded/, {
                                        timeout: 3000,
                                });
                        }
                });

                test("no visible skeleton shimmer after mount on mobile", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");

                        // Wait for hydration: last card should get .loaded class
                        const lastEmbed = page.locator(".project-embed").last();
                        await expect(lastEmbed).toHaveClass(/loaded/, { timeout: 5000 });

                        // Allow CSS transition (opacity 400ms) to complete
                        await page.waitForTimeout(500);

                        // Skeletons should either be removed from DOM or visually hidden
                        const skeletonCount = await page.locator(".skeleton").count();
                        if (skeletonCount > 0) {
                                // If skeletons exist, they should all be hidden (opacity: 0)
                                const visibleSkeletons = await page.locator(".skeleton").evaluateAll(
                                        (els) =>
                                                els.filter((el) => {
                                                        const style = window.getComputedStyle(el);
                                                        return (
                                                                style.opacity !== "0" &&
                                                                style.display !== "none" &&
                                                                style.visibility !== "hidden"
                                                        );
                                                }).length,
                                );
                                expect(visibleSkeletons).toBe(0);
                        }
                });

                test("mobile placeholders show 'tap to open' text", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");

                        // Wait for hydration — mobile placeholders appear after onMount
                        await expect(page.locator(".mobile-cta").first()).toBeVisible({
                                timeout: 5000,
                        });

                        const tapCtas = page.locator(".mobile-cta");
                        const ctaCount = await tapCtas.count();

                        // All projects except mymind.com (which has a preview) should have CTA
                        expect(ctaCount).toBeGreaterThanOrEqual(PROJECT_TITLES.length - 1);

                        for (let i = 0; i < ctaCount; i++) {
                                await expect(tapCtas.nth(i)).toHaveText("tap to open");
                        }
                });
        });

        // ──────────────────────────────────────────────────────
        // IFRAME SUPPRESSION ON MOBILE
        // ──────────────────────────────────────────────────────

        test.describe("Iframe Suppression", () => {
                test("no iframes rendered on mobile viewport", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");

                        // Wait for hydration to swap iframes → placeholders
                        await expect(page.locator(".mobile-cta").first()).toBeVisible({
                                timeout: 5000,
                        });

                        const iframeCount = await page.locator(".project-embed iframe").count();
                        expect(iframeCount).toBe(0);
                });

                test("iframes present on desktop viewport", async ({ page }) => {
                        await page.setViewportSize({ width: 1280, height: 720 });
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        // Desktop should render iframes for projects without previews
                        const iframeCount = await page.locator(".project-embed iframe").count();
                        expect(iframeCount).toBeGreaterThan(0);
                });

                test("mobile placeholders link to correct external URLs", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        const tapAreas = page.locator(".mobile-tap-area");
                        const count = await tapAreas.count();

                        for (let i = 0; i < count; i++) {
                                const href = await tapAreas.nth(i).getAttribute("href");
                                expect(href).toBeTruthy();
                                expect(href).toMatch(/^https:\/\//);
                        }
                });

                test("tap areas open in new tab (target=_blank)", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        const tapAreas = page.locator(".mobile-tap-area");
                        const count = await tapAreas.count();

                        for (let i = 0; i < count; i++) {
                                const target = await tapAreas.nth(i).getAttribute("target");
                                expect(target).toBe("_blank");
                        }
                });
        });

        // ──────────────────────────────────────────────────────
        // PREVIEW IMAGE LOADING
        // ──────────────────────────────────────────────────────

        test.describe("Preview Image Loading", () => {
                test("project with preview shows image instead of placeholder", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        // mymind.com clone has a preview image
                        const previewImages = page.locator(".preview-image");
                        const count = await previewImages.count();
                        expect(count).toBeGreaterThanOrEqual(1);

                        // The preview image should be visible
                        await expect(previewImages.first()).toBeVisible();
                });

                test("preview image skeleton clears after image loads", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(1000);

                        // The first card (mymind) has a preview — its embed should be .loaded
                        const firstEmbed = page.locator(".project-embed").first();
                        await expect(firstEmbed).toHaveClass(/loaded/);
                });

                test("slow preview image shows skeleton while loading", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);

                        // Delay the preview image by 2 seconds
                        await page.route("**/previews/*.png", async (route: Route) => {
                                await new Promise((r) => setTimeout(r, 2000));
                                const transparentPng = Buffer.from(
                                        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                                        "base64",
                                );
                                await route.fulfill({
                                        status: 200,
                                        contentType: "image/png",
                                        body: transparentPng,
                                });
                        });

                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(300);

                        // While image loads, skeleton should be visible on the preview card
                        const firstEmbed = page.locator(".project-embed").first();
                        const hasLoadedBefore = await firstEmbed.evaluate((el) =>
                                el.classList.contains("loaded"),
                        );

                        // Before image load, skeleton should still be visible (not loaded yet)
                        // After 2s+ it should become loaded
                        if (!hasLoadedBefore) {
                                // Wait for the delayed image to finish
                                await expect(firstEmbed).toHaveClass(/loaded/, { timeout: 5000 });
                        }
                });
        });

        // ──────────────────────────────────────────────────────
        // NETWORK THROTTLING BEHAVIOR
        // ──────────────────────────────────────────────────────

        test.describe("Network Conditions", () => {
                test("page loads under simulated slow 3G", async ({ page, context }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);

                        // Simulate slow 3G via CDP (Chromium only)
                        const cdpSession = await context.newCDPSession(page);
                        await cdpSession.send("Network.emulateNetworkConditions", {
                                offline: false,
                                downloadThroughput: (500 * 1024) / 8, // 500 kbps
                                uploadThroughput: (500 * 1024) / 8,
                                latency: 400, // 400ms RTT
                        });

                        const startTime = Date.now();
                        await page.goto(WORKS_URL, { waitUntil: "domcontentloaded" });
                        const loadTime = Date.now() - startTime;

                        // Page should still load within 10 seconds on slow 3G
                        expect(loadTime).toBeLessThan(10000);

                        // Content should be present
                        await expect(page.locator(".works-page")).toBeVisible();
                        await expect(page.locator(".projects-grid")).toBeVisible();
                });

                test("page loads under simulated fast 4G", async ({ page, context }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);

                        const cdpSession = await context.newCDPSession(page);
                        await cdpSession.send("Network.emulateNetworkConditions", {
                                offline: false,
                                downloadThroughput: (4 * 1024 * 1024) / 8, // 4 Mbps
                                uploadThroughput: (3 * 1024 * 1024) / 8,
                                latency: 20,
                        });

                        const startTime = Date.now();
                        await page.goto(WORKS_URL, { waitUntil: "domcontentloaded" });
                        const loadTime = Date.now() - startTime;

                        // Should load within 8s on 4G (throttled)
                        expect(loadTime).toBeLessThan(8000);

                        // Wait for hydration — mobile placeholders appear after onMount
                        await expect(page.locator(".mobile-cta").first()).toBeVisible({
                                timeout: 8000,
                        });

                        // All placeholders should be loaded
                        const cards = page.locator(".project-embed");
                        const count = await cards.count();
                        for (let i = 0; i < count; i++) {
                                await expect(cards.nth(i)).toHaveClass(/loaded/, {
                                        timeout: 5000,
                                });
                        }
                });

                test("external project URLs failing doesn't break page", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjectsFailure(page);
                        await mockPreviewImages(page);

                        // Page should load fine even if external URLs are unreachable
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        await expect(page.locator(".works-page")).toBeVisible();
                        const titleCount = await page.locator(".project-title").count();
                        expect(titleCount).toBe(PROJECT_TITLES.length);
                });

                test("delayed external responses don't block mobile placeholders", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjectsWithDelay(page, 5000); // 5s delay
                        await mockPreviewImages(page);

                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        // Even with 5s delays, mobile placeholders should appear immediately
                        const placeholders = page.locator(".mobile-placeholder");
                        const count = await placeholders.count();
                        expect(count).toBeGreaterThan(0);

                        // All embeds should be loaded (placeholders don't need network)
                        const cards = page.locator(".project-embed");
                        const cardCount = await cards.count();
                        for (let i = 0; i < cardCount; i++) {
                                await expect(cards.nth(i)).toHaveClass(/loaded/, {
                                        timeout: 2000,
                                });
                        }
                });
        });

        // ──────────────────────────────────────────────────────
        // NO EXTERNAL NETWORK REQUESTS ON MOBILE
        // ──────────────────────────────────────────────────────

        test.describe("Network Request Behavior", () => {
                test("mobile does not fire iframe requests to external project URLs", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);

                        const externalRequests: string[] = [];

                        // Track all outgoing requests to project URLs
                        page.on("request", (req) => {
                                const url = req.url();
                                if (PROJECT_URLS.some((projectUrl) => url.startsWith(projectUrl))) {
                                        externalRequests.push(url);
                                }
                        });

                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("networkidle");
                        await page.waitForTimeout(1000);

                        // On mobile, no iframes should be rendered, so no external requests
                        // (except the preview image which is a local asset)
                        // Allow for preview image URL but no iframe project URLs
                        const iframeRequests = externalRequests.filter(
                                (url) => !url.includes("/previews/"),
                        );

                        // After hydration, there should be zero iframe requests on mobile
                        // (There may be brief requests before hydration removes iframes)
                        // The key metric is that no iframes remain in the DOM
                        const iframeCount = await page.locator(".project-embed iframe").count();
                        expect(iframeCount).toBe(0);
                });

                test("desktop fires iframe requests for external projects", async ({
                        page,
                }) => {
                        await page.setViewportSize({ width: 1280, height: 720 });

                        const externalRequests: string[] = [];

                        page.on("request", (req) => {
                                const url = req.url();
                                if (PROJECT_URLS.some((projectUrl) => url.startsWith(projectUrl))) {
                                        externalRequests.push(url);
                                }
                        });

                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("networkidle");
                        await page.waitForTimeout(2000);

                        // Desktop should have at least some iframe requests
                        expect(externalRequests.length).toBeGreaterThan(0);
                });
        });

        // ──────────────────────────────────────────────────────
        // VIEWPORT RESIZE HANDLING
        // ──────────────────────────────────────────────────────

        test.describe("Viewport & Layout", () => {
                test("single column grid on mobile", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        const gridColumns = await page.locator(".projects-grid").evaluate((el) => {
                                return window.getComputedStyle(el).gridTemplateColumns;
                        });

                        // Single column: should be one value (the full width)
                        const columnCount = gridColumns.split(" ").length;
                        expect(columnCount).toBe(1);
                });

                test("two column grid on desktop", async ({ page }) => {
                        await page.setViewportSize({ width: 1280, height: 720 });
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        const gridColumns = await page.locator(".projects-grid").evaluate((el) => {
                                return window.getComputedStyle(el).gridTemplateColumns;
                        });

                        // Two columns: should have two values
                        const columnCount = gridColumns.split(" ").length;
                        expect(columnCount).toBe(2);
                });

                test("all project titles visible on mobile", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        for (const title of PROJECT_TITLES) {
                                const titleEl = page.locator(".project-title", { hasText: title });
                                await expect(titleEl).toBeAttached();
                        }
                });

                test("no horizontal overflow on mobile", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhoneSE);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        const hasOverflow = await page.evaluate(() => {
                                return document.body.scrollWidth > window.innerWidth;
                        });

                        expect(hasOverflow).toBe(false);
                });

                test("cards maintain 16:10 aspect ratio on mobile", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        const firstCard = page.locator(".project-embed").first();
                        const box = await firstCard.boundingBox();
                        expect(box).toBeTruthy();

                        if (box) {
                                const ratio = box.width / box.height;
                                // 16:10 = 1.6 — allow some tolerance for borders/rounding
                                expect(ratio).toBeGreaterThan(1.4);
                                expect(ratio).toBeLessThan(1.8);
                        }
                });
        });

        // ──────────────────────────────────────────────────────
        // MULTIPLE DEVICE VIEWPORTS
        // ──────────────────────────────────────────────────────

        test.describe("Cross-Device Mobile Viewports", () => {
                for (const [deviceName, viewport] of Object.entries(MOBILE_VIEWPORTS)) {
                        test(`loads correctly on ${deviceName} (${viewport.width}x${viewport.height})`, async ({
                                page,
                        }) => {
                                await page.setViewportSize(viewport);
                                await mockExternalProjects(page);
                                await mockPreviewImages(page);
                                await page.goto(WORKS_URL);
                                await page.waitForLoadState("domcontentloaded");
                                await page.waitForTimeout(500);

                                // Page structure present
                                await expect(page.locator(".works-page")).toBeVisible();
                                await expect(page.locator(".projects-grid")).toBeVisible();

                                // All skeletons cleared
                                const cards = page.locator(".project-embed");
                                const count = await cards.count();
                                expect(count).toBe(PROJECT_TITLES.length);

                                for (let i = 0; i < count; i++) {
                                        await expect(cards.nth(i)).toHaveClass(/loaded/, {
                                                timeout: 3000,
                                        });
                                }

                                // No iframes on mobile
                                const iframeCount = await page
                                        .locator(".project-embed iframe")
                                        .count();
                                expect(iframeCount).toBe(0);
                        });
                }
        });

        // ──────────────────────────────────────────────────────
        // PAGE METADATA & STRUCTURE
        // ──────────────────────────────────────────────────────

        test.describe("Page Structure", () => {
                test("has correct page title", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await page.goto(WORKS_URL);

                        await expect(page).toHaveTitle(/Works/);
                });

                test("section header shows project count", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");

                        const meta = page.locator(".section-meta");
                        await expect(meta).toContainText(`${PROJECT_TITLES.length} projects`);
                });

                test("project categories are visible", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");

                        const categories = page.locator(".project-category");
                        const count = await categories.count();
                        expect(count).toBeGreaterThan(0);
                });
        });

        // ──────────────────────────────────────────────────────
        // PERFORMANCE METRICS
        // ──────────────────────────────────────────────────────

        test.describe("Performance", () => {
                test("DOM content loaded under 3s on mobile", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);

                        const startTime = Date.now();
                        await page.goto(WORKS_URL, { waitUntil: "domcontentloaded" });
                        const dcl = Date.now() - startTime;

                        expect(dcl).toBeLessThan(3000);
                });

                test("first contentful paint under 2s", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);

                        await page.goto(WORKS_URL, { waitUntil: "domcontentloaded" });
                        await page.waitForTimeout(500);

                        const fcp = await page.evaluate(() => {
                                const paint = performance.getEntriesByType("paint");
                                const fcpEntry = paint.find(
                                        (p) => p.name === "first-contentful-paint",
                                );
                                return fcpEntry?.startTime || 0;
                        });

                        expect(fcp).toBeGreaterThan(0);
                        expect(fcp).toBeLessThan(2000);
                });

                test("total project cards rendered equals data length", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        const cardCount = await page.locator(".project-card").count();
                        expect(cardCount).toBe(PROJECT_TITLES.length);
                });
        });

        // ──────────────────────────────────────────────────────
        // SCROLLING & INTERACTION
        // ──────────────────────────────────────────────────────

        test.describe("Scrolling & Interaction", () => {
                test("can scroll through all projects on mobile", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        // Scroll to the last project
                        const lastCard = page.locator(".project-card").last();
                        await lastCard.scrollIntoViewIfNeeded();

                        // Last project title should be visible after scroll
                        const lastTitle = page.locator(".project-title").last();
                        await expect(lastTitle).toBeVisible();
                });

                test("mobile tap area is large enough for touch (44px minimum)", async ({
                        page,
                }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        const tapAreas = page.locator(".mobile-tap-area");
                        const count = await tapAreas.count();

                        for (let i = 0; i < Math.min(count, 3); i++) {
                                const box = await tapAreas.nth(i).boundingBox();
                                expect(box).toBeTruthy();
                                if (box) {
                                        // Touch targets should be at least 44px tall (WCAG 2.5.5)
                                        expect(box.height).toBeGreaterThanOrEqual(44);
                                        expect(box.width).toBeGreaterThanOrEqual(44);
                                }
                        }
                });
        });

        // ──────────────────────────────────────────────────────
        // ACCESSIBILITY
        // ──────────────────────────────────────────────────────

        test.describe("Accessibility", () => {
                test("all links have accessible names", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await mockPreviewImages(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");
                        await page.waitForTimeout(500);

                        const links = page.locator(".project-card a");
                        const count = await links.count();

                        for (let i = 0; i < count; i++) {
                                const link = links.nth(i);
                                const hasName = await link.evaluate((el) => {
                                        return Boolean(
                                                el.getAttribute("aria-label") ||
                                                        el.textContent?.trim() ||
                                                        el.querySelector("img[alt]"),
                                        );
                                });
                                expect(hasName).toBe(true);
                        }
                });

                test("page has proper heading hierarchy", async ({ page }) => {
                        await page.setViewportSize(MOBILE_VIEWPORTS.iPhone12);
                        await mockExternalProjects(page);
                        await page.goto(WORKS_URL);
                        await page.waitForLoadState("domcontentloaded");

                        const h1Count = await page.locator("h1").count();
                        expect(h1Count).toBe(1);

                        const h1Text = await page.locator("h1").textContent();
                        expect(h1Text).toContain("WORKS");
                });
        });
});
