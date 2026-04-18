<script lang="ts">
	import { formatDate, getHighlight, works as staticWorks } from "$lib/data/content";
	import { getHighlightTextColor } from "$lib/utils/contrast";
	import AsciiDonut from "$lib/components/AsciiDonut.svelte";
	import AsciiWave from "$lib/components/AsciiWave.svelte";
	import Elevator from "$lib/components/Elevator.svelte";
	import { onMount } from "svelte";
	import { getConvexClient } from "$lib/convex";
	import { sameAsUrlToLabel } from "$lib/utils/social-links";

	// Import from Clojure Abstraction Layer
	import { setup_hero_subscriptions, format_profile_data, get_hero_config_derived } from "$lib/clj/portfolio/sections/hero.mjs";
	import { stagedOverrides } from "$lib/stores/siteMode";
	// @ts-ignore
	import { exports as dataUtils } from '$lib/clj/portfolio/data/overrides.mjs';
	import DoubleTapEdit from '$lib/components/DoubleTapEdit.svelte';

	export let id = "hero";

	let heroConfig: any = null;
	$: effectiveHeroConfig = dataUtils.applyOverrides('heroConfig', heroConfig, $stagedOverrides);
	$: derivedConfig = get_hero_config_derived(effectiveHeroConfig);
	$: showDonut = derivedConfig.showDonut;
	$: showWave = derivedConfig.showWave;
	$: layout = derivedConfig.layout;

	// Typography styles from config
	$: heroNameStyles = `
		font-size: ${effectiveHeroConfig?.heroNameSize ? effectiveHeroConfig.heroNameSize + 'rem' : 'var(--font-size-2xl)'};
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

<!-- Hero - Breathing Space -->
<section {id}>
<header class="hero" class:hero--diptych={layout === 'diptych'} class:hero--editorial={layout === 'editorial'} class:hero--stacked={layout === 'stacked'}>
	<div class="hero-content">
	import DoubleTapEdit from '$lib/components/DoubleTapEdit.svelte';
...
		<div class="hero-main">
			<h1 class="hero-name" style={heroNameStyles}>
				<DoubleTapEdit
					table="cvProfile"
					docId={profileData._id || 'singleton'}
					field="name"
					value={profileData.name}
					label="Hero Name"
				/>
			</h1>
			<p class="hero-tagline">
				<DoubleTapEdit
					table="cvProfile"
					docId={profileData._id || 'singleton'}
					field="shortBio"
					value={profileData.shortBio}
					label="Hero Tagline"
				/>
			</p>
		</div>

		<p class="hero-bio">{profileData.shortBio}</p>

		<div class="hero-meta">
			<span class="hero-location">{profileData.location}</span>
		</div>
	</div>

	<div class="hero-visual">
		{#if showDonut}<AsciiDonut />{/if}
		{#if showWave}<AsciiWave />{/if}
	</div>
</header>

<div class="page-sections">
<!-- THE WORK - First, because it speaks loudest -->
<section class="section">
	<header class="section-header">
		<span class="section-marker">&#9670;</span>
		<h2 class="section-title">WORKS</h2>
		<span class="section-count">{works.length}</span>
	</header>
	<ul class="entry-list">
		{#each works as entry}
			<li class="entry" data-highlight={getHighlight(entry)}
				style:--hl-text={getHighlightTextColor(entry.featured)}>
				<span class="entry-date">{formatDate(entry)}</span>
				<span class="entry-title">{entry.title}</span>
				{#if entry.url}
					<span class="entry-links">
						<a href={entry.url} target="_blank" rel="noopener noreferrer">visit</a>
					</span>
				{:else if entry.links && entry.links.length > 0}
					<span class="entry-links">
						{#each entry.links as link}
							<a href={link.url}>{link.label}</a>
						{/each}
					</span>
				{/if}
			</li>
		{/each}
	</ul>
</section>

<!-- Identity -->
<section class="section">
	<header class="section-header">
		<span class="section-marker">&#9670;</span>
		<h2 class="section-title">IDENTITY</h2>
		{#if profileData.sameAs.length > 0}
			<span class="section-count">{profileData.sameAs.length}</span>
		{/if}
	</header>
	<div class="domains">
		{#if profileData.sameAs.length > 0}
			{#each profileData.sameAs as url}
				<span class="domain-group">
					<a href={url} target="_blank" rel="noopener noreferrer">{sameAsUrlToLabel(url)}</a>
				</span>
			{/each}
		{:else}
			<!-- SSR fallback: static domains -->
			<span class="domain-group">
				<a href="https://mxzou.com" target="_blank" rel="noopener noreferrer">mxzou.com</a>
				<span class="domains-sep">&middot;</span>
				<span class="domains-desc">main</span>
			</span>
			<span class="domain-group">
				<a href="https://mengxuanzou.com" target="_blank" rel="noopener noreferrer">mengxuanzou.com</a>
				<span class="domains-sep">&middot;</span>
				<span class="domains-desc">filmmaking</span>
			</span>
			<span class="domain-group">
				<a href="https://stussysenik.com" target="_blank" rel="noopener noreferrer">stussysenik.com</a>
				<span class="domains-sep">&middot;</span>
				<span class="domains-desc">dev + creative</span>
			</span>
		{/if}
	</div>
</section>
</div>

<!-- Elevator back-to-top with music -->
<Elevator showAfter={400} />
</section>

<style>
	/* HERO */
	.hero {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: var(--space-xl);
		padding-top: var(--space-md);
		gap: var(--space-2xl);
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		max-width: 50ch;
		flex: 1.618 1 min(320px, 100%);
	}

	.hero-visual {
		flex: 1 1 280px;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-direction: column;
		gap: var(--space-lg);
	}

	/* ── DIPTYCH: book-spread, edge-aligned, no gap ────────────────── */
	.hero--diptych {
		flex-wrap: nowrap;
		gap: 0;
		align-items: stretch;
	}
	.hero--diptych .hero-content {
		flex: 1 1 50%;
		max-width: none;
	}
	.hero--diptych .hero-visual {
		flex: 1 1 50%;
	}
	.hero--diptych .hero-name {
		font-size: var(--font-size-3xl, clamp(2rem, 5vw, 3.5rem));
	}

	@media (max-width: 767px) {
		.hero--diptych {
			flex-wrap: wrap;
			gap: var(--space-xl);
		}
		.hero--diptych .hero-content,
		.hero--diptych .hero-visual {
			flex: 1 1 100%;
		}
	}

	/* ── EDITORIAL: full-width name, vertical flow ────────────────── */
	.hero--editorial {
		flex-direction: column;
		gap: var(--space-xl);
	}
	.hero--editorial .hero-content {
		max-width: none;
		flex: none;
	}
	.hero--editorial .hero-name {
		font-size: clamp(3rem, 8vw, 6rem);
		line-height: 0.9;
	}

	/* ── STACKED: centered vertically ─────────────────────────────── */
	.hero--stacked {
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-xl);
	}
	.hero--stacked .hero-content {
		align-items: center;
		text-align: center;
	}
	.hero--stacked .hero-bio {
		text-align: center;
	}

	.hero-main {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.hero-name {
		font-family: var(--font-sans);
		font-size: var(--font-size-2xl);
		font-weight: 700;
		letter-spacing: var(--letter-spacing-tight);
		color: var(--color-text);
		margin: 0;
		line-height: var(--line-height-dense);
	}

	.hero-tagline {
		font-family: var(--font-sans);
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		margin: 0;
		line-height: var(--line-height-relaxed);
	}

	.hero-bio {
		font-family: var(--font-sans);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		margin: 0;
		line-height: var(--line-height-relaxed);
		max-width: 45ch;
	}

	.hero-meta {
		display: flex;
		gap: var(--space-md);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
	}

	/* SECTIONS */
	.section {
		margin-bottom: var(--section-gap);
	}

	.section-header {
		display: flex;
		align-items: baseline;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
		padding-bottom: var(--space-sm);
		border-bottom: var(--border-width) solid var(--border-color);
	}

	.section-marker {
		color: var(--color-accent);
		font-size: var(--font-size-sm);
	}

	.section-title {
		font-family: var(--font-sans);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: var(--letter-spacing-wider);
		color: var(--color-text);
		margin: 0;
	}

	.section-count {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-text-subtle);
	}

	.section-count::before { content: "["; }
	.section-count::after { content: "]"; }

	/* ENTRY LIST */
	.entry-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		list-style: none;
		padding: 0;
	}

	.entry {
		display: flex;
		align-items: baseline;
		gap: var(--space-md);
		padding: var(--space-sm) 0;
	}

	.entry:hover { opacity: 0.9; }

	.entry[data-highlight] {
		padding: var(--space-sm);
		border-radius: var(--radius-sm);
		color: var(--hl-text, #000);
	}

	.entry-date {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
		min-width: 5ch;
		flex-shrink: 0;
		font-variant-numeric: tabular-nums;
	}

	.entry-title {
		font-size: var(--font-size-sm);
		color: var(--color-text);
		font-weight: 450;
		flex-grow: 1;
	}

	.entry-links {
		display: flex;
		gap: var(--space-sm);
	}

	.entry-links a {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-accent);
		text-decoration: none;
	}

	.entry-links a:hover { text-decoration: underline; }

	/* DOMAIN DISCOVERY */
	.domains {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-md);
		padding: var(--space-xl) 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
	}

	.domain-group {
		display: inline-flex;
		align-items: baseline;
		gap: var(--space-xs);
	}
</style>
