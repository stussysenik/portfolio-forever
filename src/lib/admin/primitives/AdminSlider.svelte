<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: number = 0;
	export let min: number = 0;
	export let max: number = 1;
	export let step: number = 0.1;
	export let label: string = '';
	export let format: ((v: number) => string) | null = null;
	export let width: 'compact' | 'fill' = 'compact';
	export let showReset: boolean = false;
	export let resetValue: number = 0;

	const dispatch = createEventDispatcher<{ change: { value: number } }>();

	$: readout = format ? format(value) : value.toString();

	function handleInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		value = parseFloat(target.value);
		dispatch('change', { value });
	}

	function handleReset() {
		value = resetValue;
		dispatch('change', { value });
	}
</script>

<div class="admin-slider" class:fill={width === 'fill'}>
	{#if label}
		<span class="slider-label">{label}</span>
	{/if}
	<input
		type="range"
		class="slider-input"
		class:fill={width === 'fill'}
		{min}
		{max}
		{step}
		{value}
		on:input={handleInput}
		aria-label={label || undefined}
	/>
	<span class="slider-readout">{readout}</span>
	{#if showReset}
		<button
			class="slider-reset"
			on:click={handleReset}
			aria-label="Reset {label || 'slider'} to {resetValue}"
		>
			Reset
		</button>
	{/if}
</div>

<style>
	.admin-slider {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.slider-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
		white-space: nowrap;
	}

	.slider-input {
		-webkit-appearance: none;
		appearance: none;
		max-width: 36px;
		height: 4px;
		background: var(--border-color-subtle);
		border-radius: 2px;
		outline: none;
		transition: background 120ms ease;
	}

	.slider-input.fill {
		max-width: none;
		flex: 1;
	}

	.slider-input:hover {
		background: var(--border-color);
	}

	.slider-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--bento-blue, #2563EB);
		cursor: pointer;
		border: none;
	}

	.slider-input::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--bento-blue, #2563EB);
		cursor: pointer;
		border: none;
	}

	.slider-readout {
		font-family: var(--font-mono);
		font-size: 7px;
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
		min-width: 22px;
		text-align: right;
	}

	.slider-reset {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 2px 4px;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all 120ms ease;
		min-width: 44px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.slider-reset:hover {
		border-color: var(--border-color);
		color: var(--color-text);
	}
</style>
