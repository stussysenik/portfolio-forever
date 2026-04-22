<script lang="ts">
	import LiveContent from './LiveContent.svelte';

	export let title: string = "Hi, I'm Stüssy Senik.";
	export let thesis: string = "I build screen-pass optimized evidence artifacts.";

	function updateTitle(e: CustomEvent<string>) { title = e.detail; }
	function updateThesis(e: CustomEvent<string>) { thesis = e.detail; }
</script>

<div class="hero-block my-xl">
	<LiveContent
		tag="h1"
		class="text-display font-bold tracking-tighter leading-tight text-text mb-sm"
		htmlContent={title}
		on:change={updateTitle}
	/>
	<LiveContent
		tag="p"
		class="text-2xl text-secondary font-medium tracking-tight leading-snug max-w-2xl"
		htmlContent={thesis}
		on:change={updateThesis}
	/>
</div>

<style>
	.hero-block {
		margin: var(--space-xl) 0;
		max-width: 800px; /* Readability bounds */
	}

	/* Mobile: scale display text down to fit single-line or 2-line max */
	.hero-block :global(.text-display) {
		font-size: clamp(2rem, 1.4rem + 3vw, 3.5rem);
	}
	.hero-block :global(.text-2xl) {
		font-size: clamp(1.125rem, 1rem + 0.5vw, 1.5rem);
	}

	@media (min-width: 481px) {
		.hero-block :global(.text-display) {
			font-size: clamp(2.5rem, 1.8rem + 3.5vw, 5rem);
		}
		.hero-block :global(.text-2xl) {
			font-size: clamp(1.25rem, 1.1rem + 0.8vw, 2rem);
		}
	}
</style>
