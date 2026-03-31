<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let idx: string = '01';
	export let name: string = '';
	export let count: string | number | null = null;
	export let accentColor: 'blue' | 'green' | 'muted' = 'blue';
	export let span: number = 4;
	export let expanded: boolean = false;

	const colorMap: Record<string, string> = {
		blue: 'var(--bento-blue, #2563EB)',
		green: 'var(--bento-green, #44D62C)',
		muted: '#737373'
	};

	$: dotColor = colorMap[accentColor] || colorMap.blue;

	let mounted = false;
	let staggerIndex = 0;

	onMount(() => {
		// parse index for stagger delay
		staggerIndex = parseInt(idx, 10) || 0;
		// Trigger entrance animation after mount
		requestAnimationFrame(() => {
			mounted = true;
		});
	});

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div
	class="bento-cell"
	class:bento-cell--mounted={mounted}
	class:bento-cell--expanded={expanded}
	style="grid-column: span {span}; --stagger-delay: {staggerIndex * 40}ms"
>
	<button
		class="bento-cell-header"
		on:click={toggleExpanded}
		aria-expanded={expanded}
		aria-label="Toggle {name} section"
	>
		<div class="bento-cell-header-left">
			<span class="bento-cell-idx">{idx}</span>
			<span class="bento-cell-dot" style="background: {dotColor}"></span>
			<span class="bento-cell-name">{name}</span>
		</div>
		{#if count !== null && count !== undefined}
			<span class="bento-cell-count">{count}</span>
		{/if}
	</button>

	<div class="bento-cell-body">
		<slot />
	</div>

	{#if expanded}
		<div class="bento-cell-expanded" transition:slide={{ duration: 200 }}>
			<slot name="expanded" />
		</div>
	{/if}
</div>

<style>
	.bento-cell {
		--bento-blue: #2563EB;
		--bento-green: #44D62C;
		background: var(--color-surface);
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-md);
		overflow: hidden;
		transition:
			border-color var(--duration-fast) var(--easing),
			box-shadow var(--duration-fast) var(--easing),
			transform var(--duration-normal) var(--easing-out),
			opacity var(--duration-normal) var(--easing-out);
		/* Entrance animation: start offset */
		opacity: 0;
		transform: translateY(5px);
		transition-delay: var(--stagger-delay, 0ms);
	}

	.bento-cell--mounted {
		opacity: 1;
		transform: translateY(0);
	}

	.bento-cell:hover {
		border-color: var(--border-color);
		box-shadow: var(--shadow-sm);
	}

	.bento-cell--expanded {
		border-color: var(--border-color);
	}

	/* ── Header ── */
	.bento-cell-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 10px 12px;
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-mono);
		color: var(--color-text);
		transition: background var(--duration-fast) var(--easing);
	}

	.bento-cell-header:hover {
		background: var(--color-bg-alt);
	}

	.bento-cell-header:focus-visible {
		outline: 2px solid var(--bento-blue);
		outline-offset: -2px;
	}

	.bento-cell-header-left {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.bento-cell-idx {
		font-size: var(--font-size-3xs);
		color: var(--color-text-subtle);
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
		width: 18px;
	}

	.bento-cell-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.bento-cell-name {
		font-size: var(--font-size-xs);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.bento-cell-count {
		font-size: var(--font-size-3xs);
		color: var(--color-text-subtle);
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
		padding: 1px 6px;
		background: var(--color-bg-alt);
		border-radius: var(--radius-sm);
	}

	/* ── Body ── */
	.bento-cell-body {
		padding: 0 12px 10px;
	}

	/* ── Expanded panel ── */
	.bento-cell-expanded {
		border-top: 1px solid var(--border-color-subtle);
		padding: 12px;
		background: var(--color-bg);
	}

	/* ── Responsive span clamping ── */
	@media (max-width: 1024px) {
		.bento-cell {
			grid-column: span min(var(--span, 4), 8) !important;
		}
	}

	@media (max-width: 640px) {
		.bento-cell {
			grid-column: span 4 !important;
		}
	}
</style>
