#!/usr/bin/env bun

/**
 * record-previews — Screen recording tool for portfolio works
 *
 * Records short video previews of each project's deployment URL,
 * executing per-project "soul recipes" (scroll, click, type actions),
 * then converts to optimized MP4 via ffmpeg.
 *
 * Usage:
 *   bun scripts/record-previews.ts              # record all with recipes
 *   bun scripts/record-previews.ts --title "iPod"
 *   bun scripts/record-previews.ts --dry-run
 *   bun scripts/record-previews.ts --all --force
 */

import { chromium, type BrowserContext, type Page } from "playwright";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { execSync } from "node:child_process";

const ROOT = dirname(import.meta.dir);
const VIDEOS_DIR = join(ROOT, "static", "videos");
const RECIPES_PATH = join(ROOT, "scripts", "recording-recipes.json");
const CONVEX_URL = process.env.PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;

interface Action {
	type: "wait" | "click" | "scroll" | "hover" | "type";
	ms?: number;
	x?: number;
	y?: number;
	selector?: string;
	text?: string;
	delay?: number;
	smooth?: boolean;
}

interface Recipe {
	title: string;
	url: string;
	duration: number;
	viewport?: { width: number; height: number };
	deviceScaleFactor?: number;
	actions: Action[];
}

interface RecipesFile {
	defaults: { duration: number; viewport: { width: number; height: number }; deviceScaleFactor: number };
	recipes: Recipe[];
}

function slugify(text: string): string {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseArgs() {
	const args = process.argv.slice(2);
	const flags: Record<string, string | boolean> = {};
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--force") flags.force = true;
		else if (arg === "--dry-run") flags.dryRun = true;
		else if (arg === "--all") flags.all = true;
		else if (arg === "--no-update") flags.noUpdate = true;
		else if (arg === "--title" && args[i + 1]) flags.title = args[++i];
		else if (arg === "--help" || arg === "-h") {
			console.log(`
record-previews — Screen recording tool for portfolio works

USAGE
  bun scripts/record-previews.ts [OPTIONS]

OPTIONS
  --title <name>    Record a single project by title (partial match)
  --all             Record all projects that have recipes
  --force           Re-record even if video already exists
  --dry-run         Show what would be recorded
  --no-update       Record but don't update Convex
  --help, -h        Show this help
`);
			process.exit(0);
		}
	}
	return flags;
}

async function executeActions(page: Page, actions: Action[]) {
	for (const action of actions) {
		switch (action.type) {
			case "wait":
				await page.waitForTimeout(action.ms ?? 1000);
				break;
			case "click":
				if (action.selector) {
					await page.click(action.selector).catch(() => {});
				} else if (action.x !== undefined && action.y !== undefined) {
					await page.mouse.click(action.x, action.y);
				}
				if (action.ms) await page.waitForTimeout(action.ms);
				break;
			case "scroll":
				if (action.smooth) {
					await page.evaluate((y) => window.scrollBy({ top: y, behavior: "smooth" }), action.y ?? 300);
				} else {
					await page.mouse.wheel(0, action.y ?? 300);
				}
				await page.waitForTimeout(action.ms ?? 500);
				break;
			case "hover":
				if (action.selector) {
					await page.hover(action.selector).catch(() => {});
				} else if (action.x !== undefined && action.y !== undefined) {
					await page.mouse.move(action.x, action.y);
				}
				await page.waitForTimeout(action.ms ?? 300);
				break;
			case "type":
				if (action.text) {
					await page.keyboard.type(action.text, { delay: action.delay ?? 80 });
				}
				await page.waitForTimeout(action.ms ?? 300);
				break;
		}
	}
}

function convertToMp4(webmPath: string, mp4Path: string, maxDuration: number) {
	const durationSec = Math.ceil(maxDuration / 1000);
	const cmd = [
		"ffmpeg", "-y", "-i", JSON.stringify(webmPath),
		"-c:v libx264", "-preset slow", "-crf 28",
		`-vf "fps=30,scale=1280:-2"`,
		"-an", "-movflags +faststart",
		`-t ${durationSec}`,
		JSON.stringify(mp4Path),
	].join(" ");
	execSync(cmd, { stdio: "pipe" });
}

