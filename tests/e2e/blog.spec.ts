/**
 * Blog E2E Tests
 *
 * Tests the blog listing page (/blog) and individual blog post pages (/blog/[slug]).
 * Covers page load, note cards, view toggle, tag filters, subscribe links,
 * valid/invalid slugs, and navigation flow.
 * All data is loaded from Convex — tests use waitForSelector with 15s timeouts.
 */

import { test, expect } from '@playwright/test';

test.describe('Blog Listing - Page Load', () => {
	test('loads /blog with title and entry count', async ({ page }) => {
		await page.goto('/blog');
		await page.waitForSelector('.page-title', { timeout: 15000 });

		// Title should be "Short notes"
		const title = page.locator('.page-title');
		await expect(title).toBeVisible();
		await expect(title).toContainText('Short notes');

		// Entry count should be visible
		const count = page.locator('.header-count');
		await expect(count).toBeVisible();
		const countText = await count.textContent();
		expect(countText?.trim().length).toBeGreaterThan(0);
	});
});

test.describe('Blog Listing - Note Cards', () => {
	test('cards have date, title, excerpt, and CTA — or empty state shows', async ({ page }) => {
		await page.goto('/blog');
		await page.waitForSelector('.page-title', { timeout: 15000 });

		// Wait a moment for Convex data to load
		await page.waitForTimeout(2000);

		const cards = page.locator('.note-card');
		const cardCount = await cards.count();

		if (cardCount > 0) {
			// First card should have date, title, excerpt, and CTA
			const firstCard = cards.first();
			await expect(firstCard).toBeVisible();

			const date = firstCard.locator('.note-date');
			await expect(date).toBeVisible();

			const noteTitle = firstCard.locator('.note-title');
			await expect(noteTitle).toBeVisible();
			const titleText = await noteTitle.textContent();
			expect(titleText?.trim().length).toBeGreaterThan(0);

			const excerpt = firstCard.locator('.note-excerpt');
			await expect(excerpt).toBeVisible();

			const cta = firstCard.locator('.note-cta');
			await expect(cta).toBeVisible();
			await expect(cta).toContainText('read');
		} else {
			// Empty state
			const emptyMessage = page.locator('.empty-state .empty-message');
			await expect(emptyMessage).toBeVisible();
		}
	});
});

test.describe('Blog Listing - View Toggle', () => {
	test('switches between list and grid views', async ({ page }) => {
		await page.goto('/blog');
		await page.waitForSelector('.page-title', { timeout: 15000 });

		// Wait for Convex data to load
		await page.waitForTimeout(2000);

		const toggleButtons = page.locator('.view-toggle .toggle-btn');
		const toggleCount = await toggleButtons.count();

		// Skip test if no toggle buttons
		if (toggleCount < 2) {
			test.skip(true, 'No toggle buttons found');
			return;
		}

		// Skip if no posts — the notes-list/notes-grid section only renders when posts exist
		const cards = page.locator('.note-card');
		const cardCount = await cards.count();
		if (cardCount === 0) {
			test.skip(true, 'No blog posts loaded — view toggle has no effect without posts');
			return;
		}

		// Click grid view toggle
		const gridBtn = page.locator('.view-toggle .toggle-btn[aria-label="Grid view"]');
		if (await gridBtn.count() > 0) {
			await gridBtn.click();
			await page.waitForTimeout(300);

			// notes-grid is a class added to the notes-list section
			const grid = page.locator('.notes-grid');
			await expect(grid).toBeVisible();
		}

		// Click list view toggle
		const listBtn = page.locator('.view-toggle .toggle-btn[aria-label="List view"]');
		if (await listBtn.count() > 0) {
			await listBtn.click();
			await page.waitForTimeout(300);

			const list = page.locator('.notes-list');
			await expect(list).toBeVisible();
		}
	});
});

