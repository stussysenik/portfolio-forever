<script lang="ts">
	export let entries: any[] = [];
	export let fields: string[] = [];

	/**
	 * Auto-detect the section type from the shape of the data/fields.
	 * Returns: 'likes' | 'labs' | 'minor' | 'gifts' | 'generic'
	 */
	function detectType(): string {
		if (fields.includes('items') || entries[0]?.items) return 'likes';
		if (fields.includes('status') || entries[0]?.status) return 'labs';
		if (fields.includes('category') && fields.includes('text')) return 'minor';
		if (fields.includes('manifesto') || entries[0]?.manifesto) return 'gifts';
		return 'generic';
	}

	$: sectionType = detectType();

	const statusColors: Record<string, string> = {
		stable: 'var(--bento-green, #44D62C)',
		beta: 'var(--bento-blue, #2563EB)',
		experimental: '#737373',
		archived: '#525252',
	};
</script>

<div class="generic-preview">
	{#if sectionType === 'likes'}
		<!-- 2-col grid of category cards -->
		<div class="likes-grid">
			{#each entries.slice(0, 6) as entry}
				<div class="likes-card">
					<span class="likes-title">{entry.title}</span>
					<span class="likes-count">{entry.items?.length || 0} items</span>
				</div>
			{/each}
		</div>

	{:else if sectionType === 'labs'}
		<!-- Rows with title + status badge -->
		{#each entries.slice(0, 5) as entry}
			<div class="labs-row">
				<span class="labs-title">{entry.title}</span>
				<span
					class="labs-status"
					style="color: {statusColors[entry.status] || '#737373'}"
				>{entry.status}</span>
			</div>
		{/each}

	{:else if sectionType === 'minor'}
		<!-- Simple text rows with year -->
		{#each entries.slice(0, 6) as entry}
			<div class="minor-row">
				{#if entry.year}
					<span class="minor-year">{entry.year}</span>
				{/if}
				<span class="minor-text">{entry.text}</span>
			</div>
		{/each}

	{:else if sectionType === 'gifts'}
		<!-- Field label + value rows -->
		{#each entries.slice(0, 1) as entry}
			{#each fields as field}
				{#if entry[field] !== undefined}
					<div class="gifts-row">
						<span class="gifts-label">{field}</span>
						<span class="gifts-value">
							{typeof entry[field] === 'string'
								? entry[field].length > 40
									? entry[field].slice(0, 40) + '\u2026'
									: entry[field]
								: String(entry[field])}
						</span>
					</div>
				{/if}
			{/each}
		{/each}

	{:else}
		<!-- Generic fallback: show fields as rows -->
		{#each entries.slice(0, 5) as entry}
			<div class="generic-row">
				{#each fields as field}
					{#if entry[field] !== undefined}
						<span class="generic-field">{entry[field]}</span>
					{/if}
				{/each}
			</div>
		{/each}
	{/if}

	{#if entries.length === 0}
		<div class="generic-empty">No entries</div>
	{/if}
</div>

<style>
	.generic-preview {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	/* ── Likes: 2-col category cards ── */
	.likes-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
	}

	.likes-card {
		background: var(--color-bg-alt);
		border-radius: 3px;
		padding: 5px 6px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		transition: background 160ms ease;
	}

	.likes-card:hover {
		background: var(--border-color-subtle);
	}

	.likes-title {
		font-size: 9px;
		color: var(--color-text);
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.likes-count {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-subtle);
	}

	/* ── Labs: rows with status badge ── */
	.labs-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 3px 0;
		transition: background 160ms ease;
		border-radius: 2px;
	}

	.labs-row:hover {
		background: var(--color-bg-alt);
	}

	.labs-title {
		font-size: 10px;
		color: var(--color-text);
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.labs-status {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		flex-shrink: 0;
		font-weight: 500;
	}

	/* ── Minor: text rows with year ── */
	.minor-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 3px 0;
		transition: background 160ms ease;
		border-radius: 2px;
	}

	.minor-row:hover {
		background: var(--color-bg-alt);
	}

	.minor-year {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
		width: 28px;
	}

	.minor-text {
		font-size: 10px;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	/* ── Gifts: label + value ── */
	.gifts-row {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 3px 0;
		transition: background 160ms ease;
		border-radius: 2px;
	}

	.gifts-row:hover {
		background: var(--color-bg-alt);
	}

	.gifts-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		flex-shrink: 0;
		width: 56px;
		padding-top: 1px;
	}

	.gifts-value {
		font-size: 9px;
		color: var(--color-text);
		flex: 1;
		min-width: 0;
		line-height: 1.4;
	}

	/* ── Generic fallback ── */
	.generic-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 3px 0;
		transition: background 160ms ease;
		border-radius: 2px;
	}

	.generic-row:hover {
		background: var(--color-bg-alt);
	}

	.generic-field {
		font-size: 9px;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.generic-field:first-child {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.generic-empty {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		text-align: center;
		padding: 12px 0;
	}
</style>
