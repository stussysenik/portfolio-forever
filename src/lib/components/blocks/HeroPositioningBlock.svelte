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

	/* The mb-sm style maps to variables directly internally */
</style>
