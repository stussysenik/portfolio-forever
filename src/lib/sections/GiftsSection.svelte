<script lang="ts">
	import { onMount } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { setup_gifts_subscriptions } from '$lib/clj/portfolio/sections/gifts.mjs';
	import { giftsConfig as staticConfig } from '$lib/data/content';

	export let id = "gifts";

	let config = staticConfig;

	$: title = config?.title || "Send books, postcards, or art supplies";
	$: manifesto = config?.manifesto || "The Promise — an open exchange of creative energy.";
	$: callToAction = config?.description || "";
	$: contactEmail = config?.email || "itsmxzou@gmail.com";

	onMount(() => {
		const client = getConvexClient();
		return setup_gifts_subscriptions(client, {
			onConfig: (data: any) => {
				if (data) config = data;
			}
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content="A creative exchange — {manifesto}" />
</svelte:head>

<div class="gifts-wrapper" {id}>
	<article class="letter">
		<header class="letter-header">
			<h1 class="letter-title">{title}</h1>
		</header>

		<div class="letter-body">
			<p class="manifesto">{manifesto}</p>
			{#if contactEmail}
				<p class="gifts-contact">
					<a href="mailto:{contactEmail}">{callToAction || `Send to ${contactEmail}`}</a>
				</p>
			{/if}
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

	.gifts-contact {
		text-align: center;
		margin-top: var(--space-lg);
	}

	.gifts-contact a {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		color: var(--color-accent);
		text-decoration: none;
		transition: color var(--duration-fast) var(--easing);
	}

	.gifts-contact a:hover {
		color: var(--color-accent-hover);
	}
</style>
