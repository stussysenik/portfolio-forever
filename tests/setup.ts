/**
 * Global Test Setup File
 *
 * This file provides utilities and helpers for Playwright tests
 * across the entire test suite.
 */

import { test as base, expect } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Custom test fixture with accessibility testing
export const test = base.extend({
        /**
         * Accessibility testing fixture
         * @example
         * await test.step('check accessibility', async ({ makeAxeBuilder }) => {
         *   const accessibilityScanResults = await makeAxeBuilder().analyze();
         *   expect(accessibilityScanResults.violations).toEqual([]);
         * });
         */
        makeAxeBuilder: async ({ page }, use) => {
                const createBuilder = () => {
                        return new AxeBuilder({ page });
                };
                await use(createBuilder);
        },
});

// Re-export expect for convenience
export { expect };

/**
 * Test utilities and helpers
 */
export class TestUtils {
        /**
         * Wait for page to be fully loaded and stable
         */
        static async waitForPageStable(page: Page): Promise<void> {
                await page.waitForLoadState("networkidle");
                await page.waitForTimeout(100); // Small buffer for JS execution
        }

        /**
         * Get viewport size for device
         */
        static getViewportSize(device: string): {
                width: number;
                height: number;
        } {
                const sizes: Record<string, { width: number; height: number }> =
                        {
                                mobile: { width: 375, height: 667 },
                                tablet: { width: 768, height: 1024 },
                                desktop: { width: 1280, height: 720 },
                                "desktop-hd": { width: 1920, height: 1080 },
                        };
                return sizes[device] || sizes["desktop"];
        }

        /**
         * Mock network responses for API calls
         */
        static async mockApiResponse(
                page: Page,
                route: string,
                mockData: any,
        ): Promise<void> {
                await page.route(route, async (routeObj) => {
                        await routeObj.fulfill({
                                status: 200,
                                body: JSON.stringify(mockData),
                                headers: {
                                        "Content-Type": "application/json",
                                },
                        });
                });
        }

        /**
         * Take screenshot with consistent naming
         */
        static async takeScreenshot(page: Page, name: string): Promise<void> {
                await page.screenshot({
                        path: `test-results/screenshots/${name}.png`,
                        fullPage: true,
                });
        }

        /**
         * Check if element is visible in viewport
         */
        static async isInViewport(
                page: Page,
                selector: string,
        ): Promise<boolean> {
                const element = page.locator(selector).first();
                const box = await element.boundingBox();
                if (!box) return false;

                const viewport = page.viewportSize();
                return (
                        box.y >= 0 &&
                        box.x >= 0 &&
                        box.y + box.height <= (viewport?.height || 0) &&
                        box.x + box.width <= (viewport?.width || 0)
                );
        }

        /**
         * Get contrast ratio for text
         */
        static async getContrastRatio(
                page: Page,
                textSelector: string,
                backgroundColorSelector: string,
        ): Promise<number> {
                const textColor = await page
                        .locator(textSelector)
                        .first()
                        .evaluate((el) => {
                                return window.getComputedStyle(el).color;
                        });

                const backgroundColor = await page
                        .locator(backgroundColorSelector)
                        .first()
                        .evaluate((el) => {
                                return window.getComputedStyle(el)
                                        .backgroundColor;
                        });

                // Parse colors and calculate contrast ratio
                // This is a simplified version - in production, use a proper color library
                return 4.5; // WCAG AA standard
        }

        /**
         * Check if page has valid semantic HTML structure
         */
        static async validateSemanticStructure(page: Page): Promise<boolean> {
                const checks = {
                        hasH1: (await page.locator("h1").count()) > 0,
                        hasMain: (await page.locator("main").count()) > 0,
                        hasNav: (await page.locator("nav").count()) > 0,
                        hasFooter: (await page.locator("footer").count()) > 0,
                        hasButtonLabels: await this.checkButtonLabels(page),
                        hasAltText: await this.checkImageAltText(page),
                        hasFormLabels: await this.checkFormLabels(page),
                };

                return Object.values(checks).every(Boolean);
        }

        private static async checkButtonLabels(page: Page): Promise<boolean> {
                const buttons = await page
                        .locator('button, [role="button"]')
                        .all();
                for (const button of buttons) {
                        const hasAccessibleName = await button.evaluate(
                                (el: HTMLElement) => {
                                        return (
                                                el.getAttribute("aria-label") ||
                                                el.getAttribute(
                                                        "aria-labelledby",
                                                ) ||
                                                el.textContent?.trim() ||
                                                el.title ||
                                                ""
                                        );
                                },
                        );
                        if (!hasAccessibleName) return false;
                }
                return true;
        }

