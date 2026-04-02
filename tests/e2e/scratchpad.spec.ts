/**
 * Scratchpad E2E Tests
 *
 * Tests for the scratchpad page at /scratchpad.
 * Features a textarea with word count, save/clear toolbar,
 * localStorage persistence, and interactive toy widgets
 * (dice, coin, 8-ball, color generator).
 */

import { test, expect } from '@playwright/test';

const SCRATCHPAD_URL = '/scratchpad';

test.describe('Scratchpad', () => {
	// Run serially — tests share localStorage and use evaluate for Svelte bindings
	test.describe.configure({ mode: 'serial' });

	test.beforeEach(async ({ page }) => {
		// Clear any leftover localStorage from previous tests before navigating
		await page.goto(SCRATCHPAD_URL);
		await page.evaluate(() => {
			localStorage.removeItem('scratchpad-content');
			localStorage.removeItem('scratchpad-saved');
		});
		// Reload to start fresh
		await page.reload();
		await page.waitForSelector('.scratch-textarea', { timeout: 15000 });
	});

	test('Page Load — textarea visible', async ({ page }) => {
		const textarea = page.locator('.scratch-textarea');
		await expect(textarea).toBeVisible();
	});

	test('Title — shows "SCRATCHPAD"', async ({ page }) => {
		const title = page.locator('.scratch-title');
		await expect(title).toBeVisible();
		const text = await title.innerText();
		expect(text.toUpperCase()).toContain('SCRATCHPAD');
	});

	test('Word Count — initially 0, updates on typing', async ({ page }) => {
		const wordCount = page.locator('.word-count');
		await expect(wordCount).toBeVisible();

		// Initially should show 0 words
		await expect(wordCount).toContainText('0');

		// Use fill() + native setter + input event dispatch for reliability
		const textarea = page.locator('.scratch-textarea');
		await textarea.click();
		await textarea.fill('hello world foo bar');
		await page.evaluate(() => {
			const ta = document.querySelector('.scratch-textarea') as HTMLTextAreaElement;
			const nativeSetter = Object.getOwnPropertyDescriptor(
				window.HTMLTextAreaElement.prototype, 'value'
			)!.set!;
			nativeSetter.call(ta, 'hello world foo bar');
			ta.dispatchEvent(new Event('input', { bubbles: true }));
		});

		// Word count should update to 4
		await expect(wordCount).toContainText('4', { timeout: 5000 });
	});

	test('Typing — text appears in textarea', async ({ page }) => {
		const textarea = page.locator('.scratch-textarea');
		const testText = 'The quick brown fox jumps over the lazy dog';

		await textarea.fill(testText);
		await page.waitForTimeout(200);

		const value = await textarea.inputValue();
		expect(value).toBe(testText);
	});

	test('Save Button — status shows "saved" after clicking save', async ({ page }) => {
		const textarea = page.locator('.scratch-textarea');
		await textarea.click();
		await textarea.fill('some text to save');
		await page.evaluate(() => {
			const ta = document.querySelector('.scratch-textarea') as HTMLTextAreaElement;
			const nativeSetter = Object.getOwnPropertyDescriptor(
				window.HTMLTextAreaElement.prototype, 'value'
			)!.set!;
			nativeSetter.call(ta, 'some text to save');
			ta.dispatchEvent(new Event('input', { bubbles: true }));
		});
		await page.waitForTimeout(200);

		// Find the save button (non-danger toolbar button)
		const saveBtn = page.locator('.toolbar-btn:not(.danger)').first();
		await saveBtn.click();
		await page.waitForTimeout(500);

		const saveStatus = page.locator('.save-status');
		await expect(saveStatus).toBeVisible();
		const statusText = await saveStatus.innerText();
		expect(statusText.toLowerCase()).toContain('saved');
	});

	test('Clear Button — empties the textarea', async ({ page }) => {
		const textarea = page.locator('.scratch-textarea');
		await textarea.click();
		await textarea.fill('text that will be cleared');
		await page.evaluate(() => {
			const ta = document.querySelector('.scratch-textarea') as HTMLTextAreaElement;
			const nativeSetter = Object.getOwnPropertyDescriptor(
				window.HTMLTextAreaElement.prototype, 'value'
			)!.set!;
			nativeSetter.call(ta, 'text that will be cleared');
			ta.dispatchEvent(new Event('input', { bubbles: true }));
		});
		await page.waitForTimeout(300);

		// Handle potential confirm dialog
		page.on('dialog', async (dialog) => {
			await dialog.accept();
		});

		const clearBtn = page.locator('.toolbar-btn.danger');
		await expect(clearBtn).toBeVisible();
		await clearBtn.click();
		await page.waitForTimeout(500);

		const value = await textarea.inputValue();
		expect(value).toBe('');
	});

	test('Persistence — text survives page reload via localStorage', async ({ page }) => {
		const persistedText = 'persist me across reloads';

		// Directly set localStorage to test that the component loads persisted content on mount.
		await page.evaluate((text) => {
			localStorage.setItem('scratchpad-content', text);
			localStorage.setItem('scratchpad-saved', new Date().toISOString());
		}, persistedText);

		// Verify localStorage was set before reloading
		const stored = await page.evaluate(() => localStorage.getItem('scratchpad-content'));
		expect(stored).toBe(persistedText);

		// Reload the page so onMount reads from localStorage
		await page.reload();
		await page.waitForSelector('.scratch-textarea', { timeout: 15000 });
		// Wait for Svelte to hydrate and bind:value to update DOM
		await page.waitForTimeout(1000);

		// Text should be loaded from localStorage
		const reloadedTextarea = page.locator('.scratch-textarea');
		await expect(reloadedTextarea).toHaveValue(persistedText, { timeout: 5000 });
	});

	test('Toys Grid — 4 toy cards visible', async ({ page }) => {
		const toyCards = page.locator('.toys-grid .toy-card');
		await page.waitForSelector('.toys-grid', { timeout: 10000 });

		const count = await toyCards.count();
		expect(count).toBe(4);

		for (let i = 0; i < 4; i++) {
			await expect(toyCards.nth(i)).toBeVisible();
		}
	});

	test('Dice Roll — clicking dice button shows a number', async ({ page }) => {
		const toyCards = page.locator('.toy-card');
		await page.waitForSelector('.toy-card', { timeout: 10000 });

		// Find the dice toy card and its button
		// Dice is typically the first toy
		const diceBtn = toyCards.first().locator('.toy-btn');
		await diceBtn.click();
		await page.waitForTimeout(500);

		const diceResult = page.locator('.dice-result');
		await expect(diceResult).toBeVisible();
		const resultText = await diceResult.innerText();
		expect(resultText.length).toBeGreaterThan(0);
	});

	test('Coin Flip — clicking coin button shows HEADS or TAILS', async ({ page }) => {
		const toyCards = page.locator('.toy-card');
		await page.waitForSelector('.toy-card', { timeout: 10000 });

		// Click the coin button (second toy card) via evaluate for reliability
		await page.evaluate(() => {
			const btns = document.querySelectorAll('.toy-card .toy-btn');
			(btns[1] as HTMLButtonElement)?.click();
		});
		await page.waitForTimeout(1000);

		const coinResult = page.locator('.coin-result');
		await expect(coinResult).toBeVisible();

		// Wait for result to not be "?" — retry click if needed
		let resultText = (await coinResult.innerText()).toUpperCase();
		if (!resultText.includes('HEADS') && !resultText.includes('TAILS')) {
			// Retry with Playwright click
			await toyCards.nth(1).locator('.toy-btn').click({ force: true });
			await page.waitForTimeout(1000);
			resultText = (await coinResult.innerText()).toUpperCase();
		}

		const isValid = resultText.includes('HEADS') || resultText.includes('TAILS');
		expect(isValid).toBe(true);
	});

	test('Magic 8-Ball — clicking button shows text result', async ({ page }) => {
		const toyCards = page.locator('.toy-card');
		await page.waitForSelector('.toy-card', { timeout: 10000 });

		// 8-ball is typically the third toy
		const magicBtn = toyCards.nth(2).locator('.toy-btn');
		await magicBtn.click();
		await page.waitForTimeout(500);

		const magicResult = page.locator('.magic-result');
		await expect(magicResult).toBeVisible();
		const resultText = await magicResult.innerText();
		expect(resultText.length).toBeGreaterThan(0);
	});

	test('Color Generate — clicking button shows color swatch', async ({ page }) => {
		const toyCards = page.locator('.toy-card');
		await page.waitForSelector('.toy-card', { timeout: 10000 });

		// Color is typically the fourth toy
		const colorBtn = toyCards.nth(3).locator('.toy-btn');
		await colorBtn.click();
		await page.waitForTimeout(500);

		const colorResult = page.locator('.color-result');
		await expect(colorResult).toBeVisible();
	});
});
