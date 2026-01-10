<script lang="ts">
  import type { PageData } from './$types';
  import { PortableText } from '@portabletext/svelte';

  export let data: PageData;

  $: note = data.post;

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function formatShortDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
</script>

<svelte:head>
  {#if note}
    <title>{note.title}</title>
    <meta name="description" content={note.excerpt || ''} />
    <meta property="og:title" content={note.title} />
    <meta property="og:description" content={note.excerpt || ''} />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content={note.publishedAt} />
  {:else}
    <title>Note not found</title>
  {/if}
</svelte:head>

{#if note}
  <article class="note-article">
    <!-- Breadcrumb - Minimal, functional -->
    <nav class="breadcrumb">
      <a href="/notes">← notes</a>
    </nav>

    <!-- Article Header - Clear hierarchy -->
    <header class="article-header">
      <time class="article-date" datetime={note.publishedAt}>
        {formatDate(note.publishedAt)}
      </time>
      <h1 class="article-title">{note.title}</h1>
      {#if note.tags && note.tags.length > 0}
        <div class="article-tags">
          {#each note.tags as tag}
            <a href="/notes?tag={tag}" class="article-tag">#{tag}</a>
          {/each}
        </div>
      {/if}
    </header>

    <!-- Article Content - Optimal reading width, proper rhythm -->
    <div class="article-content">
      {#if note.body}
        <PortableText value={note.body} />
      {:else}
        <p class="no-content">No content yet.</p>
      {/if}
    </div>

    <!-- Article Footer - Clear separation -->
    <footer class="article-footer">
      <div class="footer-nav">
        <a href="/notes" class="footer-link">← all notes</a>
        <span class="footer-sep">·</span>
        <a href="#top" class="footer-link">↑ top</a>
      </div>
    </footer>
  </article>
{:else}
  <div class="not-found">
    <h1>Note not found</h1>
    <p>This note doesn't exist.</p>
    <a href="/notes">← back to notes</a>
  </div>
{/if}

<style>
  /* === ARTICLE STRUCTURE === */
  .note-article {
    max-width: 640px;
    margin: 0 auto;
    padding: var(--space-xl) var(--space-lg) var(--space-4xl);
  }

  /* === BREADCRUMB === */
  .breadcrumb {
    margin-bottom: var(--space-2xl);
  }

  .breadcrumb a {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    text-decoration: none;
    letter-spacing: var(--letter-spacing-wide);
  }

  .breadcrumb a:hover {
    color: var(--color-accent);
  }

  /* === ARTICLE HEADER === */
  .article-header {
    margin-bottom: var(--space-3xl);
    padding-bottom: var(--space-2xl);
    border-bottom: 1px solid var(--border-color-subtle);
  }

  .article-date {
    display: block;
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    letter-spacing: var(--letter-spacing-wide);
    margin-bottom: var(--space-md);
  }

  .article-title {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
    line-height: var(--line-height-tight);
    margin: 0 0 var(--space-lg) 0;
    color: var(--color-text);
  }

  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .article-tag {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    text-decoration: none;
  }

  .article-tag:hover {
    color: var(--color-accent);
  }

  /* === ARTICLE CONTENT === */
  .article-content {
    font-size: var(--font-size-base);
    line-height: var(--line-height-loose);
    color: var(--color-text);
  }

  /* Prose styling */
  .article-content :global(h2) {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: var(--space-3xl) 0 var(--space-lg) 0;
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--border-color-subtle);
    letter-spacing: var(--letter-spacing-tight);
  }

  .article-content :global(h3) {
    font-size: var(--font-size-lg);
    font-weight: 500;
    margin: var(--space-2xl) 0 var(--space-md) 0;
  }

  .article-content :global(p) {
    margin: 0 0 var(--space-lg) 0;
    max-width: 60ch;
  }

  .article-content :global(ul),
  .article-content :global(ol) {
    margin: 0 0 var(--space-lg) 0;
    padding-left: var(--space-lg);
  }

  .article-content :global(li) {
    margin-bottom: var(--space-sm);
    padding-left: var(--space-xs);
  }

  .article-content :global(li)::marker {
    color: var(--color-text-subtle);
  }

  .article-content :global(blockquote) {
    margin: var(--space-xl) 0;
    padding-left: var(--space-lg);
    border-left: 2px solid var(--color-accent);
    font-style: italic;
    color: var(--color-text-muted);
  }

  .article-content :global(code) {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--color-surface);
    padding: 2px var(--space-xs);
    border-radius: var(--radius-sm);
    color: var(--color-accent);
  }

  .article-content :global(pre) {
    background: var(--color-surface);
    border: 1px solid var(--border-color-subtle);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    margin: var(--space-xl) 0;
    overflow-x: auto;
    font-size: var(--font-size-sm);
  }

  .article-content :global(pre code) {
    background: transparent;
    padding: 0;
  }

  .article-content :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .article-content :global(a:hover) {
    text-decoration-thickness: 2px;
  }

  .no-content {
    color: var(--color-text-muted);
    font-style: italic;
  }

  /* === ARTICLE FOOTER === */
  .article-footer {
    margin-top: var(--space-4xl);
    padding-top: var(--space-xl);
    border-top: 1px solid var(--border-color-subtle);
  }

  .footer-nav {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .footer-link {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-accent);
    text-decoration: none;
  }

  .footer-link:hover {
    text-decoration: underline;
  }

  .footer-sep {
    color: var(--color-text-subtle);
  }

  /* === NOT FOUND === */
  .not-found {
    max-width: 640px;
    margin: 0 auto;
    padding: var(--space-4xl) var(--space-lg);
    text-align: center;
  }

  .not-found h1 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-md);
  }

  .not-found p {
    color: var(--color-text-muted);
    margin-bottom: var(--space-lg);
  }

  .not-found a {
    color: var(--color-accent);
  }

  /* === MOBILE === */
  @media (max-width: 600px) {
    .note-article {
      padding: var(--space-lg) var(--space-md) var(--space-3xl);
    }

    .article-title {
      font-size: var(--font-size-xl);
    }

    .article-content {
      font-size: var(--font-size-sm);
    }

    .article-content :global(h2) {
      font-size: var(--font-size-lg);
    }

    .article-content :global(h3) {
      font-size: var(--font-size-base);
    }
  }
</style>
