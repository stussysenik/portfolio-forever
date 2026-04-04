<script lang="ts">
	import { onMount } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';
	import GenericListBlock from '$lib/components/blocks/GenericListBlock.svelte';

	export let id = "likes";

	let categories: { title: string; items: string[] }[] = [];

	onMount(() => {
		const client = getConvexClient();
		const unsub = client.onUpdate(api.likes.getVisibleLikes, {}, (data) => {
			if (data && data.length > 0) {
				categories = data.map((c: any) => ({ title: c.title, items: c.items }));
			}
		});
		return () => unsub();
	});
</script>

<svelte:head>
	<title>Likes</title>
</svelte:head>

<div class="likes-wrapper" {id}>
	<section class="section">
		<header class="section-header">
			<span class="section-marker">◆</span>
			<h1 class="section-title">THINGS I LIKE</h1>
			<span class="section-meta">curated list</span>
		</header>

		<div class="likes-grid">
			{#each categories as category}
				<GenericListBlock title={category.title} items={category.items} />
			{/each}
		</div>
	</section>

	<div class="gifts-callout">
		<a href="/gifts">Send books, postcards, or art supplies →</a>
	</div>
</div>

<style>
	.likes-wrapper {
		display: flex;
		flex-direction: column;
	}

	.section {
		margin-bottom: var(--space-xl);
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
		font-size: var(--font-size-lg);
		font-weight: 600;
		letter-spacing: var(--letter-spacing-wider);
		color: var(--color-text);
		margin: 0;
	}

	.section-meta {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-text-subtle);
		margin-left: auto;
	}

	.likes-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-2xl);
	}

	@media (min-width: 768px) {
		.likes-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.gifts-callout {
		margin-top: var(--space-xl);
		padding-top: var(--space-lg);
		border-top: var(--border-width) dashed var(--border-color-subtle);
		text-align: center;
	}

	.gifts-callout a {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		color: var(--color-accent);
		text-decoration: none;
		transition: color var(--duration-fast) var(--easing);
	}

	.gifts-callout a:hover {
		color: var(--color-accent-hover);
	}
</style>
