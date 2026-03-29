import { writable, derived, get } from "svelte/store";
import { goto } from "$app/navigation";

export type SiteMode = "one-page" | "multi-page" | "reader";

export const siteMode = writable<SiteMode>("multi-page");

// Local override for user toggle (r key) independent of admin setting
export const readerOverride = writable<boolean | null>(null);

// Effective reader state: override takes precedence over site mode
export const isReaderMode = derived(
	[siteMode, readerOverride],
	([$mode, $override]) => $override ?? ($mode === "reader")
);

// Full site config from Convex (section order, parallax, etc.)
export const siteConfig = writable<{
	sectionOrder?: string[];
	parallaxSpeed?: number;
} | null>(null);

// Feature flags from Convex
export const featureFlags = writable<Map<string, boolean>>(new Map());

export function isFeatureEnabled(key: string): boolean {
	const flags = get(featureFlags);
	return flags.get(key) ?? true; // default enabled
}

export function redirectIfOnePage(sectionId: string) {
	const mode = get(siteMode);
	if (mode === "one-page" || mode === "reader") {
		goto(`/#${sectionId}`, { replaceState: true });
		return true;
	}
	return false;
}
