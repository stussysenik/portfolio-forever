<script lang="ts">
  import { onMount } from 'svelte';
  import type { MediaAsset } from '$lib/components/media/HighFiMedia.svelte';
  import { viewportMediaStore } from '$lib/stores/viewport-media';

  export let asset: Extract<MediaAsset, { type: 'gif' }>;
  export let priority = false;

  let container: HTMLElement;
  let isPlaying = false;
  let hasBeenVisible = false;

  const { activeGifIds } = viewportMediaStore;

  $: isPlaying = $activeGifIds.has(asset.url);
  $: if (isPlaying) hasBeenVisible = true;

  onMount(() => {
    return viewportMediaStore.register(container, asset.url, 'gif');
  });
</script>

<div class="animation-player" bind:this={container} on:click={() => (isPlaying = !isPlaying)}>
  <img
    src={asset.url}
    alt="Animated GIF"
    loading={priority ? 'eager' : 'lazy'}
    decoding="async"
    style:opacity={isPlaying || hasBeenVisible ? 1 : 0.5}
  />
  <div class="play-indicator" class:visible={!isPlaying}>
    <span>GIF</span>
  </div>
</div>

<style>
  .animation-player {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.6);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .play-indicator.visible {
    opacity: 1;
  }
</style>
