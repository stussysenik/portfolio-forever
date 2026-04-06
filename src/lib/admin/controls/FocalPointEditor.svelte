<script lang="ts">
	/**
	 * FocalPointEditor — Interactive focal point picker on the source image.
	 *
	 * Click anywhere on the full source image to set the focal point.
	 * Drag the crosshair to adjust. Displays coordinate readout in monospace.
	 * Dispatches `change` event with { focalX, focalY } (0-100 range).
	 */
	import { createEventDispatcher } from 'svelte';

	export let imageUrl: string;
	export let focalX: number = 50;
	export let focalY: number = 50;

	const dispatch = createEventDispatcher<{ change: { focalX: number; focalY: number } }>();

	let container: HTMLDivElement;
	let dragging = false;

	function clamp(val: number, min: number, max: number): number {
		return Math.min(max, Math.max(min, val));
	}

	function updateFromEvent(e: MouseEvent | TouchEvent) {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
		const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
		focalX = Math.round(x * 10) / 10;
		focalY = Math.round(y * 10) / 10;
		dispatch('change', { focalX, focalY });
	}

	function onPointerDown(e: MouseEvent | TouchEvent) {
		dragging = true;
		updateFromEvent(e);
		if ('touches' in e) {
			// Prevent scroll while dragging on touch
			e.preventDefault();
		}
	}

	function onPointerMove(e: MouseEvent | TouchEvent) {
		if (!dragging) return;
		updateFromEvent(e);
		if ('touches' in e) {
			e.preventDefault();
		}
	}

	function onPointerUp() {
		dragging = false;
	}
</script>

<svelte:window on:mousemove={onPointerMove} on:mouseup={onPointerUp} on:touchmove={onPointerMove} on:touchend={onPointerUp} />

<div class="focal-editor">
	<div
		class="image-container"
		bind:this={container}
		on:mousedown={onPointerDown}
		on:touchstart={onPointerDown}
		role="application"
		aria-label="Focal point editor. Click or drag to set the focal point."
		tabindex="0"
	>
		<img src={imageUrl} alt="Source for focal point editing" class="source-image" />

		<!-- Crosshair lines extending to edges -->
		<div class="crosshair-h" style="top: {focalY}%;"></div>
		<div class="crosshair-v" style="left: {focalX}%;"></div>

		<!-- Center dot at intersection -->
		<div class="crosshair-dot" style="left: {focalX}%; top: {focalY}%;" class:active={dragging}></div>
	</div>

	<div class="coords-readout" class:active={dragging}>
		<span class="coord-value">{focalX.toFixed(1)}</span>
		<span class="coord-sep">,</span>
		<span class="coord-value">{focalY.toFixed(1)}</span>
	</div>
</div>

<style>
	.focal-editor {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.image-container {
		position: relative;
		overflow: hidden;
		border-radius: var(--radius-sm, 4px);
		border: 1px solid var(--border-color-subtle, #e5e5e5);
		cursor: crosshair;
		user-select: none;
		-webkit-user-select: none;
		touch-action: none;
	}

	.image-container:focus-visible {
		outline: 2px solid var(--color-accent, #2563eb);
		outline-offset: 2px;
	}

	.source-image {
		display: block;
		width: 100%;
		height: auto;
		pointer-events: none;
	}

	/* Crosshair — thin 1px lines extending to edges */
	.crosshair-h,
	.crosshair-v {
		position: absolute;
		pointer-events: none;
	}

	.crosshair-h {
		left: 0;
		right: 0;
		height: 0;
		border-top: 1px solid var(--color-accent, #2563eb);
		opacity: 0.6;
	}

	.crosshair-v {
		top: 0;
		bottom: 0;
		width: 0;
		border-left: 1px solid var(--color-accent, #2563eb);
		opacity: 0.6;
	}

	.crosshair-dot {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid var(--color-accent, #2563eb);
		background: rgba(255, 255, 255, 0.8);
		transform: translate(-50%, -50%);
		pointer-events: none;
		transition: box-shadow 0.1s ease;
	}

	.crosshair-dot.active {
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
	}

	/* Coordinate readout */
	.coords-readout {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
		font-family: var(--font-mono, monospace);
		font-size: var(--font-size-xs, 0.75rem);
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted, #737373);
		transition: color 0.1s ease;
	}

	.coords-readout.active {
		color: var(--color-accent, #2563eb);
	}

	.coord-value {
		min-width: 3ch;
		text-align: right;
	}

	.coord-sep {
		opacity: 0.5;
		margin: 0 1px;
	}
</style>
