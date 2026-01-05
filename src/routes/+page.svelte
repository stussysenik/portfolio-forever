<script lang="ts">
  import { works, talks, interviews, type Entry } from '$lib/data/content';
  import AsciiVideo from '$lib/components/AsciiVideo.svelte';
  import WaveformPlayer from '$lib/components/WaveformPlayer.svelte';

  function formatDate(entry: Entry): string {
    const month = entry.month?.toString().padStart(2, '0') || '';
    return month ? `${entry.year}.${month}` : `${entry.year}`;
  }

  function getHighlight(entry: Entry): string | null {
    if (!entry.featured) return null;
    if (entry.featured === 'yellow') return '1';
    if (entry.featured === 'green') return '2';
    return null;
  }

  // Featured showcase items (The Real Thing)
  const showcaseItems = [
    {
      type: 'video',
      title: 'Under Neon Lights',
      subtitle: 'Short Film / Lighting Study',
      year: 2024,
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: '',
      aspectRatio: '21/9',
    },
    {
      type: 'audio',
      title: 'Nocturnal Transit',
      artist: 'YOUR NAME',
      year: 2024,
      src: '', // Would be actual audio file
    },
    {
      type: 'video',
      title: '3D Comic',
      subtitle: 'WebGL Experiment',
      year: 2020,
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      poster: '',
      aspectRatio: '16/9',
    },
  ];
</script>

<svelte:head>
  <title>Works | Creative Technologist</title>
  <meta name="description" content="Selected works in filmmaking, lighting design, music production, and experimental web technologies" />
</svelte:head>

<!-- THE REAL THING - Featured Showcase -->
<section class="showcase-section">
  <header class="showcase-header">
    <h1 class="showcase-title">◆ THE REAL THING</h1>
    <p class="showcase-subtitle">Live demos, not screenshots</p>
  </header>

  <div class="showcase-grid">
    {#each showcaseItems as item, i}
      <div class="showcase-item" style="--item-index: {i}">
        {#if item.type === 'video'}
          <AsciiVideo 
            src={item.src} 
            title={item.title}
            aspectRatio={item.aspectRatio}
          />
          <div class="showcase-meta">
            <span class="showcase-item-title">{item.title}</span>
            <span class="showcase-item-subtitle">{item.subtitle}</span>
            <span class="showcase-item-year">{item.year}</span>
          </div>
        {:else if item.type === 'audio'}
          <WaveformPlayer 
            src={item.src || ''} 
            title={item.title}
            artist={item.artist}
          />
        {/if}
      </div>
    {/each}
  </div>
</section>

<!-- Divider -->
<div class="section-divider">
  <span class="divider-line"></span>
  <span class="divider-text">ARCHIVE</span>
  <span class="divider-line"></span>
</div>

<!-- ARCHIVE - Works Grid -->
<div class="content-grid">
  <!-- WORKS Column -->
  <section class="section">
    <header class="section-header">
      <h2 class="section-title">Works</h2>
      <span class="section-count">{works.length}</span>
    </header>
    <ul class="entry-list">
      {#each works as entry}
        <li class="entry" data-highlight={getHighlight(entry)}>
          <span class="entry-date">{formatDate(entry)}</span>
          <span class="entry-title">{entry.title}</span>
          {#if entry.links && entry.links.length > 0}
            <span class="entry-links">
              {#each entry.links as link}
                <a href={link.url}>{link.label}</a>
              {/each}
            </span>
          {/if}
        </li>
      {/each}
    </ul>
  </section>

  <!-- TALKS Column -->
  <section class="section">
    <header class="section-header">
      <h2 class="section-title">Talks</h2>
      <span class="section-count">{talks.length}</span>
    </header>
    <ul class="entry-list">
      {#each talks as entry}
        <li class="entry" data-highlight={getHighlight(entry)}>
          <span class="entry-date">{formatDate(entry)}</span>
          <span class="entry-title">{entry.title}</span>
          {#if entry.links && entry.links.length > 0}
            <span class="entry-links">
              {#each entry.links as link}
                <a href={link.url}>{link.label}</a>
              {/each}
            </span>
          {/if}
        </li>
      {/each}
    </ul>
  </section>

  <!-- INTERVIEWS Column -->
  <section class="section">
    <header class="section-header">
      <h2 class="section-title">Interviews</h2>
      <span class="section-count">{interviews.length}</span>
    </header>
    <ul class="entry-list">
      {#each interviews as entry}
        <li class="entry" data-highlight={getHighlight(entry)}>
          <span class="entry-date">{formatDate(entry)}</span>
          <span class="entry-title">{entry.title}</span>
          {#if entry.links && entry.links.length > 0}
            <span class="entry-links">
              {#each entry.links as link}
                <a href={link.url}>{link.label}</a>
              {/each}
            </span>
          {/if}
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  /* Showcase Section */
  .showcase-section {
    margin-bottom: var(--space-2xl);
  }

  .showcase-header {
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-md);
    border-bottom: 2px solid var(--border-color);
  }

  .showcase-title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    color: var(--color-text-subtle);
    margin-bottom: var(--space-xs);
  }

  .showcase-subtitle {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--space-lg);
  }

  @media (max-width: 700px) {
    .showcase-grid {
      grid-template-columns: 1fr;
    }
  }

  .showcase-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .showcase-meta {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    font-size: var(--font-size-sm);
  }

  .showcase-item-title {
    font-weight: 500;
    color: var(--color-text);
  }

  .showcase-item-subtitle {
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
  }

  .showcase-item-year {
    color: var(--color-text-subtle);
    font-size: var(--font-size-xs);
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }

  /* Section Divider */
  .section-divider {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    margin: var(--space-2xl) 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }

  .divider-text {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
  }
</style>
