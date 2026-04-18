<script lang="ts">
	import { getContext } from 'svelte';
	import type { AdminStore } from '../stores/adminStore';
	import AdminIcon from '../AdminIcon.svelte';
	import { IconDownload, IconFileText, IconDatabase } from '../admin-icons';
	import { toast } from '$lib/stores/toast';

	import { takeout_all_BANG_, takeout_table_BANG_ } from '../../clj/portfolio/admin/takeouts.mjs';

	const { client, api } = getContext<any>('admin');
	const adminStore = getContext<AdminStore>('adminStore');
	const { entriesByTable, siteConfig, pages } = adminStore;

	function handleExportAll() {
		takeout_all_BANG_($siteConfig, $pages, $entriesByTable);
		toast.success('Takeout generated');
	}

	function handleExportTable(tableName: string) {
		takeout_table_BANG_(tableName, $entriesByTable[tableName]);
		toast.success(`${tableName} exported`);
	}
</script>

<div class="takeouts-view">
	<header class="view-header">
		<AdminIcon icon={IconDownload} size="lg" />
		<h1>Takeouts</h1>
	</header>

	<div class="takeout-actions">
		<section class="takeout-section">
			<h2>Full Snapshot</h2>
			<p>Export all site configuration, pages, and content in a single JSON file.</p>
			<button class="primary-btn" on:click={handleExportAll}>
				<AdminIcon icon={IconDownload} size="sm" />
				Export Everything
			</button>
		</section>

		<section class="takeout-section">
			<h2>Granular Exports</h2>
			<p>Export specific tables as individual JSON files.</p>
			<div class="table-grid">
				{#each Object.keys($entriesByTable) as tableName}
					<div class="table-card">
						<div class="table-info">
							<AdminIcon icon={IconDatabase} size="sm" />
							<span class="table-name">{tableName}</span>
							<span class="count">({$entriesByTable[tableName]?.length ?? 0} items)</span>
						</div>
						<button class="icon-btn" on:click={() => handleExportTable(tableName)} title="Export {tableName}">
							<AdminIcon icon={IconDownload} size="sm" />
						</button>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	.takeouts-view {
		padding: var(--admin-space-6, 24px);
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-8, 32px);
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

	.takeout-actions {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-8, 32px);
	}

	.takeout-section {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-3, 12px);
	}

	.takeout-section h2 {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-md, 14px);
		color: var(--admin-text-muted);
		text-transform: uppercase;
		margin: 0;
	}

	.takeout-section p {
		font-size: var(--admin-text-sm, 13px);
		color: var(--admin-text-subtle);
		margin: 0;
	}

	.primary-btn {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		padding: var(--admin-space-3, 12px) var(--admin-space-6, 24px);
		background: var(--admin-active-bg, #2563eb);
		color: white;
		border: none;
		border-radius: var(--admin-radius-md, 6px);
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-sm, 13px);
		cursor: pointer;
		width: fit-content;
		transition: opacity 120ms ease;
	}

	.primary-btn:hover {
		opacity: 0.9;
	}

	.table-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: var(--admin-space-3, 12px);
	}

	.table-card {
		background: var(--admin-chrome-bg-darker, #111);
		border: 1px solid var(--admin-keyline);
		border-radius: var(--admin-radius-md, 6px);
		padding: var(--admin-space-3, 12px);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.table-info {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-sm, 12px);
	}

	.table-name {
		color: var(--admin-text);
	}

	.count {
		color: var(--admin-text-muted);
		font-size: var(--admin-text-xs, 10px);
	}

	.icon-btn {
		background: transparent;
		border: none;
		color: var(--admin-text-muted);
		cursor: pointer;
		padding: var(--admin-space-2, 8px);
		border-radius: 4px;
		transition: all 120ms ease;
	}

	.icon-btn:hover {
		background: var(--admin-frame-bg-hover, #2a2a2a);
		color: var(--admin-active-outline, #00ff00);
	}
</style>
