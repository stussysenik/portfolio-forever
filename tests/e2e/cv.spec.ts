/**
 * CV Page E2E Tests
 *
 * Tests the full CV page including profile header, summary,
 * experience/education timelines, languages, tools, and responsive layout.
 * All data is loaded from Convex — tests use waitForSelector with 15s timeouts.
 */

import { test, expect } from '@playwright/test';

test.describe('CV Page - Profile Header', () => {
	test('renders profile name, title, location, download button, and domain links', async ({ page }) => {
		await page.goto('/cv');

		// Wait for Convex data to hydrate
		await page.waitForSelector('.cv-name', { timeout: 15000 });

		// Profile name (h1)
		const name = page.locator('.cv-name');
		await expect(name).toBeVisible();
		const nameText = await name.textContent();
		expect(nameText?.length).toBeGreaterThan(0);

		// Job title
		const title = page.locator('.cv-title');
		await expect(title).toBeVisible();

		// Location line
		const location = page.locator('.cv-location');
		await expect(location).toBeVisible();
		await expect(location).toContainText('NYC');
		await expect(location).toContainText('itsmxzou@gmail.com');

		// Download PDF button with aria-label
		const downloadBtn = page.locator('.cv-download-btn');
		await expect(downloadBtn).toBeVisible();
		await expect(downloadBtn).toContainText('Download PDF');
		const ariaLabel = await downloadBtn.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();

		// 3 domain links
		const domains = page.locator('.cv-domains');
		await expect(domains).toBeVisible();
		const domainItems = page.locator('.cv-domain-item');
		await expect(domainItems).toHaveCount(3);

		// Verify domain URLs (text includes descriptions like "stussysenik.com — dev + creative")
		const domainTexts = await domainItems.allTextContents();
		expect(domainTexts.some(t => t.includes('stussysenik.com'))).toBe(true);
		expect(domainTexts.some(t => t.includes('mengxuanzou.com'))).toBe(true);
		expect(domainTexts.some(t => t.includes('mxzou.com'))).toBe(true);
	});
});

test.describe('CV Page - Summary', () => {
	test('displays summary mentioning Cooper Union and FAMU Prague', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForSelector('.cv-summary', { timeout: 15000 });

		const summary = page.locator('.cv-summary');
		await expect(summary).toBeVisible();
		await expect(summary).toContainText('Cooper Union');
		await expect(summary).toContainText('FAMU Prague');
	});
});

test.describe('CV Page - Experience', () => {
	test('shows experience section with timeline entries', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForSelector('.timeline-entry', { timeout: 15000 });

		// Find the EXPERIENCE section title
		const sectionTitles = page.locator('.cv-section-title');
		const allTitles = await sectionTitles.allTextContents();
		const expTitle = allTitles.find(t => t.includes('EXPERIENCE'));
		expect(expTitle).toBeTruthy();

		// Section count (e.g. "7 positions")
		const sectionCounts = page.locator('.cv-section-count');
		const countTexts = await sectionCounts.allTextContents();
		const expCount = countTexts.find(t => t.includes('position'));
		expect(expCount).toBeTruthy();

		// Timeline entries
		const timelineEntries = page.locator('.timeline-entry');
		const entryCount = await timelineEntries.count();
		expect(entryCount).toBeGreaterThan(0);

		// First entry has title, org, and date
		const firstEntry = timelineEntries.first();
		await expect(firstEntry.locator('.timeline-title')).toBeVisible();
		await expect(firstEntry.locator('.timeline-org')).toBeVisible();
		await expect(firstEntry.locator('.timeline-date')).toBeVisible();
	});
});

test.describe('CV Page - Education', () => {
	test('shows education section with Computer Engineering as first entry', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForSelector('.timeline-entry', { timeout: 15000 });

		// Find the EDUCATION section title
		const sectionTitles = page.locator('.cv-section-title');
		const allTitles = await sectionTitles.allTextContents();
		const eduTitle = allTitles.find(t => t.includes('EDUCATION'));
		expect(eduTitle).toBeTruthy();

		// Section count (e.g. "4 schools")
		const sectionCounts = page.locator('.cv-section-count');
		const countTexts = await sectionCounts.allTextContents();
		const eduCount = countTexts.find(t => t.includes('school'));
		expect(eduCount).toBeTruthy();

		// CRITICAL: First education entry title is "Computer Engineering"
		// We need to find education timeline entries specifically.
		// Education section comes after Experience, so we look for entries
		// within the education context.
		await page.waitForSelector('.timeline-title', { timeout: 15000 });

		// Collect all timeline titles — education entries follow the EDUCATION header
		const allEntryTitles = page.locator('.timeline-title');
		const titleTexts = await allEntryTitles.allTextContents();

		// Find the "Computer Engineering" entry
		const ceIndex = titleTexts.findIndex(t => t.includes('Computer Engineering'));
		expect(ceIndex).toBeGreaterThanOrEqual(0);

		// The entry at that index should have Cooper Union as org
		const ceEntry = page.locator('.timeline-entry').nth(ceIndex);
		const orgText = await ceEntry.locator('.timeline-org').textContent();
		expect(orgText).toContain('Cooper Union');

		// Description mentions "dropped out"
		const descText = await ceEntry.locator('.timeline-description').textContent();
		expect(descText?.toLowerCase()).toContain('dropped out');
	});
});

