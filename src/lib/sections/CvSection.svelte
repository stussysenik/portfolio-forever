<script lang="ts">
	import { isScreenPass } from '$lib/stores/controls';
	import { getCvHiccup } from '$lib/sections/cv-hiccup';
	import Hiccup from '$lib/components/Hiccup.svelte';

	export let id = "cv";

	$: cvHiccup = getCvHiccup($isScreenPass);
</script>

<svelte:head>
	<title>CV | MENGXUAN "SENIK" ZOU</title>
	<meta name="description" content="Curriculum Vitae — Design Engineer & Creative Producer" />
</svelte:head>

<section class="cv-page" {id}>
	<Hiccup data={cvHiccup} />

	<footer class="cv-footer">
		<a href="/data/cv.pdf" download class="cv-download">Download PDF version</a>
	</footer>
</section>

<style>
	.cv-page {
		max-width: 800px;
		margin: 0 auto;
		padding: var(--space-xl) var(--space-md);
	}

	:global(.cv-header) {
		margin-bottom: var(--space-2xl);
		padding-bottom: var(--space-lg);
		border-bottom: 2px solid var(--border-color);
	}

	:global(.cv-name) {
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-bold);
		letter-spacing: var(--letter-spacing-tight);
		margin-bottom: var(--space-2xs);
	}

	:global(.cv-title) {
		font-size: var(--font-size-lg);
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-medium);
		margin-bottom: var(--space-sm);
	}

	:global(.cv-summary) {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: var(--line-height-relaxed);
		max-width: 60ch;
	}

	:global(.cv-meta) {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		margin-top: var(--space-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
	}

	:global(.cv-meta a) {
		color: var(--color-accent);
	}

	:global(.cv-section) {
		margin-bottom: var(--space-xl);
	}

	:global(.cv-section-title) {
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
		color: var(--color-text);
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-xs);
		border-bottom: var(--border-width) solid var(--border-color);
	}

	:global(.cv-entry) {
		margin-bottom: var(--space-lg);
	}

	:global(.cv-entry-header) {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	:global(.cv-entry-title) {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
	}

	:global(.cv-entry-title a) {
		color: var(--color-text);
	}

	:global(.cv-entry-dates) {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	:global(.cv-entry-org) {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		margin-top: var(--space-2xs);
		display: flex;
		gap: var(--space-sm);
	}

	:global(.cv-entry-location::before) {
		content: "· ";
	}

	:global(.cv-entry-description) {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: var(--line-height-normal);
		margin-top: var(--space-xs);
	}

	:global(.cv-entry-highlights) {
		list-style: none;
		padding: 0;
		margin-top: var(--space-xs);
	}

	:global(.cv-entry-highlights li) {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: var(--line-height-normal);
		padding-left: var(--space-md);
		position: relative;
	}

	:global(.cv-entry-highlights li::before) {
		content: "—";
		position: absolute;
		left: 0;
		color: var(--color-text-subtle);
	}

	:global(.cv-languages) {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
	}

	:global(.cv-lang) {
		font-size: var(--font-size-sm);
		color: var(--color-text);
	}

	:global(.cv-lang-level) {
		color: var(--color-text-subtle);
		font-size: var(--font-size-xs);
	}

	:global(.cv-skills) {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	:global(.cv-skill-tag) {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		background: var(--color-surface);
		padding: var(--space-2xs) var(--space-sm);
		border-radius: var(--radius-sm);
	}

	.cv-footer {
		margin-top: var(--space-2xl);
		padding-top: var(--space-lg);
		border-top: var(--border-width) solid var(--border-color);
	}

	.cv-download {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-accent);
	}
</style>
