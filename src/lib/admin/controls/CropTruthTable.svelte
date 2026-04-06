<script lang="ts">
	/**
	 * CropTruthTable — Orchestrator combining FocalPointEditor + CropPreviewCells + zoom slider.
	 *
	 * Shows how a single focal point renders across multiple aspect ratios simultaneously.
	 * Inspired by logic truth tables: one input (focal point) -> all outputs (crop regions).
	 *
	 * Dispatches a single `change` event with { focalX, focalY, zoom } whenever any control changes.
	 */
	import { createEventDispatcher } from 'svelte';
	import FocalPointEditor from './FocalPointEditor.svelte';
	import CropPreviewCell from './CropPreviewCell.svelte';

	export let imageUrl: string;
	export let focalX: number = 50;
	export let focalY: number = 50;
	export let zoom: number = 1.0;

	const dispatch = createEventDispatcher<{ change: { focalX: number; focalY: number; zoom: number } }>();

	/** The aspect ratios shown in the truth table */
	const ratios = ['16:10', '1:1', '4:3', '21:9'];

	function handleFocalChange(e: CustomEvent<{ focalX: number; focalY: number }>) {
		focalX = e.detail.focalX;
		focalY = e.detail.focalY;
		dispatch('change', { focalX, focalY, zoom });
	}

	function handleZoomInput(e: Event) {
		const target = e.target as HTMLInputElement;
		zoom = parseFloat(target.value);
		dispatch('change', { focalX, focalY, zoom });
	}
</script>

<div class="crop-truth-table">
	<!-- Focal point editor (source image with crosshair) -->
	<div class="editor-panel">
		<FocalPointEditor {imageUrl} {focalX} {focalY} on:change={handleFocalChange} />
	</div>

	<!-- Truth table grid: 4 aspect ratio previews -->
	<div class="truth-grid">
		{#each ratios as ratio}
			<CropPreviewCell {imageUrl} {focalX} {focalY} {zoom} aspectRatio={ratio} />
		{/each}
	</div>

	<!-- Zoom slider -->
	<div class="zoom-row">
		<label class="zoom-label" for="zoom-slider">ZOOM</label>
		<input
			id="zoom-slider"
			type="range"
			min="1.0"
			max="3.0"
			step="0.1"
			value={zoom}
			on:input={handleZoomInput}
			class="zoom-slider"
		/>
		<span class="zoom-value">{zoom.toFixed(1)}x</span>
	</div>
</div>

<style>
	.crop-truth-table {
		display: flex;
		flex-direction: column;
		gap: var(--space-md, 1rem);
	}

	.editor-panel {
		max-width: 100%;
	}

	/* 4 preview cells in a row */
	.truth-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-sm, 0.5rem);
	}

	/* Stack 2x2 on narrow screens */
	@media (max-width: 500px) {
		.truth-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Zoom control row */
	.zoom-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm, 0.5rem);
		padding: 0 2px;
	}

	.zoom-label {
		font-family: var(--font-mono, monospace);
		font-size: var(--font-size-2xs, 0.625rem);
		font-weight: 500;
		color: var(--color-text-subtle, #a3a3a3);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		flex-shrink: 0;
	}

	.zoom-slider {
		flex: 1;
		height: 2px;
		appearance: none;
		-webkit-appearance: none;
		background: var(--border-color-subtle, #e5e5e5);
		border-radius: 1px;
		outline: none;
		cursor: pointer;
	}

	.zoom-slider::-webkit-slider-thumb {
		appearance: none;
		-webkit-appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--color-text-muted, #737373);
		border: 2px solid var(--color-bg, #fafaf9);
		box-shadow: 0 0 0 1px var(--border-color, #d4d4d4);
		cursor: pointer;
		transition: background 0.1s ease;
	}

	.zoom-slider::-webkit-slider-thumb:hover {
		background: var(--color-accent, #2563eb);
	}

	.zoom-slider::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--color-text-muted, #737373);
		border: 2px solid var(--color-bg, #fafaf9);
		box-shadow: 0 0 0 1px var(--border-color, #d4d4d4);
		cursor: pointer;
	}

	.zoom-value {
		font-family: var(--font-mono, monospace);
		font-size: var(--font-size-xs, 0.75rem);
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted, #737373);
		min-width: 3ch;
		text-align: right;
	}
</style>
