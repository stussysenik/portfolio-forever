<script lang="ts">
	export let entries: any[] = [];
	export let type: string = 'cv';

	function getYear(entry: any): string {
		if (entry.startDate) return entry.startDate.slice(0, 4);
		if (entry.year) return String(entry.year);
		return '----';
	}
</script>

<div class="timeline-preview">
	{#if type === 'talks'}
		<div class="talks-grid">
			{#each entries.slice(0, 4) as entry}
				<div class="talks-card">
					<span class="talks-title">{entry.title}</span>
					<span class="talks-meta">{entry.year || '----'} &middot; {entry.entryType || 'talk'}</span>
				</div>
			{/each}
		</div>
	{:else}
		{#each entries.slice(0, 5) as entry}
			<div class="cv-row">
				<span class="cv-year">{getYear(entry)}</span>
				<span class="cv-title">{entry.title}</span>
				{#if entry.organization}
					<span class="cv-org">{entry.organization}</span>
				{/if}
			</div>
		{/each}
	{/if}
	{#if entries.length === 0}
		<div class="timeline-empty">No entries</div>
	{/if}
</div>

<style>
	.timeline-preview {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	/* CV rows */
	.cv-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 3px 0;
		transition: background 160ms ease;
		border-radius: 2px;
	}

	.cv-row:hover {
		background: var(--color-bg-alt);
	}

	.cv-year {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
		width: 28px;
	}

	.cv-title {
		font-size: 10px;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	.cv-org {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-muted);
		white-space: nowrap;
		flex-shrink: 0;
	}

	/* Talks 2-col grid */
	.talks-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
	}

	.talks-card {
		background: var(--color-bg-alt);
		border-radius: 3px;
		padding: 5px 6px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		transition: background 160ms ease;
	}

	.talks-card:hover {
		background: var(--border-color-subtle);
	}

	.talks-title {
		font-size: 9px;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.talks-meta {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-subtle);
	}

	.timeline-empty {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		text-align: center;
		padding: 12px 0;
	}
</style>
