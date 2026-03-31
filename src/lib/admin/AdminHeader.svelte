<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let userName: string = '';
	export let userImage: string = '';

	const dispatch = createEventDispatcher<{
		exportPDF: void;
		exportJSON: void;
	}>();

	let showExport = false;
</script>

<header class="admin-header">
	<div class="admin-id">
		{#if userImage}<img src={userImage} alt="" width="20" height="20" class="admin-avatar" />{/if}
		<span class="admin-path">
			<span class="admin-path-dim">/admin</span>
			{#if userName}<span class="admin-path-sep">/</span><span class="admin-path-user">{userName}</span>{/if}
		</span>
	</div>

	<div class="admin-tools">
		<button class="tool-btn" aria-label="Export options" on:click={() => showExport = !showExport}>
			Export
		</button>
		{#if showExport}
			<div class="export-menu">
				<button class="export-item" on:click={() => { dispatch('exportPDF'); showExport = false; }}>PDF</button>
				<button class="export-item" on:click={() => { dispatch('exportJSON'); showExport = false; }}>JSON</button>
			</div>
		{/if}
	</div>
</header>

<style>
	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-sm) 0;
		margin-bottom: var(--space-md);
	}

	.admin-id {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.admin-avatar {
		border-radius: 50%;
		opacity: 0.8;
	}

	.admin-path {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		display: flex;
		align-items: baseline;
		gap: 0;
	}

	.admin-path-dim {
		color: var(--color-text-muted);
	}

	.admin-path-sep {
		color: var(--color-text-subtle);
		margin: 0 1px;
	}

	.admin-path-user {
		color: var(--color-text);
		font-weight: 500;
	}

	.admin-tools {
		position: relative;
	}

	.tool-btn {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		padding: var(--space-xs) var(--space-sm);
		background: none;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		cursor: pointer;
	}

	.tool-btn:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.tool-btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 1px;
	}

	.export-menu {
		position: absolute;
		right: 0;
		top: calc(100% + 4px);
		display: flex;
		gap: 2px;
		background: var(--color-surface);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		padding: 2px;
		z-index: 10;
	}

	.export-item {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		padding: var(--space-xs) var(--space-sm);
		background: none;
		border: none;
		border-radius: 2px;
		color: var(--color-text-muted);
		cursor: pointer;
		white-space: nowrap;
	}

	.export-item:hover {
		background: var(--color-bg-alt, rgba(0, 0, 0, 0.05));
		color: var(--color-text);
	}

	.export-item:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -1px;
	}
</style>
