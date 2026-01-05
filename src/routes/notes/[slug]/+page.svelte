<script lang="ts">
  import { page } from '$app/stores';
  import { notesWithBacklinks, type Note } from '$lib/data/notes';

  // Get the current note based on the slug
  $: slug = $page.params.slug;
  $: note = notesWithBacklinks.find(n => n.slug === slug);
  $: relatedNotes = note?.backlinks?.map(s => notesWithBacklinks.find(n => n.slug === s)).filter(Boolean) as Note[] || [];

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Simple markdown renderer for demo purposes
  // In production, use a proper markdown parser
  function renderMarkdown(content: string): string {
    if (!content) return '';
    
    return content
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      // Code blocks with language
      .replace(/```(\w+)\n([\s\S]*?)```/g, '<pre class="code-block" data-lang="$1"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // Wiki links
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '<a href="/notes/$1" class="wiki-link">$2</a>')
      .replace(/\[\[([^\]]+)\]\]/g, '<a href="/notes/$1" class="wiki-link">$1</a>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Paragraphs (simple)
      .split('\n\n')
      .map(p => {
        if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<li')) return p;
        if (p.trim() === '') return '';
        return `<p>${p.replace(/\n/g, ' ')}</p>`;
      })
      .join('\n');
  }
</script>

<svelte:head>
  {#if note}
    <title>{note.title}</title>
    <meta name="description" content={note.excerpt} />
    <meta property="og:title" content={note.title} />
    <meta property="og:description" content={note.excerpt} />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content={note.date} />
  {:else}
    <title>Note not found</title>
  {/if}
</svelte:head>

{#if note}
  <article class="note-article">
    <!-- Header -->
    <header class="note-header">
      <nav class="note-breadcrumb">
        <a href="/notes">← back to notes</a>
      </nav>
      
      <time class="note-date" datetime={note.date}>
        {formatDate(note.date)}
      </time>
      
      <h1 class="note-title">{note.title}</h1>
      
      <p class="note-excerpt">{note.excerpt}</p>
      
      <div class="note-tags">
        {#each note.tags as tag}
          <a href="/notes?tag={tag}" class="note-tag">#{tag}</a>
        {/each}
      </div>
    </header>

    <!-- Content -->
    <div class="note-content">
      {@html renderMarkdown(note.content)}
    </div>

    <!-- Related Notes (Bidirectional Links) -->
    {#if relatedNotes.length > 0}
      <aside class="related-notes">
        <h2 class="related-title">◆ CONNECTED NOTES</h2>
        <ul class="related-list">
          {#each relatedNotes as related}
            <li class="related-item">
              <a href="/notes/{related.slug}" class="related-link">
                <span class="related-arrow">⟷</span>
                <span class="related-name">{related.title}</span>
              </a>
              <time class="related-date">{new Date(related.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</time>
            </li>
          {/each}
        </ul>
      </aside>
    {/if}

    <!-- Footer -->
    <footer class="note-footer">
      <div class="footer-meta">
        <span class="footer-label">Last updated:</span>
        <time datetime={note.date}>{formatDate(note.date)}</time>
      </div>
      <div class="footer-actions">
        <a href="/notes" class="footer-link">← all notes</a>
        <span class="footer-separator">│</span>
        <a href="#top" class="footer-link">↑ top</a>
      </div>
    </footer>
  </article>
{:else}
  <div class="note-not-found">
    <h1>Note not found</h1>
    <p>The note "{slug}" doesn't exist.</p>
    <a href="/notes">← back to notes</a>
  </div>
{/if}

<style>
  .note-article {
    max-width: 720px;
    margin: 0 auto;
  }

  /* Header */
  .note-header {
    margin-bottom: var(--space-2xl);
    padding-bottom: var(--space-xl);
    border-bottom: 2px solid var(--border-color);
  }

  .note-breadcrumb {
    margin-bottom: var(--space-lg);
  }

  .note-breadcrumb a {
    font-size: var(--font-size-sm);
    color: var(--color-text-subtle);
  }

  .note-breadcrumb a:hover {
    color: var(--color-accent);
  }

  .note-date {
    display: block;
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    margin-bottom: var(--space-sm);
    font-variant-numeric: tabular-nums;
  }

  .note-title {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
    line-height: var(--line-height-tight);
    margin-bottom: var(--space-md);
  }

  .note-excerpt {
    font-size: var(--font-size-lg);
    color: var(--color-text-muted);
    line-height: var(--line-height-normal);
    margin-bottom: var(--space-lg);
  }

  .note-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .note-tag {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    background: var(--color-surface);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
  }

  .note-tag:hover {
    color: var(--color-accent);
  }

  /* Content */
  .note-content {
    line-height: var(--line-height-loose);
  }

  .note-content :global(h2) {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-top: var(--space-2xl);
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-sm);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .note-content :global(h3) {
    font-size: var(--font-size-lg);
    font-weight: 500;
    margin-top: var(--space-xl);
    margin-bottom: var(--space-sm);
  }

  .note-content :global(p) {
    margin-bottom: var(--space-md);
    color: var(--color-text);
  }

  .note-content :global(li) {
    margin-bottom: var(--space-xs);
    padding-left: var(--space-md);
    position: relative;
  }

  .note-content :global(li)::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--color-text-subtle);
  }

  .note-content :global(.code-block) {
    background: var(--color-surface);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    margin: var(--space-lg) 0;
    overflow-x: auto;
    font-size: var(--font-size-sm);
  }

  .note-content :global(.code-block code) {
    background: transparent;
    padding: 0;
  }

  .note-content :global(.inline-code) {
    background: var(--color-surface);
    padding: 2px var(--space-xs);
    border-radius: var(--radius-sm);
    font-size: 0.9em;
    color: var(--color-accent);
  }

  .note-content :global(.wiki-link) {
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 3px;
  }

  .note-content :global(.wiki-link:hover) {
    text-decoration-style: solid;
  }

  /* Related Notes */
  .related-notes {
    margin-top: var(--space-2xl);
    padding: var(--space-lg);
    background: var(--color-surface);
    border-radius: var(--radius-md);
  }

  .related-title {
    font-size: var(--font-size-xs);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    color: var(--color-text-subtle);
    margin-bottom: var(--space-md);
  }

  .related-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .related-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) 0;
  }

  .related-link {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--color-text);
    font-size: var(--font-size-sm);
  }

  .related-link:hover {
    color: var(--color-accent);
  }

  .related-arrow {
    color: var(--color-accent);
    font-size: var(--font-size-xs);
  }

  .related-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  /* Footer */
  .note-footer {
    margin-top: var(--space-2xl);
    padding-top: var(--space-lg);
    border-top: var(--border-width) solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .footer-meta {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  .footer-label {
    margin-right: var(--space-xs);
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--font-size-xs);
  }

  .footer-link {
    color: var(--color-accent);
  }

  .footer-separator {
    color: var(--color-text-subtle);
  }

  /* Not Found */
  .note-not-found {
    text-align: center;
    padding: var(--space-2xl);
  }

  .note-not-found h1 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-md);
  }

  .note-not-found p {
    color: var(--color-text-muted);
    margin-bottom: var(--space-lg);
  }

  .note-not-found a {
    color: var(--color-accent);
  }
</style>
