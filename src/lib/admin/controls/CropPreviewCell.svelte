<script lang="ts">
	/**
	 * CropPreviewCell — A single truth table cell showing an image
	 * cropped at a specific aspect ratio with focal-point-based positioning.
	 *
	 * Uses pure CSS object-fit: cover + object-position to simulate
	 * exactly what the browser will render — zero simulation error.
	 */
	export let imageUrl: string;
	export let focalX: number = 50;
	export let focalY: number = 50;
	export let zoom: number = 1.0;
	export let aspectRatio: string = '16:10';

	/** Convert "16:10" to CSS "16 / 10" */
	$: cssAspectRatio = aspectRatio.replace(':', ' / ');
</script>

<div class="crop-cell">
	<div class="crop-frame" style="aspect-ratio: {cssAspectRatio};">
		<img
			src={imageUrl}
			alt="Crop preview at {aspectRatio}"
			class="crop-image"
			style="object-position: {focalX}% {focalY}%; transform: scale({zoom}); transform-origin: {focalX}% {focalY}%;"
		/>
	</div>
	<span class="crop-label">{aspectRatio}</span>
</div>

<style>
	.crop-cell {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.crop-frame {
		position: relative;
		overflow: hidden;
		border-radius: var(--radius-sm, 4px);
		border: 1px solid transparent;
		background: var(--color-bg-alt, #f5f5f4);
		transition: border-color 0.15s ease;
	}

	.crop-frame:hover {
		border-color: var(--border-color, #e5e5e5);
	}

	.crop-image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* object-position and transform set via inline style */
	}

	.crop-label {
		font-family: var(--font-mono, monospace);
		font-size: var(--font-size-2xs, 0.625rem);
		font-variant-numeric: tabular-nums;
		color: var(--color-text-subtle, #a3a3a3);
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
