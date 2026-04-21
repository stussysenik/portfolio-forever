<script lang="ts">
	import { formatDate, getHighlight, works as staticWorks } from "$lib/data/content";
	import { getHighlightTextColor } from "$lib/utils/contrast";
	import AsciiDonut from "$lib/components/AsciiDonut.svelte";
	import AsciiWave from "$lib/components/AsciiWave.svelte";
	import Elevator from "$lib/components/Elevator.svelte";
	import WorksSection from "$lib/sections/WorksSection.svelte";
	import HiccupWorks from "$lib/components/HiccupWorks.svelte";
	import { onMount } from "svelte";
	import { getConvexClient } from "$lib/convex";
	import { sameAsUrlToLabel } from "$lib/utils/social-links";
	import { stagedOverrides } from "$lib/stores/siteMode";
	import { applyOverrides } from '$lib/data/overrides';
	
	// Import from local logic ports
	import { setupHeroSubscriptions, formatProfileData, getHeroConfigDerived } from "$lib/sections/hero-logic";
	import { getHeroLayout } from "$lib/sections/hero-layout";

	export let id = "hero";

	let heroConfig: any = null;
	$: effectiveHeroConfig = applyOverrides('heroConfig', heroConfig, $stagedOverrides);
	$: derivedConfig = getHeroConfigDerived(effectiveHeroConfig);
	$: showDonut = derivedConfig.showDonut;
	$: showWave = derivedConfig.showWave;
	$: layout = derivedConfig.layout;
	$: isArchived = derivedConfig.archived;

	$: effectiveLayout = getHeroLayout(layout);

	// Typography styles from config
	$: heroNameStyles = `
		font-size: ${effectiveHeroConfig?.heroNameSize ? effectiveHeroConfig.heroNameSize + 'rem' : 'var(--font-size-3xl)'};
		font-weight: ${effectiveHeroConfig?.heroNameWeight ?? 'var(--font-weight-bold)'};
		letter-spacing: ${effectiveHeroConfig?.heroNameLetterSpacing ? effectiveHeroConfig.heroNameLetterSpacing + 'em' : 'var(--letter-spacing-tighter)'};
		line-height: ${effectiveHeroConfig?.heroNameLineHeight ?? 'var(--line-height-tight)'};
		text-wrap: ${effectiveHeroConfig?.heroNameTextWrap ?? 'wrap'};
	`;

	let profileData: any = formatProfileData(null, {
		name: "Stüssy Senik",
		taglines: [{ lang: "de", text: "Design Engineer · Creative Producer" }],
		shortBio: "Building at the intersection of engineering, creative production, and design — from code to camera",
		location: "NYC / PRAGUE",
		available: true,
		sameAs: [] as string[],
	});
	let works: any[] = staticWorks;

	onMount(() => {
		const client = getConvexClient();
		return setupHeroSubscriptions(client, {
			onProfile: (data: any) => {
				profileData = formatProfileData(data, profileData);
			},
			onWorks: (data: any) => {
				works = Array.isArray(data) ? data : staticWorks;
			},
			onConfig: (data: any) => {
				heroConfig = data;
			}
		});
	});
</script>

<!-- Hero - Impeccable 12-Column Grid Layout -->
<section {id} class="hero-section">
	<header class="grid-container hero-grid">
		<!-- Identity Column -->
		<div class="col-4 md:col-6 lg:col-{effectiveLayout.identity} hero-content">
			<div class="hero-header" id="greeting-0">
				<h1 class="hero-name" style={heroNameStyles}>
					{profileData.name}
				</h1>
				<p class="hero-tagline">
					{profileData.shortBio}
				</p>
			</div>

			<div class="hero-meta-group">
				<div class="meta-item">
					<span class="meta-label">Location</span>
					<span class="meta-value">{profileData.location}</span>
				</div>
			</div>
		</div>

		<!-- Visual/Donut Column -->
		<div class="col-4 md:col-6 lg:col-{effectiveLayout.visual} hero-visual-wrapper">
			<div class="hero-visual">
				{#if showDonut}<AsciiDonut />{/if}
				{#if showWave}<AsciiWave />{/if}
			</div>
		</div>
	</header>

	<div class="grid-container body-grid mt-2xl">
		<!-- WORKS Column - Full Width -->
		<div class="col-4 md:col-12 lg:col-12 works-column">
			<!-- COLORFUL WORKS TABLE (HICCUP) -->
			<div class="mb-2xl">
				<HiccupWorks viewMode="colorful-table" />
			</div>

			<div class="mt-xl">
				<header class="section-header">
					<span class="section-marker">◆</span>
					<h2 class="section-title">LIVE EMBEDS</h2>
				</header>
				<WorksSection id="hero-live-works" forceViewMode="grid" />
			</div>
		</div>
	</div>

	<Elevator showAfter={400} />
</section>

<style>
	.hero-section {
		padding-top: var(--space-xl);
		animation: fadeIn var(--duration-slow) var(--easing);
	}

	.hero-grid {
		align-items: center;
		min-height: 40vh;
	}

	/* FIRST GREETING ELEMENT - Always rendering priority */
	.hero-header {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		order: -10; /* Ensure it renders first regardless of DOM position */
		position: relative;
		z-index: 10; /* Ensure visual priority */
	}

	.hero-name {
		margin: 0;
		color: var(--color-text);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-tighter);
		font-weight: var(--font-weight-bold);
	}

	.hero-tagline {
		font-family: var(--font-sans);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-normal);
		color: var(--color-text-secondary);
		margin: 0;
		line-height: var(--line-height-snug);
		max-width: 40ch;
	}

	.hero-meta-group {
		display: flex;
		gap: var(--space-xl);
		margin-top: var(--space-xl);
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
	}

	.meta-label {
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		color: var(--color-text-subtle);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-widest);
	}

	.meta-value {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.hero-visual-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hero-visual {
		width: 100%;
		max-width: 500px;
	}

	.mt-xl { margin-top: var(--space-xl); }
	.mt-2xl { margin-top: var(--space-2xl); }
	.mb-2xl { margin-bottom: var(--space-2xl); }

	@media (max-width: 1023px) {
		.hero-grid {
			gap: var(--space-2xl);
		}
		
		.hero-visual-wrapper {
			order: -1;
			min-height: 300px;
		}
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(var(--grid-columns), 1fr);
		gap: var(--grid-gap);
	}

	.col-4 { grid-column: span 4; }
	
	@media (min-width: 768px) {
		.md\:col-6 { grid-column: span 6; }
		.md\:col-12 { grid-column: span 12; }
	}

	@media (min-width: 1024px) {
		.lg\:col-12 { grid-column: span 12; }
		.lg\:col-6 { grid-column: span 6; }
		.lg\:col-7 { grid-column: span 7; }
		.lg\:col-5 { grid-column: span 5; }
	}
</style>
