<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import type { Id } from '$convex/_generated/dataModel';

	export let client: any;
	export let api: any;
	export let categories: any[];

	let editingId: string | null = null;
	let editingField: string | null = null;
	let editBuffer = '';
	let saving = false;
	let editingItems: { id: string; items: string[] } | null = null;

	function startEdit(id: string, field: string, currentValue: string) {
		editingId = id; editingField = field; editBuffer = currentValue || '';
	}
	function cancelEdit() { editingId = null; editingField = null; editBuffer = ''; }
	function a11yClick(handler: () => void) {
		return (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } };
	}

	async function addLikesCategory() {
		await client.mutation(api.likes.createCategory, {
			title: 'New Category', items: ['item 1'],
			order: categories.length, visible: true,
		});
		toast.success('Category added');
	}

	async function deleteLikesCategory(id: string) {
		await client.mutation(api.likes.deleteCategory, { id: id as Id<"likesCategories"> });
		toast.success('Category deleted');
	}

	async function toggleLikesVisibility(id: string) {
		await client.mutation(api.likes.toggleVisibility, { id: id as Id<"likesCategories"> });
	}

	async function saveLikesEdit(id: string) {
		if (!editingField) return;
		saving = true;
		try {
			await client.mutation(api.likes.updateCategory, {
				id: id as Id<"likesCategories">, [editingField]: editBuffer,
			});
			toast.success('Saved');
		} finally {
			saving = false; editingId = null; editingField = null; editBuffer = '';
		}
	}

	function startEditItems(id: string, current: string[]) {
		editingItems = { id, items: [...(current || [])] };
	}

	async function saveItems() {
		if (!editingItems) return;
		const filtered = editingItems.items.filter(i => i.trim());
		await client.mutation(api.likes.updateCategory, {
			id: editingItems.id as Id<"likesCategories">, items: filtered,
		});
		editingItems = null;
		toast.success('Items saved');
	}

	async function moveLikesCategory(id: string, direction: -1 | 1) {
		const sorted = [...categories].sort((a, b) => a.order - b.order);
		const idx = sorted.findIndex((e: any) => e._id === id);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= sorted.length) return;
		await client.mutation(api.likes.reorderCategories, {
			updates: [
				{ id: sorted[idx]._id, order: swapIdx },
				{ id: sorted[swapIdx]._id, order: idx },
			],
		});
	}
</script>

<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Likes</h2>
		<span class="section-count">{categories.length}</span>
		<button class="btn-sm btn-add" on:click={addLikesCategory}>+ Add Category</button>
		<a href="/likes" class="btn-sm" target="_blank">View &rarr;</a>
	</div>

	{#each [...categories].sort((a, b) => a.order - b.order) as cat, idx}
		<div class="card" class:hidden-entry={!cat.visible}>
			<div class="card-header">
				<div class="card-title-row">
					<div class="reorder-btns">
						<button class="btn-icon" on:click={() => moveLikesCategory(cat._id, -1)} disabled={idx === 0}>&#8593;</button>
						<button class="btn-icon" on:click={() => moveLikesCategory(cat._id, 1)} disabled={idx === categories.length - 1}>&#8595;</button>
					</div>

					{#if editingId === cat._id && editingField === 'title'}
						<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveLikesEdit(cat._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveLikesEdit(cat._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>&times;</button>
					{:else}
						<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(cat._id, 'title', cat.title)} on:keydown={a11yClick(() => startEdit(cat._id, 'title', cat.title))}>{cat.title}</span>
					{/if}

					<button class="btn-icon" on:click={() => toggleLikesVisibility(cat._id)} title={cat.visible ? 'Hide' : 'Show'}>
						{cat.visible ? '\u{1F441}' : '\u{1F441}\u200D\u{1F5E8}'}
					</button>
					<button class="btn-icon btn-danger" on:click={() => deleteLikesCategory(cat._id)}>&times;</button>
				</div>
			</div>

			<div class="card-body">
				{#if editingItems && editingItems.id === cat._id}
					<div class="highlights-editor">
						{#each editingItems.items as item, i}
							<div class="highlight-row">
								<input class="field-input-sm flex-1" bind:value={editingItems.items[i]} placeholder="Item..." />
								<button class="btn-icon btn-danger" on:click={() => { if (editingItems) editingItems.items = editingItems.items.filter((_, j) => j !== i); }}>&times;</button>
							</div>
						{/each}
						<div class="highlight-actions">
							<button class="btn-sm" on:click={() => { if (editingItems) editingItems.items = [...editingItems.items, '']; }}>+ Add item</button>
							<button class="btn-sm btn-save" on:click={saveItems}>Save</button>
							<button class="btn-sm" on:click={() => editingItems = null}>Cancel</button>
						</div>
					</div>
				{:else}
					<div class="card-tools" role="button" tabindex="0" on:click={() => startEditItems(cat._id, cat.items)} on:keydown={a11yClick(() => startEditItems(cat._id, cat.items))} style="cursor:pointer;">
						{#each cat.items as item}
							<span class="tool-tag">{item}</span>
						{/each}
						{#if !cat.items?.length}
							<span class="tool-tag" style="opacity:0.5;">+ Add items</span>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/each}
</section>

<style>
	.admin-section {
		margin-bottom: var(--space-xl);
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.section-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
	}

	.section-count {
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
		background: var(--color-bg-alt);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
	}

	.card {
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		margin-bottom: var(--space-sm);
		transition: border-color var(--duration-fast) var(--easing);
	}

	.card:hover {
		border-color: var(--border-color);
	}

	.card.hidden-entry {
		opacity: 0.5;
		border-style: dashed;
	}

	.card-header {
		margin-bottom: var(--space-sm);
	}

	.card-title-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.card-title {
		font-weight: 500;
		cursor: pointer;
	}

	.card-title:hover {
		color: var(--color-accent);
	}

	.card-body {
		padding-left: 52px;
	}

	.card-tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-top: var(--space-sm);
	}

	.tool-tag {
		font-size: var(--font-size-xs);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		background: var(--color-bg-alt);
		color: var(--color-text-muted);
	}

	.reorder-btns {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.field-input, .field-input-sm {
		font-family: inherit;
		font-size: inherit;
		padding: 4px 8px;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		color: var(--color-text);
		width: 100%;
	}

	.field-input:focus, .field-input-sm:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	.field-input-sm {
		padding: 2px 6px;
		font-size: var(--font-size-sm);
	}

	.highlights-editor {
		margin-top: var(--space-sm);
	}

	.highlight-row {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		margin-bottom: var(--space-xs);
	}

	.highlight-actions {
		display: flex;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.btn {
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		font-weight: 500;
		border: 1px solid var(--border-color);
		background: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.btn:hover {
		border-color: var(--color-text-muted);
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

	.btn-add {
		border-color: var(--color-accent);
		color: var(--color-accent);
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

	.btn-danger {
		color: var(--color-error);
	}

	.btn-danger:hover {
		background: color-mix(in oklch, var(--color-error), transparent 90%);
	}

	.flex-1 {
		flex: 1;
	}

	@media (max-width: 767px) {
		.card-body {
			padding-left: 0;
		}

		.section-header {
			flex-wrap: wrap;
		}
	}
</style>
