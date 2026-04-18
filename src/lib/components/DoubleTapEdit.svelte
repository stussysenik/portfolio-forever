<script lang="ts">
	import { onMount } from 'svelte';
	import { stagedChanges } from '$lib/stores/stagedChanges';
	import { previewMode } from '$lib/stores/siteMode';

	export let table: string;
	export let docId: string;
	export let field: string;
	export let value: string;
	export let label: string = '';

	let editing = false;
	let inputEl: HTMLInputElement;
	let lastTap = 0;

	$: canEdit = $previewMode;

	function handleDoubleTap() {
		if (!canEdit) return;
		editing = true;
	}

	function handleClick(e: MouseEvent) {
		const now = Date.now();
		if (now - lastTap < 300) {
			handleDoubleTap();
		}
		lastTap = now;
	}

	function save() {
		if (inputEl.value !== value) {
			stagedChanges.stage(table, docId, { [field]: inputEl.value }, label || `Edit ${field}`);
		}
		editing = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') save();
		if (e.key === 'Escape') editing = false;
	}

	onMount(() => {
		if (editing) inputEl.focus();
	});

	$: if (editing && inputEl) {
		setTimeout(() => inputEl.focus(), 0);
	}
</script>

{#if editing}
	<input
		bind:this={inputEl}
		class="live-edit-input"
		type="text"
		{value}
		on:blur={save}
		on:keydown={handleKeyDown}
	/>
{:else}
	<span
		class="live-edit-target"
		class:editable={canEdit}
		on:click={handleClick}
		role="button"
		tabindex="0"
	>
		<slot>{value}</slot>
	</span>
{/if}

<style>
	.live-edit-target.editable {
		cursor: text;
		position: relative;
	}

	.live-edit-target.editable:hover::after {
		content: '✎';
		position: absolute;
		right: -1.2em;
		top: 0;
		font-size: 0.8em;
		opacity: 0.5;
	}

	.live-edit-input {
		font: inherit;
		color: inherit;
		background: var(--color-bg-alt, #eee);
		border: 1px solid var(--color-accent, #2563eb);
		padding: 0 4px;
		margin: -1px -5px;
		border-radius: 2px;
		width: auto;
		display: inline-block;
	}
</style>
