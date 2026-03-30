<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let userName: string = '';
	export let userImage: string = '';

	const dispatch = createEventDispatcher<{
		exportPDF: void;
		exportJSON: void;
	}>();
</script>

<header class="admin-header">
	<div class="admin-header-left">
		<h1>Portfolio Admin</h1>
		{#if userName}
			<span class="admin-user">
				{#if userImage}<img src={userImage} alt="" class="admin-avatar" />{/if}
				{userName}
			</span>
		{/if}
	</div>
	<div class="admin-actions">
		<button class="btn btn-accent" on:click={() => dispatch('exportPDF')}>Export PDF</button>
		<button class="btn" on:click={() => dispatch('exportJSON')}>Export JSON</button>
		<a href="/cv" class="btn" target="_blank">CV →</a>
		<a href="/works" class="btn" target="_blank">Works →</a>
		<a href="/academia" class="btn" target="_blank">Academia →</a>
		<a href="/talks" class="btn" target="_blank">Talks →</a>
		<a href="/likes" class="btn" target="_blank">Likes →</a>
		<a href="/gifts" class="btn" target="_blank">Gifts →</a>
	</div>
</header>

<style>
	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-xl);
		padding-bottom: var(--space-md);
		border-bottom: 2px solid var(--border-color);
	}

	.admin-header h1 {
		font-size: var(--font-size-xl);
		font-weight: 600;
	}

	.admin-header-left {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.admin-user {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.admin-avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
	}

	.admin-actions {
		display: flex;
		gap: var(--space-sm);
	}

	.btn {
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		font-weight: 500;
		border: 1px solid var(--border-color);
		background: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.btn:hover {
		border-color: var(--color-text-muted);
	}

	.btn-accent {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	@media (max-width: 767px) {
		.admin-header {
			flex-direction: column;
			gap: var(--space-sm);
			align-items: flex-start;
		}
	}
</style>
