<script lang="ts">
	import AsciiDonut from "$lib/components/AsciiDonut.svelte";
	import AsciiWave from "$lib/components/AsciiWave.svelte";
	import Elevator from "$lib/components/Elevator.svelte";
	import HiringProof from "$lib/components/HiringProof.svelte";
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
	$: socialLinks = (profileData.sameAs ?? [])
		.slice(0, 4)
		.map((url: string) => ({ label: sameAsUrlToLabel(url), url }));

	onMount(() => {
		const client = getConvexClient();
		return setupHeroSubscriptions(client, {
			onProfile: (data: any) => {
				profileData = formatProfileData(data, profileData);
			},
			onWorks: () => {},
			onConfig: (data: any) => {
				heroConfig = data;
			}
		});
	});
</script>

<!-- Hero - Impeccable 12-Column Grid Layout -->
<section {id} class="hero-section">
	<header class="grid-container hero-grid">
		<div class="col-4 md:col-6 lg:col-{effectiveLayout.identity} hero-content">
			<div class="hero-kicker">
				<span class="hero-kicker__line"></span>
				<span class="hero-kicker__text">Available for design engineering</span>
			</div>

			<div class="hero-header" id="greeting-0">
				<h1 class="hero-name" style={heroNameStyles}>
					{profileData.name}
				</h1>
				<p class="hero-tagline">
					Design engineer for AI-native products, expert tools, and trust-heavy interfaces.
				</p>
				<p class="hero-description">{profileData.shortBio}</p>
			</div>

			<div class="hero-meta-group">
				<div class="meta-item">
					<span class="meta-label">Location</span>
					<span class="meta-value">{profileData.location}</span>
				</div>
				<div class="meta-item">
					<span class="meta-label">Status</span>
					<span class="meta-value meta-value--available">Available now</span>
				</div>
			</div>

			{#if socialLinks.length > 0}
				<nav class="hero-links" aria-label="Selected connections">
					{#each socialLinks as link}
						<a href={link.url} target="_blank" rel="noreferrer noopener">{link.label}</a>
					{/each}
				</nav>
			{/if}

			<HiringProof />
		</div>

		<div class="col-4 md:col-6 lg:col-{effectiveLayout.visual} hero-visual-wrapper">
			<div class="hero-visual-frame">
				<div class="hero-visual-header">
					<span>Live signal</span>
					<span>Current practice</span>
				</div>
				<div class="hero-visual">
				{#if showDonut}<AsciiDonut />{/if}
				{#if showWave}<AsciiWave />{/if}
				</div>
				<div class="hero-visual-footer">
					<span>{profileData.location}</span>
					<span>Code, motion, systems</span>
				</div>
			</div>
		</div>
	</header>

	<div class="grid-container body-grid mt-2xl">
		<div class="col-4 md:col-12 lg:col-12 works-column">
			<div class="hero-proof-stage">
				<div class="hero-proof-panel">
					<div class="hero-ledger">
						<p class="hero-ledger__eyebrow">Selected proof</p>
						<p class="hero-ledger__summary">
							Start with the table for range. Use the live surfaces for proof that the work ships beyond static case studies.
						</p>
					</div>

					<div class="hero-table-wrap">
						<HiccupWorks viewMode="colorful-table" />
					</div>
				</div>

				<div class="hero-surfaces-panel">
					<header class="section-header section-header--hero">
						<span class="section-marker">◆</span>
						<h2 class="section-title">Live surfaces</h2>
						<p class="section-note">A small selection of actual routes.</p>
					</header>
					<p class="hero-surfaces-panel__summary">
						These are real shipped environments, not poster frames. The full works archive appears later as its own section.
					</p>
					<WorksSection id="hero-live-works" forceViewMode="grid" maxCount={4} showHeader={false} />
				</div>
			</div>
		</div>
	</div>

	<Elevator showAfter={400} />
</section>

<style>
	.hero-section {
		padding-top: clamp(1rem, 3vw, 2rem);
		animation: fadeIn var(--duration-slow) var(--easing);
	}

	.hero-grid {
		align-items: start;
		min-height: min(52rem, 72vh);
		padding-block: clamp(2rem, 5vw, 5rem) clamp(1rem, 2vw, 2rem);
		border-bottom: 1px solid color-mix(in srgb, var(--border-color-strong) 70%, transparent);
	}

	.hero-content {
		display: grid;
		align-content: start;
		gap: var(--space-lg);
		padding-right: clamp(1rem, 2vw, 2rem);
	}

	.hero-kicker {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--color-text-subtle);
	}

	.hero-kicker__line {
		width: 3rem;
		height: 1px;
		background: color-mix(in srgb, var(--color-text-subtle) 60%, transparent);
	}

	.hero-header {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		position: relative;
		z-index: 10;
	}

	.hero-name {
		margin: 0;
		color: var(--color-text);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-tighter);
		font-weight: var(--font-weight-bold);
		max-width: 8ch;
	}

	.hero-tagline {
		font-family: var(--font-sans);
		font-size: clamp(1.25rem, 1rem + 0.95vw, 1.95rem);
		font-weight: var(--font-weight-medium);
		color: var(--color-text);
		margin: 0;
		line-height: 1.1;
		letter-spacing: -0.03em;
		max-width: 18ch;
		text-wrap: balance;
	}

	.hero-description {
		margin: 0;
		max-width: 36ch;
		font-size: clamp(0.98rem, 0.9rem + 0.18vw, 1.08rem);
		line-height: 1.55;
		color: var(--color-text-secondary);
	}

	.hero-meta-group {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(1rem, 1.5vw, 1.5rem);
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
		letter-spacing: 0.16em;
	}

	.meta-value {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.meta-value--available {
		color: var(--color-success);
	}

	.hero-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		padding-top: 0.2rem;
	}

	.hero-links a {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
		text-decoration: none;
	}

	.hero-links a:hover {
		color: var(--color-text);
	}

	.hero-visual-wrapper {
		display: flex;
		justify-content: center;
		align-items: start;
	}

	.hero-visual-frame {
		width: 100%;
		max-width: 36rem;
		display: grid;
		gap: var(--space-sm);
		padding: var(--space-md);
		border: 1px solid color-mix(in srgb, var(--border-color-strong) 70%, transparent);
		background: color-mix(in srgb, var(--color-surface) 85%, var(--color-bg));
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
		min-height: clamp(16rem, 26vw, 24rem);
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
		gap: var(--space-md);
	}

	.hero-ledger {
		display: grid;
		gap: var(--space-xs);
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
		grid-template-columns: auto auto minmax(0, 1fr);
		align-items: center;
		column-gap: var(--space-sm);
		row-gap: var(--space-xs);
	}

	.section-note {
		margin: 0;
		justify-self: end;
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	@media (max-width: 1023px) {
		.hero-grid {
			gap: var(--space-2xl);
			min-height: auto;
		}
		
		.hero-visual-wrapper {
			order: -1;
			min-height: auto;
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

	@media (max-width: 767px) {
		.hero-section {
			padding-top: 0;
		}

		.hero-name {
			max-width: none;
		}

		.hero-visual-frame {
			padding: var(--space-sm);
		}

		.hero-visual {
			min-height: 14rem;
		}

		.section-header--hero {
			grid-template-columns: auto 1fr;
		}

		.section-note {
			grid-column: 1 / -1;
			justify-self: start;
		}
	}
</style>
