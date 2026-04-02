<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let options: Array<{ id: string; label: string; icon?: string; disabled?: boolean }> = [];
	export let value: string | string[] = '';
	export let mode: 'exclusive' | 'multi' = 'exclusive';
	export let color: 'blue' | 'green' = 'blue';
	export let layout: 'row' | 'grid' = 'row';
	export let columns: number = 3;
	export let size: 'sm' | 'md' = 'sm';
	export let equalWidth: boolean = false;

	const dispatch = createEventDispatcher<{ change: { value: string | string[] } }>();

	function isActive(optionId: string): boolean {
		if (mode === 'exclusive') {
			return value === optionId;
		}
		return Array.isArray(value) && value.includes(optionId);
	}

	function handleClick(optionId: string) {
		if (mode === 'exclusive') {
			value = optionId;
			dispatch('change', { value });
		} else {
			const arr = Array.isArray(value) ? value : [];
			if (arr.includes(optionId)) {
				value = arr.filter((v) => v !== optionId);
			} else {
				value = [...arr, optionId];
			}
			dispatch('change', { value });
		}
	}
</script>

<div
	class="admin-chip-group"
	class:grid-layout={layout === 'grid'}
	class:row-layout={layout === 'row'}
	style={layout === 'grid' ? `grid-template-columns: repeat(${columns}, 1fr)` : ''}
	role="group"
>
	{#each options as option}
		<button
			class="chip"
			class:active={isActive(option.id)}
			class:blue={color === 'blue'}
			class:green={color === 'green'}
			class:multi={mode === 'multi'}
			class:sm={size === 'sm'}
			class:md={size === 'md'}
			class:equal-width={equalWidth}
			disabled={option.disabled ?? false}
			aria-pressed={isActive(option.id)}
			aria-label={option.label}
			on:click={() => handleClick(option.id)}
		>
			{#if option.icon}
				<span class="chip-icon">{option.icon}</span>
			{/if}
			<span class="chip-label">{option.label}</span>
		</button>
	{/each}
</div>

<style>
	.admin-chip-group.row-layout {
		display: flex;
		gap: 3px;
	}

	.admin-chip-group.grid-layout {
		display: grid;
		gap: 3px;
	}

	.chip {
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 2px 5px;
		border-radius: 2px;
		border: 1px solid var(--border-color);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all 120ms ease;
		text-align: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 3px;
		min-height: 44px;
		-webkit-tap-highlight-color: transparent;
	}

	.chip.sm {
		font-size: 7px;
	}

	.chip.md {
		font-size: 9px;
	}

	.chip.equal-width {
		flex: 1;
	}

	.chip:disabled {
		cursor: not-allowed;
		opacity: 0.4;
	}

	.chip:hover:not(:disabled) {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	/* ── Exclusive blue active (solid fill) ── */
	.chip.blue.active:not(.multi) {
		background: var(--bento-blue, #2563EB);
		color: #fff;
		border-color: var(--bento-blue, #2563EB);
	}

	/* ── Exclusive green active (solid fill) ── */
	.chip.green.active:not(.multi) {
		background: var(--bento-green, #44D62C);
		color: #fff;
		border-color: var(--bento-green, #44D62C);
	}

	/* ── Multi blue active (translucent tint) ── */
	.chip.blue.multi.active {
		background: color-mix(in oklch, var(--bento-blue, #2563EB), transparent 85%);
		border-color: color-mix(in oklch, var(--bento-blue, #2563EB), transparent 60%);
		color: var(--bento-blue, #2563EB);
	}

	/* ── Multi green active (translucent tint) ── */
	.chip.green.multi.active {
		background: color-mix(in oklch, var(--bento-green, #44D62C), transparent 85%);
		border-color: color-mix(in oklch, var(--bento-green, #44D62C), transparent 60%);
		color: var(--bento-green, #44D62C);
	}

	.chip-icon {
		font-size: inherit;
		line-height: 1;
	}

	.chip-label {
		line-height: 1;
	}
</style>
