import { api } from "../../../convex/_generated/api";
import { createConvexHttpClient } from "../convex";
import type { NavItem } from "../astro/site-content";
import { fallbackNavItems, fallbackSiteConfig } from "../astro/site-content";

export type PublicNavItem = NavItem;

export type PublicSiteConfig = typeof fallbackSiteConfig & {
	mode: "one-page" | "multi-page" | "reader" | "disabled";
	navMode?: "sidebar" | "drawer" | "hybrid";
	footerEdition?: string;
	parallaxSpeed?: number;
	readerModeRoute?: string;
	footerYear?: number;
	heroVisual?: string;
};

export type PublicFeatureFlag = {
	key: string;
	enabled: boolean;
	category?: string;
};

export type PublicRuntimeState = {
	navItems: PublicNavItem[];
	siteConfig: PublicSiteConfig;
	featureFlags: PublicFeatureFlag[];
};

export async function getPublicNavItems() {
	try {
		const client = createConvexHttpClient();
		return await client.query(api.pages.getNavItems, {});
	} catch (_error) {
		return fallbackNavItems;
	}
}

export async function getPublicSiteConfig() {
	try {
		const client = createConvexHttpClient();
		const siteConfig = await client.query(api.siteConfig.get, {});
		return {
			...fallbackSiteConfig,
			...(siteConfig ?? {}),
		} as PublicSiteConfig;
	} catch (_error) {
		return fallbackSiteConfig as PublicSiteConfig;
	}
}

export async function getPublicFeatureFlags() {
	try {
		const client = createConvexHttpClient();
		return await client.query(api.siteConfig.getFeatureFlags, {});
	} catch (_error) {
		return [];
	}
}

export async function getPublicRuntimeState(): Promise<PublicRuntimeState> {
	const [navItems, siteConfig, featureFlags] = await Promise.all([
		getPublicNavItems(),
		getPublicSiteConfig(),
		getPublicFeatureFlags(),
	]);

	return {
		navItems,
		siteConfig,
		featureFlags,
	};
}
