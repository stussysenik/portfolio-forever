import { atom } from "nanostores";
import { fallbackSiteConfig } from "../astro/site-content";
import type {
	PublicFeatureFlag,
	PublicNavItem,
	PublicRuntimeState,
	PublicSiteConfig,
} from "../server/convex";

const defaultRuntimeState: PublicRuntimeState = {
	navItems: [],
	siteConfig: {
		...fallbackSiteConfig,
		mode: "multi-page",
	},
	featureFlags: [],
};

export const publicRuntimeState = atom<PublicRuntimeState>(defaultRuntimeState);

function normalizeNavItems(items?: PublicNavItem[]) {
	return (items ?? []).filter((item) => item?.route && !item.route.startsWith("/admin"));
}

function normalizeSiteConfig(siteConfig?: Partial<PublicSiteConfig> | null): PublicSiteConfig {
	return {
		...fallbackSiteConfig,
		mode: "multi-page",
		...(siteConfig ?? {}),
	} as PublicSiteConfig;
}

function normalizeFeatureFlags(featureFlags?: PublicFeatureFlag[]) {
	return featureFlags ?? [];
}

export function setPublicRuntimeState(next: Partial<PublicRuntimeState>) {
	publicRuntimeState.set({
		navItems: normalizeNavItems(next.navItems),
		siteConfig: normalizeSiteConfig(next.siteConfig),
		featureFlags: normalizeFeatureFlags(next.featureFlags),
	});
}

export function updatePublicNavItems(navItems: PublicNavItem[]) {
	publicRuntimeState.set({
		...publicRuntimeState.get(),
		navItems: normalizeNavItems(navItems),
	});
}

export function updatePublicSiteConfig(siteConfig?: Partial<PublicSiteConfig> | null) {
	publicRuntimeState.set({
		...publicRuntimeState.get(),
		siteConfig: normalizeSiteConfig(siteConfig),
	});
}

export function updatePublicFeatureFlags(featureFlags: PublicFeatureFlag[]) {
	publicRuntimeState.set({
		...publicRuntimeState.get(),
		featureFlags: normalizeFeatureFlags(featureFlags),
	});
}

export function getWipBannerEnabled(state: PublicRuntimeState, fallbackEnabled: boolean) {
	const runtimeFlag = state.featureFlags.find((flag) => flag.key === "wip-banner");
	return runtimeFlag?.enabled ?? fallbackEnabled;
}
