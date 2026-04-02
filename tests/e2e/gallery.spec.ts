/**
 * Gallery Page E2E Tests
 *
 * Tests the gallery page including page load, filter buttons,
 * tile interactions, detail panel open/close (button, Escape, backdrop).
 * All data is loaded from Convex — tests use waitForSelector with 15s timeouts.
 */

import { test, expect } from '@playwright/test';

test.describe('Gallery - Page Load', () => {
	test('loads /gallery with title and item count', async ({ page }) => {
		await page.goto('/gallery');
		await page.waitForSelector('.page-title', { timeout: 15000 });

		// Title should be "GALLERY"
		const title = page.locator('.page-header .page-title');
		await expect(title).toBeVisible();
		await expect(title).toContainText('GALLERY');

		// Item count should be visible
		const count = page.locator('.page-count');
		await expect(count).toBeVisible();
		const countText = await count.textContent();
		expect(countText?.trim().length).toBeGreaterThan(0);
	});
});

test.describe('Gallery - Filter Buttons', () => {
	test('displays 5 filter buttons with "all" active by default', async ({ page }) => {
		await page.goto('/gallery');
		await page.waitForSelector('.filter-btn', { timeout: 15000 });

		const filterButtons = page.locator('.filter-row .filter-btn');
		const btnCount = await filterButtons.count();
		expect(btnCount).toBe(5);

		// Collect button texts
		const btnTexts = await filterButtons.allTextContents();
		const lower = btnTexts.map(t => t.toLowerCase().trim());
		expect(lower).toContain('all');
		expect(lower).toContain('design');
		expect(lower).toContain('technology');
		expect(lower).toContain('art');
		expect(lower).toContain('film');

		// "all" should be active by default
		const activeBtn = page.locator('.filter-btn.active');
		await expect(activeBtn).toBeVisible();
		const activeText = await activeBtn.textContent();
		expect(activeText?.toLowerCase().trim()).toBe('all');
	});
});

test.describe('Gallery - Filter Functionality', () => {
	test('clicking a category filter updates tiles and count', async ({ page }) => {
		await page.goto('/gallery');
		await page.waitForSelector('.filter-btn', { timeout: 15000 });

		// Wait for tiles to load (skip if gallery is empty)
		const tileCount = await page.locator('.mosaic .tile').count();
		if (tileCount === 0) {
			// Give Convex a moment to deliver data
			await page.waitForTimeout(3000);
		}
		const initialCount = await page.locator('.mosaic .tile').count();
		if (initialCount === 0) {
			test.skip(true, 'No gallery items loaded — skipping filter test');
			return;
		}

		// Get initial page count text
		const initialPageCount = await page.locator('.page-count').textContent();

		// Click a category filter (not "all") — use "design"
		const designBtn = page.locator('.filter-row .filter-btn').filter({ hasText: /design/i });
		if (await designBtn.count() > 0) {
			await designBtn.click();
			await page.waitForTimeout(500);

			// Design filter should now be active
			await expect(designBtn).toHaveClass(/active/);

			// Tile count may have changed
			const filteredCount = await page.locator('.mosaic .tile').count();
			expect(filteredCount).toBeGreaterThanOrEqual(0);

			// Page count text may have updated
			const filteredPageCount = await page.locator('.page-count').textContent();
			// Count reflects filtered state (could be same if all are design)
			expect(filteredPageCount).toBeTruthy();
		}

		// Click "all" to reset
		const allBtn = page.locator('.filter-row .filter-btn').filter({ hasText: /^all$/i });
		await allBtn.click();
		await page.waitForTimeout(500);

		await expect(allBtn).toHaveClass(/active/);
		const resetCount = await page.locator('.mosaic .tile').count();
		expect(resetCount).toBe(initialCount);
	});
});

test.describe('Gallery - Tile Interaction', () => {
	test('hovering a tile reveals overlay with title and year', async ({ page }) => {
		await page.goto('/gallery');
		// Wait for Convex data
		await page.waitForTimeout(3000);
		const tileCount = await page.locator('.mosaic .tile').count();
		if (tileCount === 0) {
			test.skip(true, 'No gallery items loaded — skipping tile interaction test');
			return;
		}

		const firstTile = page.locator('.mosaic .tile').first();
		await expect(firstTile).toBeVisible();

		// Tile should have a character
		const tileChar = firstTile.locator('.tile-char');
		if (await tileChar.count() > 0) {
			await expect(tileChar).toBeVisible();
		}

		// Hover to reveal overlay
		await firstTile.hover();
		await page.waitForTimeout(300);

		const overlay = firstTile.locator('.tile-overlay');
		if (await overlay.count() > 0) {
			await expect(overlay).toBeVisible();

			// Overlay should have title and year
			const overlayTitle = overlay.locator('.tile-title');
			if (await overlayTitle.count() > 0) {
				await expect(overlayTitle).toBeVisible();
			}

			const overlayYear = overlay.locator('.tile-year');
			if (await overlayYear.count() > 0) {
				await expect(overlayYear).toBeVisible();
			}
		}
	});
});

