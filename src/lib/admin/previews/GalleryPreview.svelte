<script lang="ts">
	export let entries: any[] = [];

	const tileColors = [
		'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
		'linear-gradient(135deg, #44D62C 0%, #36b824 100%)',
		'linear-gradient(135deg, #737373 0%, #525252 100%)',
		'linear-gradient(135deg, #2563EB 0%, #44D62C 100%)',
		'linear-gradient(135deg, #525252 0%, #2563EB 100%)',
		'linear-gradient(135deg, #44D62C 0%, #737373 100%)',
	];

	function getTileGradient(i: number): string {
		return tileColors[i % tileColors.length];
	}

	$: showAdd = entries.length < 9;
	$: visibleEntries = entries.slice(0, showAdd ? 8 : 9);
</script>

<div class="gallery-preview">
	{#each visibleEntries as entry, i}
		<div
			class="gallery-tile"
			style="background: {getTileGradient(i)}"
		>
			{#if entry.category?.length}
				<span class="gallery-label">{entry.category[0]}</span>
			{/if}
		</div>
	{/each}
	{#if showAdd}
		<div class="gallery-tile gallery-tile--add">
			<span class="gallery-add-icon">+</span>
		</div>
	{/if}
	{#if entries.length === 0}
		<div class="gallery-tile gallery-tile--add">
			<span class="gallery-add-icon">+</span>
		</div>
	{/if}
</div>

<style>
	.gallery-preview {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3px;
	}

	.gallery-tile {
		aspect-ratio: 1;
		border-radius: 3px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 3px;
		position: relative;
		overflow: hidden;
		transition: transform 160ms ease;
		cursor: default;
	}

	.gallery-tile:hover {
		transform: scale(1.04);
	}

	.gallery-label {
		font-family: var(--font-mono);
		font-size: 6px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.85);
		background: rgba(0, 0, 0, 0.3);
		padding: 1px 4px;
		border-radius: 2px;
		white-space: nowrap;
	}

	.gallery-tile--add {
		background: var(--color-bg-alt) !important;
		border: 1px dashed var(--border-color);
		align-items: center;
	}

	.gallery-add-icon {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--color-text-subtle);
		line-height: 1;
	}
</style>
