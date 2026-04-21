/**
 * Admin constants and utilities.
 * Ported from clj/portfolio/admin/constants.cljs
 */

export const flagCategories = [
	{ 
		id: "core", 
		label: "Core System", 
		icon: "⚙️",
		flags: ["view-transitions", "parallax", "command-palette"]
	},
	{ 
		id: "ux", 
		label: "User Experience", 
		icon: "✨",
		flags: ["wip-banner", "social-links", "elevator"]
	},
	{ 
		id: "experimental", 
		label: "Experimental", 
		icon: "🧪",
		flags: ["pixel-engine", "ascii-donut", "terminal-matrix", "os-desktop"]
	},
	{ 
		id: "performance", 
		label: "Performance", 
		icon: "⚡",
		flags: []
	},
];

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
