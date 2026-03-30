<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string = '';
	export let label: string = '';
	export let multiline: boolean = false;
	export let type: 'text' | 'number' = 'text';
	export let saving: boolean = false;
	export let placeholder: string = '(empty)';
	/** Compact mode: inline save checkmark instead of Save/Cancel buttons */
	export let compact: boolean = false;

	const dispatch = createEventDispatcher<{
		save: string;
		cancel: void;
	}>();

	let editing = false;
	let buffer = '';

	export function startEditing() {
		editing = true;
		buffer = value || '';
	}

	function save() {
		dispatch('save', buffer);
		editing = false;
		buffer = '';
	}

	function cancel() {
		editing = false;
		buffer = '';
		dispatch('cancel');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			save();
		} else if (e.key === 'Escape') {
			cancel();
		}
	}

	function a11yClick(handler: () => void) {
		return (e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
		};
	}
</script>

{#if editing}
	<div class="editable-field-edit">
		{#if label}
			<span class="field-label">{label}</span>
		{/if}
		{#if multiline}
			<textarea
				class="field-input"
				bind:value={buffer}
				on:keydown={handleKeydown}
				rows="3"
			></textarea>
		{:else}
			<input
				class="field-input{compact ? '-sm' : ''}"
				class:flex-1={compact}
				{type}
				bind:value={buffer}
				on:keydown={handleKeydown}
			/>
		{/if}
		{#if compact}
			<button class="btn-sm btn-save" on:click={save} disabled={saving}>&#10003;</button>
		{:else}
			<div class="field-actions">
				<button class="btn-sm btn-save" on:click={save} disabled={saving}>Save</button>
				<button class="btn-sm" on:click={cancel}>Cancel</button>
			</div>
		{/if}
	</div>
{:else}
	<span
		class="field-value"
		role="button"
		tabindex="0"
		on:click={startEditing}
		on:keydown={a11yClick(startEditing)}
	>
		{value || placeholder}
	</span>
{/if}

<style>
	.editable-field-edit {
		display: contents;
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
	}

	.field-value:hover {
		background: var(--color-bg-alt);
	}

	.field-input, .field-input-sm {
		font-family: inherit;
		font-size: inherit;
		padding: 4px 8px;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		color: var(--color-text);
		width: 100%;
	}

	.field-input:focus, .field-input-sm:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	.field-input-sm {
		padding: 2px 6px;
		font-size: var(--font-size-sm);
	}

	textarea.field-input {
		resize: vertical;
		min-height: 60px;
	}

	.field-actions {
		display: flex;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.btn-sm {
		padding: 2px 8px;
		font-size: var(--font-size-xs);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color-subtle);
		background: var(--color-bg);
		color: var(--color-text-muted);
		cursor: pointer;
	}

	.btn-save {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	.flex-1 {
		flex: 1;
	}
</style>
