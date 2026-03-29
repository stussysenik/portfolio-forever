<script lang="ts">
  import type { SanityPost } from '$lib/sanity/types';

  export let posts: any[] = [];
  export let id = "blog";

  // Map Sanity posts to note-like structure and sort by date
  $: sortedNotes = [...(posts || [])]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Get all unique tags
  $: allTags = Array.from(
    new Set(sortedNotes.flatMap(note => note.tags || []))
  ).sort();

  let activeTag: string | null = null;
  let activeView: 'list' | 'grid' = 'list';


  function toggleTag(tag: string) {
    activeTag = activeTag === tag ? null : tag;
  }

  $: filteredNotes = activeTag
    ? sortedNotes.filter(note => (note.tags || []).includes(activeTag!))
    : sortedNotes;

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
</script>

<svelte:head>
  <title>Short notes | Technical Opinions & Tutorials</title>
  <meta name="description" content="Atomic notes on WebGPU, graphics programming, and creative technology" />
  <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
  <link rel="alternate" type="application/json" title="JSON Feed" href="/feed.json" />
</svelte:head>

<section {id}>
<article class="notes-page" class:wide-container={activeView === 'grid'}>
  <!-- Page Header - Clear hierarchy -->
  <header class="page-header">
    <div class="header-meta">
      <span class="header-count">{filteredNotes.length} entries</span>
      {#if activeTag}
        <button class="tag-clear" on:click={() => activeTag = null}>
          &times; {activeTag}
        </button>
      {/if}

      <div class="view-toggle">
        <button
          class="toggle-btn"
          class:active={activeView === 'grid'}
          on:click={() => activeView = 'grid'}
          aria-label="Grid view"
        >
          GRID
        </button>
        <button
          class="toggle-btn"
          class:active={activeView === 'list'}
          on:click={() => activeView = 'list'}
          aria-label="List view"
        >
          LIST
        </button>
      </div>
    </div>
    <h1 class="page-title">Short notes</h1>
  </header>

  <!-- Notes List - Clean cards with consistent rhythm -->
  {#if filteredNotes.length === 0}
    <div class="empty-state">
      <p class="empty-message">No notes yet — check back soon.</p>
    </div>
  {:else}
    <section class="notes-list" class:notes-grid={activeView === 'grid'}>
      {#each filteredNotes as note (note.slug || note._id)}
        <a href="/blog/{note.slug}" class="note-card">
          <time class="note-date" datetime={note.publishedAt}>
            {formatDate(note.publishedAt)}
          </time>
          <h2 class="note-title">{note.title}</h2>
          {#if note.excerpt}
            <p class="note-excerpt">{note.excerpt}</p>
          {/if}
          <span class="note-cta">read &rarr;</span>
        </a>
      {/each}
    </section>
  {/if}

  <p class="page-description">
    EXPL. atomic notes on graphics programming, creative technology, and technical opinions.
  </p>

  <!-- Footer - Minimal, functional -->
  <footer class="page-footer">
    {#if allTags.length > 0}
      <nav class="filter-nav" aria-label="Filter by tag">
        <span class="filter-label">Filter:</span>
        <div class="filter-tags">
          {#each allTags as tag}
            <button
              class="filter-tag"
              class:active={activeTag === tag}
              on:click={() => toggleTag(tag)}
            >
              {tag}
            </button>
          {/each}
        </div>
      </nav>
    {/if}

    <div class="subscribe-row">
      <span class="subscribe-label">Subscribe:</span>
      <a href="/feed.xml" class="subscribe-link">RSS</a>
      <span class="subscribe-sep">&middot;</span>
      <a href="/feed.json" class="subscribe-link">JSON</a>
    </div>
  </footer>
</article>
</section>

<style>
  /* === PAGE STRUCTURE === */
  .notes-page {
    max-width: 640px;
    margin: 0 auto;
    padding: var(--space-lg) var(--space-lg);
  }

  /* === PAGE HEADER === */
  .page-header {
    margin-bottom: var(--space-xl);
  }

  .header-meta {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-sm);
  }

  .header-count {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    letter-spacing: var(--letter-spacing-wide);
  }

  .tag-clear {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-accent);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .view-toggle {
    margin-left: auto;
    display: flex;
    gap: var(--space-xs);
  }

  .toggle-btn {
    font-family: var(--font-mono);
    font-size: var(--font-size-2xs);
    color: var(--color-text-subtle);
    color: var(--color-text-subtle);
    background: transparent;
    border: none;
    padding: var(--space-2xs) var(--space-xs);
    cursor: pointer;
    line-height: 1;
    opacity: 0.5;
    transition: opacity var(--duration-fast) var(--easing);
  }

  .toggle-btn.active {
    background: transparent;
    color: var(--color-text);
    opacity: 1;
    border: none;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .toggle-btn:hover:not(.active) {
    color: var(--color-text);
    opacity: 0.8;
    border: none;
  }


  .page-title {
    font-size: var(--font-size-3xl);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
    margin: 0 0 var(--space-md) 0;
    line-height: 1;
  }

  .page-description {
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    line-height: var(--line-height-relaxed);
    max-width: 48ch;
    margin: var(--space-2xl) 0 0 0;
  }

  /* === EMPTY STATE === */
  .empty-state {
    padding: var(--space-3xl) 0;
    text-align: center;
  }

  .empty-message {
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  /* === NOTES LIST === */
  .notes-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .wide-container {
    max-width: 1200px;
  }

  /* Grid Mode */
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    auto-rows: 1fr; /* Force rows to be equal height */
    gap: var(--space-md);
  }

  @media (max-width: 900px) {
    .notes-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .notes-grid {
      grid-template-columns: 1fr;
    }
  }


  .note-card {
    display: block;
    padding: var(--space-lg) 0;
    border-bottom: 1px solid var(--border-color-subtle);
    text-decoration: none;
    color: inherit;
    transition: all var(--duration-fast) var(--easing);
  }

  .note-card:first-child {
    border-top: 1px solid var(--border-color-subtle);
  }

  .note-card:hover {
    padding-left: var(--space-md);
    border-left: 2px solid var(--color-accent);
    margin-left: calc(-1 * var(--space-md) - 2px);
  }

  /* Grid Card Overrides */
  .notes-grid .note-card {
    border: 1px solid var(--border-color-subtle);
    border-radius: var(--radius-md);
    padding: var(--space-xl); /* Generous padding */
    height: auto;
    aspect-ratio: 1 / 1; /* Perfectly square */
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .notes-grid .note-card:hover {
    padding-left: var(--space-xl); /* Match padding on hover */
    border-left: 1px solid var(--border-color-subtle);
    border-color: var(--color-accent);
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .notes-grid .note-card:hover {
    padding-left: var(--space-md);
    border-left: 1px solid var(--border-color-subtle);
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  .notes-grid .note-card .note-excerpt {
    flex-grow: 1; /* Push CTA to bottom */
  }


  .note-date {
    display: block;
    font-family: var(--font-mono);
    font-size: var(--font-size-2xs);
    color: var(--color-text-subtle);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
    margin-bottom: var(--space-xs);
  }

  .note-title {
    font-size: var(--font-size-lg);
    font-weight: 500;
    letter-spacing: var(--letter-spacing-tight);
    line-height: var(--line-height-snug);
    margin: 0 0 var(--space-sm) 0;
    color: var(--color-text);
  }

  .note-card:hover .note-title {
    color: var(--color-accent);
  }

  .note-excerpt {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    line-height: var(--line-height-relaxed);
    margin: 0 0 var(--space-sm) 0;
    max-width: 54ch;
  }

  .note-cta {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-accent);
  }

  /* === FOOTER === */
  .page-footer {
    margin-top: var(--space-2xl);
    padding-top: var(--space-xl);
    border-top: 1px solid var(--border-color-subtle);
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  .filter-nav {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .filter-label {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    padding-top: var(--space-2xs);
  }

  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    flex: 1;
  }

  .filter-tag {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    background: transparent;
    border: 1px solid var(--border-color-subtle);
    padding: var(--space-2xs) var(--space-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
  }

  .filter-tag:hover {
    border-color: var(--color-text-muted);
    color: var(--color-text);
  }

  .filter-tag.active {
    background: var(--color-text);
    color: var(--color-bg);
    border-color: var(--color-text);
  }

  .subscribe-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--font-size-xs);
  }

  .subscribe-label {
    font-family: var(--font-mono);
    color: var(--color-text-subtle);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
  }

  .subscribe-sep {
    color: var(--color-text-subtle);
  }

  .subscribe-link {
    font-family: var(--font-mono);
    color: var(--color-accent);
  }

  /* === MOBILE ADJUSTMENTS === */
  @media (max-width: 600px) {
    .notes-page {
      padding: var(--space-xl) var(--space-md);
    }

    .page-title {
      font-size: var(--font-size-2xl);
    }

    .note-card {
      padding: var(--space-md) 0;
    }

    .note-title {
      font-size: var(--font-size-base);
    }
  }
</style>
