<script lang="ts">
	import { formatDate, getHighlight, works as staticWorks } from "$lib/data/content";
	import { getHighlightTextColor } from "$lib/utils/contrast";
	import AsciiDonut from "$lib/components/AsciiDonut.svelte";
	import AsciiWave from "$lib/components/AsciiWave.svelte";
	import Elevator from "$lib/components/Elevator.svelte";
	import { onMount } from "svelte";
	import { getConvexClient } from "$lib/convex";
	import { api } from "$convex/_generated/api";
	import { sameAsUrlToLabel } from "$lib/utils/social-links";

	export let id = "hero";

	let heroConfig: any = null;
	$: showDonut = heroConfig?.showAsciiDonut ?? true;
	$: showWave = heroConfig?.showAsciiWave ?? false;
	$: layout = heroConfig?.layout ?? 'default';

	let profileData: any = {
		name: "Stüssy Senik",
		taglines: [{ lang: "de", text: "Design Engineer · Creative Producer" }],
		shortBio: "Building at the intersection of engineering, creative production, and design — from code to camera",
		location: "NYC / PRAGUE",
		sameAs: [] as string[],
	};
	let works: any[] = staticWorks;

	onMount(() => {
		const client = getConvexClient();
		const unsub1 = client.onUpdate(api.cv.getVisibleCV, {}, (data: any) => {
			if (data?.profile) {
				profileData = {
					name: data.profile.name,
					taglines: data.profile.taglines || profileData.taglines,
					shortBio: data.profile.shortBio || data.profile.summary,
					location: data.profile.location || profileData.location,
					sameAs: data.profile.sameAs || [],
				};
			}
		});
		const unsub2 = client.onUpdate(api.works.getVisibleWorks, {}, (data: any) => {
			works = Array.isArray(data) ? data : staticWorks;
		});
		const unsub3 = client.onUpdate(api.hero.getHeroConfig, {}, (data: any) => {
			heroConfig = data;
		});
		return () => { unsub1(); unsub2(); unsub3(); };
	});
</script>

<!-- Hero - Breathing Space -->
<section {id}>
<header class="hero" class:hero--diptych={layout === 'diptych'} class:hero--editorial={layout === 'editorial'} class:hero--stacked={layout === 'stacked'}>
	<div class="hero-content">
		<div class="hero-main">
			<h1 class="hero-name">{profileData.name}</h1>
			<p class="hero-tagline">{profileData.taglines[0]?.text ?? profileData.shortBio}</p>
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
<<<<<<< Updated upstream
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
=======
	.hero-section {
		padding-top: 0;
		animation: fadeIn var(--duration-slow) var(--easing);
	}

	.hero-grid {
		align-items: start;
		gap: var(--space-2xl);
		min-height: auto;
		padding-block: clamp(2rem, 5vw, 5rem) clamp(1rem, 2vw, 2rem);
		border-bottom: 1px solid color-mix(in srgb, var(--border-color-strong) 70%, transparent);
		min-width: 0;
	}

	.hero-content,
	.hero-visual-wrapper {
		min-width: 0;
	}

	@media (min-width: 1024px) {
		.hero-grid {
			gap: 0;
			min-height: min(52rem, 72vh);
		}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
		margin: 0;
		line-height: var(--line-height-dense);
=======
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-tighter);
		font-weight: var(--font-weight-bold);
		max-width: none;
	}

	@media (min-width: 768px) {
		.hero-name {
			max-width: 8ch;
		}
>>>>>>> Stashed changes
	}

	.hero-tagline {
		font-family: var(--font-sans);
<<<<<<< Updated upstream
		font-size: var(--font-size-base);
=======
		font-size: clamp(1.25rem, 1rem + 0.95vw, 1.95rem);
		font-weight: var(--font-weight-medium);
		color: var(--color-text);
		margin: 0;
		line-height: 1.25;
		letter-spacing: -0.02em;
		max-width: 18ch;
		text-wrap: balance;
	}

	.hero-description {
		margin: 0;
		max-width: 36ch;
		font-size: clamp(0.98rem, 0.9rem + 0.18vw, 1.08rem);
		line-height: 1.55;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
		flex-wrap: wrap;
		align-items: baseline;
=======
		justify-content: center;
		align-items: start;
		order: -1;
		min-height: auto;
	}

	@media (min-width: 1024px) {
		.hero-visual-wrapper {
			order: 0;
			min-height: auto;
		}
	}

	.hero-visual-frame {
		width: 100%;
		max-width: 36rem;
		display: grid;
		gap: var(--space-sm);
		padding: var(--space-sm);
		border: 1px solid color-mix(in srgb, var(--border-color-strong) 70%, transparent);
		background: color-mix(in srgb, var(--color-surface) 85%, var(--color-bg));
	}

	@media (min-width: 768px) {
		.hero-visual-frame {
			padding: var(--space-md);
		}
	}

	.hero-visual-header,
	.hero-visual-footer {
		display: flex;
		justify-content: space-between;
		gap: var(--space-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--color-text-subtle);
	}

	.hero-visual {
		width: 100%;
		min-height: 14rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1px solid color-mix(in srgb, var(--border-color) 65%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--border-color) 65%, transparent);
	}

	.mt-xl { margin-top: var(--space-xl); }
	.mt-2xl { margin-top: var(--space-2xl); }
	.mb-2xl { margin-bottom: var(--space-2xl); }

	.hero-proof-stage {
		display: grid;
		gap: clamp(1.5rem, 3vw, 3rem);
	}

	.hero-proof-panel,
	.hero-surfaces-panel {
		display: grid;
		align-content: start;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
	}
