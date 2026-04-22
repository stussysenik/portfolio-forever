<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { MediaAsset } from '$lib/components/media/HighFiMedia.svelte';
  import { colorProfileStore } from '$lib/stores/media';
  
  export let asset: Extract<MediaAsset, { type: 'photo' }>;
  export let priority = false;
  export let showExif = false;

  let loaded = false;
  const { gamut, destroy } = colorProfileStore;

  onDestroy(destroy);
</script>

<figure class="photo-viewer" class:loaded={loaded}>
  {#if !loaded && asset.blurPlaceholder}
    <img
      class="blur-placeholder"
      src={asset.blurPlaceholder}
      alt=""
      aria-hidden="true"
    />
  {/if}

  <picture>
    {#if $gamut === 'p3' && asset.srcset?.avif}
      {#each asset.srcset.avif as { width, url }}
        <source srcset={url} media={`(min-width: ${width}px)`} type="image/avif" />
      {/each}
    {/if}
    {#if asset.srcset?.webp}
      {#each asset.srcset.webp as { width, url }}
        <source srcset={url} media={`(min-width: ${width}px)`} type="image/webp" />
      {/each}
    {/if}
    <img
      src={asset.srcset?.jpeg?.[0]?.url ?? asset.url}
      alt={asset.alt ?? 'Portfolio image'}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      on:load={() => (loaded = true)}
    />
  </picture>

  {#if showExif && asset.exif}
    <figcaption class="exif-overlay">
      {asset.exif.focalLength} · f/{asset.exif.aperture} · {asset.exif.exposureTime}s · ISO {asset.exif.iso}
    </figcaption>
  {/if}
</figure>

<style>
  .photo-viewer {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .photo-viewer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.4s ease-out;
  }

  .blur-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(20px);
    transform: scale(1.1);
    opacity: 1;
    z-index: 1;
    transition: opacity 0.4s ease-in;
  }

  .photo-viewer.loaded .blur-placeholder {
    opacity: 0;
  }

  .photo-viewer:not(.loaded) > picture > img {
    opacity: 0;
  }

  .exif-overlay {
    position: absolute;
    bottom: var(--space-sm);
    right: var(--space-sm);
    padding: var(--space-xs) var(--space-sm);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-family: var(--font-mono);
    font-size: var(--font-size-2xs);
    border-radius: var(--radius-sm);
  }
</style>