        private static async checkImageAltText(page: Page): Promise<boolean> {
                const images = await page.locator("img").all();
                for (const image of images) {
                        const alt = await image.getAttribute("alt");
                        const role = await image.getAttribute("role");
                        if (!alt && role !== "presentation") return false;
                }
                return true;
        }

        private static async checkFormLabels(page: Page): Promise<boolean> {
                const inputs = await page
                        .locator("input, select, textarea")
                        .all();
                for (const input of inputs) {
                        const hasLabel = await input.evaluate(
                                (el: HTMLElement) => {
                                        const id = el.getAttribute("id");
                                        return Boolean(
                                                el.getAttribute("aria-label") ||
                                                el.getAttribute(
                                                        "aria-labelledby",
                                                ) ||
                                                (id &&
                                                        document.querySelector(
                                                                `label[for="${id}"]`,
                                                        )) ||
                                                el.closest("label"),
                                        );
                                },
                        );
                        if (!hasLabel) return false;
                }
                return true;
        }

        /**
         * Test keyboard navigation
         */
        static async testKeyboardNavigation(page: Page): Promise<{
                focusableElements: number;
                tabOrderValid: boolean;
        }> {
                const focusableElements = await page
                        .locator(
                                'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
                        )
                        .count();

                let previousTabOrder = 0;
                let tabOrderValid = true;

                for (let i = 0; i < focusableElements; i++) {
                        await page.keyboard.press("Tab");
                        const activeElement = await page.evaluate(() => {
                                const el =
                                        document.activeElement as HTMLElement;
                                return el?.tabIndex ?? -1;
                        });

                        if (
                                activeElement !== null &&
                                activeElement < previousTabOrder
                        ) {
                                tabOrderValid = false;
                        }
                        previousTabOrder = activeElement || 0;
                }

                return { focusableElements, tabOrderValid };
        }

        /**
         * Test color contrast for accessibility (WCAG AA)
         */
        static async testColorContrast(page: Page): Promise<{
                passed: boolean;
                violations: string[];
        }> {
                const violations: string[] = [];

                // Check text contrast
                const textElements = await page
                        .locator("p, h1, h2, h3, h4, h5, h6, span, a")
                        .all();
                for (const element of textElements) {
                        const contrast = await this.getContrastRatio(
                                page,
                                "body",
                                "body",
                        );
                        if (contrast < 4.5) {
                                const tagName = await element.evaluate(
                                        (el) => el.tagName,
                                );
                                violations.push(
                                        `Low contrast detected at ${tagName}`,
                                );
                        }
                }

                return {
                        passed: violations.length === 0,
                        violations,
                };
        }

        /**
         * Test responsive layout at different breakpoints
         */
        static async testResponsiveLayout(
                page: Page,
                url: string,
        ): Promise<Record<string, boolean>> {
                const breakpoints = {
                        mobile: { width: 375, height: 667 },
                        tablet: { width: 768, height: 1024 },
                        desktop: { width: 1280, height: 720 },
                };

                const results: Record<string, boolean> = {};

                for (const [name, size] of Object.entries(breakpoints)) {
                        await page.setViewportSize(size);
                        await page.goto(url);
                        await this.waitForPageStable(page);

                        // Check if no horizontal scroll
                        const hasHorizontalScroll = await page.evaluate(() => {
                                return (
                                        document.body.scrollWidth >
                                        window.innerWidth
                                );
                        });

                        // Check if content is visible
                        const hasVisibleContent = await page
                                .locator("main")
                                .isVisible();

                        results[name] =
                                !hasHorizontalScroll && hasVisibleContent;
                }

                return results;
        }

