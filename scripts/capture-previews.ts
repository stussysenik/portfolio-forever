#!/usr/bin/env bun

/**
 * capture-previews — Screenshot capture tool for portfolio works
 *
 * Captures screenshots of live deployment URLs and saves them as static
 * preview images. Replaces unreliable iframe embeds (login screens, blank
 * pages) with proper screenshots.
 *
 * Usage:
 *   bun scripts/capture-previews.ts              # capture all works
 *   bun scripts/capture-previews.ts --title "iPod emulator"
 *   bun scripts/capture-previews.ts --url https://ipod-music.vercel.app
 *   bun scripts/capture-previews.ts --missing     # only works without previews
 *   bun scripts/capture-previews.ts --force       # re-capture even if preview exists
 *   bun scripts/capture-previews.ts --dry-run     # show what would be captured
 *   bun scripts/capture-previews.ts --width 1440 --height 900
 */

import { chromium, type Browser, type Page } from "playwright";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

// ── Config ──────────────────────────────────────────────────────────────────

const ROOT = dirname(import.meta.dir);
const PREVIEWS_DIR = join(ROOT, "static", "previews");
const CONVEX_URL = process.env.PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;

const DEFAULT_VIEWPORT = { width: 1440, height: 900 };
const NAVIGATION_TIMEOUT = 30_000;
const SETTLE_DELAY = 2_000; // wait for animations/renders
const MAX_RETRIES = 2;

// ── Types ───────────────────────────────────────────────────────────────────

interface WorkEntry {
	_id: string;
	title: string;
	url: string;
	preview?: string;
	visible: boolean;
	order: number;
	[key: string]: unknown;
}

interface CaptureResult {
	title: string;
	url: string;
	filename: string;
	success: boolean;
	error?: string;
	skipped?: boolean;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function parseArgs() {
	const args = process.argv.slice(2);
	const flags: Record<string, string | boolean> = {};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--missing") flags.missing = true;
		else if (arg === "--force") flags.force = true;
		else if (arg === "--dry-run") flags.dryRun = true;
		else if (arg === "--no-update") flags.noUpdate = true;
		else if (arg === "--title" && args[i + 1]) flags.title = args[++i];
		else if (arg === "--url" && args[i + 1]) flags.url = args[++i];
		else if (arg === "--width" && args[i + 1]) flags.width = args[++i];
		else if (arg === "--height" && args[i + 1]) flags.height = args[++i];
		else if (arg === "--help" || arg === "-h") {
			console.log(`
capture-previews — Screenshot capture tool for portfolio works

USAGE
  bun scripts/capture-previews.ts [OPTIONS]

OPTIONS
  --title <name>    Capture a single work by title (partial match)
  --url <url>       Capture a single work by deployment URL
  --missing         Only capture works that don't have a preview yet
  --force           Re-capture even if a preview image already exists on disk
  --dry-run         Show what would be captured without doing it
  --no-update       Capture screenshots but don't update Convex preview fields
  --width <px>      Viewport width (default: 1440)
  --height <px>     Viewport height (default: 900)
  --help, -h        Show this help

EXAMPLES
  bun scripts/capture-previews.ts                    # all works
  bun scripts/capture-previews.ts --missing          # only missing previews
  bun scripts/capture-previews.ts --title "iPod"     # single project
  bun scripts/capture-previews.ts --force --width 1920
`);
			process.exit(0);
		}
	}

	return flags;
}

