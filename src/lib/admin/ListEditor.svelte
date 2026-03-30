<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: string[] = [];
	export let placeholder: string = 'Item...';
	export let addLabel: string = '+ Add item';

	const dispatch = createEventDispatcher<{
		save: string[];
		cancel: void;
	}>();

	let editItems = [...items];

	function addItem() {
		editItems = [...editItems, ''];
	}

	function removeItem(idx: number) {
		editItems = editItems.filter((_, i) => i !== idx);
	}

	function save() {
		const filtered = editItems.filter(i => i.trim());
		dispatch('save', filtered);
	}
</script>

<div class="list-editor">
	{#each editItems as item, i}
		<div class="list-editor-row">
			<input
				class="field-input-sm flex-1"
				bind:value={editItems[i]}
				{placeholder}
			/>
			<button class="btn-icon btn-danger" on:click={() => removeItem(i)}>&times;</button>
		</div>
	{/each}
	<div class="list-editor-actions">
		<button class="btn-sm" on:click={addItem}>{addLabel}</button>
		<button class="btn-sm btn-save" on:click={save}>Save</button>
		<button class="btn-sm" on:click={() => dispatch('cancel')}>Cancel</button>
	</div>
</div>

<style>
	.list-editor {
		margin-top: var(--space-sm);
	}

	.list-editor-row {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		margin-bottom: var(--space-xs);
	}

	.list-editor-actions {
		display: flex;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.field-input-sm {
		font-family: inherit;
		font-size: var(--font-size-sm);
		padding: 2px 6px;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		color: var(--color-text);
	}

	.field-input-sm:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	.flex-1 {
		flex: 1;
	}

	.btn-sm {
		padding: 2px 8px;
		font-size: var(--font-size-xs);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color-subtle);
		background: var(--color-bg);
		color: var(--color-text-muted);
		cursor: pointer;
	}

	.btn-save {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
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

	.btn-danger {
		color: var(--color-error);
	}

	.btn-danger:hover {
		background: color-mix(in oklch, var(--color-error), transparent 90%);
	}
</style>
