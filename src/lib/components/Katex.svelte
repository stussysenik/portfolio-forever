<script lang="ts">
	import { onMount } from 'svelte';

	export let content: string = '';
	export let displayMode: boolean = false;

	let el: HTMLSpanElement | undefined;

	onMount(async () => {
		if (!el || !content) return;
		try {
			const katex = (await import('katex')).default;
			katex.render(content, el, {
				displayMode,
				throwOnError: false,
				output: 'mathml',
				strict: 'ignore',
				trust: false
			});
		} catch (err) {
			if (el) el.textContent = content;
		}
	});
</script>

{#if displayMode}
	<span class="katex-block" bind:this={el}></span>
{:else}
	<span class="katex-inline" bind:this={el}></span>
{/if}

<style>
	.katex-inline,
	.katex-block {
		color: currentColor;
	}

	.katex-block {
		display: block;
		margin: 0.5em 0;
		overflow-x: auto;
		overflow-y: hidden;
	}
</style>
