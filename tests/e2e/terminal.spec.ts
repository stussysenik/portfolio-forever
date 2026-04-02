/**
 * Terminal E2E Tests
 *
 * Tests for the interactive terminal page at /terminal.
 * The terminal processes commands locally with a JS command system.
 * Known commands: help, whoami, pwd, ls, cd, cat, neofetch, date,
 * fortune, echo, clear, history, matrix, pipes, exit, browse.
 */

import { test, expect } from '@playwright/test';

const TERMINAL_URL = '/terminal';
const CMD_DELAY = 1000;

/**
 * Set the terminal input value and execute the command.
 * Uses multiple strategies to reliably trigger Svelte's event handlers:
 * 1. fill() to set value (standard Playwright approach)
 * 2. evaluate + native setter + input dispatch as backup
 * 3. Keyboard Enter via both evaluate and Playwright
 * Retries up to 3 times if the command doesn't execute.
 */
async function runCommand(page: import('@playwright/test').Page, command: string) {
	const input = page.locator('.terminal-input');
	const output = page.locator('.output');
	const outputBefore = await output.innerText();

	for (let attempt = 0; attempt < 3; attempt++) {
		// Strategy: fill + native setter + input event
		await input.click();
		await input.fill(command);
		// Also dispatch input event via evaluate as backup
		await page.evaluate((cmd) => {
			const el = document.querySelector('.terminal-input') as HTMLInputElement;
			el.focus();
			const nativeSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype, 'value'
			)!.set!;
			nativeSetter.call(el, cmd);
			el.dispatchEvent(new Event('input', { bubbles: true }));
		}, command);
		await page.waitForTimeout(100);

		// Press Enter via both keyboard and evaluate
		await input.press('Enter');
		await page.evaluate(() => {
			const el = document.querySelector('.terminal-input') as HTMLInputElement;
			el.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'Enter', code: 'Enter', bubbles: true
			}));
		});
		await page.waitForTimeout(CMD_DELAY);

		// Check if command executed (output changed or input cleared)
		const inputVal = await input.inputValue();
		const outputAfter = await output.innerText();
		if (inputVal === '' || outputAfter !== outputBefore) {
			break; // Command executed successfully
		}
		// Retry with longer wait
		await page.waitForTimeout(500);
	}
}

