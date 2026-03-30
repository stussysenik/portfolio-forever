<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import type { Id } from '$convex/_generated/dataModel';

	export let client: any;
	export let api: any;
	export let sections: any[];
	export let entries: any[];
	export let languages: any[];

	const SECTION_TYPES = ['work', 'education', 'award', 'publication', 'project'];

	let editingId: string | null = null;
	let editingField: string | null = null;
	let editBuffer = '';
	let saving = false;
	let editingHighlights: { id: string; highlights: string[] } | null = null;

	function entriesOfType(type: string) {
		return entries.filter((e: any) => e.type === type).sort((a: any, b: any) => a.order - b.order);
	}

	function formatDate(d: string) {
		if (d === 'present') return 'present';
		const date = new Date(d);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	}

	function startEdit(id: string, field: string, currentValue: string) {
		editingId = id;
		editingField = field;
		editBuffer = currentValue || '';
	}

	async function saveEdit(table: 'entry' | 'language', id: string) {
		if (!editingField) return;
		saving = true;
		try {
			if (table === 'entry') {
				await client.mutation(api.cv.updateEntry, {
					id: id as Id<"cvEntries">,
					[editingField]: editBuffer,
				});
			} else if (table === 'language') {
				await client.mutation(api.languages.updateLanguage, {
					id: id as Id<"cvLanguages">,
					[editingField]: editBuffer,
				});
			}
			toast.success('Saved');
		} catch (e: any) {
			toast.error(`Save failed: ${e.message}`);
		} finally {
			saving = false;
			editingId = null;
			editingField = null;
			editBuffer = '';
		}
	}

	function cancelEdit() {
		editingId = null;
		editingField = null;
		editBuffer = '';
	}

	function a11yClick(handler: () => void) {
		return (e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
		};
	}

	function handleKeydown(e: KeyboardEvent, table: 'entry' | 'language', id: string) {
		if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(table, id); }
		else if (e.key === 'Escape') cancelEdit();
	}

	async function toggleEntryVisibility(id: string) {
		await client.mutation(api.cv.toggleVisibility, { id: id as Id<"cvEntries"> });
	}

	async function deleteEntry(id: string) {
		await client.mutation(api.cv.deleteEntry, { id: id as Id<"cvEntries"> });
		toast.success('Entry deleted');
	}

	async function addEntry(type: string) {
		const existing = entriesOfType(type);
		await client.mutation(api.cv.createEntry, {
			type: type as any,
			title: 'New Entry',
			startDate: new Date().toISOString().slice(0, 7),
			order: existing.length,
			visible: true,
		});
		toast.success('Entry added');
	}

	async function moveEntry(id: string, type: string, direction: -1 | 1) {
		const typeEntries = entriesOfType(type);
		const idx = typeEntries.findIndex((e: any) => e._id === id);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= typeEntries.length) return;
		await client.mutation(api.cv.reorderEntries, {
			updates: [
				{ id: typeEntries[idx]._id, order: swapIdx },
				{ id: typeEntries[swapIdx]._id, order: idx },
			],
		});
	}

	// Highlights
	function startEditHighlights(id: string, current: string[]) {
		editingHighlights = { id, highlights: [...(current || [])] };
	}

	function addHighlight() {
		if (editingHighlights) editingHighlights.highlights = [...editingHighlights.highlights, ''];
	}

	function removeHighlight(idx: number) {
		if (editingHighlights) editingHighlights.highlights = editingHighlights.highlights.filter((_, i) => i !== idx);
	}

	async function saveHighlights() {
		if (!editingHighlights) return;
		const filtered = editingHighlights.highlights.filter(h => h.trim());
		await client.mutation(api.cv.updateEntry, {
			id: editingHighlights.id as Id<"cvEntries">,
			highlights: filtered,
		});
		editingHighlights = null;
	}

	// Languages
	async function addLanguage() {
		await client.mutation(api.languages.createLanguage, {
			name: 'NEW',
			level: 'Beginner',
			order: languages.length,
			visible: true,
		});
	}

	async function deleteLanguage(id: string) {
		await client.mutation(api.languages.deleteLanguage, { id: id as Id<"cvLanguages"> });
	}

	// Sections
	async function addSection(type: string) {
		await client.mutation(api.sections.createSection, {
			name: type.charAt(0).toUpperCase() + type.slice(1),
			type,
			order: sections.length,
			visible: true,
		});
	}
