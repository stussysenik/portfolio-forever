/// <reference types="cypress" />
import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://127.0.0.1:4321",
		supportFile: "cypress/support/e2e.ts",
		specPattern: "cypress/e2e/astro/**/*.cy.ts",
		video: false,
		screenshotOnRunFailure: true,
	},
});
