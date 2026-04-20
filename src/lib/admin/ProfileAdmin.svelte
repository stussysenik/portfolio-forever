<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { sameAsUrlToLabel } from '$lib/utils/social-links';

	export let client: any;
	export let api: any;
	export let profile: any;

	let editingField: string | null = null;
	let editBuffer = '';
	let saving = false;

	// Taglines editor state
	let editingTaglines = false;
	let taglinesBuffer: { lang: string; text: string }[] = [];
	let savingTaglines = false;

	// SameAs (social links) editor state
	let editingSameAs = false;
	let sameAsBuffer: string[] = [];
	let savingSameAs = false;

	function startEdit(field: string, currentValue: string) {
		editingField = field;
		editBuffer = currentValue || '';
	}

	async function saveEdit() {
		if (!editingField || !profile) return;
		saving = true;
		try {
			await client.mutation(api.cv.updateProfile, {
				id: profile._id,
				[editingField]: editBuffer,
			});
			toast.success('Saved');
		} catch (e: any) {
			toast.error(`Save failed: ${e.message}`);
		} finally {
			saving = false;
			editingField = null;
			editBuffer = '';
		}
	}

	function cancelEdit() {
		editingField = null;
		editBuffer = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
		else if (e.key === 'Escape') cancelEdit();
	}

	function a11yClick(handler: () => void) {
		return (e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
		};
	}

	function startEditTaglines() {
		taglinesBuffer = (profile?.taglines ?? []).map((t: any) => ({ lang: t.lang, text: t.text }));
		editingTaglines = true;
	}

	function cancelEditTaglines() {
		editingTaglines = false;
		taglinesBuffer = [];
	}

	function addTagline() {
		taglinesBuffer = [...taglinesBuffer, { lang: '', text: '' }];
	}

	function removeTagline(index: number) {
		taglinesBuffer = taglinesBuffer.filter((_, i) => i !== index);
	}

	async function saveTaglines() {
		if (!profile) return;
		savingTaglines = true;
		try {
			await client.mutation(api.cv.updateProfile, {
				id: profile._id,
				taglines: taglinesBuffer,
			});
			toast.success('Taglines saved');
			editingTaglines = false;
		} catch (e: any) {
			toast.error(`Save failed: ${e.message}`);
		} finally {
			savingTaglines = false;
		}
	}

	// SameAs (social links) editor functions
	function startEditSameAs() {
		sameAsBuffer = [...(profile?.sameAs ?? [])];
		editingSameAs = true;
	}

	function cancelEditSameAs() {
		editingSameAs = false;
		sameAsBuffer = [];
	}

	function addSameAs() {
		sameAsBuffer = [...sameAsBuffer, ''];
	}

	function removeSameAs(index: number) {
		sameAsBuffer = sameAsBuffer.filter((_, i) => i !== index);
	}

	async function saveSameAs() {
		if (!profile) return;
		savingSameAs = true;
		try {
			// Filter out empty URLs before saving
			const cleaned = sameAsBuffer.filter((url) => url.trim() !== '');
			await client.mutation(api.cv.updateProfile, {
				id: profile._id,
				sameAs: cleaned,
			});
			toast.success('Social links saved');
			editingSameAs = false;
		} catch (e: any) {
			toast.error(`Save failed: ${e.message}`);
		} finally {
			savingSameAs = false;
		}
	}

</script>

