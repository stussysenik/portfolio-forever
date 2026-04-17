/// <reference types="cypress" />
import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		baseUrl: 'http://portfolio.localhost:1355',
		supportFile: 'cypress/support/e2e.ts',
		video: false,
		screenshotOnRunFailure: true,
	},
});
