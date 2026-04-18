<script lang="ts">
	import { getContext } from 'svelte';
	import type { AdminStore } from '../stores/adminStore';
	import AdminIcon from '../AdminIcon.svelte';
	import { IconFileText, IconPlus, IconEye, IconEyeOff, IconTrash } from '../admin-icons';
	import { toast } from '$lib/stores/toast';
	import { stripConvexMeta } from '../constants';

	const { client, api } = getContext<any>('admin');
	const adminStore = getContext<AdminStore>('adminStore');
	const { pages } = adminStore;

	async function handleToggleVisibility(page: any) {
		try {
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				visible: !page.visible
			});
			toast.success(`${page.label} visibility updated`);
		} catch (err: any) {
			toast.error(err.message || 'Failed to update visibility');
		}
	}

	async function handleDelete(pageId: string) {
		if (!confirm('Are you sure you want to delete this page?')) return;
		try {
			await client.mutation(api.pages.remove, { pageId });
			toast.success('Page deleted');
		} catch (err: any) {
			toast.error(err.message || 'Failed to delete page');
		}
	}
</script>

<div class="pages-view">
	<header class="view-header">
		<div class="header-left">
			<AdminIcon icon={IconFileText} size="lg" />
			<h1>Pages</h1>
		</div>
		<button class="primary-btn">
			<AdminIcon icon={IconPlus} size="sm" />
			New Page
		</button>
	</header>

	<div class="pages-list">
		{#if $pages === undefined}
			<div class="loading">Loading pages...</div>
		{:else if $pages.length === 0}
			<div class="empty">No pages found.</div>
		{:else}
			{#each $pages as page}
				<div class="page-item" class:hidden={!page.visible}>
					<div class="page-info">
						<AdminIcon icon={IconFileText} size="sm" />
						<div class="page-details">
							<span class="page-label">{page.label}</span>
							<span class="page-route">{page.route}</span>
						</div>
					</div>
					<div class="page-actions">
						<button class="icon-btn" on:click={() => handleToggleVisibility(page)} title="Toggle Visibility">
							<AdminIcon icon={page.visible ? IconEye : IconEyeOff} size="sm" />
						</button>
						<button class="icon-btn delete" on:click={() => handleDelete(page.pageId)} title="Delete Page">
							<AdminIcon icon={IconTrash} size="sm" />
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.pages-view {
		padding: var(--admin-space-6, 24px);
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-6, 24px);
	}

	.view-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.header-left {
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

	.primary-btn {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		padding: var(--admin-space-2, 8px) var(--admin-space-4, 16px);
		background: var(--admin-active-bg, #2563eb);
		color: white;
		border: none;
		border-radius: var(--admin-radius-md, 6px);
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-sm, 13px);
		cursor: pointer;
	}

	.pages-list {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-2, 8px);
	}

	.page-item {
		background: var(--admin-chrome-bg-darker, #111);
		border: 1px solid var(--admin-keyline);
		border-radius: var(--admin-radius-md, 6px);
		padding: var(--admin-space-3, 12px) var(--admin-space-4, 16px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		transition: all 120ms ease;
	}

	.page-item.hidden {
		opacity: 0.6;
	}

	.page-item:hover {
		border-color: var(--admin-keyline-strong);
	}

	.page-info {
		display: flex;
		align-items: center;
		gap: var(--admin-space-4, 16px);
	}

	.page-details {
		display: flex;
		flex-direction: column;
	}

	.page-label {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-md, 14px);
		font-weight: 600;
	}

	.page-route {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-xs, 11px);
		color: var(--admin-text-muted);
	}

	.page-actions {
		display: flex;
		gap: var(--admin-space-2, 8px);
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
		color: var(--admin-text);
	}

	.icon-btn.delete:hover {
		color: var(--admin-text-error, #ff4444);
	}

	.loading, .empty {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-sm, 13px);
		color: var(--admin-text-muted);
		text-align: center;
		padding: var(--admin-space-10, 40px);
	}
</style>
