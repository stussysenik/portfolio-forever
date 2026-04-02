/**
 * Labs E2E Tests
 *
 * Tests for the Laboratory page at /labs.
 * Displays experimental projects as cards with status badges,
 * feature requirements, and launch links.
 */

import { test, expect } from '@playwright/test';

const LABS_URL = '/labs';

test.describe('Labs', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(LABS_URL);
		await page.waitForSelector('.labs-container', { timeout: 15000 });
	});

	test('Page Load — returns 200 and container visible', async ({ page }) => {
		const response = await page.goto(LABS_URL);
		expect(response?.status()).toBe(200);

		const container = page.locator('.labs-container');
		await expect(container).toBeVisible();
	});

	test('Header — title "Laboratory" and warning badge visible', async ({ page }) => {
		const header = page.locator('.labs-header');
		await expect(header).toBeVisible();

		const title = page.locator('.labs-title');
		await expect(title).toBeVisible();
		const titleText = await title.innerText();
		expect(titleText.toLowerCase()).toContain('laboratory');

		const warning = page.locator('.labs-warning');
		await expect(warning).toBeVisible();
		const warningText = await warning.innerText();
		expect(warningText.toUpperCase()).toContain('EXPERIMENTAL');
	});

	test('Feature Legend — legend nav visible with feature icons', async ({ page }) => {
		const legend = page.locator('.feature-legend');
		await expect(legend).toBeVisible();

		// Legend should contain feature icon elements
		const legendChildren = await legend.locator('*').count();
		expect(legendChildren).toBeGreaterThan(0);
	});

	test('Lab Cards — cards visible with title, description, status', async ({ page }) => {
		const cards = page.locator('.lab-card');
		const cardCount = await cards.count();

		if (cardCount === 0) {
			// No lab data loaded — skip gracefully
			test.skip(true, 'No lab cards found — data may not be loaded');
			return;
		}

		// Check the first card has essential elements
		const firstCard = cards.first();
		await expect(firstCard).toBeVisible();

		const cardTitle = firstCard.locator('.lab-title');
		await expect(cardTitle).toBeVisible();
		const titleText = await cardTitle.innerText();
		expect(titleText.length).toBeGreaterThan(0);

		const cardDescription = firstCard.locator('.lab-description');
		await expect(cardDescription).toBeVisible();

		const cardStatus = firstCard.locator('.lab-status');
		await expect(cardStatus).toBeVisible();
	});

	test('Status Badges — cards have status classes', async ({ page }) => {
		const cards = page.locator('.lab-card');
		const cardCount = await cards.count();

		if (cardCount === 0) {
			test.skip(true, 'No lab cards found');
			return;
		}

		// Collect all status badges
		const statusBadges = page.locator('.lab-status');
		const badgeCount = await statusBadges.count();
		expect(badgeCount).toBeGreaterThan(0);

		// Each status badge should have one of the valid status classes
		const validStatuses = ['status-stable', 'status-beta', 'status-experimental', 'status-archived'];
		for (let i = 0; i < badgeCount; i++) {
			const badge = statusBadges.nth(i);
			const classes = await badge.getAttribute('class');
			const hasValidStatus = validStatuses.some((s) => classes?.includes(s));
			expect(hasValidStatus).toBe(true);
		}
	});

	test('Feature Badges — cards show required feature badges', async ({ page }) => {
		const cards = page.locator('.lab-card');
		const cardCount = await cards.count();

		if (cardCount === 0) {
			test.skip(true, 'No lab cards found');
			return;
		}

		// At least some cards should have feature badges
		const featureBadges = page.locator('.feature-badge');
		const badgeCount = await featureBadges.count();

		// Feature badges may not exist on every card, but we check that if they do
		// they are rendered correctly
		if (badgeCount > 0) {
			const firstBadge = featureBadges.first();
			await expect(firstBadge).toBeVisible();
			const text = await firstBadge.innerText();
			expect(text.length).toBeGreaterThan(0);
		}
	});

	test('Launch Links — supported cards have launch links', async ({ page }) => {
		const cards = page.locator('.lab-card');
		const cardCount = await cards.count();

		if (cardCount === 0) {
			test.skip(true, 'No lab cards found');
			return;
		}

		// Filter out unsupported cards — supported ones should have a launch link
		const supportedCards = page.locator('.lab-card:not(.unsupported)');
		const supportedCount = await supportedCards.count();

		if (supportedCount > 0) {
			const launchLinks = supportedCards.first().locator('.lab-launch');
			const linkCount = await launchLinks.count();
			expect(linkCount).toBeGreaterThan(0);

			const firstLink = launchLinks.first();
			await expect(firstLink).toBeVisible();
			const href = await firstLink.getAttribute('href');
			expect(href).toBeTruthy();
		}
	});

	test('Compatibility Notice — section visible at bottom', async ({ page }) => {
		const notice = page.locator('.compatibility-notice');
		await expect(notice).toBeVisible({ timeout: 5000 });

		const noticeText = await notice.innerText();
		expect(noticeText.length).toBeGreaterThan(0);
	});
});
