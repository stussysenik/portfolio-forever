import { test, expect } from '@playwright/test';
import { HomePage } from './pageObjects/HomePage';

test.describe('Control Theory - Evidence Engine Validation', () => {

    test('Screen-Pass Mode (5-min) hides verbose archival data', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();

        // Screen-pass must display the Hero Positioning
        await expect(homePage.heroPositioningBlock).toBeVisible();

        // Screen-pass must display ONLY Flagship Shipments (Attendu & Claude Code)
        await expect(homePage.flagshipShipments).toBeVisible();

        // It must NOT display the "ALL WORKS" and detailed domains archival dump
        // Assuming by default $isScreenPass is true or layout natively hides it.
        // Our new layout restricts ALL WORKS unless !$isScreenPass
        await expect(homePage.customArchiveWorks).not.toBeVisible();
    });

});
