<script lang="ts">
	import { toast } from '$lib/stores/toast';

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

		<!-- Available toggle -->
		<div class="field-row">
			<span class="field-label">Available</span>
			<button class="btn-sm" class:btn-save={profile?.available}
				on:click={async () => {
					try {
						await client.mutation(api.cv.updateProfile, {
							id: profile._id, available: !profile?.available
						});
						toast.success(profile?.available ? 'Set unavailable' : 'Set available');
					} catch (e: any) {
						toast.error(`Save failed: ${e.message}`);
					}
				}}>
				{profile?.available ? 'YES' : 'NO'}
			</button>
		</div>

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
	</div>
</section>
{/if}

<style>
	.admin-section {
		margin-bottom: var(--space-xl);
	}

	.section-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
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

	.field-row--column {
		flex-direction: column;
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

	.field-value-muted {
		color: var(--color-text-muted);
		font-style: italic;
		font-size: var(--font-size-sm);
		padding: 2px 4px;
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
		resize: vertical;
	}

	.field-input:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 1px;
	}

	.field-actions {
		display: flex;
		gap: var(--space-xs);
		padding-top: var(--space-xs);
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
		transition: border-color var(--duration-fast) var(--easing), color var(--duration-fast) var(--easing);
	}

	.btn-sm:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.btn-sm:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 1px;
	}

	.btn-save {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	.btn-save:hover {
		opacity: 0.9;
	}

	.btn-remove {
		flex-shrink: 0;
		padding: var(--space-xs);
		line-height: 1;
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
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.tagline-row {
		display: flex;
		gap: var(--space-xs);
		align-items: center;
	}

	.tagline-lang {
		flex: 0 0 70px;
		min-width: 0;
	}

	.tagline-text {
		flex: 1;
		min-width: 0;
	}

	.taglines-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: var(--space-xs);
	}

	.taglines-preview {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.tagline-chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 8px;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
	}

	.tagline-chip-lang {
		font-weight: 600;
		color: var(--color-text-muted);
		margin-right: 4px;
	}

	@media (max-width: 600px) {
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

		.tagline-row {
			flex-wrap: wrap;
		}

		.tagline-lang {
			flex: 0 0 60px;
		}
	}
</style>
