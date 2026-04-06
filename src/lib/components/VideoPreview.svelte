<script lang="ts">
	import { onMount } from 'svelte';

	export let src: string;
	export let poster: string = '';
	export let playing: boolean = false;

	let videoEl: HTMLVideoElement;
	let loaded = false;
	let prefersReducedMotion = false;

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = mq.matches;
		const handler = (e: MediaQueryListEvent) => { prefersReducedMotion = e.matches; };
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	$: if (videoEl && loaded && !prefersReducedMotion) {
		if (playing) {
			videoEl.play().catch(() => {});
		} else {
			videoEl.pause();
			videoEl.currentTime = 0;
		}
	}

	function handleCanPlay() { loaded = true; }
</script>

<video
	bind:this={videoEl}
	{src}
	poster={poster || undefined}
	muted
	loop
	playsinline
	preload="metadata"
	on:canplaythrough={handleCanPlay}
	class="video-preview"
	aria-hidden="true"
>
</video>

<style>
	.video-preview {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
</style>
