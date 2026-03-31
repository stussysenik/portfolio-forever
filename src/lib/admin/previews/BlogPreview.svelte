<script lang="ts">
	export let entries: any[] = [];

	function formatDate(dateStr: string | undefined): string {
		if (!dateStr) return '--/--';
		try {
			const d = new Date(dateStr);
			const mm = String(d.getMonth() + 1).padStart(2, '0');
			const yy = String(d.getFullYear()).slice(-2);
			return `${mm}-${yy}`;
		} catch {
			return '--/--';
		}
	}
</script>

<div class="blog-preview">
	{#each entries.slice(0, 6) as entry}
		<div class="blog-row">
			<span class="blog-date">{formatDate(entry.publishedAt)}</span>
			<span class="blog-title">{entry.title}</span>
			{#if entry.tags?.length}
				<span class="blog-tag">{entry.tags[0]}</span>
			{/if}
		</div>
	{/each}
	{#if entries.length === 0}
		<div class="blog-empty">No posts</div>
	{/if}
</div>

<style>
	.blog-preview {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.blog-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 3px 0;
		transition: background 160ms ease;
		border-radius: 2px;
	}

	.blog-row:hover {
		background: var(--color-bg-alt);
	}

	.blog-date {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
		width: 32px;
	}

	.blog-title {
		font-size: 10px;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	.blog-tag {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		background: var(--color-bg-alt);
		color: var(--color-text-muted);
		padding: 1px 4px;
		border-radius: 2px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.blog-empty {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		text-align: center;
		padding: 12px 0;
	}
</style>
