/**
 * OS Desktop E2E Tests
 *
 * Tests for the retro OS desktop page at /os.
 * Features a windowed desktop environment with icons, taskbar,
 * draggable windows, and a start/exit button.
 */

import { test, expect } from '@playwright/test';

const OS_URL = '/os';

test.describe('OS Desktop', () => {
	// Run serially — the OS desktop's fixed positioning and window state
	// cause flaky interactions when multiple workers load /os simultaneously
	test.describe.configure({ mode: 'serial' });

	test.beforeEach(async ({ page }) => {
		await page.goto(OS_URL);
		await page.waitForSelector('.desktop', { timeout: 15000 });
		// Wait for Svelte to hydrate and windows to render
		await page.waitForSelector('.window', { timeout: 10000 });
		await page.waitForTimeout(500);
	});

	test('Page Load — desktop visible', async ({ page }) => {
		const desktop = page.locator('.desktop');
		await expect(desktop).toBeVisible();
	});

	test('Desktop Icons — 4 icons visible with labels', async ({ page }) => {
		const icons = page.locator('.icon-item');
		await expect(icons).toHaveCount(4);

		for (let i = 0; i < 4; i++) {
			const icon = icons.nth(i);
			await expect(icon).toBeVisible();

			const label = icon.locator('.icon-label');
			await expect(label).toBeVisible();
			const text = await label.innerText();
			expect(text.length).toBeGreaterThan(0);
		}
	});

	test('Default Windows — at least 1 window visible on load', async ({ page }) => {
		const windows = page.locator('.window');
		await page.waitForSelector('.window', { timeout: 10000 });

		const count = await windows.count();
		expect(count).toBeGreaterThanOrEqual(1);

		// First window should be visible
		await expect(windows.first()).toBeVisible();
	});

	test('Window Focus — clicking a window gives it the active class', async ({ page }) => {
		const windows = page.locator('.window');
		const count = await windows.count();

		if (count < 2) {
			test.skip(true, 'Need at least 2 windows to test focus');
			return;
		}

		// Verify the second window starts as active (activeWindowId=2)
		const secondWindow = windows.nth(1);
		await expect(secondWindow).toHaveClass(/active/, { timeout: 5000 });

		// Click the first window's title bar using dispatchEvent for reliability under load
		const firstWindow = windows.first();
		await firstWindow.locator('.title-bar').dispatchEvent('mousedown');
		await page.waitForTimeout(500);

		// If that didn't work, try a direct click as fallback
		if (!(await firstWindow.getAttribute('class'))?.includes('active')) {
			await firstWindow.click({ force: true, position: { x: 50, y: 10 } });
			await page.waitForTimeout(500);
		}

		// It should now have the active class
		await expect(firstWindow).toHaveClass(/active/, { timeout: 5000 });
	});

	test('Close Window — clicking close button removes the window', async ({ page }) => {
		const windows = page.locator('.window');
		await page.waitForSelector('.window', { timeout: 10000 });

		const initialCount = await windows.count();
		expect(initialCount).toBeGreaterThanOrEqual(1);

		// Find the close button on the first window — use dispatchEvent for reliability
		const firstWindow = windows.first();
		const closeBtn = firstWindow.locator('.btn-close');
		await expect(closeBtn).toBeVisible();

		await closeBtn.dispatchEvent('click');
		await page.waitForTimeout(500);

		// Window count should have decreased
		const newCount = await windows.count();
		expect(newCount).toBeLessThan(initialCount);
	});

	test('Open Window via Icon — double-click icon opens a new window', async ({ page }) => {
		const windows = page.locator('.window');
		const initialCount = await windows.count();

		// Double-click the first desktop icon (My Computer) to open a window.
		// Use dispatchEvent for reliable dblclick handling with Svelte's on:dblclick.
		const firstIcon = page.locator('.icon-item').first();
		await firstIcon.dispatchEvent('dblclick');
		await page.waitForTimeout(1000);

		// A new window should appear
		const newCount = await windows.count();
		expect(newCount).toBeGreaterThan(initialCount);
	});

	test('Taskbar — visible with start button and clock', async ({ page }) => {
		const taskbar = page.locator('.taskbar');
		await expect(taskbar).toBeVisible();

		const startBtn = page.locator('.start-btn');
		await expect(startBtn).toBeVisible();

		const clock = page.locator('.clock');
		await expect(clock).toBeVisible();
		const clockText = await clock.innerText();
		expect(clockText.length).toBeGreaterThan(0);
	});

	test('Taskbar Items — open windows reflected as taskbar items', async ({ page }) => {
		await page.waitForSelector('.window', { timeout: 10000 });

		const windows = page.locator('.window');
		const windowCount = await windows.count();

		if (windowCount === 0) {
			test.skip(true, 'No windows to check taskbar items');
			return;
		}

		const taskbarItems = page.locator('.taskbar-item');
		const itemCount = await taskbarItems.count();

		// There should be at least one taskbar item for the open windows
		expect(itemCount).toBeGreaterThanOrEqual(1);
	});

	test('Exit Button — clicking start/exit navigates to /', async ({ page }) => {
		const startBtn = page.locator('.start-btn');
		await expect(startBtn).toBeVisible();

		await startBtn.click();

		// Should navigate to the home page — use regex to match full URL ending with /
		await expect(page).toHaveURL(/\/$/);
	});
});
