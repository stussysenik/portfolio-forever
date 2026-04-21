<script lang="ts">
  import { onMount } from 'svelte';
  import { getConvexClient } from '$lib/convex';
  import { setupGallerySubscriptions, filterItems } from '$lib/sections/gallery-logic';

  export let id = "gallery";

  // Filter state
  let activeFilter: string = 'all';
  const categories = ['all', 'design', 'technology', 'art', 'film'];

  // Color mapping for category dots
  const categoryColors: Record<string, string> = {
    design: 'var(--color-design)',
    technology: 'var(--color-technology)',
    art: 'var(--color-art)',
    film: 'var(--color-film)',
  };

  let galleryItems: any[] = [];

  onMount(() => {
    const client = getConvexClient();
    return setupGallerySubscriptions(client, {
      onItems: (data: any) => {
        if (data) galleryItems = data;
      }
    });
  });

  function getPlaceholderColor(item: any): string {
    const cat = Array.isArray(item.category) ? item.category[0] : item.category;
    return categoryColors[cat] || 'var(--color-text-subtle)';
  }

  $: filteredItems = filterItems(galleryItems, activeFilter);

  function setFilter(category: string) {
    activeFilter = category;
  }

  // Selected item for detail view
  let selected: any | null = null;
</script>

<svelte:head>
  <title>Gallery</title>
  <meta name="description" content="Visual archive" />
</svelte:head>

<svelte:window on:keydown={(e) => e.key === 'Escape' && (selected = null)} />

<div {id}>
  <header class="page-header">
    <h1 class="page-title">&#9671; GALLERY</h1>
    <span class="page-count">[{filteredItems.length}]</span>
  </header>

  <!-- Filter -->
  <nav class="filter-row">
    {#each categories as cat}
      <button
        class="filter-btn"
        class:active={activeFilter === cat}
        on:click={() => setFilter(cat)}
      >
        {cat}
      </button>
    {/each}
  </nav>

  <!-- Grid -->
  <div class="mosaic">
    {#each filteredItems as item (item.id)}
      <button
        class="tile"
        style="--bg: {getPlaceholderColor(item)}"
        on:click={() => selected = item}
      >
        <span class="tile-char">{item.title.charAt(0)}</span>
        <div class="tile-overlay">
          <span class="tile-title">{item.title}</span>
          <span class="tile-year">{item.year}</span>
        </div>
      </button>
    {/each}
  </div>
</div>

<!-- Detail Panel -->
{#if selected}
  <div class="detail-backdrop" role="presentation">
    <button
      type="button"
      class="detail-dismiss"
      tabindex="-1"
      aria-label="Close gallery detail"
      on:click={() => selected = null}
    ></button>
    <div class="detail-panel" role="dialog" aria-modal="true" tabindex="-1">
      <button class="detail-close" on:click={() => selected = null}>&times;</button>
      <div class="detail-visual" style="--bg: {getPlaceholderColor(selected)}">
        <span class="detail-char">{selected.title.charAt(0)}</span>
      </div>
      <div class="detail-info">
        <h2 class="detail-title">{selected.title}</h2>
        <span class="detail-year">{selected.year}</span>
        <div class="detail-tags">
          {#each selected.category as cat}
            <span class="tag">{cat}</span>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .page-header {
    display: flex;
    align-items: baseline;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
    border-bottom: var(--border-width-thick) solid var(--color-text);
  }

  .page-title {
    font-family: var(--font-sans);
    font-size: var(--font-size-xl);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
    margin: 0;
  }

  .page-count {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  /* Filter */
  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-bottom: var(--space-lg);
  }

  .filter-btn {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    padding: var(--space-xs) var(--space-sm);
    background: transparent;
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
  }

  .filter-btn:hover {
    border-color: var(--color-text-muted);
    color: var(--color-text);
  }

  .filter-btn.active {
    background: var(--color-text);
    border-color: var(--color-text);
    color: var(--color-bg);
  }

  /* Mosaic Grid */
  .mosaic {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 3px;
  }

  @media (min-width: 480px) {
    .mosaic {
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 4px;
    }
  }

  @media (min-width: 768px) {
    .mosaic {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }

  .tile {
    aspect-ratio: 1;
    background: var(--bg);
    border: none;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--duration-fast) var(--easing);
  }

  .tile:hover {
    transform: scale(1.05);
    z-index: 5;
  }

  .tile-char {
    font-family: var(--font-sans);
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: white;
    opacity: 0.3;
    text-transform: uppercase;
  }

  .tile-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: var(--space-xs);
    background: linear-gradient(to top, hsla(0,0%,0%,0.8), transparent 70%);
    opacity: 0;
    transition: opacity var(--duration-fast) var(--easing);
  }

  .tile:hover .tile-overlay {
    opacity: 1;
  }

  .tile-title {
    font-size: var(--font-size-2xs);
    font-weight: 500;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tile-year {
    font-family: var(--font-mono);
    font-size: var(--font-size-2xs, 0.75rem);
    color: hsla(0,0%,100%,0.6);
  }

  /* Detail Panel */
  .detail-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: hsla(0,0%,0%,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-md);
    animation: fadeIn var(--duration-fast) var(--easing);
  }

  .detail-dismiss {
    position: absolute;
    inset: 0;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .detail-panel {
    background: var(--color-surface);
    border-radius: var(--radius-md);
    max-width: 500px;
    width: 100%;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .detail-close {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
    width: 2em;
    height: 2em;
    background: var(--color-bg);
    border: var(--border-width) solid var(--border-color);
    border-radius: 50%;
    font-size: var(--font-size-lg);
    color: var(--color-text-muted);
    cursor: pointer;
    z-index: 10;
  }

  .detail-close:hover {
    background: var(--color-text);
    color: var(--color-bg);
  }

  .detail-visual {
    aspect-ratio: 16/9;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .detail-char {
    font-family: var(--font-sans);
    font-size: var(--font-size-display);
    font-weight: 700;
    color: white;
    opacity: 0.2;
    text-transform: uppercase;
  }

  .detail-info {
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .detail-title {
    font-family: var(--font-sans);
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0;
  }

  .detail-year {
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .detail-tags {
    display: flex;
    gap: var(--space-xs);
  }

  .tag {
    font-family: var(--font-mono);
    font-size: var(--font-size-2xs);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    padding: var(--space-2xs) var(--space-xs);
    background: var(--color-bg-alt);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
