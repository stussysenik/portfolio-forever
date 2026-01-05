<script lang="ts">
  import type { PageData } from './$types';
  import type { SanityPost } from '$lib/sanity/types';

  export let data: PageData;

  // Map Sanity posts to note-like structure and sort by date
  $: sortedNotes = [...(data.posts || [])]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Get all unique tags
  $: allTags = Array.from(
    new Set(sortedNotes.flatMap(note => note.tags || []))
  ).sort();

  let activeTag: string | null = null;

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
  <title>Notes | Technical Opinions & Tutorials</title>
  <meta name="description" content="Atomic notes on WebGPU, graphics programming, and creative technology" />
  <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
  <link rel="alternate" type="application/json" title="JSON Feed" href="/feed.json" />
</svelte:head>

<div class="notes-container">
  <!-- Header -->
  <header class="notes-header">
    <div class="notes-title-row">
      <h1 class="notes-title">Notes</h1>
      <span class="notes-count">({filteredNotes.length})</span>
    </div>
    <p class="notes-description">
      Atomic notes on graphics programming, creative technology, and technical opinions.
      <span class="notes-subtitle">Wiki-style with bidirectional linking.</span>
    </p>
  </header>

  <!-- Notes List -->
  <ul class="notes-list">
    {#each filteredNotes as note (note.slug || note._id)}
      <li class="note-card">
        <article>
          <header class="note-header">
            <time class="note-date" datetime={note.publishedAt}>
              {formatDate(note.publishedAt)}
            </time>
          </header>
          
          <a href="/notes/{note.slug}" class="note-title-link">
            <h2 class="note-title">{note.title}</h2>
          </a>
          
          {#if note.excerpt}
            <p class="note-excerpt">{note.excerpt}</p>
          {/if}
          
          <footer class="note-footer">
            {#if note.tags && note.tags.length > 0}
              <div class="note-tags">
                {#each note.tags as tag}
                  <button
                    class="note-tag"
                    class:active={activeTag === tag}
                    onclick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </button>
                {/each}
              </div>
            {/if}
            
            <a href="/notes/{note.slug}" class="note-read-more">
              read →
            </a>
          </footer>
        </article>
      </li>
    {/each}
  </ul>

  <!-- Tag Filter (Moved to bottom) -->
  <div class="filter-section">
      <nav class="tags-nav" aria-label="Filter by tag">
        <span class="tags-label">◆ FILTER:</span>
        <div class="tags-list">
          {#each allTags as tag}
            <button
              class="tag-button"
              class:active={activeTag === tag}
              onclick={() => toggleTag(tag)}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          {/each}
        </div>
        {#if activeTag}
          <button class="tag-clear" onclick={() => activeTag = null}>
            ✕ clear
          </button>
        {/if}
      </nav>
  </div>
  
  <!-- Feed Links -->
  <footer class="notes-footer">
    <span class="footer-label">Subscribe:</span>
    <a href="/feed.xml" class="feed-link">RSS</a>
    <span class="footer-separator">│</span>
    <a href="/feed.json" class="feed-link">JSON Feed</a>
  </footer>
</div>

<style>
  .notes-container {
    max-width: 800px;
    margin: 0 auto;
  }

  /* Header */
  .notes-header {
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-lg);
    border-bottom: 2px solid var(--border-color);
  }

  .notes-title-row {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    margin-bottom: var(--space-xs);
  }

  .notes-title {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
  }

  .notes-count {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .notes-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    max-width: 60ch;
  }

  .notes-subtitle {
    color: var(--color-text-subtle);
    font-size: var(--font-size-xs);
  }

  /* Tags Navigation */
  .tags-nav {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-top: var(--space-2xl);
    padding: var(--space-md);
    background: var(--color-surface);
    border-radius: var(--radius-md);
  }

  .tags-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    flex: 1;
  }

  .tag-button {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    background: transparent;
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
  }

  .tag-button:hover {
    color: var(--color-text);
    border-color: var(--color-text-muted);
  }

  .tag-button.active {
    color: var(--color-bg);
    background: var(--color-text);
    border-color: var(--color-text);
  }

  .tag-clear {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-accent);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--space-xs);
  }

  .tag-clear:hover {
    text-decoration: underline;
  }

  /* Notes List */
  .notes-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .note-card {
    padding: var(--space-lg);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    border: var(--border-width) solid transparent;
    transition: border-color var(--duration-fast) var(--easing);
  }

  .note-card:hover {
    border-color: var(--border-color);
  }

  .note-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-sm);
  }

  .note-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    font-variant-numeric: tabular-nums;
  }

  .note-links-count {
    font-size: var(--font-size-xs);
    color: var(--color-accent);
  }

  .note-title-link {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .note-title {
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: var(--space-sm);
    line-height: var(--line-height-tight);
  }

  .note-title-link:hover .note-title {
    color: var(--color-accent);
  }

  .note-excerpt {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    line-height: var(--line-height-normal);
    margin-bottom: var(--space-md);
  }

  .note-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .note-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .note-tag {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color var(--duration-fast) var(--easing);
  }

  .note-tag:hover,
  .note-tag.active {
    color: var(--color-accent);
  }

  .note-read-more {
    font-size: var(--font-size-xs);
    color: var(--color-accent);
  }

  /* Footer */
  .notes-footer {
    margin-top: var(--space-2xl);
    padding-top: var(--space-lg);
    border-top: var(--border-width) solid var(--border-color);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--font-size-xs);
  }

  .footer-label {
    color: var(--color-text-subtle);
  }

  .footer-separator {
    color: var(--color-text-subtle);
  }

  .feed-link {
    color: var(--color-accent);
  }
</style>
