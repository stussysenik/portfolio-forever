/**
 * Admin constants and utilities.
 * The current admin surface imports these symbols broadly, so this file
 * must preserve a stable contract even while the UI is being standardized.
 */

export const VIEW_MODES = ["grid", "case-study", "minimal-list", "colorful-table"] as const;

export const TYPOGRAPHY_DEFAULTS = {
	fontSize: 3.5,
	fontWeight: 400,
	letterSpacing: 0,
	lineHeight: 1.2,
} as const;

export const DEFAULTS = {
	hero: {
		heroNameSize: 3.5,
		heroNameWeight: 400,
		heroNameLetterSpacing: 0,
		heroNameLineHeight: 1.2,
		heroNameTextWrap: "wrap",
	},
} as const;

export const flagCategories = [
	{
		id: "core",
		label: "Core System",
		icon: "⚙️",
		flags: ["view-transitions", "parallax", "command-palette"],
	},
	{
		id: "ux",
		label: "User Experience",
		icon: "✨",
		flags: ["wip-banner", "social-links", "elevator"],
	},
	{
		id: "experimental",
		label: "Experimental",
		icon: "🧪",
		flags: ["pixel-engine", "ascii-donut", "terminal-matrix", "os-desktop"],
	},
	{
		id: "performance",
		label: "Performance",
		icon: "⚡",
		flags: [],
	},
] as const;

export function stripConvexMeta<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(Object.entries(value).filter(([key]) => !key.startsWith("_"))) as T;
}

export function formatRelativeTime(timestamp: number): string {
	if (!timestamp) return "unknown";
	const now = Date.now();
	const diff = now - timestamp;

	const seconds = Math.floor(diff / 1000);
	if (seconds < 60) return "just now";

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;

	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;

	return new Date(timestamp).toLocaleDateString();
}
