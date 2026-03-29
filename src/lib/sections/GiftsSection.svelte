<script lang="ts">
	import { onMount } from 'svelte';
	import { profile } from "$lib/data/content";
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';

	export let id = "gifts";

	let title = "The Promise";
	let manifesto = "I build and design a lot of things with free value in mind. In return, you could send me kind gifts in the form of art supplies or film medium.";

	onMount(() => {
		const client = getConvexClient();
		const unsub = client.onUpdate(api.gifts.getGiftsConfig, {}, (data) => {
			if (data) {
				title = data.title || title;
				manifesto = data.manifesto || manifesto;
			}
		});
		return () => unsub();
	});
</script>

<svelte:head>
	<title>{title} | {profile.name}</title>
	<meta name="description" content="A creative exchange — {manifesto}" />
</svelte:head>

<div class="gifts-wrapper" {id}>
	<article class="letter">
		<header class="letter-header">
			<h1 class="letter-title">{title}</h1>
		</header>

		<div class="letter-body">
			<p class="manifesto">{manifesto}</p>
		</div>
	</article>
</div>

<style>
	.gifts-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 60vh;
	}

	.letter {
		max-width: 560px;
		margin: 0 auto;
		padding: var(--space-2xl) var(--space-md);
		text-align: center;
	}

	@media (min-width: 480px) {
		.letter {
			padding: var(--space-2xl) var(--space-lg);
		}
	}

	@media (min-width: 768px) {
		.letter {
			padding: var(--space-2xl) 0;
		}
	}

	.letter-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
		margin-bottom: var(--space-2xl);
		text-align: center;
	}

	.letter-title {
		font-family: var(--font-sans);
		font-size: var(--font-size-2xl);
		font-weight: 500;
		letter-spacing: var(--letter-spacing-tight);
		color: var(--color-text);
		margin: 0;
	}

	.letter-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}

	.manifesto {
		font-family: var(--font-mono);
		font-size: var(--font-size-lg);
		font-weight: 400;
		line-height: var(--line-height-relaxed);
		color: var(--color-text);
		margin: 0;
		text-align: center;
	}
</style>
