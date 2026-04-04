<script lang="ts">
	import { formatDate, getHighlight, works as staticWorks } from "$lib/data/content";
	import { getHighlightTextColor } from "$lib/utils/contrast";
	import AsciiDonut from "$lib/components/AsciiDonut.svelte";
	import Elevator from "$lib/components/Elevator.svelte";
	import HeroPositioningBlock from "$lib/components/blocks/HeroPositioningBlock.svelte";
	import OutcomeBlock from "$lib/components/blocks/OutcomeBlock.svelte";
	import MetadataBlock from "$lib/components/blocks/MetadataBlock.svelte";
	import { isScreenPass, isDeepDive, isFullArchive } from "$lib/stores/controls";
	import { onMount } from "svelte";
	import { getConvexClient } from "$lib/convex";
	import { api } from "$convex/_generated/api";

	export let id = "hero";

	let profileData: any = {
		name: "Stüssy Senik",
		taglines: [{ lang: "de", text: "Design Engineer · Creative Producer" }],
		shortBio: "Building at the intersection of engineering, creative production, and design — from code to camera",
		location: "NYC / PRAGUE",
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
				};
			}
		});
		const unsub2 = client.onUpdate(api.works.getVisibleWorks, {}, (data: any) => {
			works = Array.isArray(data) ? data : staticWorks;
		});
		return () => { unsub1(); unsub2(); };
	});
</script>

<!-- The New Thesis-Driven Evidence Engine -->
<section {id}>
	<!-- Hero Positioning -->
	{#if $isScreenPass || $isDeepDive || $isFullArchive}
		<header class="hero-evidence">
			<HeroPositioningBlock
				title={profileData.name}
				thesis={profileData.taglines[0]?.text ?? profileData.shortBio}
			/>
		</header>
	{/if}

	<div class="page-sections">

		<!-- The Case Studies (Immediate Evidence Density) -->
		<section class="section pt-xl">
			<header class="section-header">
				<span class="section-marker">&#9670;</span>
				<h2 class="section-title">FLAGSHIP SHIPMENTS</h2>
			</header>

			<div class="flex flex-col gap-2xl">
				<!-- Case Study 1: Attendu -->
				<div class="case-study pb-lg border-b border-border-color-subtle">
					<div class="mb-md">
						<h3 class="text-xl weight-bold tracking-tight mb-2xs">Attendu Platform Overhaul</h3>
						{#if $isScreenPass || $isDeepDive || $isFullArchive}
							<div class="flex gap-lg flex-wrap mb-sm">
								<MetadataBlock label="Time to Ship" value="2 weeks" />
								<MetadataBlock label="Role" value="Lead Design Engineer" />
								<MetadataBlock label="Framework" value="SvelteKit + Tailwind" />
							</div>
						{/if}
					</div>

					<!-- Outcomes explicitly front-loaded -->
					<OutcomeBlock
						problem="Aesthetics were high, but conversion funnel lacked trust signals."
						constraint="Strict 2-week timeline before Series A raise."
						result="Increased demo conversions by 42% post-rebuild."
					/>
				</div>

				<!-- Case Study 2: Claude Code Elixir -->
				<div class="case-study pb-lg">
					<div class="mb-md">
						<h3 class="text-xl weight-bold tracking-tight mb-2xs">Claude Code Elixir Runtime</h3>
						{#if $isScreenPass || $isDeepDive || $isFullArchive}
							<div class="flex gap-lg flex-wrap mb-sm">
								<MetadataBlock label="Time to Ship" value="3 days" />
								<MetadataBlock label="Role" value="Architect" />
								<MetadataBlock label="Framework" value="Elixir/OTP + Zig" />
							</div>
						{/if}
					</div>

					<OutcomeBlock
						problem="Need for an extremely reliable local-first runtime without JS lockouts."
						constraint="OTP concurrency limits & native OS file access."
						result="Zero-downtime robust recovery model scaled to 10k messages."
					/>
				</div>
			</div>
		</section>

		<!-- Only render standard arrays if we aren't in strict 5-min Screen Pass -->
		{#if !$isScreenPass}
			<section class="section">
				<header class="section-header">
					<span class="section-marker">&#9670;</span>
					<h2 class="section-title">ALL WORKS</h2>
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
				</header>
				<div class="domains">
					<span class="domain-group">
						<a href="https://mxzou.com" target="_blank" rel="noopener noreferrer">mxzou.com</a>
						<span class="domains-sep">&middot;</span>
						<span class="domains-desc">main</span>
					</span>
				</div>
			</section>
		{/if}
	</div>

	<Elevator showAfter={400} />
</section>

<style>
	.hero-evidence {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 40vh;
		padding: var(--space-2xl) 0;
	}

	.case-study {
		display: flex;
		flex-direction: column;
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

	/* Utility Classes for Flex layout inside scoped components */
	:global(.flex) { display: flex; }
	:global(.flex-col) { flex-direction: column; }
	:global(.flex-wrap) { flex-wrap: wrap; }
	:global(.gap-2xl) { gap: var(--space-2xl); }
	:global(.gap-lg) { gap: var(--space-lg); }
	:global(.mb-md) { margin-bottom: var(--space-md); }
	:global(.mb-sm) { margin-bottom: var(--space-sm); }
	:global(.mb-2xs) { margin-bottom: var(--space-2xs); }
	:global(.pb-lg) { padding-bottom: var(--space-lg); }
	:global(.pt-xl) { padding-top: var(--space-xl); }
	:global(.border-b) { border-bottom-width: var(--border-width); border-bottom-style: solid; }
	:global(.border-border-color-subtle) { border-color: var(--border-color-subtle); }

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
