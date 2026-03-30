<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let client: any;
	export let api: any;
	export let profile: any;

	let editingField: string | null = null;
	let editBuffer = '';
	let saving = false;

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
</script>

{#if profile}
<section class="admin-section">
	<h2 class="section-label">Profile</h2>
	<div class="card">
		{#each [
			{ field: 'name', label: 'Name', value: profile.name },
			{ field: 'jobTitle', label: 'Title', value: profile.jobTitle },
			{ field: 'summary', label: 'Summary', value: profile.summary },
		] as item}
			<div class="field-row">
				<span class="field-label">{item.label}</span>
				{#if editingField === item.field}
					{#if item.field === 'summary'}
						<textarea class="field-input" bind:value={editBuffer} on:keydown={handleKeydown} rows="3"></textarea>
					{:else}
						<input class="field-input" bind:value={editBuffer} on:keydown={handleKeydown} />
					{/if}
					<div class="field-actions">
						<button class="btn-sm btn-save" on:click={saveEdit} disabled={saving}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
					</div>
				{:else}
					<span class="field-value" role="button" tabindex="0" on:click={() => startEdit(item.field, item.value)} on:keydown={a11yClick(() => startEdit(item.field, item.value))}>
						{item.value || '(empty)'}
					</span>
				{/if}
			</div>
		{/each}
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
	}
</style>
