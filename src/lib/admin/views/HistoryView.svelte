<script lang="ts">
	import { getContext } from 'svelte';
	import type { AdminStore } from '../stores/adminStore';
	import AdminIcon from '../AdminIcon.svelte';
	import { IconHistory, IconClock, IconUser, IconDatabase } from '../admin-icons';

	const { client, api } = getContext<any>('admin');
	const adminStore = getContext<AdminStore>('adminStore');

	const history = client.query(api.adminHistory.listRecent, { limit: 50 });

	function formatDate(timestamp: number) {
		return new Date(timestamp).toLocaleString();
	}

	function formatValue(val: any) {
		if (typeof val === 'object') return JSON.stringify(val);
		return String(val);
	}
</script>

<div class="history-view">
	<header class="view-header">
		<AdminIcon icon={IconHistory} size="lg" />
		<h1>Admin History</h1>
	</header>

	<div class="history-list">
		{#if $history === undefined}
			<div class="loading">Loading history...</div>
		{:else if $history.length === 0}
			<div class="empty">No history recorded yet.</div>
		{:else}
			{#each $history as entry}
				<div class="history-item">
					<div class="item-meta">
						<span class="timestamp">
							<AdminIcon icon={IconClock} size="xs" />
							{formatDate(entry.timestamp)}
						</span>
						<span class="user">
							<AdminIcon icon={IconUser} size="xs" />
							{entry.user}
						</span>
						<span class="table">
							<AdminIcon icon={IconDatabase} size="xs" />
							{entry.table}.{entry.field}
						</span>
					</div>
					<div class="item-diff">
						<div class="old-value">{formatValue(entry.oldValue)}</div>
						<div class="arrow">→</div>
						<div class="new-value">{formatValue(entry.newValue)}</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.history-view {
		padding: var(--admin-space-6, 24px);
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-6, 24px);
	}

	.view-header {
		display: flex;
		align-items: center;
		gap: var(--admin-space-3, 12px);
	}

	.view-header h1 {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-xl, 20px);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-3, 12px);
	}

	.history-item {
		background: var(--admin-chrome-bg-darker, #111);
		border: 1px solid var(--admin-keyline);
		border-radius: var(--admin-radius-md, 6px);
		padding: var(--admin-space-4, 16px);
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-3, 12px);
	}

	.item-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--admin-space-4, 16px);
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-xs, 11px);
		color: var(--admin-text-muted);
	}

	.item-meta span {
		display: flex;
		align-items: center;
		gap: var(--admin-space-1, 4px);
	}

	.item-diff {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: var(--admin-space-4, 16px);
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-sm, 12px);
	}

	.old-value {
		color: var(--admin-text-error, #ff4444);
		background: rgba(255, 68, 68, 0.1);
		padding: var(--admin-space-2, 8px);
		border-radius: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.new-value {
		color: var(--admin-active-outline, #00ff00);
		background: rgba(0, 255, 0, 0.1);
		padding: var(--admin-space-2, 8px);
		border-radius: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.arrow {
		color: var(--admin-text-muted);
	}

	.loading, .empty {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-sm, 13px);
		color: var(--admin-text-muted);
		text-align: center;
		padding: var(--admin-space-10, 40px);
	}
</style>
