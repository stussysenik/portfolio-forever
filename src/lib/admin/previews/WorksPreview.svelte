<script lang="ts">
	export let entries: any[] = [];

	const fallbackColors = ['var(--bento-blue, #2563EB)', 'var(--bento-green, #44D62C)'];

	function getSwatchColor(entry: any, i: number): string {
		return entry.styleOverrides?.accentColor || fallbackColors[i % 2];
	}

	function formatUrl(url: string): string {
		try {
			return new URL(url).hostname.replace('www.', '');
		} catch {
			return url;
		}
	}
</script>

<div class="works-preview">
	{#each entries.slice(0, 8) as entry, i}
		<div
			class="works-row"
			class:works-row--hidden={!entry.visible}
		>
			<span
				class="works-swatch"
				style="background: {getSwatchColor(entry, i)}"
			></span>
			<span class="works-title">{entry.title}</span>
			{#if entry.url}
				<span class="works-url">{formatUrl(entry.url)}</span>
			{/if}
			{#if entry.category}
				<span class="works-tag">{entry.category}</span>
			{/if}
			<span
				class="works-dot"
				class:works-dot--on={entry.visible !== false}
			></span>
		</div>
	{/each}
	{#if entries.length === 0}
		<div class="works-empty">No entries</div>
	{/if}
</div>

<style>
	.works-preview {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.works-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 3px 0;
		transition: background 160ms ease;
		border-radius: 2px;
	}

	.works-row:hover {
		background: var(--color-bg-alt);
	}

	.works-row--hidden {
		opacity: 0.3;
	}

	.works-swatch {
		width: 10px;
		height: 10px;
		border-radius: 2px;
		flex-shrink: 0;
		transition: transform 160ms ease, border-radius 160ms ease;
	}

	.works-row:hover .works-swatch {
		transform: scale(1.7);
		border-radius: 50%;
	}

	.works-title {
		font-size: 10px;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	.works-url {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.works-tag {
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

	.works-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #737373;
		flex-shrink: 0;
	}

	.works-dot--on {
		background: var(--bento-green, #44D62C);
	}

	.works-empty {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		text-align: center;
		padding: 12px 0;
	}
</style>
