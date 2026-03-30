<script lang="ts">
	export let visible: boolean = true;
	export let compact: boolean = false;
</script>

<div class="card" class:hidden-entry={!visible} class:card-compact={compact}>
	{#if !compact}
		<div class="card-header">
			<div class="card-title-row">
				<slot name="reorder" />
				<slot name="title" />
				<slot name="actions" />
			</div>
			<div class="card-meta">
				<slot name="meta" />
			</div>
		</div>
		<div class="card-body">
			<slot name="body" />
		</div>
	{:else}
		<slot />
	{/if}
</div>

<style>
	.card {
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		margin-bottom: var(--space-sm);
		transition: border-color var(--duration-fast) var(--easing);
	}

	.card:hover {
		border-color: var(--border-color);
	}

	.card.hidden-entry {
		opacity: 0.5;
		border-style: dashed;
	}

	.card-compact {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
	}

	.card-header {
		margin-bottom: var(--space-sm);
	}

	.card-title-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		margin-top: var(--space-xs);
		padding-left: 52px;
	}

	.card-body {
		padding-left: 52px;
	}

	@media (max-width: 767px) {
		.card-meta {
			padding-left: 0;
			flex-wrap: wrap;
		}

		.card-body {
			padding-left: 0;
		}
	}
</style>
