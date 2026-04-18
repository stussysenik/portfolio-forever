<script lang="ts">
	import { getContext } from 'svelte';
	import type { AdminStore } from '$lib/admin/stores/adminStore';
	import BentoGrid from '$lib/admin/BentoGrid.svelte';
	import BentoCell from '$lib/admin/BentoCell.svelte';
	import AdminIcon from '$lib/admin/AdminIcon.svelte';
	import { IconLayers, IconFileText, IconSettings, IconActivity, IconRotateCw } from '$lib/admin/admin-icons';	// @ts-ignore
	import { exports as agentInterface } from '$lib/clj/portfolio/admin/agent_interface.mjs';

	const adminStore = getContext<AdminStore>('adminStore');
	const { pages, siteConfig, featureFlags, entriesByTable } = adminStore;

	$: pageCount = ($pages ?? []).length;
	$: blogCount = ($entriesByTable['blogPosts'] ?? []).length;
	$: worksCount = ($entriesByTable['worksEntries'] ?? []).length;
	$: activeFlags = ($featureFlags ?? []).filter(f => f.enabled).length;

	const stats = [
		{ label: 'Pages', value: pageCount, icon: IconLayers, color: 'blue' },
		{ label: 'Blog Posts', value: blogCount, icon: IconFileText, color: 'green' },
		{ label: 'Works', value: worksCount, icon: IconActivity, color: 'purple' },
		{ label: 'Active Flags', value: activeFlags, icon: IconSettings, color: 'orange' },
	];
</script>

<div class="admin-dashboard">
	<header class="dashboard-header">
		<div class="header-main">
			<h1>Portfolio OS Admin</h1>
			<p>System Status: <span class="status-online">Online</span></p>
		</div>
		<button class="sync-btn" on:click={() => agentInterface.syncAllTabs()} title="Sync all tabs">
			<AdminIcon icon={IconRotateCw} size="lg" />
			<span>Sync All Tabs</span>
		</button>
	</header>

	<div class="stats-grid">
		{#each stats as stat}
			<div class="stat-card" class:stat-blue={stat.color === 'blue'} class:stat-green={stat.color === 'green'} class:stat-purple={stat.color === 'purple'} class:stat-orange={stat.color === 'orange'}>
				<div class="stat-icon">
					<AdminIcon icon={stat.icon} size="lg" />
				</div>
				<div class="stat-info">
					<span class="stat-label">{stat.label}</span>
					<span class="stat-value">{stat.value}</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="dashboard-main">
		<BentoGrid columns={2}>
			<BentoCell title="Recent Activity" span={1}>
				<div class="activity-placeholder">
					<p>History logs coming soon...</p>
				</div>
			</BentoCell>
			<BentoCell title="Site Config" span={1}>
				<div class="config-summary">
					<div class="summary-item">
						<span class="item-label">Mode:</span>
						<span class="item-value">{$siteConfig?.mode ?? 'N/A'}</span>
					</div>
					<div class="summary-item">
						<span class="item-label">Visual:</span>
						<span class="item-value">{$siteConfig?.heroVisual ?? 'N/A'}</span>
					</div>
					<div class="summary-item">
						<span class="item-label">Parallax:</span>
						<span class="item-value">{$siteConfig?.parallaxSpeed ?? 0}</span>
					</div>
				</div>
			</BentoCell>
		</BentoGrid>
	</div>
</div>

<style>
	.admin-dashboard {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 24px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.dashboard-header h1 {
		font-family: var(--admin-font-sans);
		font-size: 24px;
		font-weight: 700;
		margin: 0;
		color: var(--admin-text);
	}

	.dashboard-header p {
		font-family: var(--admin-font-mono);
		font-size: 12px;
		color: var(--admin-text-muted);
		margin: 4px 0 0;
	}

	.status-online {
		color: var(--admin-green, #44D62C);
		font-weight: 600;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 20px;
		background: var(--admin-chrome-bg);
		border: 1px solid var(--admin-keyline);
		border-radius: 8px;
		transition: transform 0.2s ease, border-color 0.2s ease;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		border-color: var(--admin-keyline-strong);
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: var(--admin-workspace-bg);
	}

	.stat-blue .stat-icon { color: #3B82F6; }
	.stat-green .stat-icon { color: #10B981; }
	.stat-purple .stat-icon { color: #8B5CF6; }
	.stat-orange .stat-icon { color: #F59E0B; }

	.stat-info {
		display: flex;
		flex-direction: column;
	}

	.stat-label {
		font-family: var(--admin-font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--admin-text-muted);
	}

	.stat-value {
		font-family: var(--admin-font-sans);
		font-size: 24px;
		font-weight: 700;
		color: var(--admin-text);
	}

	.config-summary {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		font-family: var(--admin-font-mono);
		font-size: 12px;
	}

	.item-label {
		color: var(--admin-text-muted);
	}

	.item-value {
		color: var(--admin-text);
		font-weight: 600;
	}

	.activity-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 120px;
		font-family: var(--admin-font-mono);
		font-size: 12px;
		color: var(--admin-text-muted);
	}

	.item-value {
		color: var(--admin-text);
		font-weight: 600;
	}

	.activity-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 120px;
		font-family: var(--admin-font-mono);
		font-size: 12px;
		color: var(--admin-text-muted);
	}
</style>