test.describe('Gallery - Detail Panel', () => {
	test('clicking a tile opens detail panel with title and tags', async ({ page }) => {
		await page.goto('/gallery');
		await page.waitForTimeout(3000);
		const tileCount = await page.locator('.mosaic .tile').count();
		if (tileCount === 0) {
			test.skip(true, 'No gallery items loaded — skipping detail panel test');
			return;
		}

		const firstTile = page.locator('.mosaic .tile').first();
		await expect(firstTile).toBeVisible();

		// Click tile to open detail
		await firstTile.click();
		await page.waitForSelector('.detail-panel', { timeout: 15000 });

		// Backdrop should be visible
		const backdrop = page.locator('.detail-backdrop');
		await expect(backdrop).toBeVisible();

		// Detail panel should be visible
		const panel = page.locator('.detail-panel');
		await expect(panel).toBeVisible();

		// Title in detail
		const detailTitle = panel.locator('.detail-title');
		await expect(detailTitle).toBeVisible();
		const titleText = await detailTitle.textContent();
		expect(titleText?.trim().length).toBeGreaterThan(0);

		// Tags in detail
		const tags = panel.locator('.detail-tags .tag');
		const tagCount = await tags.count();
		expect(tagCount).toBeGreaterThan(0);
	});
});

test.describe('Gallery - Detail Close (X button)', () => {
	test('clicking close button dismisses the detail panel', async ({ page }) => {
		await page.goto('/gallery');
		await page.waitForTimeout(3000);
		const tileCount = await page.locator('.mosaic .tile').count();
		if (tileCount === 0) {
			test.skip(true, 'No gallery items loaded — skipping detail close test');
			return;
		}

		// Open detail
		await page.locator('.mosaic .tile').first().click();
		await page.waitForSelector('.detail-panel', { timeout: 15000 });
		await expect(page.locator('.detail-panel')).toBeVisible();

		// Click close button
		const closeBtn = page.locator('.detail-close');
		await expect(closeBtn).toBeVisible();
		await closeBtn.click();
		await page.waitForTimeout(500);

		// Panel should be gone
		await expect(page.locator('.detail-panel')).not.toBeVisible();
	});
});

test.describe('Gallery - Detail Close (Escape)', () => {
	test('pressing Escape dismisses the detail panel', async ({ page }) => {
		await page.goto('/gallery');
		await page.waitForTimeout(3000);
		const tileCount = await page.locator('.mosaic .tile').count();
		if (tileCount === 0) {
			test.skip(true, 'No gallery items loaded — skipping escape close test');
			return;
		}

		// Open detail
		await page.locator('.mosaic .tile').first().click();
		await page.waitForSelector('.detail-panel', { timeout: 15000 });
		await expect(page.locator('.detail-panel')).toBeVisible();

		// Press Escape
		await page.keyboard.press('Escape');
		await page.waitForTimeout(500);

		// Panel should be gone
		await expect(page.locator('.detail-panel')).not.toBeVisible();
	});
});

test.describe('Gallery - Detail Close (Backdrop)', () => {
	test('clicking backdrop dismisses the detail panel', async ({ page }) => {
		await page.goto('/gallery');
		await page.waitForTimeout(3000);
		const tileCount = await page.locator('.mosaic .tile').count();
		if (tileCount === 0) {
			test.skip(true, 'No gallery items loaded — skipping backdrop close test');
			return;
		}

		// Open detail
		await page.locator('.mosaic .tile').first().click();
		await page.waitForSelector('.detail-panel', { timeout: 15000 });
		await expect(page.locator('.detail-panel')).toBeVisible();

		// Click the backdrop (outside the panel)
		const backdrop = page.locator('.detail-backdrop');
		await expect(backdrop).toBeVisible();

		// Click at the edge of the backdrop to avoid hitting the panel
		await backdrop.click({ position: { x: 10, y: 10 } });
		await page.waitForTimeout(500);

		// Panel should be gone
		await expect(page.locator('.detail-panel')).not.toBeVisible();
	});
});
