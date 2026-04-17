<script lang="ts">
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { featureFlags } from "$lib/stores/siteMode";
	import OnePageView from "$lib/components/OnePageView.svelte";
	import CubeShell from "$lib/components/CubeShell.svelte";
	import { profile } from "$lib/data/content";
	import { getConvexClient } from "$lib/convex";
	import { api } from "$convex/_generated/api";
	import { resolveComponentKey } from "$lib/sections/registry";

	import HeroSection from "$lib/sections/HeroSection.svelte";
	import WorksSection from "$lib/sections/WorksSection.svelte";
	import TalksSection from "$lib/sections/TalksSection.svelte";
	import TerminalSection from "$lib/sections/TerminalSection.svelte";
	import CvSection from "$lib/sections/CvSection.svelte";
	import AcademiaSection from "$lib/sections/AcademiaSection.svelte";
	import BlogSection from "$lib/sections/BlogSection.svelte";
	import ProcessSection from "$lib/sections/ProcessSection.svelte";
	import GallerySection from "$lib/sections/GallerySection.svelte";
	import LikesSection from "$lib/sections/LikesSection.svelte";
	import MinorSection from "$lib/sections/MinorSection.svelte";
	import GiftsSection from "$lib/sections/GiftsSection.svelte";
	import OsSection from "$lib/sections/OsSection.svelte";
	import LabsSection from "$lib/sections/LabsSection.svelte";
	import MediaSection from "$lib/sections/MediaSection.svelte";

	const componentMap: Record<string, any> = {
		hero: HeroSection,
		works: WorksSection,
		talks: TalksSection,
		terminal: TerminalSection,
		cv: CvSection,
		academia: AcademiaSection,
		blog: BlogSection,
		process: ProcessSection,
		gallery: GallerySection,
		likes: LikesSection,
		minor: MinorSection,
		gifts: GiftsSection,
		os: OsSection,
		labs: LabsSection,
		media: MediaSection,
	};

	let cubeMode = $state(false);
	let homePage: any = null;

	onMount(() => {
		let unsub1: (() => void) | null = null;
		let unsub2: (() => void) | null = null;

		const client = getConvexClient();
		unsub1 = client.onUpdate(api.siteConfig.getFeatureFlags, {}, (data: any) => {
			if (data) {
				const map = new Map<string, boolean>();
				for (const f of data) {
					map.set(f.key, f.enabled);
				}
				featureFlags.set(map);
				cubeMode = map.get('cube-mode') ?? false;
			}
		});

		unsub2 = client.onUpdate(api.pages.getByPageId, { pageId: "home" }, (data: any) => {
			if (data) homePage = data;
		});

		function handleMessage(e: MessageEvent) {
			if (e.data?.type === 'admin:flagOverrides') {
				const overrides = e.data.overrides as Record<string, boolean>;
				if ('cube-mode' in overrides) {
					cubeMode = overrides['cube-mode'];
				}
			}
		}

		window.addEventListener('message', handleMessage);
		return () => {
			unsub1?.();
			unsub2?.();
			window.removeEventListener('message', handleMessage);
		};
	});

	let pageSections = $derived(
		homePage?.sections
			? [...homePage.sections].sort((a: any, b: any) => a.order - b.order)
			: []
	);
</script>

<svelte:head>
	<title>Stüssy Senik</title>
	<meta name="description" content={profile.shortBio} />
</svelte:head>

{#if cubeMode}
	<CubeShell sections={pageSections} {componentMap} />
{:else}
	<OnePageView />
{/if}
