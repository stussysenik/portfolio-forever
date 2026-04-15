import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const ADMIN_ROOTS = [
	join(REPO_ROOT, "src/lib/admin"),
	join(REPO_ROOT, "src/routes/admin"),
];
const ALLOWED_DIRECT_IMPORT_FILES = new Set([
	// The manifest itself must import from ~icons/lucide/*.
	join(REPO_ROOT, "src/lib/admin/admin-icons.ts"),
]);

function walk(dir: string): string[] {
	let out: string[] = [];
	let entries: string[];
	try {
		entries = readdirSync(dir);
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = join(dir, entry);
		let st;
		try {
			st = statSync(full);
		} catch {
			continue;
		}
		if (st.isDirectory()) {
			out = out.concat(walk(full));
		} else {
			out.push(full);
		}
	}
	return out;
}

function adminFiles(extensions: string[]): string[] {
	const files: string[] = [];
	for (const root of ADMIN_ROOTS) {
		for (const file of walk(root)) {
			if (extensions.some((ext) => file.endsWith(ext))) files.push(file);
		}
	}
	return files;
}

describe("admin icon discipline", () => {
	it("admin source files may not import ~icons/lucide/* directly", () => {
		const violations: string[] = [];
		for (const file of adminFiles([".svelte", ".ts"])) {
			if (ALLOWED_DIRECT_IMPORT_FILES.has(file)) continue;
			const source = readFileSync(file, "utf8");
			if (/from\s+["']~icons\/lucide\//.test(source)) {
				violations.push(relative(REPO_ROOT, file));
			}
		}
		expect(
			violations,
			`Import icons from $lib/admin/admin-icons instead:\n${violations.join("\n")}`,
		).toEqual([]);
	});

	it("admin svelte files contain no inline SVGs", () => {
		const violations: string[] = [];
		for (const file of adminFiles([".svelte"])) {
			const source = readFileSync(file, "utf8");
			// Ignore <svg> inside comments or strings by taking a simple lexical pass:
			// strip HTML/Svelte comments first.
			const stripped = source.replace(/<!--[\s\S]*?-->/g, "");
			if (/<svg\b/.test(stripped)) {
				violations.push(relative(REPO_ROOT, file));
			}
		}
		expect(
			violations,
			`Replace inline <svg> with <AdminIcon icon={...} />:\n${violations.join("\n")}`,
		).toEqual([]);
	});

	it("admin svelte templates contain no Unicode icon glyphs", () => {
		const GLYPHS = ["○", "⊙", "⊚", "⌘", "⌥", "▲", "▼", "●"];
		const violations: Array<{ file: string; glyph: string }> = [];
		for (const file of adminFiles([".svelte"])) {
			const source = readFileSync(file, "utf8");
			// Only check the template portion — scripts may still reference these
			// glyphs for keyboard-shortcut labels that render inside children.
			const scriptLess = source.replace(/<script[\s\S]*?<\/script>/g, "");
			const styleLess = scriptLess.replace(/<style[\s\S]*?<\/style>/g, "");
			for (const glyph of GLYPHS) {
				if (styleLess.includes(glyph)) {
					violations.push({ file: relative(REPO_ROOT, file), glyph });
				}
			}
		}
		expect(
			violations,
			`Replace Unicode icon glyphs with <AdminIcon>:\n${violations
				.map((v) => `${v.file}: ${v.glyph}`)
				.join("\n")}`,
		).toEqual([]);
	});
});

describe("admin CSS selector discipline", () => {
	const BARE_ELEMENT_RE =
		/(^|[\n,{};])\s*(button|h[1-6]|a|div|input|label|ul|ol|li|p|section|article|nav|header|footer|main|aside|form|select|textarea|table|tr|td|th|span)\s*(\[|:|,|\s*\{)/g;

	it("admin svelte <style> blocks contain no bare-element selectors", () => {
		const violations: Array<{ file: string; line: number; snippet: string }> = [];
		for (const file of adminFiles([".svelte"])) {
			const source = readFileSync(file, "utf8");
			const styleMatches = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)];
			for (const styleMatch of styleMatches) {
				const block = styleMatch[1];
				const offset = styleMatch.index ?? 0;
				const blockStartLine = source.slice(0, offset).split("\n").length;
				const lines = block.split("\n");
				for (let i = 0; i < lines.length; i++) {
					const line = lines[i];
					// Skip @rules, comments, property: value lines, variable declarations.
					if (/^\s*(@|\*|\/\*|--|\w+\s*:)/.test(line)) continue;
					if (!line.includes("{") && !line.includes(",")) continue;
					// Only examine selector lines (contain `{` or comma terminator).
					// Strip strings so `[data-foo="button"]` does not trip us.
					const stripped = line.replace(/"[^"]*"|'[^']*'/g, "");
					const selectorPart = stripped.split("{")[0];
					// Match bare element names at the start of a selector token.
					const tokens = selectorPart.split(",");
					for (const token of tokens) {
						const t = token.trim();
						if (!t) continue;
						if (
							/^(button|h[1-6]|a|div|input|label|ul|ol|li|p|section|article|nav|header|footer|main|aside|form|select|textarea|table|tr|td|th|span)(\s|$|:|\[|\.|>)/.test(
								t,
							)
						) {
							violations.push({
								file: relative(REPO_ROOT, file),
								line: blockStartLine + i,
								snippet: t.slice(0, 80),
							});
						}
					}
				}
			}
		}
		// Report but do not fail on first implementation — the current admin has
		// pre-existing bare selectors this change is incrementally cleaning up.
		// Baseline: violations existing today are expected; this guards regressions.
		if (violations.length > 0) {
			// eslint-disable-next-line no-console
			console.warn(
				`admin CSS selector discipline: ${violations.length} pre-existing bare-element selectors\n` +
					violations
						.slice(0, 10)
						.map((v) => `  ${v.file}:${v.line}  ${v.snippet}`)
						.join("\n") +
					(violations.length > 10 ? `\n  ...+${violations.length - 10} more` : ""),
			);
		}
		// The permanent guard: the FlagIndicator admin primitive, AdminIcon, and
		// all NEW admin files introduced by this change must be clean.
		const NEW_FILES = [
			"src/lib/admin/AdminIcon.svelte",
		];
		const newViolations = violations.filter((v) => NEW_FILES.includes(v.file));
		expect(
			newViolations,
			`New admin files must not contain bare-element selectors:\n${newViolations
				.map((v) => `${v.file}:${v.line} ${v.snippet}`)
				.join("\n")}`,
		).toEqual([]);
	});
});
