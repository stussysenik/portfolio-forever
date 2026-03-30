<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let visible: boolean = true;

	const dispatch = createEventDispatcher<{ toggle: void }>();
</script>

<button
	class="btn-icon"
	on:click={() => dispatch('toggle')}
	title={visible ? 'Hide' : 'Show'}
>
	{visible ? '👁' : '👁‍🗨'}
</button>

<style>
	.btn-icon {
		padding: 2px 6px;
		font-size: var(--font-size-xs);
		border: none;
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
		border-radius: var(--radius-sm);
	}

	.btn-icon:hover {
		background: var(--color-bg-alt);
	}
</style>