async function main() {
	const flags = parseArgs();

	if (!CONVEX_URL) {
		console.error("ERROR: PUBLIC_CONVEX_URL or CONVEX_URL not set.");
		process.exit(1);
	}

	// Check ffmpeg
	try {
		execSync("which ffmpeg", { stdio: "pipe" });
	} catch {
		console.error("ERROR: ffmpeg not found. Install with: brew install ffmpeg");
		process.exit(1);
	}

	// Load recipes
	if (!existsSync(RECIPES_PATH)) {
		console.error("ERROR: recording-recipes.json not found.");
		process.exit(1);
	}
	const recipesFile: RecipesFile = JSON.parse(readFileSync(RECIPES_PATH, "utf-8"));
	let recipes = recipesFile.recipes;
	const defaults = recipesFile.defaults;

	// Filter
	if (flags.title) {
		const needle = (flags.title as string).toLowerCase();
		recipes = recipes.filter((r) => r.title.toLowerCase().includes(needle));
		if (recipes.length === 0) {
			console.error(`  No recipes matching "${flags.title}"`);
			process.exit(1);
		}
	}

	if (!flags.force) {
		recipes = recipes.filter((r) => {
			const mp4Path = join(VIDEOS_DIR, `${slugify(r.title)}.mp4`);
			return !existsSync(mp4Path);
		});
	}

	if (recipes.length === 0) {
		console.log("  Nothing to record. Use --force to re-record.");
		process.exit(0);
	}

	// Dry run
	if (flags.dryRun) {
		console.log("\n  DRY RUN — would record:\n");
		for (const r of recipes) {
			const slug = slugify(r.title);
			const dur = r.duration ?? defaults.duration;
			console.log(`    ${r.title}`);
			console.log(`      ${r.url}`);
			console.log(`      → /videos/${slug}.mp4 (${dur / 1000}s, ${r.actions.length} actions)\n`);
		}
		process.exit(0);
	}

	// Ensure output dir
	mkdirSync(VIDEOS_DIR, { recursive: true });
	const tmpDir = join(ROOT, ".video-tmp");
	mkdirSync(tmpDir, { recursive: true });

	console.log(`\n  Launching browser...\n`);
	const browser = await chromium.launch({ headless: true }).catch((err) => {
		console.error("ERROR: Failed to launch Chromium. Run: bunx playwright install chromium");
		process.exit(1);
	});

	const convex = new ConvexHttpClient(CONVEX_URL);
	const total = recipes.length;
	let succeeded = 0;
	let failed = 0;

	for (let i = 0; i < total; i++) {
		const recipe = recipes[i];
		const slug = slugify(recipe.title);
		const vp = recipe.viewport ?? defaults.viewport;
		const duration = recipe.duration ?? defaults.duration;
		const mp4Path = join(VIDEOS_DIR, `${slug}.mp4`);
		const progress = `[${i + 1}/${total}]`;

		console.log(`  ${progress} ${recipe.title}`);
		console.log(`          ${recipe.url} (${duration / 1000}s, ${recipe.actions.length} actions)`);

		try {
			// Create context with video recording
			const context = await browser.newContext({
				viewport: vp,
				deviceScaleFactor: recipe.deviceScaleFactor ?? defaults.deviceScaleFactor,
				colorScheme: "light",
				recordVideo: { dir: tmpDir, size: vp },
			});

			const page = await context.newPage();

			// Navigate
			await page.goto(recipe.url, { waitUntil: "networkidle", timeout: 30_000 });
			await page.waitForTimeout(1000); // settle

			// Execute soul actions
			await executeActions(page, recipe.actions);

			// Close to finalize video
			const videoPath = await page.video()?.path();
			await context.close();

			if (!videoPath || !existsSync(videoPath)) {
				throw new Error("Video file not created by Playwright");
			}

			// Convert to MP4
			console.log(`          Converting to MP4...`);
			convertToMp4(videoPath, mp4Path, duration);

			// Clean up webm
			rmSync(videoPath, { force: true });

			const size = Bun.file(mp4Path).size;
			const sizeMB = (size / 1024 / 1024).toFixed(1);
			console.log(`          → /videos/${slug}.mp4 (${sizeMB}MB)`);

			// Update Convex
			if (!flags.noUpdate) {
				try {
					const works = await convex.query(api.works.getFullWorks, {}) as any[];
					const entry = works.find((w: any) => w.title === recipe.title);
					if (entry) {
						await convex.mutation(api.works.updateEntry, {
							id: entry._id,
							videoPreview: `/videos/${slug}.mp4`,
							previewMode: "video",
						});
						console.log(`          ✓ Convex updated (mode: video)`);
					}
				} catch (err) {
					console.log(`          ⚠ Convex update failed: ${err}`);
				}
			}

			succeeded++;
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			console.log(`          ✗ FAILED: ${msg}`);
			failed++;
		}

		console.log();
	}

	await browser.close();
	rmSync(tmpDir, { recursive: true, force: true });

	console.log("  ────────────────────────────────────");
	console.log(`  Done: ${succeeded} recorded, ${failed} failed`);
	if (failed > 0) console.log("  Use --title to retry individual projects.");
	console.log();
	process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
	console.error("Unhandled error:", err);
	process.exit(1);
});