</script>

<!-- CV Sections with Entries -->
{#each sections.filter(s => s.visible) as section}
<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">{section.name}</h2>
		<span class="section-count">{entriesOfType(section.type).length}</span>
		<button class="btn-sm btn-add" on:click={() => addEntry(section.type)}>+ Add</button>
	</div>

	{#each entriesOfType(section.type) as entry, idx}
		<div class="card" class:hidden-entry={!entry.visible}>
			<div class="card-header">
				<div class="card-title-row">
					<div class="reorder-btns">
						<button class="btn-icon" on:click={() => moveEntry(entry._id, section.type, -1)} disabled={idx === 0}>↑</button>
						<button class="btn-icon" on:click={() => moveEntry(entry._id, section.type, 1)} disabled={idx === entriesOfType(section.type).length - 1}>↓</button>
					</div>
					{#if editingId === entry._id && editingField === 'title'}
						<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'entry', entry._id)} />
						<button class="btn-sm btn-save" on:click={() => saveEdit('entry', entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>×</button>
					{:else}
						<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'title', entry.title)} on:keydown={a11yClick(() => startEdit(entry._id, 'title', entry.title))}>{entry.title}</span>
					{/if}
					<button class="btn-icon" on:click={() => toggleEntryVisibility(entry._id)} title={entry.visible ? 'Hide' : 'Show'}>{entry.visible ? '👁' : '👁‍🗨'}</button>
					<button class="btn-icon btn-danger" on:click={() => deleteEntry(entry._id)} title="Delete" aria-label="Delete entry">×</button>
				</div>
				<div class="card-meta">
					{#if editingId === entry._id && editingField === 'organization'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'entry', entry._id)} />
						<button class="btn-sm btn-save" on:click={() => saveEdit('entry', entry._id)}>✓</button>
					{:else}
						<span class="meta-org" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'organization', entry.organization || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'organization', entry.organization || ''))}>{entry.organization || '(org)'}</span>
					{/if}
					<span class="meta-sep">·</span>
					{#if editingId === entry._id && editingField === 'location'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'entry', entry._id)} />
						<button class="btn-sm btn-save" on:click={() => saveEdit('entry', entry._id)}>✓</button>
					{:else}
						<span class="meta-loc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'location', entry.location || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'location', entry.location || ''))}>{entry.location || '(location)'}</span>
					{/if}
					<span class="meta-sep">·</span>
					<span class="meta-date">{formatDate(entry.startDate)} → {entry.endDate ? formatDate(entry.endDate) : '...'}</span>
				</div>
			</div>
			<div class="card-body">
				{#if editingId === entry._id && editingField === 'description'}
					<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'entry', entry._id)} rows="2"></textarea>
					<div class="field-actions">
						<button class="btn-sm btn-save" on:click={() => saveEdit('entry', entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
					</div>
				{:else}
					<p class="card-desc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'description', entry.description || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'description', entry.description || ''))}>{entry.description || '(click to add description)'}</p>
				{/if}
				<!-- Highlights -->
				{#if editingHighlights && editingHighlights.id === entry._id}
					<div class="highlights-editor">
						{#each editingHighlights.highlights as hl, i}
							<div class="highlight-row">
								<input class="field-input-sm flex-1" bind:value={editingHighlights.highlights[i]} placeholder="Highlight..." />
								<button class="btn-icon btn-danger" on:click={() => removeHighlight(i)}>×</button>
							</div>
						{/each}
						<div class="highlight-actions">
							<button class="btn-sm" on:click={addHighlight}>+ Add highlight</button>
							<button class="btn-sm btn-save" on:click={saveHighlights}>Save</button>
							<button class="btn-sm" on:click={() => editingHighlights = null}>Cancel</button>
						</div>
					</div>
				{:else if entry.highlights?.length}
					<ul class="card-highlights" role="button" tabindex="0" on:click={() => startEditHighlights(entry._id, entry.highlights)} on:keydown={a11yClick(() => startEditHighlights(entry._id, entry.highlights))}>
						{#each entry.highlights as hl}<li>→ {hl}</li>{/each}
					</ul>
				{:else}
					<button class="btn-sm" on:click={() => startEditHighlights(entry._id, [])}>+ Add highlights</button>
				{/if}
				{#if entry.tools?.length}
					<div class="card-tools">
						{#each entry.tools as tool}<span class="tool-tag">{tool}</span>{/each}
					</div>
				{/if}
			</div>
		</div>
	{/each}
</section>
{/each}

<!-- Languages -->
<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Languages</h2>
		<button class="btn-sm btn-add" on:click={addLanguage}>+ Add</button>
	</div>
	<div class="languages-grid">
		{#each languages as lang}
			<div class="card card-compact">
				{#if editingId === lang._id && editingField === 'name'}
					<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'language', lang._id)} />
					<button class="btn-sm btn-save" on:click={() => saveEdit('language', lang._id)}>✓</button>
				{:else}
					<span class="lang-name" role="button" tabindex="0" on:click={() => startEdit(lang._id, 'name', lang.name)} on:keydown={a11yClick(() => startEdit(lang._id, 'name', lang.name))}>{lang.name}</span>
				{/if}
				{#if editingId === lang._id && editingField === 'level'}
					<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'language', lang._id)} />
					<button class="btn-sm btn-save" on:click={() => saveEdit('language', lang._id)}>✓</button>
				{:else}
					<span class="lang-level" role="button" tabindex="0" on:click={() => startEdit(lang._id, 'level', lang.level)} on:keydown={a11yClick(() => startEdit(lang._id, 'level', lang.level))}>{lang.level}</span>
				{/if}
				<button class="btn-icon btn-danger" on:click={() => deleteLanguage(lang._id)}>×</button>
			</div>
		{/each}
	</div>
</section>

<!-- Add CV Section -->
<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Add CV Section</h2>
	</div>
	<div class="add-section-grid">
		{#each SECTION_TYPES.filter(t => !sections.some(s => s.type === t)) as type}
			<button class="btn btn-outline" on:click={() => addSection(type)}>+ {type}</button>
		{/each}
	</div>
</section>

<style>
	/* Section layout */
	.admin-section {
		margin-bottom: var(--space-xl);
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
	}

	.section-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
	}

	.section-count {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		background: var(--border-color-subtle);
		padding: 1px 6px;
		border-radius: var(--radius-sm);
	}

	/* Card */
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

	.hidden-entry {
		opacity: 0.45;
	}

	.card-compact {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
	}

	/* Card header */
	.card-header {
		margin-bottom: var(--space-sm);
	}

	.card-title-row {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.card-title {
		font-weight: 600;
		cursor: pointer;
		padding: 2px 4px;
		border-radius: var(--radius-sm);
		transition: background var(--duration-fast) var(--easing);
	}

	.card-title:hover {
		background: var(--color-bg-hover, rgba(255, 255, 255, 0.05));
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
		padding-left: 52px;
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.meta-org,
	.meta-loc {
		cursor: pointer;
		padding: 1px 3px;
		border-radius: var(--radius-sm);
		transition: background var(--duration-fast) var(--easing);
	}

	.meta-org:hover,
	.meta-loc:hover {
		background: var(--color-bg-hover, rgba(255, 255, 255, 0.05));
	}

	.meta-sep {
		color: var(--border-color);
	}

	.meta-date {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
	}

	/* Card body */
	.card-body {
		padding-left: 52px;
	}

	.card-desc {
		cursor: pointer;
		padding: 2px 4px;
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		margin: 0;
		transition: background var(--duration-fast) var(--easing);
	}

	.card-desc:hover {
		background: var(--color-bg-hover, rgba(255, 255, 255, 0.05));
	}

	.card-highlights {
		list-style: none;
		padding: var(--space-xs) 0;
		margin: 0;
		cursor: pointer;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		transition: background var(--duration-fast) var(--easing);
	}

	.card-highlights:hover {
		background: var(--color-bg-hover, rgba(255, 255, 255, 0.05));
	}

	.card-highlights li {
		padding: 1px 4px;
	}

	.card-tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-top: var(--space-sm);
	}

	.tool-tag {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		padding: 1px 6px;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
	}

	/* Reorder buttons */
	.reorder-btns {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	/* Field inputs */
	.field-row {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.field-row:last-child {
		border-bottom: none;
	}

	.field-label {
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		color: var(--color-text-muted);
		min-width: 70px;
		padding-top: 4px;
	}

	.field-value {
		flex: 1;
		cursor: pointer;
		padding: 2px 4px;
		border-radius: var(--radius-sm);
		transition: background var(--duration-fast) var(--easing);
	}

	.field-value:hover {
		background: var(--color-bg-hover, rgba(255, 255, 255, 0.05));
	}

	.field-input {
		flex: 1;
		font-family: inherit;
		font-size: inherit;
		padding: var(--space-xs) var(--space-sm);
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text);
		outline: none;
		resize: vertical;
	}

	.field-input-sm {
		font-family: inherit;
		font-size: var(--font-size-xs);
		padding: 2px var(--space-xs);
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text);
		outline: none;
	}

	.field-actions {
		display: flex;
		gap: var(--space-xs);
		padding-top: var(--space-xs);
	}

	/* Highlights editor */
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

	/* Languages grid */
	.languages-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: var(--space-sm);
	}

	.lang-name {
		font-weight: 600;
		cursor: pointer;
		padding: 1px 3px;
		border-radius: var(--radius-sm);
		transition: background var(--duration-fast) var(--easing);
	}

	.lang-name:hover {
		background: var(--color-bg-hover, rgba(255, 255, 255, 0.05));
	}

	.lang-level {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		cursor: pointer;
		padding: 1px 3px;
		border-radius: var(--radius-sm);
		transition: background var(--duration-fast) var(--easing);
	}

	.lang-level:hover {
		background: var(--color-bg-hover, rgba(255, 255, 255, 0.05));
	}

	/* Add section grid */
	.add-section-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	/* Buttons */
	.btn {
		padding: var(--space-sm) var(--space-md);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
	}

	.btn-outline {
		border-style: dashed;
		color: var(--color-text-muted);
	}

	.btn-outline:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
		border-style: solid;
	}

	.btn-sm {
		padding: var(--space-xs) var(--space-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
	}

	.btn-sm:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.btn-save {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	.btn-save:hover {
		opacity: 0.9;
	}

	.btn-add {
		margin-left: auto;
	}

	.btn-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		font-size: var(--font-size-xs);
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
	}

	.btn-icon:hover {
		border-color: var(--border-color);
		color: var(--color-text);
	}

	.btn-icon:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.btn-danger {
		color: var(--color-danger, #e74c3c);
	}

	.btn-danger:hover {
		border-color: var(--color-danger, #e74c3c);
		color: var(--color-danger, #e74c3c);
	}

	/* Utility */
	.flex-1 {
		flex: 1;
	}

	/* Mobile responsive */
	@media (max-width: 600px) {
		.card-title-row {
			flex-wrap: wrap;
		}

		.card-meta {
			padding-left: 0;
			flex-wrap: wrap;
		}

		.card-body {
			padding-left: 0;
		}

		.languages-grid {
			grid-template-columns: 1fr;
		}

		.field-row {
			flex-direction: column;
			gap: var(--space-xs);
		}

		.field-label {
			min-width: unset;
		}

		.field-actions {
			width: 100%;
			justify-content: flex-end;
		}

		.highlight-row {
			flex-direction: column;
			align-items: stretch;
		}

		.add-section-grid {
			flex-direction: column;
		}

		.reorder-btns {
			flex-direction: row;
		}
	}
</style>
