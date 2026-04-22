<script lang="ts">
  import HighFiMedia from '$lib/components/media/HighFiMedia.svelte';
  import type { MediaAsset } from '$lib/components/media/HighFiMedia.svelte';

export let items: MediaAsset[] = [];
  export let layout: 'grid' | 'masonry' | 'filmstrip' | 'editorial' = 'grid';
</script>

<div class="media-grid" data-layout={layout}>
  {#each items as item}
    <div class="grid-item">
      <HighFiMedia asset={item} />
    </div>
  {/each}
</div>

<style>
  .media-grid {
    display: grid;
    gap: var(--space-md, 1rem);
  }

  /* Grid Layout */
  .media-grid[data-layout="grid"] {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .media-grid[data-layout="editorial"] {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  /* Masonry Layout */
  .media-grid[data-layout="masonry"] {
    columns: 3;
    column-gap: var(--space-md, 1rem);
  }
  .media-grid[data-layout="masonry"] .grid-item {
    break-inside: avoid;
    margin-bottom: var(--space-md, 1rem);
  }

  /* Filmstrip Layout */
  .media-grid[data-layout="filmstrip"] {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 1rem; /* For scrollbar visibility */
  }
  .media-grid[data-layout="filmstrip"] .grid-item {
    flex: 0 0 80%;
    scroll-snap-align: start;
  }
  @media (min-width: 768px) {
    .media-grid[data-layout="filmstrip"] .grid-item {
      flex-basis: 40%;
    }
  }

  .grid-item {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3; /* Default aspect ratio */
  }
</style>
