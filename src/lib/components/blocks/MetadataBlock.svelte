<script lang="ts">
	import LiveContent from './LiveContent.svelte';

	export let label: string = "Status";
	export let value: string = "Shipped";

	// Windmill explicitly cares about 'ship speed' and 'ownership'
	// Allows rapid overriding for the Screen-Pass 5-min view

	function updateLabel(e: CustomEvent<string>) {
		label = e.detail;
	}

	function updateValue(e: CustomEvent<string>) {
		value = e.detail;
	}
</script>

<div class="metadata-block">
	<LiveContent
		class="meta-label text-2xs uppercase tracking-widest text-muted"
		htmlContent={label}
		on:change={updateLabel}
	/>
	<LiveContent
		class="meta-value text-sm font-mono tracking-tight text-accent"
		htmlContent={value}
		on:change={updateValue}
	/>
</div>

<style>
	.metadata-block {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: var(--space-xs) 0;
		border-left: 2px solid transparent;
		padding-left: var(--space-xs);
		transition: border-color var(--duration-fast) var(--easing);
	}

	.metadata-block:hover {
		border-color: var(--border-color-subtle);
	}
</style>
