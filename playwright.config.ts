import { defineConfig, devices } from "@playwright/test";
import type { PlaywrightTestConfig } from "@playwright/test";

/**
 * Playwright Configuration for Portfolio 2026
 *
 * This configuration supports:
 * - E2E testing with SvelteKit dev server
 * - Visual regression testing
 * - Accessibility testing (axe-core)
 * - Responsive design testing
 * - Mobile device emulation
 * - Cross-browser testing
 *
 * Test Structure:
 * tests/
 *   ├── e2e/              # End-to-end tests
 *   ├── accessibility/    # Accessibility tests
 *   ├── responsive/       # Responsive design tests
 *   └── visual/          # Visual regression tests
 */

const config: PlaywrightTestConfig = defineConfig({
        // Test directory
        testDir: "./tests",

        // Run tests in files in parallel
        fullyParallel: true,

        // Fail the build on CI if you accidentally left test.only in the source code
        forbidOnly: !!process.env.CI,

        // Retry on CI only
        retries: process.env.CI ? 2 : 0,

        // Opt out of parallel tests on CI
        workers: process.env.CI ? 1 : undefined,

        // Reporter to use
        reporter: [
                [
                        "html",
                        {
                                outputFolder: "playwright-report",
                                open: "never", // Set to 'always' to auto-open after tests
                        },
                ],
                ["json", { outputFile: "test-results/results.json" }],
                ["junit", { outputFile: "test-results/junit.xml" }],
                ["list"],
        ],

        // Shared settings for all tests
        use: {
                // Base URL to use in actions like `await page.goto('/')`
                baseURL: "http://localhost:3000",

                // Collect trace when retrying the failed test
                trace: "on-first-retry",

                // Screenshot on failure
                screenshot: "only-on-failure",

                // Video on failure
                video: "retain-on-failure",

                // Action timeout
                actionTimeout: 10 * 1000,

                // Navigation timeout
                navigationTimeout: 30 * 1000,

                // Ignore HTTPS errors for local dev
                ignoreHTTPSErrors: true,
        },

        // Configure projects for major browsers and mobile devices
        projects: [
                {
                        name: "chromium",
                        use: { ...devices["Desktop Chrome"] },
                },

                {
                        name: "firefox",
                        use: { ...devices["Desktop Firefox"] },
                },

                {
                        name: "webkit",
                        use: { ...devices["Desktop Safari"] },
                },

                // Test against mobile viewports
                {
                        name: "Mobile Chrome",
                        use: { ...devices["Pixel 5"] },
                },
                {
                        name: "Mobile Safari",
                        use: { ...devices["iPhone 12"] },
                },

                // Test against tablet viewports
                {
                        name: "Tablet",
                        use: { ...devices["iPad Pro"] },
                },

                // Visual regression project
                {
                        name: "visual-regression",
                        use: {
                                ...devices["Desktop Chrome"],
                                viewport: { width: 1280, height: 720 },
                        },
                        testMatch: /visual\/.*\.spec\.ts/,
                },

                // Accessibility testing project
                {
                        name: "accessibility",
                        use: {
                                ...devices["Desktop Chrome"],
                        },
                        testMatch: /accessibility\/.*\.spec\.ts/,
                },

                // Responsive design testing
                {
                        name: "responsive-mobile",
                        use: {
                                ...devices["iPhone SE"],
                        },
                        testMatch: /responsive\/mobile\/.*\.spec\.ts/,
                },
                {
                        name: "responsive-tablet",
                        use: {
                                ...devices["iPad Mini"],
                        },
                        testMatch: /responsive\/tablet\/.*\.spec\.ts/,
                },
                {
                        name: "responsive-desktop",
                        use: {
                                ...devices["Desktop HiDPI"],
                        },
                        testMatch: /responsive\/desktop\/.*\.spec\.ts/,
                },

                // Dark mode testing
                {
                        name: "dark-mode",
                        use: {
                                ...devices["Desktop Chrome"],
                        },
                        testMatch: /dark-mode\/.*\.spec\.ts/,
                },

                // Reduced motion testing (accessibility)
                {
                        name: "reduced-motion",
                        use: {
                                ...devices["Desktop Chrome"],
                        },
                        testMatch: /accessibility\/reduced-motion\/.*\.spec\.ts/,
                },
        ],

        // Run your local dev server before starting the tests
        // NOTE: Web server is disabled - assume dev server is already running
        // webServer: {
        //         command: "bun run dev",
        //         url: "http://localhost:3000",
        //         reuseExistingServer: true,
        //         timeout: 120 * 1000,
        //         // Wait for server to be ready
        //         stdout: "pipe",
        //         stderr: "pipe",
        // },

        // Output folder for test artifacts
        outputDir: "test-results",

        // Global setup file (if needed)
        // globalSetup: require.resolve('./tests/global-setup.ts'),

        // Global teardown file (if needed)
        // globalTeardown: require.resolve('./tests/global-teardown.ts'),

        // Expect configuration for better assertions
        expect: {
                // Timeout for expect() assertions
                timeout: 5 * 1000,

                // Visual comparison options
                toHaveScreenshot: {
                        maxDiffPixels: 100,
                        threshold: 0.2,
                        animations: "disabled",
                },

                // Snapshot options
                toMatchSnapshot: {
                        maxDiffPixels: 100,
                        threshold: 0.2,
                },
        },

        // Metadata
        metadata: {
                project: "Portfolio 2026",
                version: "0.0.1",
                environment: process.env.NODE_ENV || "development",
        },
});

export default config;
