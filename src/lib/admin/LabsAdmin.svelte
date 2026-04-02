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

	const statuses = ['stable', 'beta', 'experimental', 'archived'] as const;

	function startEdit(id: string, field: string, currentValue: string) {
		editingId = id; editingField = field; editBuffer = currentValue || '';
	}
	function cancelEdit() { editingId = null; editingField = null; editBuffer = ''; }

	async function addEntry() {
		await client.mutation(api.labs.createEntry, {
			title: 'New Experiment', description: 'Description',
			status: 'experimental', date: new Date().toISOString().split('T')[0],
			tags: [], memoryBudget: 128, requiredFeatures: [],
			order: entries.length, visible: true,
		});
	}

	async function deleteEntry(id: string) {
		await client.mutation(api.labs.deleteEntry, { id: id as Id<"labEntries"> });
		toast.success('Experiment deleted');
	}

	async function toggleVisibility(id: string) {
		await client.mutation(api.labs.toggleVisibility, { id: id as Id<"labEntries"> });
	}

	async function cycleStatus(id: string, current: string) {
		const idx = statuses.indexOf(current as any);
		const next = statuses[(idx + 1) % statuses.length];
		await client.mutation(api.labs.updateEntry, { id: id as Id<"labEntries">, status: next });
	}

	async function saveEdit(id: string) {
		if (!editingField) return;
		const value = parseFieldValue(editingField, editBuffer, {
			arrays: ['tags', 'requiredFeatures'],
			numbers: ['memoryBudget'],
		});
		await client.mutation(api.labs.updateEntry, {
			id: id as Id<"labEntries">, [editingField]: value,
		});
		cancelEdit();
	}

	async function moveEntry(id: string, direction: -1 | 1) {
		await reorderEntry(entries, id, direction, client, api.labs.reorderEntries);
	}

	function statusColor(s: string) {
		return s === 'stable' ? 'var(--color-success)' : s === 'beta' ? 'var(--color-accent)' : s === 'experimental' ? 'var(--color-warning)' : 'var(--color-text-muted)';
	}
</script>

<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Labs / Experiments</h2>
		<span class="section-count">{entries.length}</span>
		<button class="btn-sm btn-add" on:click={addEntry}>+ Add</button>
		<a href="/labs" class="btn-sm" target="_blank">View &rarr;</a>
	</div>

	{#each [...entries].sort((a, b) => a.order - b.order) as entry, idx}
		<div class="card" class:hidden-entry={!entry.visible}>
			<div class="card-header">
				<div class="card-title-row">
					<div class="reorder-btns">
						<button class="btn-icon" on:click={() => moveEntry(entry._id, -1)} disabled={idx === 0}>&#8593;</button>
						<button class="btn-icon" on:click={() => moveEntry(entry._id, 1)} disabled={idx === entries.length - 1}>&#8595;</button>
					</div>

					<span class="tool-tag" style="cursor:pointer; color:{statusColor(entry.status)}; border: 1px solid {statusColor(entry.status)}; background: transparent;" role="button" tabindex="0" on:click={() => cycleStatus(entry._id, entry.status)} on:keydown={a11yClick(() => cycleStatus(entry._id, entry.status))} title="Click to cycle status">{entry.status}</span>

					{#if editingId === entry._id && editingField === 'title'}
						<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>&times;</button>
					{:else}
						<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'title', entry.title)} on:keydown={a11yClick(() => startEdit(entry._id, 'title', entry.title))}>{entry.title}</span>
					{/if}

					<button class="btn-icon" on:click={() => toggleVisibility(entry._id)} title={entry.visible ? 'Hide' : 'Show'}>
						{entry.visible ? '\u{1F441}' : '\u{1F441}\u200D\u{1F5E8}'}
					</button>
					<button class="btn-icon btn-danger" on:click={() => deleteEntry(entry._id)}>&times;</button>
				</div>

				<div class="card-meta">
					{#if editingId === entry._id && editingField === 'slug'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-org" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'slug', entry.slug || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'slug', entry.slug || ''))}>{entry.slug || '(slug)'}</span>
					{/if}
					<span class="meta-sep">&middot;</span>

					{#if editingId === entry._id && editingField === 'date'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-date" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'date', entry.date)} on:keydown={a11yClick(() => startEdit(entry._id, 'date', entry.date))}>{entry.date}</span>
					{/if}
					<span class="meta-sep">&middot;</span>

					{#if editingId === entry._id && editingField === 'memoryBudget'}
						<input class="field-input-sm" type="number" style="max-width:80px;" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-date" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'memoryBudget', String(entry.memoryBudget))} on:keydown={a11yClick(() => startEdit(entry._id, 'memoryBudget', String(entry.memoryBudget)))}>{entry.memoryBudget} MB</span>
					{/if}
				</div>
			</div>

			<div class="card-body">
				{#if editingId === entry._id && editingField === 'description'}
					<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(entry._id); } if (e.key === 'Escape') cancelEdit(); }} rows="3"></textarea>
					<div class="field-actions">
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
					</div>
				{:else}
					<p class="card-desc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'description', entry.description)} on:keydown={a11yClick(() => startEdit(entry._id, 'description', entry.description))}>{entry.description}</p>
				{/if}

				<div class="card-tools" style="margin-top: var(--space-xs);">
					{#each ['sourceUrl', 'entryPoint', 'fallbackImage'] as field}
						{#if editingId === entry._id && editingField === field}
							<input class="field-input-sm" bind:value={editBuffer} placeholder={field} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
						{:else}
							<span class="tool-tag clickable" on:click={() => startEdit(entry._id, field, entry[field] || '')}>{field.replace('Url', '')}: {entry[field] ? '✓' : '—'}</span>
						{/if}
					{/each}
				</div>

				<div class="card-tools">
					{#if editingId === entry._id && editingField === 'tags'}
						<input class="field-input-sm" bind:value={editBuffer} placeholder="comma-separated tags" on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="tool-tag clickable" on:click={() => startEdit(entry._id, 'tags', (entry.tags || []).join(', '))}>tags: {(entry.tags || []).join(', ') || '—'}</span>
					{/if}

					{#if editingId === entry._id && editingField === 'requiredFeatures'}
						<input class="field-input-sm" bind:value={editBuffer} placeholder="comma-separated features" on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="tool-tag clickable" on:click={() => startEdit(entry._id, 'requiredFeatures', (entry.requiredFeatures || []).join(', '))}>features: {(entry.requiredFeatures || []).join(', ') || '—'}</span>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</section>

<style>
	/* All shared styles come from admin-shared.css */
</style>
