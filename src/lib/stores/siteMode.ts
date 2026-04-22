import { writable, derived, get } from "svelte/store";
import { goto } from "$app/navigation";
import { browser } from "$app/environment";

export type SiteMode = "one-page" | "multi-page" | "reader" | "disabled";

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
	navMode?: NavParadigm;
} | null>(null);

// Feature flags from Convex
export const featureFlags = writable<Map<string, boolean>>(new Map());

export type NavParadigm = "sidebar" | "drawer" | "hybrid";

export const navParadigm = writable<NavParadigm>("sidebar");

if (browser) {
	const saved = localStorage.getItem("navParadigm");
	if (saved === "sidebar" || saved === "drawer" || saved === "hybrid") {
		navParadigm.set(saved);
	}
	navParadigm.subscribe((v) => {
		localStorage.setItem("navParadigm", v);
	});
}

// WIP banner toggle — persisted in localStorage
export const wipBannerDismissed = writable<boolean>(false);
if (browser) {
	const saved = localStorage.getItem("wipBannerDismissed");
	if (saved === "true") wipBannerDismissed.set(true);
	wipBannerDismissed.subscribe((v) => {
		localStorage.setItem("wipBannerDismissed", String(v));
	});
}

// Preview mode: when true, this page is running inside an admin preview iframe.
// ALL Convex/Rust subscriptions are blocked — the preview is WYSIWYG-only,
// relying on admin-provided data passed via postMessage instead of live DB calls.
export const previewMode = writable<boolean>(false);
if (browser) {
	const params = new URLSearchParams(window.location.search);
	if (params.get('preview') === 'true') {
		previewMode.set(true);
		// Read nav paradigm from URL param in preview mode
		const navParam = params.get('nav');
		if (navParam === 'sidebar' || navParam === 'drawer' || navParam === 'hybrid' || navParam === 'none') {
			navParadigm.set(navParam === 'none' ? 'hybrid' : navParam);
		}
	}
	// Listen for admin postMessage to update nav paradigm live
	window.addEventListener('message', (e: MessageEvent) => {
		if (e.data?.type === 'admin:setNavParadigm') {
			const nav = e.data.navParadigm;
			if (nav === 'sidebar' || nav === 'drawer' || nav === 'hybrid') {
				navParadigm.set(nav);
			}
		}
		if (e.data?.type === 'admin:setTheme') {
			document.documentElement.dataset.theme = e.data.theme;
		}
		if (e.data?.type === 'admin:setFont') {
			document.documentElement.dataset.font = e.data.font;
		}
	});
}

// Defensive blocker: returns true when Convex/Rust calls should be SUPPRESSED.
// Use this to guard every subscription in the customer-facing layout.
export const shouldBlockCalls = derived(
	[previewMode],
	([$preview]) => $preview
);

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
