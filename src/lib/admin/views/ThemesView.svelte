<script lang="ts">
	import { getContext } from 'svelte';
	import type { AdminStore } from '../stores/adminStore';
	import AdminIcon from '../AdminIcon.svelte';
	import { IconSparkles, IconPlus, IconTrash, IconCheck } from '../admin-icons';
	import { toast } from '$lib/stores/toast';

	const { client, api } = getContext<any>('admin');
	const adminStore = getContext<AdminStore>('adminStore');
	const { themes } = adminStore;

	async function handleSetDefault(themeId: string) {
		try {
			await client.mutation(api.themes.setDefault, { themeId });
			toast.success('Default theme updated');
		} catch (err: any) {
			toast.error(err.message || 'Failed to update default theme');
		}
	}

	async function handleDelete(themeId: string) {
		if (!confirm('Are you sure you want to delete this theme?')) return;
		try {
			await client.mutation(api.themes.remove, { themeId });
			toast.success('Theme deleted');
		} catch (err: any) {
			toast.error(err.message || 'Failed to delete theme');
		}
	}
</script>

<div class="themes-view">
	<header class="view-header">
		<div class="header-left">
			<AdminIcon icon={IconSparkles} size="lg" />
			<h1>Themes</h1>
		</div>
		<button class="primary-btn">
			<AdminIcon icon={IconPlus} size="sm" />
			Create Theme
		</button>
	</header>

	<div class="themes-grid">
		{#if $themes === undefined}
			<div class="loading">Loading themes...</div>
		{:else if $themes.length === 0}
			<div class="empty">No themes found.</div>
		{:else}
			{#each $themes as theme}
				<div class="theme-card" class:is-default={theme.isDefault}>
					<div class="theme-preview" style="--theme-bg: {theme.colors?.bg || '#000'}; --theme-accent: {theme.colors?.accent || '#00ff00'};">
						<div class="preview-dot"></div>
					</div>
					<div class="theme-info">
						<div class="theme-name">
							{theme.label}
							{#if theme.isBuiltIn}
								<span class="badge">Built-in</span>
							{/if}
						</div>
						<div class="theme-type">{theme.type}</div>
					</div>
					<div class="theme-actions">
						{#if theme.isDefault}
							<div class="active-badge">
								<AdminIcon icon={IconCheck} size="xs" />
								Default
							</div>
						{:else}
							<button class="action-btn" on:click={() => handleSetDefault(theme.themeId)}>Set Default</button>
						{/if}
						{#if !theme.isBuiltIn}
							<button class="icon-btn delete" on:click={() => handleDelete(theme.themeId)}>
								<AdminIcon icon={IconTrash} size="sm" />
							</button>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.themes-view {
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

	.themes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--admin-space-4, 16px);
	}

	.theme-card {
		background: var(--admin-chrome-bg-darker, #111);
		border: 1px solid var(--admin-keyline);
		border-radius: var(--admin-radius-md, 6px);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: border-color 120ms ease;
	}

	.theme-card:hover {
		border-color: var(--admin-keyline-strong);
	}

	.theme-card.is-default {
		border-color: var(--admin-active-outline, #00ff00);
		box-shadow: 0 0 10px rgba(0, 255, 0, 0.1);
	}

	.theme-preview {
		height: 80px;
		background: var(--theme-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid var(--admin-keyline);
	}

	.preview-dot {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--theme-accent);
		box-shadow: 0 0 15px var(--theme-accent);
	}

	.theme-info {
		padding: var(--admin-space-3, 12px);
		flex: 1;
	}

	.theme-name {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-md, 14px);
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
	}

	.badge {
		font-size: 10px;
		background: var(--admin-frame-bg, #222);
		color: var(--admin-text-muted);
		padding: 2px 6px;
		border-radius: 4px;
		text-transform: uppercase;
	}

	.theme-type {
		font-size: var(--admin-text-xs, 11px);
		color: var(--admin-text-muted);
		text-transform: capitalize;
	}

	.theme-actions {
		padding: var(--admin-space-3, 12px);
		border-top: 1px solid var(--admin-keyline);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.active-badge {
		display: flex;
		align-items: center;
		gap: 4px;
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-xs, 11px);
		color: var(--admin-active-outline, #00ff00);
	}

	.action-btn {
		background: transparent;
		border: 1px solid var(--admin-keyline);
		color: var(--admin-text-subtle);
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-xs, 11px);
		padding: 4px 8px;
		border-radius: 4px;
		cursor: pointer;
	}

	.action-btn:hover {
		border-color: var(--admin-text-subtle);
		color: var(--admin-text);
	}

	.icon-btn {
		background: transparent;
		border: none;
		color: var(--admin-text-muted);
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
	}

	.icon-btn:hover {
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
		grid-column: 1 / -1;
	}
</style>
