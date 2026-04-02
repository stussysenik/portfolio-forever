<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { VIEW_MODES, stripConvexMeta } from '$lib/admin/constants';

	export let sections: any[] = [];
	export let client: any;
	export let api: any;

	$: visibleSections = sections
		.filter((s: any) => s.adminVisible)
		.sort((a: any, b: any) => a.order - b.order);

	async function cycleViewMode(section: any) {
		if (section.immune) return;

		const current = section.viewMode ?? 'grid';
		const idx = VIEW_MODES.indexOf(current);
		const next = VIEW_MODES[(idx + 1) % VIEW_MODES.length];

		try {
			await client.mutation(api.sectionRegistry.upsert, {
				...stripConvexMeta(section),
				viewMode: next,
			});
			toast.success(`${section.sectionId}: ${next}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to update display');
		}
	}
</script>

<div class="display-cell">
	<div class="display-grid">
		{#each visibleSections as section}
			<button
				class="display-card"
				class:immune={section.immune}
				on:click={() => cycleViewMode(section)}
				aria-label="Cycle {section.sectionId} view mode. Current: {section.viewMode ?? 'grid'}"
				disabled={section.immune}
			>
				<div class="display-card-header">
					<span class="display-section-name">{section.sectionId}</span>
					{#if section.immune}
						<span class="immune-badge">L</span>
					{/if}
				</div>
				<span class="display-view-mode">{section.viewMode ?? 'grid'}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.display-cell {
		display: flex;
		flex-direction: column;
	}

	.display-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
	}

	.display-card {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 4px 5px;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		background: transparent;
		cursor: pointer;
		text-align: left;
		transition: all 160ms ease;
	}

	.display-card:hover:not(:disabled) {
		border-color: var(--border-color);
		background: var(--color-bg-alt);
	}

	.display-card:disabled {
		cursor: default;
		opacity: 0.6;
	}

	.display-card.immune {
		border-style: dashed;
	}

	.display-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 3px;
	}

	.display-section-name {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.immune-badge {
		font-family: var(--font-mono);
		font-size: 6px;
		font-weight: 700;
		color: var(--bento-blue, #2563EB);
		background: color-mix(in oklch, var(--bento-blue, #2563EB), transparent 88%);
		padding: 0 3px;
		border-radius: 2px;
		line-height: 1.4;
	}

	.display-view-mode {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}
</style>
