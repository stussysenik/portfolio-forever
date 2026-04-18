<script lang="ts">
	import AdminIcon from './AdminIcon.svelte';
	import { IconExternalLink, IconRotateCw } from './admin-icons';

	export let url: string = '';
	export let route: string = '/';
	export let refreshKey: number = 0;

	function handleRefresh() {
		refreshKey++;
	}

	function handleOpenNew() {
		window.open(url, '_blank');
	}
</script>

<div class="preview-frame">
	<header class="frame-header">
		<div class="address-bar">
			<span class="url-text">{route}</span>
		</div>
		<div class="frame-actions">
			<button class="icon-btn" on:click={handleRefresh} title="Refresh preview">
				<AdminIcon icon={IconRotateCw} size="xs" />
			</button>
			<button class="icon-btn" on:click={handleOpenNew} title="Open in new tab">
				<AdminIcon icon={IconExternalLink} size="xs" />
			</button>
		</div>
	</header>
	<div class="frame-body">
		<slot {refreshKey} />
	</div>
</div>

<style>
	.preview-frame {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		border: 1px solid var(--admin-keyline);
	}

	.frame-header {
		height: 32px;
		background: var(--admin-chrome-bg, #f8f8f6);
		border-bottom: 1px solid var(--admin-keyline);
		display: flex;
		align-items: center;
		padding: 0 8px;
		gap: 8px;
		flex-shrink: 0;
	}

	.address-bar {
		flex: 1;
		height: 20px;
		background: var(--admin-workspace-bg, #fff);
		border: 1px solid var(--admin-keyline);
		border-radius: 4px;
		display: flex;
		align-items: center;
		padding: 0 8px;
		min-width: 0;
	}

	.url-text {
		font-family: var(--admin-font-mono);
		font-size: 10px;
		color: var(--admin-text-subtle);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.frame-actions {
		display: flex;
		gap: 2px;
	}

	.icon-btn {
		background: transparent;
		border: none;
		color: var(--admin-text-muted);
		cursor: pointer;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 120ms ease;
	}

	.icon-btn:hover {
		background: var(--admin-keyline);
		color: var(--admin-text);
	}

	.frame-body {
		flex: 1;
		min-height: 0;
		position: relative;
	}
</style>
