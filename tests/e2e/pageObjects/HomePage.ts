import { type Page, type Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly heroPositioningBlock: Locator;
    readonly flagshipShipments: Locator;
    readonly customArchiveWorks: Locator;

    // We target data-testid or strong structural classes
    constructor(page: Page) {
        this.page = page;
        this.heroPositioningBlock = page.locator('header.hero-evidence');
        this.flagshipShipments = page.locator('.page-sections .section.pt-xl');
        this.customArchiveWorks = page.locator('.page-sections .section:not(.pt-xl)');
    }

    async goto() {
        await this.page.goto('/');
    }

    // A helper method if we actually hooked up the UI slider
    // Right now, since we only wrote the visual blocks and stores,
    // the system defaults to "Screen Pass" (5 mins) natively due to layout rewrite.
    async selectDepth(depth: '5-min' | '15-min' | 'full') {
        // Trigger a custom event on window or mock store if needed.
        // For testing the structural changes:
        await this.page.evaluate((d) => {
            // Dispatch a mock control signal since Playwright tests from the outside
            window.dispatchEvent(new CustomEvent('setDepth', { detail: d }));
        }, depth);
    }
}
