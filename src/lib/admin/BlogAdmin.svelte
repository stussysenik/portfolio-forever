<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import type { Id } from '$convex/_generated/dataModel';
	import { a11yClick, parseFieldValue } from './admin-utils';

	export let client: any;
	export let api: any;
	export let entries: any[];
	export let compact: boolean = false;

	let editingId: string | null = null;
	let editingField: string | null = null;
	let editBuffer = '';

	import { stagedChanges } from '$lib/stores/stagedChanges';

	function stageUpdate(id: string, patch: any, label: string) {
		stagedChanges.stage('blogPosts', id, patch, label);
	}

	function startEdit(id: string, field: string, currentValue: string) {
		editingId = id; editingField = field; editBuffer = currentValue || '';
	}
	function cancelEdit() { editingId = null; editingField = null; editBuffer = ''; }

	function addPost() {
		const tempId = `new-${Date.now()}`;
		stageUpdate(tempId, {
			title: 'New Post', slug: 'new-post-' + Date.now(),
			visible: false,
			isNew: true
		}, 'Add Blog Post');
	}

	function deletePost(id: string) {
		stageUpdate(id, { _deleted: true }, 'Delete Blog Post');
	}

	function toggleVisibility(id: string) {
		const entry = entries.find(e => e._id === id);
		const current = entry?.visible ?? true;
		stageUpdate(id, { visible: !current }, `Visibility: ${!current ? 'Show' : 'Hide'}`);
	}

	function saveEdit(id: string) {
		if (!editingField) return;
		const value = parseFieldValue(editingField, editBuffer, { arrays: ['tags'] });
		stageUpdate(id, { [editingField]: value }, `Edit ${editingField}`);
		cancelEdit();
	}
</script>

<section class="admin-section blog-admin">
	{#if !compact}
	<div class="section-header">
		<h2 class="section-label">Blog</h2>
		<span class="section-count">{entries.length}</span>
		<button class="btn-sm btn-add" on:click={addPost}>+ Add</button>
		<a href="/blog" class="btn-sm" target="_blank">View &rarr;</a>
	</div>
	{/if}

	{#each [...entries].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')) as entry}
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
					<button class="btn-icon btn-danger" on:click={() => deletePost(entry._id)}>&times;</button>
				</div>

				<div class="card-meta">
					{#if editingId === entry._id && editingField === 'slug'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-org" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'slug', entry.slug)} on:keydown={a11yClick(() => startEdit(entry._id, 'slug', entry.slug))}>{entry.slug}</span>
					{/if}
					<span class="meta-sep">&middot;</span>

					{#if editingId === entry._id && editingField === 'publishedAt'}
						<input class="field-input-sm" bind:value={editBuffer} placeholder="YYYY-MM-DD" on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<span class="meta-date" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'publishedAt', entry.publishedAt || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'publishedAt', entry.publishedAt || ''))}>{entry.publishedAt || '(date)'}</span>
					{/if}
				</div>
			</div>

			<div class="card-body">
				{#if editingId === entry._id && editingField === 'excerpt'}
					<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(entry._id); } if (e.key === 'Escape') cancelEdit(); }} rows="2" placeholder="Excerpt..."></textarea>
					<div class="field-actions">
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
					</div>
				{:else}
					<button type="button" class="card-desc inline-edit-btn" on:click={() => startEdit(entry._id, 'excerpt', entry.excerpt || '')}>{entry.excerpt || '(click to add excerpt)'}</button>
				{/if}

				{#if editingId === entry._id && editingField === 'content'}
					<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Escape') cancelEdit(); }} rows="8" placeholder="Markdown content..." style="margin-top: var(--space-sm);"></textarea>
					<div class="field-actions">
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
					</div>
				{:else}
					<button type="button" class="card-desc content-preview inline-edit-btn" on:click={() => startEdit(entry._id, 'content', entry.content || '')} style="margin-top: var(--space-sm);">
						{entry.content ? (entry.content.length > 120 ? entry.content.slice(0, 120) + '...' : entry.content) : '(click to add content)'}
					</button>
				{/if}

				<div class="card-tools" style="margin-top: var(--space-xs);">
					{#if editingId === entry._id && editingField === 'tags'}
						<input class="field-input-sm" bind:value={editBuffer} placeholder="comma-separated tags" on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<button type="button" class="tool-tag clickable tool-tag-btn" on:click={() => startEdit(entry._id, 'tags', (entry.tags || []).join(', '))}>tags: {(entry.tags || []).join(', ') || '—'}</button>
					{/if}

					{#if editingId === entry._id && editingField === 'coverImage'}
						<input class="field-input-sm" bind:value={editBuffer} placeholder="Cover image URL" on:keydown={(e) => { if (e.key === 'Enter') saveEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
						<button class="btn-sm btn-save" on:click={() => saveEdit(entry._id)}>&#10003;</button>
					{:else}
						<button type="button" class="tool-tag clickable tool-tag-btn" on:click={() => startEdit(entry._id, 'coverImage', entry.coverImage || '')}>cover: {entry.coverImage ? '✓' : '—'}</button>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</section>

<style>
	/* All shared styles come from admin-shared.css */
	/* Blog-specific: no reorder arrows, so no left padding on meta/body */
	.blog-admin :global(.card-meta) { padding-left: 0; }
	.blog-admin :global(.card-body) { padding-left: 0; margin-top: var(--space-sm); }
	.content-preview { font-family: var(--font-mono); font-size: var(--font-size-xs); opacity: 0.7; }
</style>
