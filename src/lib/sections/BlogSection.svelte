<script lang="ts">
  import { onMount } from 'svelte';
  import { getConvexClient } from '$lib/convex';
  import { setup_blog_subscriptions, sort_posts, get_all_tags, filter_posts_by_tag } from '$lib/clj/portfolio/sections/blog.mjs';
  import { blogPosts as staticPosts } from '$lib/data/content';

  export let id = "blog";

  let posts: any[] = staticPosts;
  let activeTag: string | null = null;
  let activeView: 'list' | 'grid' = 'list';

  $: sortedNotes = sort_posts(posts);
  $: allTags = get_all_tags(posts);
  $: filteredNotes = filter_posts_by_tag(sortedNotes, activeTag);

  function toggleTag(tag: string) {
    activeTag = activeTag === tag ? null : tag;
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  onMount(() => {
    const client = getConvexClient();
    return setup_blog_subscriptions(client, {
      onPosts: (data: any) => {
        if (data) posts = data;
      }
    });
  });
</script>

<svelte:head>
  <title>Short notes | Technical Opinions & Tutorials</title>
  <meta name="description" content="Atomic notes on WebGPU, graphics programming, and creative technology" />
</svelte:head>

<section {id}>
<article class="notes-page" class:wide-container={activeView === 'grid'}>
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
        >
          GRID
        </button>
        <button
          class="toggle-btn"
          class:active={activeView === 'list'}
          on:click={() => activeView = 'list'}
        >
          LIST
        </button>
      </div>
    </div>
    <h1 class="page-title">Short notes</h1>
  </header>

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

  <footer class="page-footer">
    {#if allTags.length > 0}
      <nav class="filter-nav">
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
  </footer>
</article>
</section>

<style>
  .notes-page {
    max-width: 640px;
    margin: 0 auto;
    padding: var(--space-lg) var(--space-lg);
  }
  .wide-container { max-width: 1200px; }
  .page-header { margin-bottom: var(--space-xl); }
  .header-meta { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm); }
  .header-count { font-family: var(--font-mono); font-size: var(--font-size-xs); color: var(--color-text-subtle); }
  .tag-clear { font-family: var(--font-mono); font-size: var(--font-size-xs); color: var(--color-accent); background: transparent; border: none; cursor: pointer; }
  .view-toggle { margin-left: auto; display: flex; gap: var(--space-xs); }
  .toggle-btn { font-family: var(--font-mono); font-size: var(--font-size-2xs); color: var(--color-text-subtle); background: transparent; border: none; padding: var(--space-2xs) var(--space-xs); cursor: pointer; opacity: 0.5; }
  .toggle-btn.active { color: var(--color-text); opacity: 1; text-decoration: underline; text-underline-offset: 4px; }
  .page-title { font-size: var(--font-size-3xl); font-weight: 600; margin: 0 0 var(--space-md) 0; }
  .page-description { font-family: var(--font-mono); font-size: var(--font-size-sm); color: var(--color-text-muted); margin: var(--space-2xl) 0 0 0; }
  .notes-list { display: flex; flex-direction: column; gap: var(--space-lg); }
  .notes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); }
  @media (max-width: 900px) { .notes-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .notes-grid { grid-template-columns: 1fr; } }
  .note-card { display: block; padding: var(--space-lg) 0; border-bottom: 1px solid var(--border-color-subtle); text-decoration: none; color: inherit; }
  .note-card:hover { border-left: 2px solid var(--color-accent); padding-left: var(--space-sm); }
  .notes-grid .note-card { border: 1px solid var(--border-color-subtle); border-radius: var(--radius-md); padding: var(--space-xl); aspect-ratio: 1/1; }
  .note-date { display: block; font-family: var(--font-mono); font-size: var(--font-size-2xs); color: var(--color-text-subtle); text-transform: uppercase; }
  .note-title { font-size: var(--font-size-lg); font-weight: 500; color: var(--color-text); }
  .note-excerpt { font-size: var(--font-size-sm); color: var(--color-text-muted); }
  .note-cta { font-family: var(--font-mono); font-size: var(--font-size-xs); color: var(--color-accent); }
  .page-footer { margin-top: var(--space-2xl); padding-top: var(--space-xl); border-top: 1px solid var(--border-color-subtle); }
  .filter-nav { display: flex; gap: var(--space-md); flex-wrap: wrap; }
  .filter-label { font-family: var(--font-mono); font-size: var(--font-size-xs); color: var(--color-text-subtle); }
  .filter-tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); }
  .filter-tag { font-family: var(--font-mono); font-size: var(--font-size-xs); border: 1px solid var(--border-color-subtle); padding: 2px 8px; border-radius: 4px; background: transparent; cursor: pointer; }
  .filter-tag.active { background: var(--color-text); color: var(--color-bg); }
</style>
