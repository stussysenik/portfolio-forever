<script lang="ts">
	import { stagedCount, stagedLabels, stagedFlags } from '$lib/stores/stagedFlags';
	import { stagedChanges, stagedChangesCount, stagedChangesLabels } from '$lib/stores/stagedChanges';
	import { toast } from '$lib/stores/toast';

	export let client: any;
	export let api: any;
	export let currentFlags: Array<{ key: string; enabled: boolean; category: string }> = [];

	let saving = false;

	$: totalStagedCount = $stagedCount + $stagedChangesCount;
	$: combinedLabels = [...$stagedLabels, ...$stagedChangesLabels];

	async function handleSave() {
		if (saving) return;
		saving = true;
		try {
			const flagsCount = await stagedFlags.commit(client, api, currentFlags);
			const changesCount = await stagedChanges.commit(client, api);
			const total = flagsCount + changesCount;
			if (total > 0) {
				toast.success(`${total} change${total !== 1 ? 's' : ''} saved`);
			}
		} catch (err: any) {
			toast.error(err.message || 'Failed to save changes');
		} finally {
			saving = false;
		}
	}

	function handleDiscard() {
		stagedFlags.clear();
		stagedChanges.clear();
		if (typeof window !== 'undefined') {
			const iframes = document.querySelectorAll<HTMLIFrameElement>(
				'iframe[src*="preview=true"]'
			);
			iframes.forEach((iframe) => {
				iframe.contentWindow?.postMessage(
					{ type: 'admin:flagOverrides', overrides: {} },
					'*'
				);
				iframe.contentWindow?.postMessage(
					{ type: 'admin:stagedChanges', changes: {} },
					'*'
				);
			});
		}
		toast.success('Changes discarded');
	}
</script>

{#if totalStagedCount > 0}
	<div class="save-bar" role="status" aria-live="polite">
		<div class="save-bar-info">
			<span class="save-bar-count">{totalStagedCount} unsaved</span>
			<ul class="save-bar-labels">
				{#each combinedLabels as label}
					<li class="save-bar-label">{label}</li>
				{/each}
			</ul>
		</div>
		<div class="save-bar-actions">
			<button
				class="save-btn save-btn--discard"
				on:click={handleDiscard}
				disabled={saving}
			>
				discard
			</button>
			<button
				class="save-btn save-btn--commit"
				on:click={handleSave}
				disabled={saving}
			>
				{saving ? 'saving...' : 'save'}
			</button>
		</div>
	</div>
{/if}

<style>
	.save-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--admin-space-2, 8px);
		padding: var(--admin-space-2, 8px) var(--admin-space-3, 12px);
		border-top: 1px solid var(--border-color-subtle, #1a1a1a);
		background: color-mix(in oklch, var(--admin-green, #44D62C) 6%, var(--admin-chrome-bg, #111));
		flex-shrink: 0;
	}

	.save-bar-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}

	.save-bar-count {
		font-family: var(--admin-font-mono, monospace);
		font-size: var(--admin-text-xs, 9px);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--admin-green, #44D62C);
	}

	.save-bar-labels {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}

	.save-bar-label {
		font-family: var(--admin-font-mono, monospace);
		font-size: var(--admin-text-2xs, 7px);
		color: var(--color-text-muted, #666);
		letter-spacing: 0.04em;
	}

	.save-bar-actions {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.save-btn {
		font-family: var(--admin-font-mono, monospace);
		font-size: var(--admin-text-2xs, 7px);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 4px 10px;
		border-radius: 2px;
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
		min-height: 28px;
		border: 1px solid var(--border-color-subtle, #1a1a1a);
	}

	.save-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.save-btn--discard {
		background: transparent;
		color: var(--color-text-subtle, #444);
	}

	.save-btn--discard:hover:not(:disabled) {
		color: var(--color-text, #e5e5e5);
		border-color: var(--color-text-subtle, #444);
	}

	.save-btn--commit {
		background: var(--admin-green, #44D62C);
		color: #000;
		border-color: var(--admin-green, #44D62C);
	}

	.save-btn--commit:hover:not(:disabled) {
		opacity: 0.9;
	}
</style>
