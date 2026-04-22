<script lang="ts">
  import { onMount } from 'svelte';
  import { getConvexClient } from '$lib/convex';
  import { api } from '$convex/_generated/api';
  import MuxVideo from '$lib/components/MuxVideo.svelte';
  import GenericListBlock from '$lib/components/blocks/GenericListBlock.svelte';

  export let id = "academia";

  let entries: any[] = [];
  let loading = true;
  let thumbnailConfig: any = null;

  $: displayMode = thumbnailConfig?.displayMode ?? 'grid';

  onMount(() => {
    const client = getConvexClient();
    const unsub1 = client.onUpdate(api.academia.getVisibleAcademia, {}, (data) => {
      if (data) {
        entries = data;
        loading = false;
      }
    });
    const unsub2 = client.onUpdate(api.thumbnails.getConfig, { section: 'academia' }, (data) => {
      thumbnailConfig = data;
    });
    return () => { unsub1(); unsub2(); };
  });
</script>

<svelte:head>
  <title>Re:mix Research | Stüssy Senik</title>
  <meta name="description" content="Re:mix Research — extending and re-implementing landmark papers in computer vision, deep learning, and motion analysis." />
</svelte:head>

<div {id} class="academia">
  <header class="academia-header">
    <h1 class="academia-name">Re:mix Research</h1>
    <p class="academia-tagline">Taking landmark papers and rebuilding them from scratch — learning by doing, extending the original work with new ideas, different frameworks, and fresh perspectives.</p>
    <p class="academia-meta">
      Stüssy Senik · Cooper Union · FAMU Prague · Bed-Stuy, Brooklyn
    </p>
    <p class="academia-contact">
      <a href="mailto:itsmxzou@gmail.com">itsmxzou@gmail.com</a>
      <span class="sep">·</span>
      <a href="https://github.com/stussysenik" target="_blank" rel="noopener noreferrer">GitHub</a>
      <span class="sep">·</span>
      <a href="https://stussysenik.com" target="_blank" rel="noopener noreferrer">Portfolio</a>
    </p>
  </header>

  <section class="academia-section">
    <h2 class="academia-section-title">Re-implementations</h2>

    {#if loading}
      <p class="academia-empty">Loading...</p>
    {:else if entries.length === 0}
      <p class="academia-empty">No entries yet. Add research papers from the <a href="/admin">admin panel</a>.</p>
    {:else}
      {#each entries as entry}
        <div class="paper" class:compact={displayMode === 'list'}>
          {#if entry.muxPlaybackId}
            <div class="paper-video">
              <MuxVideo playbackId={entry.muxPlaybackId} title={entry.title} />
            </div>
          {:else if entry.thumbnailUrl}
            <img class="paper-thumb" src={entry.thumbnailUrl} alt="{entry.title} thumbnail" loading="lazy" />
          {:else}
            <div class="paper-thumb paper-thumb-placeholder"></div>
          {/if}

          <div class="paper-content">
            <h3 class="paper-title">
              {#if entry.paperUrl}
                <a href={entry.paperUrl} target="_blank" rel="noopener noreferrer">{entry.title}</a>
              {:else}
                {entry.title}
              {/if}
            </h3>

            <p class="paper-authors">{entry.authors}</p>

            {#if entry.venue}
              <p class="paper-venue">{entry.venue}{entry.year ? `, ${entry.year}` : ''}</p>
            {:else if entry.year}
              <p class="paper-venue">{entry.year}</p>
            {/if}

            {#if entry.description}
              <p class="paper-desc">{entry.description}</p>
            {/if}

            <div class="paper-links">
              {#if entry.paperUrl}
                <a href={entry.paperUrl} target="_blank" rel="noopener noreferrer">paper</a>
              {/if}
              {#if entry.codeUrl}
                <a href={entry.codeUrl} target="_blank" rel="noopener noreferrer">code</a>
              {/if}
              {#if entry.demoUrl}
                <a href={entry.demoUrl} target="_blank" rel="noopener noreferrer">demo</a>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </section>

	<section class="academia-pipeline mt-2xl pt-xl border-t border-border-color-subtle">
		<GenericListBlock
			title="Research Pipeline & WIP"
			items={["Diffusion Models for Vector Space", "Sparse Neural Rendering", "Realtime WebGL Kernels"]}
		/>
	</section>
</div>

<style>
<<<<<<< Updated upstream
  .academia {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-lg) var(--space-md);
  }

  /* Header */
  .academia-header {
    margin-bottom: var(--space-2xl);
  }

  .academia-name {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    margin-bottom: var(--space-xs);
  }

  .academia-tagline {
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    margin-bottom: var(--space-xs);
  }

  .academia-meta {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-sm);
  }

  .academia-contact {
    font-size: var(--font-size-sm);
  }

  .academia-contact a {
    color: var(--color-accent);
  }

  .academia-contact .sep {
    color: var(--color-text-subtle);
    margin: 0 var(--space-xs);
  }

  /* Section */
  .academia-section-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border-color);
  }

  .academia-empty {
    color: var(--color-text-muted);
    font-style: italic;
  }

  .academia-empty a {
    color: var(--color-accent);
  }

  /* Paper entries */
  .paper {
    display: flex;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
    align-items: flex-start;
  }

  /* Compact/list mode: hide thumbnails */
  .paper.compact :global(.paper-video),
  .paper.compact .paper-thumb,
  .paper.compact .paper-thumb-placeholder {
    display: none;
  }

  .paper-thumb {
    width: 160px;
    min-width: 160px;
    height: 100px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    background: var(--color-bg-alt);
  }

  .paper-thumb-placeholder {
    border: 1px dashed var(--border-color-subtle);
  }

  .paper-video {
    width: 160px;
    min-width: 160px;
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .paper-content {
    flex: 1;
    min-width: 0;
  }

  .paper-title {
    font-size: var(--font-size-base);
    font-weight: 600;
    margin-bottom: var(--space-2xs);
    line-height: 1.3;
  }

  .paper-title a {
    color: var(--color-text);
    text-decoration: none;
  }

  .paper-title a:hover {
    color: var(--color-accent);
  }

  .paper-authors {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2xs);
  }

  .paper-venue {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    font-style: italic;
    margin-bottom: var(--space-xs);
  }

  .paper-desc {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin-bottom: var(--space-xs);
  }

  .paper-links {
    display: flex;
    gap: var(--space-md);
    font-size: var(--font-size-sm);
  }

  .paper-links a {
    color: var(--color-accent);
    text-decoration: none;
    font-weight: 500;
  }

  .paper-links a:hover {
    text-decoration: underline;
  }

  /* Mobile */
  @media (max-width: 600px) {
    .paper {
      flex-direction: column;
    }

    .paper-thumb {
      width: 100%;
      min-width: unset;
      height: 140px;
    }
  }
=======
  .academia { max-width: 800px; margin: 0 auto; padding: var(--space-lg) var(--space-md); }
  .academia-header { margin-bottom: var(--space-2xl); }
  .academia-name { font-size: var(--font-size-2xl); font-weight: 600; margin-bottom: var(--space-xs); }
  .academia-tagline { color: var(--color-text-secondary); font-size: var(--font-size-base); margin-bottom: var(--space-xs); }
  .academia-meta { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-sm); }
  .academia-section-title { font-size: var(--font-size-lg); font-weight: 600; margin-bottom: var(--space-lg); border-bottom: 1px solid var(--border-color); }
  .academia-empty { color: var(--color-text-muted); font-style: italic; }
  .paper { display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-xl); align-items: flex-start; }
  .paper.compact .paper-thumb { display: none; }
  .paper-thumb { width: 100%; height: 140px; object-fit: cover; border-radius: var(--radius-sm); background: var(--color-bg-alt); }
  .paper-content { flex: 1; min-width: 0; }
  .paper-title { font-size: var(--font-size-base); font-weight: 600; line-height: 1.3; }
  .paper-authors { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
  .paper-venue { font-size: var(--font-size-sm); color: var(--color-text-muted); font-style: italic; }
  .paper-desc { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.5; }
  .paper-links { display: flex; gap: var(--space-md); font-size: var(--font-size-sm); }
  .paper-links a { color: var(--color-accent); font-weight: 500; }
  @media (min-width: 600px) { .paper { flex-direction: row; } .paper-thumb { width: 160px; min-width: 160px; height: 100px; } }
>>>>>>> Stashed changes
</style>
