<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let checked: boolean = false;
	export let size: 'sm' | 'md' = 'sm';
	export let color: 'green' | 'blue' = 'green';
	export let label: string = '';
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher<{ change: { checked: boolean } }>();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		dispatch('change', { checked });
	}
</script>

<button
	class="admin-toggle {size}"
	class:on={checked}
	class:green={color === 'green'}
	class:blue={color === 'blue'}
	class:disabled
	role="switch"
	aria-checked={checked}
	aria-label={label}
	{disabled}
	on:click={toggle}
>
	<span class="toggle-track">
		<span class="toggle-thumb"></span>
	</span>
</button>

<style>
	.admin-toggle {
		background: none;
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		padding: 0;
		-webkit-tap-highlight-color: transparent;
	}

	.admin-toggle.disabled {
		cursor: not-allowed;
		opacity: 0.4;
	}

	/* ── sm: 20x10 track, 8px thumb ── */
	.admin-toggle.sm .toggle-track {
		width: 20px;
		height: 10px;
		border-radius: 999px;
		background: var(--color-text-muted, #737373);
		position: relative;
		transition: background 120ms ease;
	}

	.admin-toggle.sm .toggle-thumb {
		position: absolute;
		top: 1px;
		left: 1px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #fff;
		transition: transform 120ms ease;
		pointer-events: none;
	}

	.admin-toggle.sm.on .toggle-thumb {
		transform: translateX(10px);
	}

	/* ── md: 28x14 track, 10px thumb ── */
	.admin-toggle.md .toggle-track {
		display: block;
		width: 28px;
		height: 14px;
		border-radius: 7px;
		background: var(--border-color, #333);
		position: relative;
		transition: background 120ms ease;
	}

	.admin-toggle.md .toggle-thumb {
		display: block;
		position: absolute;
		top: 2px;
		left: 2px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #fff;
		transition: transform 120ms ease;
		pointer-events: none;
	}

	.admin-toggle.md.on .toggle-thumb {
		transform: translateX(14px);
	}

	/* ── Color: green ── */
	.admin-toggle.green.on .toggle-track {
		background: var(--bento-green, #44D62C);
	}

	/* ── Color: blue ── */
	.admin-toggle.blue.on .toggle-track {
		background: var(--bento-blue, #2563EB);
	}
</style>
