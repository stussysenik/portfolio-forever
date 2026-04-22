<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { api } from "../../../convex/_generated/api.js";
	import { getConvexClient } from "../../lib/convex";
	import {
		publicRuntimeState,
		setPublicRuntimeState,
		updatePublicFeatureFlags,
		updatePublicNavItems,
		updatePublicSiteConfig,
	} from "../../lib/stores/publicRuntime";
	import { 
		depthController, 
		themeMatrix, 
		physicsEngine,
		type DepthLevel,
		type ThemeMode,
		type PhysicsMode
	} from "../../lib/stores/controls";
	import { oklchAccentColor, spacingAtom } from "../../lib/stores/theme";
	
	import type {
		PublicFeatureFlag,
		PublicNavItem,
		PublicRuntimeState,
		PublicSiteConfig,
	} from "../../lib/server/convex";

	export let initialRuntime: PublicRuntimeState;

	let unsubscribeNav: (() => void) | undefined;
	let unsubscribeSiteConfig: (() => void) | undefined;
	let unsubscribeFeatureFlags: (() => void) | undefined;

	$: if (typeof document !== "undefined") {
		document.documentElement.style.setProperty("--color-accent", $oklchAccentColor);
		document.documentElement.style.setProperty("--spacing-multiplier", String($spacingAtom));
	}

	function handleSetDepth(e: Event) {
		const detail = (e as CustomEvent).detail as DepthLevel;
		if (detail) depthController.set(detail);
	}

	function handleSetTheme(e: Event) {
		const detail = (e as CustomEvent).detail as ThemeMode;
		if (detail) themeMatrix.set(detail);
	}

	function handleSetPhysics(e: Event) {
		const detail = (e as CustomEvent).detail as PhysicsMode;
		if (detail) physicsEngine.set(detail);
	}

	function applySiteDatasets(siteConfig?: Partial<PublicSiteConfig> | null) {
		if (typeof document === "undefined") {
			return;
		}

		const mode = siteConfig?.mode ?? "multi-page";
		const navMode = siteConfig?.navMode ?? "sidebar";

		document.documentElement.dataset.siteMode = mode;
		document.documentElement.dataset.navMode = navMode;
		document.body.dataset.siteMode = mode;
		document.body.dataset.navMode = navMode;
	}

	$: applySiteDatasets($publicRuntimeState.siteConfig);

	onMount(() => {
		setPublicRuntimeState(initialRuntime);
		applySiteDatasets(initialRuntime.siteConfig);

		window.addEventListener('setDepth', handleSetDepth);
		window.addEventListener('setTheme', handleSetTheme);
		window.addEventListener('setPhysics', handleSetPhysics);

		const client = getConvexClient();
		if (!client) {
			return;
		}

		unsubscribeNav = client.onUpdate(api.pages.getNavItems, {}, (data: unknown) => {
			updatePublicNavItems(Array.isArray(data) ? (data as PublicNavItem[]) : []);
		});

		unsubscribeSiteConfig = client.onUpdate(api.siteConfig.get, {}, (data: unknown) => {
			updatePublicSiteConfig((data as Partial<PublicSiteConfig> | null | undefined) ?? null);
		});

		unsubscribeFeatureFlags = client.onUpdate(api.siteConfig.getFeatureFlags, {}, (data: unknown) => {
			updatePublicFeatureFlags(Array.isArray(data) ? (data as PublicFeatureFlag[]) : []);
		});
	});

	onDestroy(() => {
		unsubscribeNav?.();
		unsubscribeSiteConfig?.();
		unsubscribeFeatureFlags?.();
		
		if (typeof window !== 'undefined') {
			window.removeEventListener('setDepth', handleSetDepth);
			window.removeEventListener('setTheme', handleSetTheme);
			window.removeEventListener('setPhysics', handleSetPhysics);
		}
	});
</script>
