<script lang="ts">
	import { formatDate, getHighlight, works as staticWorks } from "$lib/data/content";
	import { getHighlightTextColor } from "$lib/utils/contrast";
	import AsciiDonut from "$lib/components/AsciiDonut.svelte";
	import AsciiWave from "$lib/components/AsciiWave.svelte";
	import Elevator from "$lib/components/Elevator.svelte";
	import WorksSection from "$lib/sections/WorksSection.svelte";
	import HiccupWorks from "$lib/components/HiccupWorks.svelte";
	import AsciiDiagram from "$lib/components/AsciiDiagram.svelte";
	import { onMount } from "svelte";
	import { getConvexClient } from "$lib/convex";
	import { sameAsUrlToLabel } from "$lib/utils/social-links";

	// Import from Clojure Abstraction Layer
	import { setup_hero_subscriptions, format_profile_data, get_hero_config_derived } from "$lib/clj/portfolio/sections/hero.mjs";
	import { get_hero_layout } from "$lib/clj/portfolio/ui/impeccable.mjs";
	import { stagedOverrides } from "$lib/stores/siteMode";
	// @ts-ignore
	import { exports as dataUtils } from '$lib/clj/portfolio/data/overrides.mjs';

	export let id = "hero";

	let heroConfig: any = null;
	$: effectiveHeroConfig = dataUtils.applyOverrides('heroConfig', heroConfig, $stagedOverrides);
	$: derivedConfig = get_hero_config_derived(effectiveHeroConfig);
	$: showDonut = derivedConfig.showDonut;
	$: showWave = derivedConfig.showWave;
	$: layout = derivedConfig.layout;
	$: isArchived = derivedConfig.archived;

	$: effectiveLayout = get_hero_layout(layout);

	// Typography styles from config
	$: heroNameStyles = `
		font-size: ${effectiveHeroConfig?.heroNameSize ? effectiveHeroConfig.heroNameSize + 'rem' : 'var(--font-size-3xl)'};
		font-weight: ${effectiveHeroConfig?.heroNameWeight ?? 700};
		letter-spacing: ${effectiveHeroConfig?.heroNameLetterSpacing ? effectiveHeroConfig.heroNameLetterSpacing + 'em' : 'var(--letter-spacing-tight)'};
		line-height: ${effectiveHeroConfig?.heroNameLineHeight ?? 'var(--line-height-dense)'};
		text-wrap: ${effectiveHeroConfig?.heroNameTextWrap ?? 'wrap'};
	`;

	let profileData: any = format_profile_data(null, {
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
		return setup_hero_subscriptions(client, {
			onProfile: (data: any) => {
				profileData = format_profile_data(data, profileData);
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
				<!-- Archive meta item s-t3U1eD8QnXou
				{#if profileData.available && !isArchived}
					<div class="meta-item s-t3U1eD8QnXou">
						<span class="meta-label">Status</span>
						<span class="meta-value status-available">Available for projects</span>
					</div>
				{/if}
				-->
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
			<!-- ASCII DIAGRAM (3X) -->
			<div class="mb-2xl">
				<AsciiDiagram />
			</div>

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
	}

	.hero-tagline {
		font-family: var(--font-sans);
		font-size: var(--font-size-base);
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
.status-available {
	color: var(--color-success);
}

/* Archived flashy styling for s-t3U1eD8QnXou meta-item */
.meta-item.s-t3U1eD8QnXou {
	position: relative;
	border-left: 2px solid var(--color-accent, #F97242);
	padding-left: var(--space-xs);
	background: linear-gradient(90deg, color-mix(in srgb, var(--color-accent, #F97242) 10%, transparent), transparent);
}

.hero-visual-wrapper {
...
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hero-visual {
		width: 100%;
		max-width: 500px;
	}

	/* Impeccable List Styling */
	.impeccable-list {
		margin-top: var(--space-md);
	}

	.entry-item {
		border-bottom: 1px solid var(--border-color-subtle);
		transition: transform var(--duration-fast) var(--easing);
	}

	.entry-item:hover {
		transform: translateX(4px);
		border-bottom-color: var(--border-color);
	}

	.entry-link {
		display: grid;
		grid-template-columns: 80px 1fr auto;
		align-items: center;
		padding: var(--space-md) 0;
		color: var(--color-text);
		text-decoration: none;
	}

	.entry-date {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.entry-title-text {
		font-weight: 500;
		font-size: var(--font-size-base);
	}

	.entry-arrow {
		color: var(--color-accent);
		opacity: 0;
		transition: opacity var(--duration-fast) var(--easing);
	}

	.entry-item:hover .entry-arrow {
		opacity: 1;
	}

	/* DOMAIN DISCOVERY */
	.domains {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-md);
		padding: var(--space-sm) 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
	}

	.domain-group {
		display: inline-flex;
		align-items: baseline;
		gap: var(--space-xs);
	}

	.domains a {
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color var(--duration-fast) var(--easing);
	}

	.domains a:hover {
		color: var(--color-accent);
	}

	.domains-sep {
		opacity: 0.4;
	}

	.domains-desc {
		color: var(--color-text-subtle);
	}

	/* Sidebar Connections */
	.connect-nav {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.connect-link {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-alt);
		border-radius: var(--radius-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		border: 1px solid transparent;
	}

	.connect-link:hover {
		background: var(--color-surface);
		border-color: var(--color-border-strong);
		color: var(--color-text);
	}

	.connect-arrow {
		font-size: 0.8em;
		opacity: 0.5;
	}

	@media (max-width: 1023px) {
		.hero-grid {
			gap: var(--space-2xl);
		}
		
		.hero-visual-wrapper {
			order: -1;
			min-height: 300px;
		}
	}
</style>