test.describe('Blog Listing - Tag Filters', () => {
	test('filter buttons work and clear resets', async ({ page }) => {
		await page.goto('/blog');
		await page.waitForSelector('.page-title', { timeout: 15000 });

		// Wait for potential tag filters to load
		await page.waitForTimeout(2000);

		const filterTags = page.locator('.page-footer .filter-tag');
		const tagCount = await filterTags.count();

		if (tagCount === 0) {
			// No tags available — skip gracefully
			test.skip();
			return;
		}

		// Get initial card count
		const initialCards = await page.locator('.note-card').count();

		// Click first filter tag
		const firstTag = filterTags.first();
		await firstTag.click();
		await page.waitForTimeout(500);

		// The clicked tag should become active
		await expect(firstTag).toHaveClass(/active/);

		// Card count may change (filtered)
		const filteredCards = await page.locator('.note-card').count();
		expect(filteredCards).toBeGreaterThanOrEqual(0);

		// Click clear button to reset
		const clearBtn = page.locator('.tag-clear');
		if (await clearBtn.count() > 0) {
			await clearBtn.click();
			await page.waitForTimeout(500);

			// Cards should return to initial count
			const resetCards = await page.locator('.note-card').count();
			expect(resetCards).toBe(initialCards);
		}
	});
});

test.describe('Blog Listing - Subscribe Links', () => {
	test('RSS and JSON subscribe links are visible', async ({ page }) => {
		await page.goto('/blog');
		await page.waitForSelector('.page-title', { timeout: 15000 });

		const subscribeLinks = page.locator('.subscribe-link');
		const linkCount = await subscribeLinks.count();
		expect(linkCount).toBeGreaterThanOrEqual(1);

		// Check that at least RSS or JSON link text is present
		const allText = await subscribeLinks.allTextContents();
		const joined = allText.join(' ').toLowerCase();
		expect(joined.includes('rss') || joined.includes('json')).toBe(true);
	});
});

test.describe('Blog Slug - Valid Post', () => {
	test('navigates to a post and shows article content', async ({ page }) => {
		await page.goto('/blog');
		await page.waitForSelector('.page-title', { timeout: 15000 });

		// Wait for note cards to load
		await page.waitForTimeout(2000);

		const cards = page.locator('.note-card');
		const cardCount = await cards.count();

		if (cardCount === 0) {
			test.skip();
			return;
		}

		// Click first note card (it's an <a> tag)
		const firstCard = cards.first();
		const href = await firstCard.getAttribute('href');
		expect(href).toBeTruthy();

		await firstCard.click();
		await page.waitForSelector('.note-article', { timeout: 15000 });

		// Article title should be visible
		const articleTitle = page.locator('.article-title');
		await expect(articleTitle).toBeVisible();
		const titleText = await articleTitle.textContent();
		expect(titleText?.trim().length).toBeGreaterThan(0);

		// Article date should be visible
		const articleDate = page.locator('.article-date');
		await expect(articleDate).toBeVisible();

		// Breadcrumb back link should exist
		const breadcrumb = page.locator('.breadcrumb a');
		await expect(breadcrumb).toBeVisible();
		await expect(breadcrumb).toContainText('blog');
	});
});

test.describe('Blog Slug - Invalid Slug', () => {
	test('shows not-found state for nonexistent post', async ({ page }) => {
		await page.goto('/blog/this-does-not-exist-xyz');

		// Wait for page to render
		await page.waitForSelector('.not-found', { timeout: 15000 });

		const notFound = page.locator('.not-found');
		await expect(notFound).toBeVisible();
	});
});

test.describe('Blog - Navigation Flow', () => {
	test('navigates from listing to post and back via breadcrumb', async ({ page }) => {
		await page.goto('/blog');
		await page.waitForSelector('.page-title', { timeout: 15000 });

		// Wait for cards
		await page.waitForTimeout(2000);

		const cards = page.locator('.note-card');
		const cardCount = await cards.count();

		if (cardCount === 0) {
			test.skip();
			return;
		}

		// Navigate to first post
		await cards.first().click();
		await page.waitForSelector('.note-article', { timeout: 15000 });

		// Verify we are on a post page
		await expect(page.locator('.article-title')).toBeVisible();

		// Click breadcrumb to go back
		const breadcrumb = page.locator('.breadcrumb a');
		await expect(breadcrumb).toBeVisible();
		await breadcrumb.click();

		// Should be back on the blog listing
		await page.waitForSelector('.page-title', { timeout: 15000 });
		await expect(page.locator('.page-title')).toContainText('Short notes');

		// URL should be /blog
		await expect(page).toHaveURL(/\/blog\/?$/);
	});
});
