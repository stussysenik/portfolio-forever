<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import type { Id } from '$convex/_generated/dataModel';
	import CropTruthTable from './controls/CropTruthTable.svelte';

	export let client: any;
	export let api: any;
	export let entries: any[];
	export let compact: boolean = false;

	let editingId: string | null = null;
	let editingField: string | null = null;
	let editBuffer = '';
	let saving = false;
	let expandedId: string | null = null;

	// New project form
	let showNewForm = false;
	let newTitle = '';
	let newUrl = '';
	let newPreview = '';

	/** Which entry's crop truth table is expanded (null = none) */
	let expandedCropId: string | null = null;

	function toggleCropTable(id: string) {
		expandedCropId = expandedCropId === id ? null : id;
	}

	/**
	 * Parse a legacy cam/objectPosition string like "center 30%" or "35% 20%"
	 * into { focalX, focalY } (0-100). Returns defaults (50,50) on failure.
	 */
	function parseCamToFocal(cam: string | undefined): { focalX: number; focalY: number } {
		if (!cam) return { focalX: 50, focalY: 50 };
		const parts = cam.trim().split(/\s+/);
		const parseVal = (s: string): number => {
			if (s === 'left' || s === 'top') return 0;
			if (s === 'center') return 50;
			if (s === 'right' || s === 'bottom') return 100;
			const n = parseFloat(s);
			return isNaN(n) ? 50 : n;
		};
		return {
			focalX: parseVal(parts[0] || 'center'),
			focalY: parseVal(parts[1] || 'center'),
		};
	}

	async function handleCropChange(entryId: string, detail: { focalX: number; focalY: number; zoom: number }) {
		await client.mutation(api.works.updateEntry, {
			id: entryId as Id<"worksEntries">,
			focalX: detail.focalX,
			focalY: detail.focalY,
			zoom: detail.zoom,
		});
	}

	function startEdit(id: string, field: string, currentValue: string) {
		editingId = id; editingField = field; editBuffer = currentValue || '';
	}
	function cancelEdit() { editingId = null; editingField = null; editBuffer = ''; }
	function a11yClick(handler: () => void) {
		return (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } };
	}

	function toggleExpand(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	async function addWorkEntry() {
		if (!showNewForm) { showNewForm = true; newTitle = ''; newUrl = ''; newPreview = ''; return; }
		if (!newUrl.trim()) { toast.error('URL is required'); return; }
		await client.mutation(api.works.createEntry, {
			title: newTitle.trim() || 'New Project',
			url: newUrl.trim(),
			preview: newPreview.trim() || undefined,
			order: entries.length, visible: true,
		});
		showNewForm = false;
		toast.success('Project added');
	}

	function cancelNewForm() { showNewForm = false; }

	async function saveObjectPosition(id: string, value: string) {
		await client.mutation(api.works.updateEntry, {
			id: id as Id<"worksEntries">, objectPosition: value,
		});
	}

	async function togglePreviewMode(id: string, current: string | undefined) {
		const cycle = ['live', 'static', 'video'];
		const idx = cycle.indexOf(current || 'live');
		const next = cycle[(idx + 1) % cycle.length];
		await client.mutation(api.works.updateEntry, {
			id: id as Id<"worksEntries">, previewMode: next as any,
		});
		toast.success(`Preview: ${next}`);
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
		const sorted = [...entries].sort((a: any, b: any) => a.order - b.order);
		const idx = sorted.findIndex((e: any) => e._id === id);
		const newIdx = idx + direction;
		if (newIdx < 0 || newIdx >= sorted.length) return;
		// Move element to new position
		const [moved] = sorted.splice(idx, 1);
		sorted.splice(newIdx, 0, moved);
		// Renumber all entries sequentially (0, 1, 2, 3...)
		const updates = sorted.map((e: any, i: number) => ({ id: e._id, order: i }));
		await client.mutation(api.works.reorderEntries, { updates });
	}
</script>

<section class="admin-section">
	{#if !compact}
	<div class="section-header">
		<h2 class="section-label">Works / Projects</h2>
		<span class="section-count">{entries.length}</span>
		<button class="btn-sm btn-add" on:click={addWorkEntry}>+ Add</button>
		<a href="/works" class="btn-sm" target="_blank">View &rarr;</a>
	</div>
	{/if}

	{#if showNewForm}
		<div class="new-form">
			<div class="new-form-row">
				<label class="new-form-label" for="new-work-title">Title</label>
				<input id="new-work-title" class="field-input-sm" bind:value={newTitle} placeholder="Project name" />
			</div>
			<div class="new-form-row">
				<label class="new-form-label" for="new-work-url">URL</label>
				<input id="new-work-url" class="field-input-sm" bind:value={newUrl} placeholder="https://..." />
			</div>
			<div class="new-form-row">
				<label class="new-form-label" for="new-work-preview">Preview</label>
				<input id="new-work-preview" class="field-input-sm" bind:value={newPreview} placeholder="/previews/... or https://..." />
			</div>
			<div class="new-form-actions">
				<button class="btn-sm btn-save" on:click={addWorkEntry}>Create</button>
				<button class="btn-sm" on:click={cancelNewForm}>Cancel</button>
			</div>
		</div>
	{/if}

	{#each [...entries].sort((a, b) => a.order - b.order) as entry, idx}
		<div class="card" class:hidden-entry={!entry.visible}>
			<div class="card-header">
				<div class="card-title-row">
					{#if entry.preview}
						<div class="works-thumb">
							<img src={entry.preview} alt={entry.title} loading="lazy" />
						</div>
					{:else}
						<div class="works-thumb works-thumb--empty">
							<span>no preview</span>
						</div>
					{/if}
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
						<button type="button" class="tool-tag tool-tag-btn" on:click={() => startEdit(entry._id, 'featured', entry.featured || '')}>{entry.featured}</button>
					{/if}
				</div>
			</div>

			<div class="card-body">
				<div class="card-tools" style="margin-top: var(--space-xs);">
					<button
						class="tool-tag tool-tag-btn"
						class:mode-live={!entry.previewMode || entry.previewMode === 'live'}
						class:mode-static={entry.previewMode === 'static'}
						class:mode-video={entry.previewMode === 'video'}
						on:click={() => togglePreviewMode(entry._id, entry.previewMode)}
						title="Cycle: live → static → video"
					>
						{entry.previewMode || 'live'}
					</button>
					<button class="tool-tag tool-tag-btn" on:click={() => toggleExpand(entry._id)}>
					Preview {expandedId === entry._id ? '\u25B4' : '\u25BE'}
				</button>
				{#each ['viewport', 'cam', 'videoPreview', 'muxPlaybackId'] as field}
						{#if editingId === entry._id && editingField === field}
							<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveWorkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveWorkEdit(entry._id)}>&#10003;</button>
						{:else}
							<button type="button" class="tool-tag tool-tag-btn" on:click={() => startEdit(entry._id, field, String(entry[field] || ''))}>
								{field}: {entry[field] || '—'}
							</button>
						{/if}
					{/each}
					{#if entry.preview}
						<button class="tool-tag crop-toggle" class:active={expandedCropId === entry._id} on:click={() => toggleCropTable(entry._id)}>
							{expandedCropId === entry._id ? '- crop' : '+ crop'}
						</button>
					{/if}
				</div>

				{#if expandedCropId === entry._id && entry.preview}
					{@const focal = entry.focalX != null ? { focalX: entry.focalX, focalY: entry.focalY } : parseCamToFocal(entry.cam)}
					<div class="crop-table-wrapper">
						<CropTruthTable
							imageUrl={entry.preview}
							focalX={focal.focalX}
							focalY={focal.focalY}
							zoom={entry.zoom ?? 1.0}
							on:change={(e) => handleCropChange(entry._id, e.detail)}
						/>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</section>

<style>
	/* Shared admin styles come from admin-shared.css */

	.works-thumb {
		width: 48px;
		height: 32px;
		border-radius: 2px;
		overflow: hidden;
		flex-shrink: 0;
		border: 1px solid var(--border-color-subtle);
	}

	.works-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.works-thumb--empty {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg-alt);
	}

	.works-thumb--empty span {
		font-size: 5px;
		font-family: var(--font-mono);
		color: var(--color-text-subtle);
		text-transform: uppercase;
	}

	.tool-tag-btn {
		cursor: pointer;
		border: 1px solid var(--border-color-subtle);
		transition: all 160ms ease;
	}

	.tool-tag-btn:hover {
		border-color: var(--bento-blue, #2563EB);
		color: var(--color-text);
	}

	/* Preview mode toggle indicators */
	.mode-live {
		border-color: var(--bento-green, #16a34a);
		color: var(--bento-green, #16a34a);
	}

	.mode-static {
		border-color: var(--color-text-muted);
		color: var(--color-text-muted);
	}

	.mode-video {
		border-color: #8B5CF6;
		color: #8B5CF6;
	}

	/* ── Expandable preview panel ── */
	.preview-panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: var(--space-sm);
		padding: var(--space-sm);
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		background: var(--color-bg-alt, #fafafa);
	}

	.preview-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.preview-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.preview-url {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		cursor: pointer;
		word-break: break-all;
	}

	.preview-url:hover {
		color: var(--color-accent);
	}

	.preview-edit-row {
		display: flex;
		gap: var(--space-xs);
		align-items: center;
	}

	.preview-position {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	/* ── New project form ── */
	.new-form {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: var(--space-md);
		margin-bottom: var(--space-sm);
		border: 1px solid var(--bento-blue, #2563EB);
		border-radius: var(--radius-md);
		background: var(--color-bg-alt, #fafafa);
	}

	.new-form-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.new-form-label {
		font-family: var(--font-mono);
		font-size: 8px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		min-width: 48px;
	}

	.new-form-actions {
		display: flex;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.crop-toggle {
		cursor: pointer;
		font-family: var(--font-mono, monospace);
		border: 1px dashed var(--border-color-subtle);
		transition: border-color 0.15s ease, color 0.15s ease;
	}

	.crop-toggle:hover,
	.crop-toggle.active {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.crop-table-wrapper {
		margin-top: var(--space-md);
		padding-top: var(--space-md);
		border-top: 1px solid var(--border-color-subtle);
	}
</style>