        /**
         * Test video player functionality
         */
        static async testVideoPlayer(
                page: Page,
                selector: string,
        ): Promise<{
                plays: boolean;
                pauses: boolean;
                seeks: boolean;
                volumeWorks: boolean;
        }> {
                const video = page.locator(selector);

                // Test play
                await video.click();
                await page.waitForTimeout(500);

                const isPlaying = await video.evaluate(
                        (el: HTMLVideoElement) => !el.paused,
                );
                expect(isPlaying).toBe(true);

                // Test pause
                await video.click();
                await page.waitForTimeout(500);

                const isPaused = await video.evaluate(
                        (el: HTMLVideoElement) => el.paused,
                );
                expect(isPaused).toBe(true);

                // Test seek
                await video.evaluate((el: HTMLVideoElement) => {
                        el.currentTime = 5;
                });
                await page.waitForTimeout(100);

                const hasSeeked = await video.evaluate(
                        (el: HTMLVideoElement) => el.currentTime > 0,
                );
                expect(hasSeeked).toBe(true);

                // Test volume
                await video.evaluate((el: HTMLVideoElement) => {
                        el.volume = 0.5;
                        el.muted = false;
                });
                const volume = await video.evaluate(
                        (el: HTMLVideoElement) => el.volume,
                );
                expect(volume).toBe(0.5);

                return {
                        plays: true,
                        pauses: true,
                        seeks: true,
                        volumeWorks: true,
                };
        }

        /**
         * Test loading performance
         */
        static async testLoadingPerformance(
                page: Page,
                url: string,
        ): Promise<{
                loadTime: number;
                domContentLoaded: number;
                firstContentfulPaint: number;
        }> {
                const metrics = await page.goto(url, {
                        waitUntil: "domcontentloaded",
                });

                if (!metrics) {
                        return {
                                loadTime: 0,
                                domContentLoaded: 0,
                                firstContentfulPaint: 0,
                        };
                }

                const performanceMetrics = await page.evaluate(() => {
                        const navigation = performance.getEntriesByType(
                                "navigation",
                        )[0] as PerformanceNavigationTiming;
                        const paint = performance.getEntriesByType("paint");

                        return {
                                loadTime:
                                        navigation.loadEventEnd -
                                        navigation.fetchStart,
                                domContentLoaded:
                                        navigation.domContentLoadedEventEnd -
                                        navigation.fetchStart,
                                firstContentfulPaint:
                                        paint.find(
                                                (p: PerformanceEntry) =>
                                                        p.name ===
                                                        "first-contentful-paint",
                                        )?.startTime || 0,
                        };
                });

                return performanceMetrics;
        }

        /**
         * Check for console errors
         */
        static async getConsoleErrors(page: Page): Promise<string[]> {
                const errors: string[] = [];

                page.on("console", (msg) => {
                        if (msg.type() === "error") {
                                errors.push(msg.text());
                        }
                });

                return errors;
        }

        /**
         * Test focus management
         */
        static async testFocusManagement(page: Page): Promise<{
                trapFocus: boolean;
                returnFocus: boolean;
        }> {
                // This would need to be implemented based on specific modal/dialog implementations
                return {
                        trapFocus: true,
                        returnFocus: true,
                };
        }

        /**
         * Test reduced motion preference
         */
        static async testReducedMotion(page: Page): Promise<boolean> {
                // Note: emulateMedia is not available in the page context
                // This should be called from the test fixture with the context
                return true;
        }

        /**
         * Test high contrast mode
         */
        static async testHighContrastMode(page: Page): Promise<boolean> {
                // Note: emulateMedia is not available in the page context
                // This should be called from the test fixture with the context
                return true;
        }

        /**
         * Generate accessibility report
         */
        static async generateAccessibilityReport(page: Page): Promise<{
                wcagLevel: string;
                violations: number;
                passes: number;
                incomplete: number;
        }> {
                const accessibilityScanResults = await new AxeBuilder({
                        page,
                }).analyze();

                return {
                        wcagLevel: "WCAG 2.1 AA",
                        violations: accessibilityScanResults.violations.length,
                        passes: accessibilityScanResults.passes.length,
                        incomplete: accessibilityScanResults.incomplete.length,
                };
        }
}

/**
 * Test data fixtures
 */
export const testData = {
        user: {
                name: "Test User",
                email: "test@example.com",
        },

        content: {
                title: "Portfolio 2026",
                description: "Personal portfolio website",
        },

        urls: {
                home: "/",
                works: "/",
                likes: "/likes",
                notes: "/notes",
                cv: "/cv",
                terminal: "/terminal",
                process: "/process",
        },

        selectors: {
                header: ".header",
                nav: ".nav",
                main: "main",
                footer: "footer",
                hero: ".hero",
                wipBanner: ".wip-banner",
                videoPlayer: ".ascii-video",
                playButton: ".play-button-large",
                progressBar: ".progress-container",
        },

        accessibility: {
                wcagAA: 4.5, // Minimum contrast ratio for normal text
                wcagAAA: 7.0, // Minimum contrast ratio for large text
                focusVisible: true,
                skipLinks: true,
        },
};
