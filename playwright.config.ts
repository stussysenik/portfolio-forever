import { defineConfig, devices } from "@playwright/test";
const config = defineConfig({
	testDir: "./tests/astro",
	testMatch: /.*\.spec\.ts/,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
	use: {
		baseURL: "http://127.0.0.1:4321",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "bun run dev",
		url: "http://127.0.0.1:4321",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
	outputDir: "test-results",
	expect: {
		timeout: 5 * 1000,
	},
});

export default config;