</style>
=======
		max-width: 36rem;
		margin-bottom: var(--space-lg);
	}

	.hero-ledger__eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--color-text-subtle);
	}

	.hero-ledger__summary {
		margin: 0;
		font-size: var(--font-size-sm);
		line-height: 1.55;
		color: var(--color-text-secondary);
		max-width: 42ch;
	}

	.hero-table-wrap,
	.hero-surfaces-panel {
		padding-top: var(--space-sm);
		border-top: 1px solid color-mix(in srgb, var(--border-color) 78%, transparent);
	}

	.hero-surfaces-panel__summary {
		margin: 0;
		max-width: 34ch;
		font-size: var(--font-size-sm);
		line-height: 1.55;
		color: var(--color-text-secondary);
	}

	.section-header--hero {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		column-gap: var(--space-sm);
		row-gap: var(--space-xs);
	}

	.section-note {
		margin: 0;
		grid-column: 1 / -1;
		justify-self: start;
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	@media (min-width: 768px) {
		.section-header--hero {
			grid-template-columns: auto auto minmax(0, 1fr);
		}

		.section-note {
			grid-column: auto;
			justify-self: end;
		}
	}

	.grid-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-md);
	}

	.col-4 { grid-column: 1 / -1; }

	@media (min-width: 768px) {
		.grid-container {
			grid-template-columns: repeat(var(--grid-columns), 1fr);
			gap: var(--grid-gap);
		}

		.col-4 { grid-column: span 4; }
	}
	
	@media (min-width: 768px) {
		.hero-visual {
			min-height: clamp(16rem, 26vw, 24rem);
		}

		.hero-name {
			max-width: 8ch;
		}

		.hero-section {
			padding-top: clamp(1rem, 3vw, 2rem);
		}

		.md\:col-6 { grid-column: span 6; }
		.md\:col-12 { grid-column: span 12; }
	}

	@media (min-width: 1024px) {
		.lg\:col-12 { grid-column: span 12; }
		.lg\:col-6 { grid-column: span 6; }
		.lg\:col-7 { grid-column: span 7; }
		.lg\:col-5 { grid-column: span 5; }
	}

	@media (min-width: 1800px) {
		.hero-grid {
			min-height: min(56rem, 78vh);
		}

		.hero-visual-frame {
			max-width: 40rem;
		}
	}

	@media (min-width: 1200px) {
		.hero-proof-stage {
			grid-template-columns: minmax(0, 1.2fr) minmax(21rem, 0.8fr);
			align-items: start;
		}

		.hero-surfaces-panel {
			position: sticky;
			top: clamp(5.5rem, 9vh, 7rem);
		}
	}

	</style>
>>>>>>> Stashed changes
