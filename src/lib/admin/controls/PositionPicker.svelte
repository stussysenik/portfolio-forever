<script lang="ts">
	export let previewUrl: string = '';
	export let value: string = 'center top';
	export let onChange: (value: string) => void;

	const GRID: { label: string; keyword: string; x: number; y: number }[] = [
		{ label: 'TL', keyword: 'left top', x: 0, y: 0 },
		{ label: 'TC', keyword: 'center top', x: 50, y: 0 },
		{ label: 'TR', keyword: 'right top', x: 100, y: 0 },
		{ label: 'CL', keyword: 'left center', x: 0, y: 50 },
		{ label: 'CC', keyword: 'center center', x: 50, y: 50 },
		{ label: 'CR', keyword: 'right center', x: 100, y: 50 },
		{ label: 'BL', keyword: 'left bottom', x: 0, y: 100 },
		{ label: 'BC', keyword: 'center bottom', x: 50, y: 100 },
		{ label: 'BR', keyword: 'right bottom', x: 100, y: 100 },
	];

	// Parse current value to x/y percentages
	function parsePosition(val: string): { x: number; y: number } {
		const match = GRID.find((g) => g.keyword === val);
		if (match) return { x: match.x, y: match.y };
		const parts = val.split(/\s+/).map((p) => parseFloat(p));
		if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
			return { x: parts[0], y: parts[1] };
		}
		return { x: 50, y: 0 }; // default: center top
	}

	$: pos = parsePosition(value);

	function isActive(g: { x: number; y: number }): boolean {
		return Math.abs(pos.x - g.x) < 1 && Math.abs(pos.y - g.y) < 1;
	}

	function pickGrid(g: { keyword: string }) {
		onChange(g.keyword);
	}

	function setX(x: number) {
		onChange(`${x}% ${pos.y}%`);
	}

	function setY(y: number) {
		onChange(`${pos.x}% ${y}%`);
	}

	function reset() {
		onChange('center top');
	}
</script>

<div class="position-picker">
	<!-- Live preview -->
	{#if previewUrl}
		<div class="picker-preview">
			<img
				src={previewUrl}
				alt="Preview"
				class="picker-thumb"
				style:object-position={value}
			/>
		</div>
	{/if}

	<!-- 9-point grid -->
	<div class="picker-grid">
		{#each GRID as g}
			<button
				class="grid-cell"
				class:active={isActive(g)}
				on:click={() => pickGrid(g)}
				title={g.keyword}
				aria-label="Position: {g.keyword}"
				aria-pressed={isActive(g)}
			>
				<span class="grid-dot"></span>
			</button>
		{/each}
	</div>

	<!-- Fine-tune sliders -->
	<div class="picker-sliders">
		<div class="slider-row">
			<span class="slider-label">X</span>
			<input
				type="range"
				class="picker-slider"
				min="0"
				max="100"
				step="1"
				value={pos.x}
				on:input={(e) => setX(parseInt(e.currentTarget.value))}
				aria-label="Horizontal position"
			/>
			<span class="slider-value">{Math.round(pos.x)}%</span>
		</div>
		<div class="slider-row">
			<span class="slider-label">Y</span>
			<input
				type="range"
				class="picker-slider"
				min="0"
				max="100"
				step="1"
				value={pos.y}
				on:input={(e) => setY(parseInt(e.currentTarget.value))}
				aria-label="Vertical position"
			/>
			<span class="slider-value">{Math.round(pos.y)}%</span>
		</div>
	</div>

	<!-- Reset -->
	{#if value !== 'center top'}
		<button class="picker-reset" on:click={reset}>Reset</button>
	{/if}
</div>

<style>
	.position-picker {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	/* ── Live Preview ── */
	.picker-preview {
		aspect-ratio: 16 / 10;
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid var(--border-color-subtle);
		background: var(--color-surface, #f5f5f5);
	}

	.picker-thumb {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* ── 9-Point Grid ── */
	.picker-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;
		width: 72px;
		align-self: center;
	}

	.grid-cell {
		width: 22px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		background: transparent;
		cursor: pointer;
		padding: 0;
		transition: all 120ms ease;
	}

	.grid-cell:hover {
		border-color: var(--color-text-muted);
	}

	.grid-cell.active {
		background: var(--bento-blue, #2563EB);
		border-color: var(--bento-blue, #2563EB);
	}

	.grid-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--color-text-subtle);
	}

	.grid-cell.active .grid-dot {
		background: #fff;
	}

	/* ── Sliders ── */
	.picker-sliders {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.slider-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
		width: 10px;
	}

	.picker-slider {
		-webkit-appearance: none;
		appearance: none;
		flex: 1;
		height: 3px;
		background: var(--border-color-subtle);
		border-radius: 2px;
		outline: none;
	}

	.picker-slider:hover {
		background: var(--border-color);
	}

	.picker-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--bento-blue, #2563EB);
		cursor: pointer;
		border: none;
	}

	.picker-slider::-moz-range-thumb {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--bento-blue, #2563EB);
		cursor: pointer;
		border: none;
	}

	.slider-value {
		font-family: var(--font-mono);
		font-size: 7px;
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
		min-width: 24px;
		text-align: right;
	}

	/* ── Reset ── */
	.picker-reset {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-subtle);
		background: transparent;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		padding: 2px 6px;
		cursor: pointer;
		align-self: flex-start;
		transition: all 160ms ease;
	}

	.picker-reset:hover {
		color: var(--color-text);
		border-color: var(--border-color);
	}
</style>
