<script lang="ts">
	import { onMount } from 'svelte';

	export let playbackId: string;
	export let title: string = '';
	export let autoplay: boolean = false;
	export let muted: boolean = false;
	export let loop: boolean = false;
	export let poster: string = '';
	export let accentColor: string = '#000';

	let container: HTMLElement;
	let loaded = false;

	onMount(async () => {
		// Dynamic import to avoid SSR issues with custom elements
		await import('@mux/mux-player');
		loaded = true;
	});
</script>

<div class="mux-wrapper" bind:this={container}>
	{#if loaded}
		<mux-player
			stream-type="on-demand"
			playback-id={playbackId}
			metadata-video-title={title}
			accent-color={accentColor}
			autoplay={autoplay ? 'any' : undefined}
			muted={muted || undefined}
			loop={loop || undefined}
			poster={poster || undefined}
			default-hidden-captions
		></mux-player>
	{:else}
		<div class="mux-skeleton">
			<div class="mux-skeleton-shimmer"></div>
		</div>
	{/if}
</div>

<style>
	.mux-wrapper {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--color-bg-alt);
	}

	.mux-wrapper :global(mux-player) {
		width: 100%;
		height: 100%;
		--media-object-fit: cover;
	}

	.mux-skeleton {
		width: 100%;
		height: 100%;
		position: relative;
		background: var(--color-bg-alt);
	}

	.mux-skeleton-shimmer {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent 0%, var(--color-surface) 50%, transparent 100%);
		background-size: 200% 100%;
		animation: shimmer 1.8s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>
