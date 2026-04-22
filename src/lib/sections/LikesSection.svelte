<script lang="ts">
	import { onMount } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { setupLikesSubscriptions } from '$lib/sections/likes-logic';
	import GenericListBlock from '$lib/components/blocks/GenericListBlock.svelte';
	import { likes as staticLikes } from '$lib/data/content';
  import SectionShell from '$lib/components/layout/SectionShell.svelte';

	export let id = "likes";

	let categories: any[] = staticLikes;

	onMount(() => {
		const client = getConvexClient();
		return setupLikesSubscriptions(client, {
			onLikes: (data: any) => {
				if (data) categories = data;
			}
		});
	});
</script>

<svelte:head>
	<title>Likes</title>
</svelte:head>

<div class="likes-wrapper" {id}>
  <SectionShell title="Things I Like" subtitle="A curated list of books, music, and other things I enjoy.">
    <div class="likes-grid">
      {#each categories as category}
        <GenericListBlock title={category.title} items={category.items} />
      {/each}
    </div>
  </SectionShell>

	<div class="gifts-callout">
		<a href="/gifts">Send books, postcards, or art supplies →</a>
	</div>
</div>

<style>
	.likes-wrapper {
		display: flex;
		flex-direction: column;
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