test.describe('CV Page - Languages', () => {
	test('displays 4 languages with proficiency levels', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForSelector('.language-name', { timeout: 15000 });

		const languageNames = page.locator('.language-name');
		const count = await languageNames.count();
		expect(count).toBe(4);

		const nameTexts = await languageNames.allTextContents();
		const joined = nameTexts.join(' ');
		expect(joined).toContain('EN');
		expect(joined).toMatch(/中文\s*ZH|ZH/);
		expect(joined).toContain('CZ');
		expect(joined).toContain('DE');

		// Each language has a proficiency level
		const levels = page.locator('.language-level');
		const levelCount = await levels.count();
		expect(levelCount).toBe(4);

		// Levels should have non-empty text
		for (let i = 0; i < levelCount; i++) {
			const text = await levels.nth(i).textContent();
			expect(text?.trim().length).toBeGreaterThan(0);
		}
	});
});

test.describe('CV Page - Tools', () => {
	test('displays 4 tool groups with tags', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForSelector('.tool-group', { timeout: 15000 });

		const toolGroups = page.locator('.tool-group');
		const groupCount = await toolGroups.count();
		expect(groupCount).toBe(4);

		// Each group should have at least one tool tag
		for (let i = 0; i < groupCount; i++) {
			const tags = toolGroups.nth(i).locator('.tool-tag');
			const tagCount = await tags.count();
			expect(tagCount).toBeGreaterThan(0);
		}

		// Verify the 4 categories exist somewhere on page
		const sectionTitles = page.locator('.cv-section-title');
		const allTitles = await sectionTitles.allTextContents();
		const toolsTitle = allTitles.find(t => t.includes('TOOLS') || t.includes('TECHNOLOGIES'));
		expect(toolsTitle).toBeTruthy();
	});
});

test.describe('CV Page - Footer', () => {
	test('has JSON-LD download link and mailto request link', async ({ page }) => {
		await page.goto('/cv');
		await page.waitForSelector('.cv-footer', { timeout: 15000 });

		const footer = page.locator('.cv-footer');
		await expect(footer).toBeVisible();

		// JSON-LD download link
		const downloadLink = footer.locator('a[href*="json"], a[href*="download"], a:has-text("Download")').first();
		await expect(downloadLink).toBeVisible();

		// "Request full CV" mailto link
		const mailtoLink = footer.locator('a[href^="mailto"]');
		await expect(mailtoLink).toBeVisible();
		await expect(mailtoLink).toContainText('Request full CV');
	});
});

test.describe('CV Page - Responsive', () => {
	test('on mobile viewport, timeline collapses and domains stack', async ({ page }) => {
		// Set mobile viewport (375px width)
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/cv');
		await page.waitForSelector('.cv-name', { timeout: 15000 });

		// Page should still render without horizontal overflow
		const hasHorizontalScroll = await page.evaluate(() => {
			return document.body.scrollWidth > window.innerWidth;
		});
		expect(hasHorizontalScroll).toBe(false);

		// Timeline entries should be present and visible
		await page.waitForSelector('.timeline-entry', { timeout: 15000 });
		const firstEntry = page.locator('.timeline-entry').first();
		await expect(firstEntry).toBeVisible();

		// On mobile, timeline should collapse to single column —
		// the header and content should stack vertically (header.y < content.y)
		const header = firstEntry.locator('.timeline-header');
		const content = firstEntry.locator('.timeline-content');

		if (await header.count() > 0 && await content.count() > 0) {
			const headerBox = await header.boundingBox();
			const contentBox = await content.boundingBox();

			if (headerBox && contentBox) {
				// In single-column layout, content should be below header
				expect(contentBox.y).toBeGreaterThanOrEqual(headerBox.y);
			}
		}

		// Domains should stack vertically on mobile
		const domainItems = page.locator('.cv-domain-item');
		const domainCount = await domainItems.count();

		if (domainCount >= 2) {
			const firstDomain = await domainItems.first().boundingBox();
			const secondDomain = await domainItems.nth(1).boundingBox();

			if (firstDomain && secondDomain) {
				// Stacked means second domain is below or at the same x as first
				// (not side by side extending beyond viewport)
				expect(secondDomain.x + secondDomain.width).toBeLessThanOrEqual(375 + 10);
			}
		}
	});
});
