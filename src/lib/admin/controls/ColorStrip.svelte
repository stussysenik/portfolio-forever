<script lang="ts">
	import { NAMED_COLORS, COLOR_CSS, type NamedColor } from '$lib/admin/admin-utils';

	export let entries: any[] = [];
	export let colorField: string = 'featured';
	export let activeFilter: string | null = null;
	export let onFilterChange: (color: string | null) => void = () => {};
	export let onColorChange: (entryId: string, color: NamedColor) => void = () => {};

	/** Color → count of entries assigned that color */
	$: distribution = (() => {
		const counts: Record<string, number> = {};
		for (const c of NAMED_COLORS) counts[c] = 0;
		for (const entry of entries) {
			const c = entry[colorField];
			if (c && c in counts) counts[c]++;
		}
		return counts;
	})();

	let popoverEntryId: string | null = null;
	let popoverAnchor: HTMLElement | null = null;

	function handleSwatchClick(color: string) {
		if (activeFilter === color) {
			onFilterChange(null);
		} else {
			onFilterChange(color);
		}
	}

	function handleEntryDotClick(e: MouseEvent, entryId: string) {
		popoverEntryId = popoverEntryId === entryId ? null : entryId;
		popoverAnchor = e.currentTarget as HTMLElement;
	}

	function handleColorPick(color: NamedColor) {
		if (popoverEntryId) {
			onColorChange(popoverEntryId, color);
			popoverEntryId = null;
		}
	}
</script>

<div class="color-strip" role="group" aria-label="Color distribution">
	{#each NAMED_COLORS as color}
		{@const count = distribution[color] ?? 0}
		{#if count > 0 || activeFilter === color}
			<button
				class="swatch"
				class:active={activeFilter === color}
				class:empty={count === 0}
				aria-label="{color}: {count} entries"
				aria-pressed={activeFilter === color}
				on:click={() => handleSwatchClick(color)}
			>
				<span class="swatch-bar" style="background: {COLOR_CSS[color]}"></span>
				<span class="swatch-meta">{color} · {count}</span>
			</button>
		{/if}
	{/each}
</div>

{#if popoverEntryId}
	<div class="color-popover" role="listbox" aria-label="Pick a color">
		{#each NAMED_COLORS as color}
			<button
				class="popover-dot"
				role="option"
				aria-label={color}
				style="background: {COLOR_CSS[color]}"
				on:click={() => handleColorPick(color)}
			></button>
		{/each}
	</div>
{/if}

<style>
	.color-strip {
		display: flex;
		gap: 4px;
		padding: 8px 10px;
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle, #1a1a1a);
		border-radius: var(--radius-sm, 6px);
		flex-wrap: wrap;
	}

	.swatch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		cursor: pointer;
		background: none;
		border: none;
		padding: 2px;
		border-radius: 3px;
		transition: opacity var(--duration-fast, 120ms) var(--easing);
	}

	.swatch:hover {
		opacity: 0.8;
	}

	.swatch.active {
		outline: 1px solid var(--bento-blue, #2563EB);
		outline-offset: 1px;
	}

	.swatch.empty {
		opacity: 0.3;
	}

	.swatch-bar {
		display: block;
		width: 28px;
		height: 8px;
		border-radius: 2px;
	}

	.swatch-meta {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-subtle, #666);
		white-space: nowrap;
	}

	.color-popover {
		display: flex;
		gap: 4px;
		padding: 6px;
		background: var(--color-surface, #1a1a1a);
		border: 1px solid var(--border-color, #333);
		border-radius: var(--radius-sm, 4px);
		margin-top: 4px;
	}

	.popover-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		transition: border-color var(--duration-fast, 120ms) var(--easing);
	}

	.popover-dot:hover {
		border-color: #fff;
	}

	.popover-dot:focus-visible {
		outline: 2px solid var(--bento-blue, #2563EB);
		outline-offset: 1px;
	}
</style>
