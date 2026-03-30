<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: any[] = [];
	export let getId: (item: any) => string = (item) => item._id;

	const dispatch = createEventDispatcher<{
		reorder: { id: string; direction: -1 | 1 };
	}>();
</script>

{#each items as item, idx}
	<div class="reorderable-item">
		<div class="reorder-btns">
			<button
				class="btn-icon"
				on:click={() => dispatch('reorder', { id: getId(item), direction: -1 })}
				disabled={idx === 0}
			>&uarr;</button>
			<button
				class="btn-icon"
				on:click={() => dispatch('reorder', { id: getId(item), direction: 1 })}
				disabled={idx === items.length - 1}
			>&darr;</button>
		</div>
		<slot {item} {idx} isFirst={idx === 0} isLast={idx === items.length - 1} />
	</div>
{/each}

<style>
	.reorderable-item {
		display: contents;
	}

	.reorder-btns {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

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

	.btn-icon:disabled {
		opacity: 0.3;
		cursor: default;
	}
</style>
