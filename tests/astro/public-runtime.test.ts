import { afterEach, describe, expect, it } from "vitest";
import { fallbackSiteConfig } from "../../src/lib/astro/site-content";
import type { PublicSiteConfig } from "../../src/lib/server/convex";
import {
	getWipBannerEnabled,
	publicRuntimeState,
	setPublicRuntimeState,
	updatePublicFeatureFlags,
	updatePublicNavItems,
	updatePublicSiteConfig,
} from "../../src/lib/stores/publicRuntime";

describe("public runtime store", () => {
	const defaultSiteConfig = {
		...fallbackSiteConfig,
		mode: "multi-page",
	} as PublicSiteConfig;

	afterEach(() => {
		setPublicRuntimeState({
			navItems: [],
			siteConfig: defaultSiteConfig,
			featureFlags: [],
		});
	});

	it("filters admin routes and preserves fallback site config defaults", () => {
		setPublicRuntimeState({
			navItems: [
				{ label: "Home", route: "/" },
				{ label: "Admin", route: "/admin/system" },
				{ label: "Works", route: "/works", archived: false },
			],
			siteConfig: {
				...fallbackSiteConfig,
				mode: "reader",
			} as PublicSiteConfig,
			featureFlags: [{ key: "wip-banner", enabled: true, category: "layout" }],
		});

		expect(publicRuntimeState.get()).toEqual({
			navItems: [
				{ label: "Home", route: "/" },
				{ label: "Works", route: "/works", archived: false },
			],
			siteConfig: {
				...fallbackSiteConfig,
				mode: "reader",
			},
			featureFlags: [{ key: "wip-banner", enabled: true, category: "layout" }],
		});
	});

	it("merges site config updates instead of dropping fallback fields", () => {
		updatePublicSiteConfig({
			navMode: "drawer",
			footerYear: 2026,
		});

		expect(publicRuntimeState.get().siteConfig).toEqual({
			...fallbackSiteConfig,
			mode: "multi-page",
			navMode: "drawer",
			footerYear: 2026,
		});
	});

	it("keeps public nav and banner state aligned with runtime updates", () => {
		updatePublicNavItems([
			{ label: "Blog", route: "/blog" },
			{ label: "Admin", route: "/admin" },
		]);
		updatePublicFeatureFlags([{ key: "wip-banner", enabled: false, category: "layout" }]);

		expect(publicRuntimeState.get().navItems).toEqual([{ label: "Blog", route: "/blog" }]);
		expect(getWipBannerEnabled(publicRuntimeState.get(), true)).toBe(false);
		expect(getWipBannerEnabled({ ...publicRuntimeState.get(), featureFlags: [] }, true)).toBe(true);
	});
});
