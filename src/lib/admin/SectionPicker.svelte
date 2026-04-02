<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getSectionTypesByCategory } from '$lib/sections/registry';
	import { AdminModal } from '$lib/admin/primitives';

	export let open = false;

	const dispatch = createEventDispatcher<{
		pick: string;
		close: void;
	}>();

	const grouped = getSectionTypesByCategory();

	const categoryLabels: Record<string, string> = {
		content: 'Content',
		media: 'Media',
		layout: 'Layout',
	};

	function pick(typeId: string) {
		dispatch('pick', typeId);
		dispatch('close');
	}
</script>

<AdminModal {open} title="Add Section" width="lg" on:close={() => dispatch('close')}>
	<div class="picker-body">
		{#each Object.entries(grouped) as [category, types]}
			{#if types.length > 0}
				<div class="picker-category">
					<span class="category-label">{categoryLabels[category] ?? category}</span>
					<div class="type-grid">
						{#each types as typeDef}
							<button class="type-card" on:click={() => pick(typeDef.id)}>
								<span class="type-icon">{typeDef.icon}</span>
								<span class="type-name">{typeDef.label}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</AdminModal>

<style>
	.picker-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.picker-category {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.category-label {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
	}

	.type-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 10px 4px;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		background: transparent;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
		min-height: var(--admin-touch-min, 44px);
	}

	.type-card:hover {
		border-color: var(--bento-blue, #2563EB);
		background: color-mix(in oklch, var(--bento-blue, #2563EB), transparent 94%);
	}

	.type-icon {
		font-size: 16px;
	}

	.type-name {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
	}
</style>
