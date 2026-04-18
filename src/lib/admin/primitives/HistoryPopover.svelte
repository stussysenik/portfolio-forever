<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { format_relative_time as formatRelativeTime } from '$lib/clj/portfolio/admin/constants.mjs';

	export let entries: Array<{ oldValue: any; newValue: any; timestamp: number }> = [];
	export let open: boolean = false;
	export let field: string = '';

	const dispatch = createEventDispatcher<{
		close: void;
		restore: { oldValue: any; newValue: any; timestamp: number };
	}>();

	$: visibleEntries = entries.slice(0, 5);

	function handleBackdropClick() {
		dispatch('close');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			dispatch('close');
		}
	}

	function handleRestore(entry: { oldValue: any; newValue: any; timestamp: number }) {
		dispatch('restore', entry);
	}

	function truncate(value: any, maxLen: number = 12): string {
		const str = String(value);
		return str.length > maxLen ? str.slice(0, maxLen) + '\u2026' : str;
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="popover-backdrop" on:click={handleBackdropClick}></div>
	<div class="history-popover" role="dialog" aria-label="{field} change history">
		<div class="popover-header">
			<span class="popover-field">{field}</span>
			<span class="popover-subtitle">last {visibleEntries.length} changes</span>
		</div>
		{#each visibleEntries as entry}
			<div class="popover-row">
				<span class="row-time">{formatRelativeTime(entry.timestamp)}</span>
				<span class="row-change">{truncate(entry.oldValue)} → {truncate(entry.newValue)}</span>
				<button
					class="row-restore"
					on:click={() => handleRestore(entry)}
					aria-label="Restore to {entry.oldValue}"
				>
					restore
				</button>
			</div>
		{/each}
		{#if visibleEntries.length === 0}
			<div class="popover-empty">no changes recorded</div>
		{/if}
	</div>
{/if}

<style>
	.popover-backdrop {
		position: fixed;
		inset: 0;
		z-index: 99;
	}

	.history-popover {
		position: absolute;
		z-index: 100;
		background: var(--color-bg, #1a1a1a);
		border: 1px solid var(--border-color-subtle, #333);
		border-radius: 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		max-width: 280px;
		min-width: 200px;
		overflow: hidden;
	}

	.popover-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 8px 10px;
		border-bottom: 1px solid var(--border-color-subtle, #333);
	}

	.popover-field {
		font-family: var(--font-mono);
		font-size: 8px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted, #737373);
	}

	.popover-subtitle {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-subtle, #444);
	}

	.popover-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 10px;
		border-bottom: 1px solid var(--border-color-subtle, #333);
	}

	.popover-row:last-child {
		border-bottom: none;
	}

	.row-time {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-subtle, #444);
		min-width: 44px;
		flex-shrink: 0;
	}

	.row-change {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-muted, #737373);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	.row-restore {
		display: inline-flex;
		align-items: center;
		min-height: 14px;
		padding: 1px 4px;
		border: 1px dashed var(--border-color-subtle, #333);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-subtle, #444);
		font-family: var(--font-mono);
		font-size: 6px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		cursor: pointer;
		transition: all 120ms ease;
		line-height: 1;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.row-restore:hover {
		color: var(--color-text-muted, #737373);
		border-color: var(--color-text-muted, #737373);
	}

	.popover-empty {
		padding: 10px;
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-subtle, #444);
		text-align: center;
	}
</style>
