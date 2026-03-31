<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let sections: any[] = [];
	export let client: any;
	export let api: any;

	$: sorted = [...sections].sort((a, b) => a.order - b.order);

	async function move(section: any, direction: number) {
		const order = sorted.map((s) => s);
		const idx = order.findIndex((s) => s._id === section._id);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= order.length) return;

		// Swap the order values
		const updates = [
			{ id: order[idx]._id, order: order[swapIdx].order },
			{ id: order[swapIdx]._id, order: order[idx].order },
		];

		try {
			await client.mutation(api.sectionRegistry.reorder, { updates });
			toast.success('Order updated');
		} catch (e: any) {
			toast.error(e.message || 'Failed to reorder');
		}
	}
</script>

<div class="order-cell">
	{#each sorted as section, idx}
		<div class="order-row">
			<span class="order-idx">{String(idx + 1).padStart(2, '0')}</span>
			<span class="order-grip" aria-hidden="true">&#x2807;</span>
			<span class="order-name">{section.sectionId}</span>
			<div class="order-arrows">
				<button
					class="order-arrow"
					on:click={() => move(section, -1)}
					disabled={idx === 0}
					aria-label="Move {section.sectionId} up"
				>
					&#8593;
				</button>
				<button
					class="order-arrow"
					on:click={() => move(section, 1)}
					disabled={idx === sorted.length - 1}
					aria-label="Move {section.sectionId} down"
				>
					&#8595;
				</button>
			</div>
		</div>
	{/each}

	{#if sorted.length === 0}
		<div class="order-empty">No sections</div>
	{/if}
</div>

<style>
	.order-cell {
		display: flex;
		flex-direction: column;
	}

	.order-row {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 3px 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.order-row:last-child {
		border-bottom: none;
	}

	.order-row:hover .order-grip {
		opacity: 1;
	}

	.order-idx {
		font-family: var(--font-mono);
		font-size: 7px;
		font-variant-numeric: tabular-nums;
		color: var(--color-text-subtle);
		min-width: 14px;
	}

	.order-grip {
		font-size: 8px;
		color: var(--color-text-subtle);
		opacity: 0;
		transition: opacity 160ms ease;
		cursor: grab;
		user-select: none;
	}

	.order-name {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		flex: 1;
	}

	.order-arrows {
		display: flex;
		gap: 1px;
	}

	.order-arrow {
		font-size: 8px;
		padding: 1px 3px;
		border: none;
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
		border-radius: 2px;
		transition: all 160ms ease;
		line-height: 1;
	}

	.order-arrow:hover:not(:disabled) {
		background: var(--color-bg-alt);
		color: var(--color-text);
	}

	.order-arrow:disabled {
		opacity: 0.2;
		cursor: default;
	}

	.order-empty {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-subtle);
		text-align: center;
		padding: 8px;
	}
</style>