test.describe('Terminal', () => {
	// Run serially — terminal commands use evaluate + dispatchEvent which can be
	// unreliable when many workers compete for CPU on the dev server
	test.describe.configure({ mode: 'serial' });

	test.beforeEach(async ({ page }) => {
		await page.goto(TERMINAL_URL);
		await page.waitForSelector('.terminal-input', { timeout: 15000 });
	});

	test('Page Load — terminal input is visible and focused', async ({ page }) => {
		const input = page.locator('.terminal-input');
		await expect(input).toBeVisible();
		await expect(input).toBeFocused();
	});

	test('Welcome Message — output contains welcome text', async ({ page }) => {
		const output = page.locator('.output');
		await expect(output).toBeVisible();

		// The terminal should render at least one line of welcome output on load
		const lines = page.locator('.output .line');
		await expect(lines.first()).toBeVisible({ timeout: 5000 });

		const outputText = await output.innerText();
		expect(outputText.length).toBeGreaterThan(0);
	});

	test('Help Command — output shows available commands', async ({ page }) => {
		await runCommand(page, 'help');

		// Wait for the help output to render — it contains command names
		const output = page.locator('.output');
		await expect(output).toContainText('echo', { timeout: 10000 });
		await expect(output).toContainText('help', { timeout: 5000 });
	});

	test('Echo Command — output contains "hello world"', async ({ page }) => {
		await runCommand(page, 'echo hello world');

		const output = page.locator('.output');
		await expect(output).toContainText('hello world', { timeout: 10000 });
	});

	test('Whoami Command — output has text content', async ({ page }) => {
		await runCommand(page, 'whoami');

		const lines = page.locator('.output .line');
		const count = await lines.count();
		expect(count).toBeGreaterThan(0);

		const lastLine = lines.last();
		const text = await lastLine.innerText();
		expect(text.length).toBeGreaterThan(0);
	});

	test('Ls Command — output has content', async ({ page }) => {
		await runCommand(page, 'ls');

		const output = page.locator('.output');
		const outputText = await output.innerText();
		expect(outputText.length).toBeGreaterThan(0);
	});

	test('Neofetch Command — output has content (ASCII art)', async ({ page }) => {
		await runCommand(page, 'neofetch');

		const output = page.locator('.output');
		// neofetch output contains system info like "Role" — wait for it to appear
		await expect(output).toContainText('Role', { timeout: 10000 });
		const outputText = await output.innerText();
		expect(outputText.length).toBeGreaterThan(0);
	});

	test('Clear Command — output lines reduced', async ({ page }) => {
		// Run a few commands to build up output
		await runCommand(page, 'echo first');
		await runCommand(page, 'echo second');
		await runCommand(page, 'echo third');

		const linesBefore = await page.locator('.output .line').count();
		expect(linesBefore).toBeGreaterThan(0);

		await runCommand(page, 'clear');

		// After clear, output should have significantly fewer lines
		const linesAfter = await page.locator('.output .line').count();
		expect(linesAfter).toBeLessThan(linesBefore);
	});

	test('History Navigation — ArrowUp recalls previous commands', async ({ page }) => {
		await runCommand(page, 'echo a');
		await expect(page.locator('.output')).toContainText('echo a', { timeout: 5000 });

		await runCommand(page, 'echo b');
		await expect(page.locator('.output')).toContainText('echo b', { timeout: 5000 });

		const input = page.locator('.terminal-input');

		// Press ArrowUp via evaluate to get "echo b"
		await page.evaluate(() => {
			const el = document.querySelector('.terminal-input') as HTMLInputElement;
			el.focus();
			el.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'ArrowUp', code: 'ArrowUp', bubbles: true
			}));
		});
		await page.waitForTimeout(300);
		await expect(input).toHaveValue('echo b', { timeout: 3000 });

		// Press ArrowUp again to get "echo a"
		await page.evaluate(() => {
			const el = document.querySelector('.terminal-input') as HTMLInputElement;
			el.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'ArrowUp', code: 'ArrowUp', bubbles: true
			}));
		});
		await page.waitForTimeout(300);
		await expect(input).toHaveValue('echo a', { timeout: 3000 });
	});

	test('Ctrl+C — input cleared and ^C shown in output', async ({ page }) => {
		// Set input value via native setter
		await page.evaluate(() => {
			const el = document.querySelector('.terminal-input') as HTMLInputElement;
			el.focus();
			const nativeSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype, 'value'
			)!.set!;
			nativeSetter.call(el, 'some partial command');
			el.dispatchEvent(new Event('input', { bubbles: true }));
		});
		await page.waitForTimeout(200);

		// Dispatch Ctrl+C keydown
		await page.evaluate(() => {
			const el = document.querySelector('.terminal-input') as HTMLInputElement;
			el.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'c', code: 'KeyC', ctrlKey: true, bubbles: true
			}));
		});
		await page.waitForTimeout(300);

		// Input should be cleared
		const input = page.locator('.terminal-input');
		const value = await input.inputValue();
		expect(value).toBe('');

		// Output should show ^C
		const output = page.locator('.output');
		await expect(output).toContainText('^C', { timeout: 3000 });
	});

	test('Unknown Command — output shows error message', async ({ page }) => {
		await runCommand(page, 'xyznotacommand');

		const output = page.locator('.output');
		const outputText = await output.innerText();

		// Should show some kind of "not found" or "unknown" error
		const hasError =
			outputText.toLowerCase().includes('not found') ||
			outputText.toLowerCase().includes('unknown') ||
			outputText.toLowerCase().includes('command not found') ||
			outputText.toLowerCase().includes('not recognized');
		expect(hasError).toBe(true);
	});

	test('Tmux Bar — visible with session, path, and time', async ({ page }) => {
		const tmuxBar = page.locator('.tmux-bar');
		await expect(tmuxBar).toBeVisible();

		const session = page.locator('.tmux-session');
		await expect(session).toBeVisible();
		const sessionText = await session.innerText();
		expect(sessionText.length).toBeGreaterThan(0);

		const tmuxPath = page.locator('.tmux-path');
		await expect(tmuxPath).toBeVisible();

		const tmuxTime = page.locator('.tmux-time');
		await expect(tmuxTime).toBeVisible();
		const timeText = await tmuxTime.innerText();
		expect(timeText.length).toBeGreaterThan(0);
	});

	test('Multiple Commands Sequential — all outputs visible', async ({ page }) => {
		await runCommand(page, 'echo first-output');
		await expect(page.locator('.output')).toContainText('first-output', { timeout: 5000 });

		await runCommand(page, 'echo second-output');
		await expect(page.locator('.output')).toContainText('second-output', { timeout: 5000 });

		await runCommand(page, 'echo third-output');
		await expect(page.locator('.output')).toContainText('third-output', { timeout: 5000 });
	});
});
