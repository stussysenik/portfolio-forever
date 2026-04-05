<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import type { Id } from '$convex/_generated/dataModel';
	import { a11yClick } from './admin-utils';

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
		await client.mutation(api.heroCaseStudies.createEntry, {
			title: 'New Case Study',
			problem: 'Describe the problem...',
			constraint: 'Describe the constraint...',
			result: 'Describe the result...',
			visible: false,
		});
	}

	async function deleteEntry(id: string) {
		await client.mutation(api.heroCaseStudies.deleteEntry, { id: id as Id<"heroCaseStudies"> });
		toast.success('Case study deleted');
	}

	async function toggleVisibility(id: string) {
		await client.mutation(api.heroCaseStudies.toggleVisibility, { id: id as Id<"heroCaseStudies"> });
	}

	async function saveEdit(id: string) {
		if (!editingField) return;
		await client.mutation(api.heroCaseStudies.updateEntry, {
			id: id as Id<"heroCaseStudies">, [editingField]: editBuffer,
		});
		cancelEdit();
	}

	const FIELDS = [
		{ key: 'title', label: 'Title' },
		{ key: 'role', label: 'Role' },
		{ key: 'timeToShip', label: 'Time to Ship' },
		{ key: 'framework', label: 'Framework' },
		{ key: 'problem', label: 'Problem' },
		{ key: 'constraint', label: 'Constraint' },
		{ key: 'result', label: 'Result' },
	];
</script>

<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Case Studies</h2>
		<span class="section-count">{entries.length}</span>
		<button class="btn-sm btn-add" on:click={addEntry}>+ Add</button>
	</div>

	{#each [...entries].sort((a, b) => a.order - b.order) as entry (entry._id)}
		<div class="card" class:hidden-entry={!entry.visible}>
			<div class="card-header">
				<div class="card-title-row">
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

				<div class="card-fields">
					{#each FIELDS.filter(f => f.key !== 'title') as field}
						<div class="field-row">
							<span class="field-key">{field.label}</span>
							{#if editingId === entry._id && editingField === field.key}
								<input class="field-input-sm flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
								<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
							{:else}
								<span class="field-value" role="button" tabindex="0" on:click={() => startEdit(entry._id, field.key, entry[field.key] ?? '')} on:keydown={a11yClick(() => startEdit(entry._id, field.key, entry[field.key] ?? ''))}>{entry[field.key] || '—'}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</section>

<style>
	.section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
	.section-label { font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-subtle); }
	.section-count { font-family: var(--font-mono); font-size: 7px; color: var(--color-text-subtle); }
	.section-count::before { content: "["; }
	.section-count::after { content: "]"; }

	.card { border: 1px solid var(--border-color); border-radius: 4px; padding: 8px; margin-bottom: 6px; }
	.card.hidden-entry { opacity: 0.5; }
	.card-title-row { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
	.card-title { font-size: 11px; font-weight: 600; cursor: pointer; }
	.card-title:hover { color: var(--color-accent); }

	.card-fields { display: flex; flex-direction: column; gap: 2px; }
	.field-row { display: flex; align-items: center; gap: 4px; }
	.field-key { font-family: var(--font-mono); font-size: 7px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-subtle); min-width: 70px; }
	.field-value { font-size: 10px; color: var(--color-text-muted); cursor: pointer; }
	.field-value:hover { color: var(--color-text); }

	.btn-icon { background: none; border: none; cursor: pointer; font-size: 11px; padding: 0 2px; }
	.btn-danger { color: hsl(0, 70%, 60%); }
</style>
