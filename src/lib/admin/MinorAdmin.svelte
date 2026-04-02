<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import type { Id } from '$convex/_generated/dataModel';
	import { a11yClick, reorderEntry, parseFieldValue } from './admin-utils';

	export let client: any;
	export let api: any;
	export let entries: any[];

	let editingId: string | null = null;
	let editingField: string | null = null;
	let editBuffer = '';

	function startEdit(id: string, field: string, currentValue: string) {
		editingId = id; editingField = field; editBuffer = currentValue || '';
	}
	function cancelEdit() { editingId = null; editingField = null; editBuffer = ''; }

	async function addEntry() {
		await client.mutation(api.minor.createEntry, {
			category: 'misc', text: 'New entry',
			order: entries.length, visible: true,
		});
	}

	async function deleteEntry(id: string) {
		await client.mutation(api.minor.deleteEntry, { id: id as Id<"minorEntries"> });
		toast.success('Entry deleted');
	}

	async function toggleVisibility(id: string) {
		await client.mutation(api.minor.toggleVisibility, { id: id as Id<"minorEntries"> });
	}

	async function saveEdit(id: string) {
		if (!editingField) return;
		const value = parseFieldValue(editingField, editBuffer, { numbers: ['year'] });
		await client.mutation(api.minor.updateEntry, {
			id: id as Id<"minorEntries">, [editingField]: value,
		});
		cancelEdit();
	}

	async function moveEntry(id: string, direction: -1 | 1) {
		await reorderEntry(entries, id, direction, client, api.minor.reorderEntries);
	}
</script>

<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Minor</h2>
		<span class="section-count">{entries.length}</span>
		<button class="btn-sm btn-add" on:click={addEntry}>+ Add</button>
	</div>

	{#each [...entries].sort((a, b) => a.order - b.order) as entry, idx}
		<div class="card" class:hidden-entry={!entry.visible}>
			<div class="card-header">
				<div class="card-title-row">
					<div class="reorder-btns">
						<button class="btn-icon" on:click={() => moveEntry(entry._id, -1)} disabled={idx === 0}>&#8593;</button>
						<button class="btn-icon" on:click={() => moveEntry(entry._id, 1)} disabled={idx === entries.length - 1}>&#8595;</button>
					</div>

					{#if editingId === entry._id && editingField === 'category'}
						<input class="field-input-sm" style="max-width:100px;" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="tool-tag" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'category', entry.category)} on:keydown={a11yClick(() => startEdit(entry._id, 'category', entry.category))}>{entry.category}</span>
					{/if}

					{#if editingId === entry._id && editingField === 'text'}
						<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>&times;</button>
					{:else}
						<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'text', entry.text)} on:keydown={a11yClick(() => startEdit(entry._id, 'text', entry.text))}>{entry.text}</span>
					{/if}

					<button class="btn-icon" on:click={() => toggleVisibility(entry._id)} title={entry.visible ? 'Hide' : 'Show'}>
						{entry.visible ? '\u{1F441}' : '\u{1F441}\u200D\u{1F5E8}'}
					</button>
					<button class="btn-icon btn-danger" on:click={() => deleteEntry(entry._id)}>&times;</button>
				</div>

				<div class="card-meta">
					{#if editingId === entry._id && editingField === 'year'}
						<input class="field-input-sm" type="number" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-date" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'year', String(entry.year || ''))} on:keydown={a11yClick(() => startEdit(entry._id, 'year', String(entry.year || '')))}>{entry.year || '(year)'}</span>
					{/if}
				</div>
			</div>

			{#if entry.note || (editingId === entry._id && editingField === 'note')}
				<div class="card-body">
					{#if editingId === entry._id && editingField === 'note'}
						<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(entry._id); } if (e.key === 'Escape') cancelEdit(); }} rows="2"></textarea>
						<div class="field-actions">
							<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
						</div>
					{:else}
						<p class="card-desc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'note', entry.note || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'note', entry.note || ''))}>{entry.note}</p>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
</section>

<style>
	/* All shared styles come from admin-shared.css */
</style>
