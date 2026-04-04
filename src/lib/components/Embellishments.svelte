<script lang="ts">
	import { embellishmentsEnabled } from "$lib/stores/controls";
</script>

{#if $embellishmentsEnabled}
	<div class="embellishments-layer">
		<!-- Shaders and "little aliens" SVG Physics will stack inside here -->
		<!-- They represent non-intrusive aesthetic components that ignore page flow -->
	</div>
{/if}

<style>
	.embellishments-layer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none; /* Let clicks pass through to the DOM below */
		z-index: 500; /* Stack above background, below modals/navigation */
		overflow: hidden;
	}
</style>
