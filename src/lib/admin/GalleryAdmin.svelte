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

	async function addGalleryEntry() {
		await client.mutation(api.gallery.createEntry, {
			title: 'New Item', order: entries.length, visible: true,
		});
	}

	async function deleteGalleryEntry(id: string) {
		await client.mutation(api.gallery.deleteEntry, { id: id as Id<"galleryItems"> });
		toast.success('Item deleted');
	}

	async function toggleGalleryVisibility(id: string) {
		await client.mutation(api.gallery.toggleVisibility, { id: id as Id<"galleryItems"> });
	}

	async function saveGalleryEdit(id: string) {
		if (!editingField) return;
		const value = parseFieldValue(editingField, editBuffer, {
			arrays: ['category'], numbers: ['year'],
		});
		await client.mutation(api.gallery.updateEntry, {
			id: id as Id<"galleryItems">, [editingField]: value,
		});
		cancelEdit();
	}

	async function moveGalleryEntry(id: string, direction: -1 | 1) {
		await reorderEntry(entries, id, direction, client, api.gallery.reorderEntries);
	}
</script>

<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Gallery</h2>
		<span class="section-count">{entries.length}</span>
		<button class="btn-sm btn-add" on:click={addGalleryEntry}>+ Add</button>
		<a href="/gallery" class="btn-sm" target="_blank">View &rarr;</a>
	</div>

	{#each [...entries].sort((a, b) => a.order - b.order) as entry, idx}
		<div class="card" class:hidden-entry={!entry.visible}>
			<div class="card-header">
				<div class="card-title-row">
					<div class="reorder-btns">
						<button class="btn-icon" on:click={() => moveGalleryEntry(entry._id, -1)} disabled={idx === 0}>&#8593;</button>
						<button class="btn-icon" on:click={() => moveGalleryEntry(entry._id, 1)} disabled={idx === entries.length - 1}>&#8595;</button>
					</div>

					{#if editingId === entry._id && editingField === 'title'}
						<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveGalleryEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveGalleryEdit(entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>&times;</button>
					{:else}
						<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'title', entry.title)} on:keydown={a11yClick(() => startEdit(entry._id, 'title', entry.title))}>{entry.title}</span>
					{/if}

					<button class="btn-icon" on:click={() => toggleGalleryVisibility(entry._id)} title={entry.visible ? 'Hide' : 'Show'}>
						{entry.visible ? '👁' : '👁‍🗨'}
					</button>
					<button class="btn-icon btn-danger" on:click={() => deleteGalleryEntry(entry._id)}>&times;</button>
				</div>

				<div class="card-meta">
					{#if editingId === entry._id && editingField === 'category'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveGalleryEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveGalleryEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-org" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'category', (entry.category || []).join(', '))} on:keydown={a11yClick(() => startEdit(entry._id, 'category', (entry.category || []).join(', ')))}>{(entry.category || []).join(', ') || '(category)'}</span>
					{/if}
					<span class="meta-sep">&middot;</span>

					{#if editingId === entry._id && editingField === 'year'}
						<input class="field-input-sm" type="number" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveGalleryEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveGalleryEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-date" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'year', String(entry.year || ''))} on:keydown={a11yClick(() => startEdit(entry._id, 'year', String(entry.year || '')))}>{entry.year || '(year)'}</span>
					{/if}
				</div>
			</div>

			<div class="card-body">
				{#if editingId === entry._id && editingField === 'description'}
					<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveGalleryEdit(entry._id); } if (e.key === 'Escape') cancelEdit(); }} rows="2"></textarea>
					<div class="field-actions">
						<button class="btn-sm btn-save" on:click={() => saveGalleryEdit(entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
					</div>
				{:else}
					<p class="card-desc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'description', entry.description || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'description', entry.description || ''))}>{entry.description || '(click to add description)'}</p>
				{/if}

				<!-- Tool tags -->
				<div class="card-tools" style="margin-top: var(--space-xs);">
					{#each ['thumbnailUrl', 'fullUrl', 'muxPlaybackId'] as field}
						{#if editingId === entry._id && editingField === field}
							<input class="field-input-sm" bind:value={editBuffer} placeholder="{field}" on:keydown={(e) => { if (e.key === 'Enter') saveGalleryEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveGalleryEdit(entry._id)}>&#10003;</button>
						{:else}
							<span class="tool-tag clickable" on:click={() => startEdit(entry._id, field, entry[field] || '')}>
								{field.replace('Url', '')}: {entry[field] ? '✓' : '—'}
							</span>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	{/each}
</section>

<style>
	/* All shared styles come from admin-shared.css */
</style>