async function captureScreenshot(
	page: Page,
	url: string,
	outputPath: string,
	retries = MAX_RETRIES,
): Promise<void> {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			// Navigate and wait for network to settle
			await page.goto(url, {
				waitUntil: "networkidle",
				timeout: NAVIGATION_TIMEOUT,
			});

			// Extra settle time for client-side rendering / animations
			await page.waitForTimeout(SETTLE_DELAY);

			// Dismiss any cookie banners or overlays by clicking them away
			try {
				const dismissSelectors = [
					'[class*="cookie"] button',
					'[class*="consent"] button',
					'[class*="banner"] button[class*="close"]',
					'[class*="banner"] button[class*="accept"]',
					'button[aria-label*="close" i]',
					'button[aria-label*="dismiss" i]',
				];
				for (const sel of dismissSelectors) {
					const btn = page.locator(sel).first();
					if (await btn.isVisible({ timeout: 500 }).catch(() => false)) {
						await btn.click().catch(() => {});
						await page.waitForTimeout(300);
					}
				}
			} catch {
				// Ignore — best-effort banner dismissal
			}

			await page.screenshot({ path: outputPath, type: "png" });
			return; // success
		} catch (err) {
			if (attempt === retries) throw err;
			const wait = 1000 * (attempt + 1);
			console.log(`    retry ${attempt + 1}/${retries} in ${wait}ms...`);
			await new Promise((r) => setTimeout(r, wait));
		}
	}
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
	const flags = parseArgs();

	if (!CONVEX_URL) {
		console.error("ERROR: PUBLIC_CONVEX_URL or CONVEX_URL not set.");
		console.error("Make sure .env.local is loaded or pass the URL as env var.");
		process.exit(1);
	}

	const viewport = {
		width: flags.width ? parseInt(flags.width as string, 10) : DEFAULT_VIEWPORT.width,
		height: flags.height ? parseInt(flags.height as string, 10) : DEFAULT_VIEWPORT.height,
	};

	// Ensure output directory exists
	mkdirSync(PREVIEWS_DIR, { recursive: true });

	// ── Fetch works from Convex ─────────────────────────────────────────────
	console.log("\n  Connecting to Convex...");
	const convex = new ConvexHttpClient(CONVEX_URL);
	let works: WorkEntry[];

	try {
		works = await convex.query(api.works.getFullWorks, {}) as WorkEntry[];
	} catch (err) {
		console.error("ERROR: Failed to fetch works from Convex:", err);
		process.exit(1);
	}

	console.log(`  Found ${works.length} works in database\n`);

	// ── Filter based on flags ───────────────────────────────────────────────
	let targets = works;

	if (flags.title) {
		const needle = (flags.title as string).toLowerCase();
		targets = targets.filter((w) => w.title.toLowerCase().includes(needle));
		if (targets.length === 0) {
			console.error(`  No works matching title "${flags.title}"`);
			process.exit(1);
		}
	}

	if (flags.url) {
		targets = targets.filter((w) => w.url === flags.url);
		if (targets.length === 0) {
			console.error(`  No works matching URL "${flags.url}"`);
			process.exit(1);
		}
	}

	if (flags.missing) {
		targets = targets.filter((w) => !w.preview);
	}

	if (!flags.force) {
		// Skip works that already have a preview file on disk (unless --force)
		targets = targets.filter((w) => {
			if (!w.preview) return true;
			const diskPath = join(ROOT, "static", w.preview.replace(/^\//, ""));
			return !existsSync(diskPath);
		});
	}

	if (targets.length === 0) {
		console.log("  Nothing to capture — all works already have previews.");
		console.log("  Use --force to re-capture, or --missing to target works without preview fields.\n");
		process.exit(0);
	}

	// ── Dry run ─────────────────────────────────────────────────────────────
	if (flags.dryRun) {
		console.log("  DRY RUN — would capture:\n");
		for (const w of targets) {
			const filename = `${slugify(w.title)}.png`;
			console.log(`    ${w.title}`);
			console.log(`      ${w.url}`);
			console.log(`      → /previews/${filename}\n`);
		}
		process.exit(0);
	}

	// ── Launch browser ──────────────────────────────────────────────────────
	console.log(`  Launching browser (${viewport.width}x${viewport.height})...\n`);
	let browser: Browser;

	try {
		browser = await chromium.launch({ headless: true });
	} catch (err) {
		console.error("ERROR: Failed to launch Chromium.");
		console.error("Run `bunx playwright install chromium` first.");
		console.error(err);
		process.exit(1);
	}

	const context = await browser.newContext({
		viewport,
		deviceScaleFactor: 2, // retina quality
		colorScheme: "light",
	});

	const page = await context.newPage();

	// ── Capture each work ───────────────────────────────────────────────────
	const results: CaptureResult[] = [];
	const total = targets.length;

	for (let i = 0; i < total; i++) {
		const work = targets[i];
		const filename = `${slugify(work.title)}.png`;
		const outputPath = join(PREVIEWS_DIR, filename);
		const previewPath = `/previews/${filename}`;
		const progress = `[${i + 1}/${total}]`;

		console.log(`  ${progress} ${work.title}`);
		console.log(`          ${work.url}`);

		try {
			await captureScreenshot(page, work.url, outputPath);
			console.log(`          → ${previewPath}`);
			results.push({ title: work.title, url: work.url, filename, success: true });

			// Update Convex preview field
			if (!flags.noUpdate) {
				try {
					await convex.mutation(api.works.updateEntry, {
						id: work._id as any,
						preview: previewPath,
					});
					console.log(`          ✓ Convex updated`);
				} catch (err) {
					console.log(`          ⚠ Convex update failed: ${err}`);
				}
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			console.log(`          ✗ FAILED: ${msg}`);
			results.push({ title: work.title, url: work.url, filename, success: false, error: msg });
		}

		console.log();
	}

	// ── Cleanup ─────────────────────────────────────────────────────────────
	await browser.close();

	// ── Summary ─────────────────────────────────────────────────────────────
	const succeeded = results.filter((r) => r.success).length;
	const failed = results.filter((r) => !r.success).length;

	console.log("  ────────────────────────────────────");
	console.log(`  Done: ${succeeded} captured, ${failed} failed`);

	if (failed > 0) {
		console.log("\n  Failed:");
		for (const r of results.filter((r) => !r.success)) {
			console.log(`    ${r.title}: ${r.error}`);
		}
	}

	console.log();
	process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
	console.error("Unhandled error:", err);
	process.exit(1);
});
