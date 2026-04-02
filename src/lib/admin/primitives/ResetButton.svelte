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
		padding: 2px 5px;
		border: 1px dashed var(--border-color-subtle, #333);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-subtle, #444);
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		cursor: pointer;
		transition: all 120ms ease;
		line-height: 1;
		white-space: nowrap;
	}

	.reset-button:hover {
		color: var(--color-text-muted, #737373);
		border-color: var(--color-text-muted, #737373);
	}

	.reset-button.hidden {
		display: none;
	}

	.reset-icon {
		font-size: 8px;
		line-height: 1;
	}

	.reset-label {
		line-height: 1;
	}
</style>
