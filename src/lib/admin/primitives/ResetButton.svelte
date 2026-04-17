<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let visible: boolean = false;

	const dispatch = createEventDispatcher<{ reset: void }>();

	function handleClick() {
		dispatch('reset');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}
</script>

<button
	class="reset-button"
	class:hidden={!visible}
	on:click={handleClick}
	on:keydown={handleKeydown}
	aria-label="Reset to default"
>
	<span class="reset-icon">{'\u21BA'}</span>
	<span class="reset-label">reset</span>
</button>

<style>
	.reset-button {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		min-height: 18px;
		padding: 2px 6px;
		border: 1px solid var(--admin-keyline, #333);
		border-radius: 2px;
		background: transparent;
		color: var(--admin-text-subtle, #444);
		font-family: var(--admin-font-mono, monospace);
		font-size: 8px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		cursor: pointer;
		transition: all 120ms ease;
		line-height: 1;
		white-space: nowrap;
	}

	.reset-button:hover {
		color: var(--admin-active-outline, #00FF00);
		border-color: var(--admin-active-outline, #00FF00);
		background: rgba(0, 255, 0, 0.05);
	}

	.reset-button.hidden {
		display: none;
	}

	.reset-icon {
		font-size: 9px;
		line-height: 1;
		color: var(--admin-active-outline, #00FF00);
	}

	.reset-label {
		line-height: 1;
	}
</style>