{#if profile}
<section class="admin-section">
	<h2 class="section-label">Profile</h2>
	<div class="card">
		{#each [
			{ field: 'name', label: 'Name', value: profile.name },
			{ field: 'jobTitle', label: 'Title', value: profile.jobTitle },
			{ field: 'summary', label: 'Summary', value: profile.summary },
			{ field: 'shortBio', label: 'Short Bio', value: profile.shortBio },
			{ field: 'location', label: 'Location', value: profile.location },
			{ field: 'email', label: 'Email', value: profile.email },
		] as item}
			<div class="field-row">
				<span class="field-label">{item.label}</span>
				{#if editingField === item.field}
					{#if item.field === 'summary' || item.field === 'shortBio'}
						<textarea class="field-input" bind:value={editBuffer} on:keydown={handleKeydown} rows="3"></textarea>
					{:else}
						<input class="field-input" bind:value={editBuffer} on:keydown={handleKeydown} />
					{/if}
					<div class="field-actions">
						<button class="btn-sm btn-save" on:click={saveEdit} disabled={saving}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
					</div>
				{:else}
					<button class="field-value" on:click={() => startEdit(item.field, item.value)}>
						{item.value || '(empty)'}
					</button>
				{/if}
			</div>
		{/each}

		<!-- Taglines editor -->
		<div class="field-row field-row--column">
			<div class="taglines-header">
				<span class="field-label">Taglines</span>
				{#if !editingTaglines}
					<button class="btn-sm" on:click={startEditTaglines}>Edit</button>
				{/if}
			</div>
			{#if editingTaglines}
				<div class="taglines-list">
					{#each taglinesBuffer as tagline, i}
						<div class="tagline-row">
							<input
								class="field-input tagline-lang"
								placeholder="lang"
								bind:value={tagline.lang}
							/>
							<input
								class="field-input tagline-text"
								placeholder="text"
								bind:value={tagline.text}
							/>
							<button class="btn-sm btn-remove" aria-label="Remove tagline" on:click={() => removeTagline(i)}>✕</button>
						</div>
					{/each}
					<div class="taglines-footer">
						<button class="btn-sm" on:click={addTagline}>+ Add tagline</button>
						<div class="field-actions">
							<button class="btn-sm btn-save" on:click={saveTaglines} disabled={savingTaglines}>Save</button>
							<button class="btn-sm" on:click={cancelEditTaglines}>Cancel</button>
						</div>
					</div>
				</div>
			{:else}
				<div class="taglines-preview">
					{#if profile?.taglines?.length}
						{#each profile.taglines as t}
							<span class="tagline-chip"><span class="tagline-chip-lang">{t.lang}</span>{t.text}</span>
						{/each}
					{:else}
						<span class="field-value-muted">(none)</span>
					{/if}
				</div>
			{/if}
		</div>
		<!-- SameAs (social links) editor -->
		<div class="field-row field-row--column">
			<div class="taglines-header">
				<span class="field-label">Social Links</span>
				{#if !editingSameAs}
					<button class="btn-sm" on:click={startEditSameAs}>Edit</button>
				{/if}
			</div>
			{#if editingSameAs}
				<div class="taglines-list">
					{#each sameAsBuffer as url, i}
						<div class="tagline-row">
							<input
								class="field-input sameas-url"
								placeholder="https://..."
								bind:value={sameAsBuffer[i]}
							/>
							<button class="btn-sm btn-remove" aria-label="Remove link" on:click={() => removeSameAs(i)}>&#10005;</button>
						</div>
					{/each}
					<div class="taglines-footer">
						<button class="btn-sm" on:click={addSameAs}>+ Add link</button>
						<div class="field-actions">
							<button class="btn-sm btn-save" on:click={saveSameAs} disabled={savingSameAs}>Save</button>
							<button class="btn-sm" on:click={cancelEditSameAs}>Cancel</button>
						</div>
					</div>
				</div>
			{:else}
				<div class="taglines-preview">
					{#if profile?.sameAs?.length}
						{#each profile.sameAs as url}
							<a href={url} target="_blank" rel="noopener" class="tagline-chip sameas-chip">{sameAsUrlToLabel(url)}</a>
						{/each}
					{:else}
						<span class="field-value-muted">(none)</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>
{/if}

<style>
	/* Modern minimal admin — Linear/Notion inspired */
	.admin-section {
		margin-bottom: var(--space-lg);
	}

	.section-label {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--color-text-subtle);
		margin-bottom: var(--space-sm);
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.field-row {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: 10px 0;
		border-bottom: 1px solid var(--border-color-subtle, rgba(0,0,0,0.06));
		min-height: 40px;
	}

	.field-row:last-child { border-bottom: none; }

	.field-row--column {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-xs);
	}

	.field-label {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		color: var(--color-text-muted);
		min-width: 80px;
		flex-shrink: 0;
	}

	.field-value {
		flex: 1;
		cursor: pointer;
		padding: 4px 8px;
		margin: -4px -8px;
		border-radius: 6px;
		border: none;
		background: none;
		font: inherit;
		color: var(--color-text);
		text-align: left;
		width: 100%;
		min-width: 0;
		transition: background-color 0.15s ease;
	}

	.field-value:hover {
		background: var(--color-surface, rgba(0,0,0,0.03));
	}

	.field-value:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 0;
	}

	.field-value-muted {
		color: var(--color-text-subtle);
		font-size: 13px;
	}

	.field-input {
		flex: 1;
		width: 100%;
		font-family: inherit;
		font-size: 14px;
		padding: 6px 8px;
		border: 1.5px solid var(--color-accent);
		border-radius: 6px;
		background: var(--color-bg);
		color: var(--color-text);
		resize: vertical;
	}

	.field-input:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
	}

	.field-actions {
		display: flex;
		gap: 6px;
		margin-top: 6px;
	}

	.btn-sm {
		padding: 4px 12px;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		border: 1px solid var(--border-color, rgba(0,0,0,0.1));
		border-radius: 6px;
		background: var(--color-bg);
		color: var(--color-text-muted);
		cursor: pointer;
		transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
	}

	.btn-sm:hover {
		border-color: var(--color-text-subtle);
		color: var(--color-text);
		background: var(--color-surface, rgba(0,0,0,0.02));
	}

	.btn-sm:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 1px;
	}

	.btn-save {
		background: var(--color-text);
		color: var(--color-bg);
		border-color: var(--color-text);
	}

	.btn-save:hover {
		opacity: 0.85;
	}

	.btn-remove {
		flex-shrink: 0;
		padding: 4px 6px;
		line-height: 1;
		color: var(--color-text-subtle);
	}

	.btn-remove:hover {
		color: var(--color-text);
	}

	/* Taglines */
	.taglines-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
	}

	.taglines-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 6px;
	}

	.tagline-row {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	.tagline-lang {
		flex: 0 0 56px;
		min-width: 0;
		font-size: 13px;
	}

	.tagline-text {
		flex: 1;
		min-width: 0;
		font-size: 13px;
	}

	.taglines-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 8px;
	}

	.taglines-preview {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 4px;
	}

	.tagline-chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 10px;
		background: var(--color-surface, rgba(0,0,0,0.03));
		border-radius: 2px;
		font-size: 12px;
		color: var(--color-text-secondary);
	}

	.tagline-chip-lang {
		font-weight: 600;
		color: var(--color-text-muted);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	/* SameAs */
	.sameas-url {
		flex: 1;
		min-width: 0;
		font-size: 13px;
	}

	.sameas-chip {
		text-decoration: none;
		color: var(--color-text-secondary);
	}

	.sameas-chip:hover {
		color: var(--color-text);
	}

	@media (max-width: 600px) {
		.field-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 4px;
		}
		.field-label { min-width: unset; }
		.field-actions { width: 100%; justify-content: flex-end; }
		.tagline-row { flex-wrap: wrap; }
		.tagline-lang { flex: 0 0 48px; }
	}
</style>
