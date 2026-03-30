<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import type { Id } from '$convex/_generated/dataModel';

	export let client: any;
	export let api: any;
	export let entries: any[];

	let editingId: string | null = null;
	let editingField: string | null = null;
	let editBuffer = '';
	let saving = false;

	function startEdit(id: string, field: string, currentValue: string) {
		editingId = id; editingField = field; editBuffer = currentValue || '';
	}
	function cancelEdit() { editingId = null; editingField = null; editBuffer = ''; }
	function a11yClick(handler: () => void) {
		return (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } };
	}

	async function addWorkEntry() {
		await client.mutation(api.works.createEntry, {
			title: 'New Project', url: 'https://',
			order: entries.length, visible: true,
		});
	}

	async function deleteWorkEntry(id: string) {
		await client.mutation(api.works.deleteEntry, { id: id as Id<"worksEntries"> });
		toast.success('Project deleted');
	}

	async function toggleWorkVisibility(id: string) {
		await client.mutation(api.works.toggleVisibility, { id: id as Id<"worksEntries"> });
	}

	async function saveWorkEdit(id: string) {
		if (!editingField) return;
		saving = true;
		try {
			const numFields = ['viewport', 'year', 'month'];
			const value = numFields.includes(editingField) ? parseFloat(editBuffer) || 0 : editBuffer;
			await client.mutation(api.works.updateEntry, {
				id: id as Id<"worksEntries">, [editingField]: value,
			});
		} finally {
			saving = false; editingId = null; editingField = null; editBuffer = '';
		}
	}

	async function moveWorkEntry(id: string, direction: -1 | 1) {
		const sorted = [...entries].sort((a, b) => a.order - b.order);
		const idx = sorted.findIndex((e: any) => e._id === id);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= sorted.length) return;
		await client.mutation(api.works.reorderEntries, {
			updates: [
				{ id: sorted[idx]._id, order: swapIdx },
				{ id: sorted[swapIdx]._id, order: idx },
			],
		});
	}
</script>

<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Works / Projects</h2>
		<span class="section-count">{entries.length}</span>
		<button class="btn-sm btn-add" on:click={addWorkEntry}>+ Add</button>
		<a href="/works" class="btn-sm" target="_blank">View &rarr;</a>
	</div>

	{#each [...entries].sort((a, b) => a.order - b.order) as entry, idx}
		<div class="card" class:hidden-entry={!entry.visible}>
			<div class="card-header">
				<div class="card-title-row">
					<div class="reorder-btns">
						<button class="btn-icon" on:click={() => moveWorkEntry(entry._id, -1)} disabled={idx === 0}>&#8593;</button>
						<button class="btn-icon" on:click={() => moveWorkEntry(entry._id, 1)} disabled={idx === entries.length - 1}>&#8595;</button>
					</div>

					{#if editingId === entry._id && editingField === 'title'}
						<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveWorkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveWorkEdit(entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>&times;</button>
					{:else}
						<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'title', entry.title)} on:keydown={a11yClick(() => startEdit(entry._id, 'title', entry.title))}>{entry.title}</span>
					{/if}

					<button class="btn-icon" on:click={() => toggleWorkVisibility(entry._id)} title={entry.visible ? 'Hide' : 'Show'}>
						{entry.visible ? '👁' : '👁‍🗨'}
					</button>
					<button class="btn-icon btn-danger" on:click={() => deleteWorkEntry(entry._id)}>&times;</button>
				</div>

				<div class="card-meta">
					{#if editingId === entry._id && editingField === 'url'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveWorkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveWorkEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-org" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'url', entry.url)} on:keydown={a11yClick(() => startEdit(entry._id, 'url', entry.url))}>{entry.url}</span>
					{/if}
					<span class="meta-sep">&middot;</span>

					{#if editingId === entry._id && editingField === 'category'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveWorkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveWorkEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-loc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'category', entry.category || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'category', entry.category || ''))}>{entry.category || '(category)'}</span>
					{/if}
					{#if entry.featured}
						<span class="meta-sep">&middot;</span>
						<span class="tool-tag" on:click={() => startEdit(entry._id, 'featured', entry.featured || '')} style="cursor:pointer;">{entry.featured}</span>
					{/if}
				</div>
			</div>

			<div class="card-body">
				<div class="card-tools" style="margin-top: var(--space-xs);">
					{#each ['preview', 'viewport', 'cam', 'muxPlaybackId'] as field}
						{#if editingId === entry._id && editingField === field}
							<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveWorkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveWorkEdit(entry._id)}>&#10003;</button>
						{:else}
							<span class="tool-tag" on:click={() => startEdit(entry._id, field, String(entry[field] || ''))} style="cursor:pointer;">
								{field}: {entry[field] || '—'}
							</span>
						{/if}
					{/each}
				</div>
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

	.card-meta {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		margin-top: var(--space-xs);
		padding-left: 52px;
	}

	.meta-org, .meta-loc {
		cursor: pointer;
	}

	.meta-org:hover, .meta-loc:hover {
		color: var(--color-accent);
	}

	.meta-sep {
		opacity: 0.4;
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

	.field-actions {
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
		text-decoration: none;
		display: inline-flex;
		align-items: center;
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
		.card-meta {
			padding-left: 0;
			flex-wrap: wrap;
		}

		.card-body {
			padding-left: 0;
		}
	}
</style>
