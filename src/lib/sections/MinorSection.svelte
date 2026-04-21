<script lang="ts">
  // Minor things - little lists of life's moments
  import { onMount } from 'svelte';
  import { getConvexClient } from '$lib/convex';
  import { setupMinorSubscriptions } from '$lib/sections/minor-logic';

  export let id = "minor";

  interface MinorList {
    id: string;
    title: string;
    emoji: string;
    description: string;
    items: { text: string; year?: number; note?: string }[];
  }

  let minorLists: MinorList[] = [];

  onMount(() => {
    const client = getConvexClient();
    return setupMinorSubscriptions(client, {
      onMinor: (data: any) => {
        if (data) {
          // Group flat rows by category
          const grouped: Record<string, MinorList> = {};
          for (const row of data) {
            const key = row.category ?? row.id ?? 'misc';
            if (!grouped[key]) {
              grouped[key] = {
                id: key,
                title: row.categoryTitle ?? row.category ?? key,
                emoji: row.emoji ?? '◇',
                description: row.description ?? '',
                items: [],
              };
            }
            grouped[key].items.push({ text: row.text, year: row.year, note: row.note });
          }
          minorLists = Object.values(grouped);
        }
      }
    });
  });

  let expandedList: string | null = null;

  function toggleList(listId: string) {
    expandedList = expandedList === listId ? null : listId;
  }
</script>

<svelte:head>
  <title>Minor | The Little Things</title>
  <meta name="description" content="A collection of minor lists - things lost, broken, learned, and pondered" />
</svelte:head>

<div class="minor-container" {id}>
  <header class="minor-header">
    <div class="header-main">
      <h1 class="minor-title">◇ MINOR</h1>
      <p class="minor-subtitle">The little things that make a life</p>
    </div>
    <p class="minor-description">
      Not everything needs to be monumental. Some things are just... lists.
      Little inventories of moments, mistakes, and musings.
    </p>
  </header>

  <div class="lists-container">
    {#each minorLists as list (list.id)}
      <section class="list-card" class:expanded={expandedList === list.id}>
        <button
          class="list-header-btn"
          on:click={() => toggleList(list.id)}
          aria-expanded={expandedList === list.id}
        >
          <div class="list-header-content">
            <span class="list-emoji">{list.emoji}</span>
            <div class="list-title-group">
              <h2 class="list-title">{list.title}</h2>
              <span class="list-description">{list.description}</span>
            </div>
          </div>
          <div class="list-meta">
            <span class="list-count">{list.items.length}</span>
            <span class="list-toggle">{expandedList === list.id ? '−' : '+'}</span>
          </div>
        </button>

        {#if expandedList === list.id}
          <ul class="list-items">
            {#each list.items as item, i}
              <li class="list-item" style="--item-delay: {i * 0.05}s">
                <span class="item-bullet">→</span>
                <span class="item-text">{item.text}</span>
                {#if item.year}
                  <span class="item-year">{item.year}</span>
                {/if}
                {#if item.note}
                  <span class="item-note">({item.note})</span>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
      </section>
    {/each}
  </div>

  <footer class="minor-footer">
    <p class="footer-note">
      ◆ Lists are personal. These are placeholders—add your own.
    </p>
  </footer>
</div>

<style>
  .minor-container {
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: var(--space-2xl);
  }

  /* Header */
  .minor-header {
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-lg);
    border-bottom: 2px solid var(--border-color);
  }

  .header-main {
    display: flex;
    align-items: baseline;
    gap: var(--space-lg);
    margin-bottom: var(--space-md);
    flex-wrap: wrap;
  }

  .minor-title {
    font-size: var(--font-size-xl);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    color: var(--color-text);
  }

  .minor-subtitle {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    font-style: italic;
  }

  .minor-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-subtle);
    line-height: var(--line-height-loose);
    max-width: 60ch;
  }

  /* Lists Container */
  .lists-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  /* List Card */
  .list-card {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: border-color var(--duration-fast) var(--easing);
  }

  .list-card:hover {
    border-color: var(--color-text-muted);
  }

  .list-card.expanded {
    border-color: var(--color-accent);
  }

  .list-header-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    background: var(--color-surface);
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: background var(--duration-fast) var(--easing);
  }

  .list-header-btn:hover {
    background: var(--color-bg);
  }

  .list-header-content {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .list-emoji {
    font-size: var(--font-size-lg);
    line-height: 1;
  }

  .list-title-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .list-title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text);
    margin: 0;
  }

  .list-description {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  .list-meta {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .list-count {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    background: var(--color-bg);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-variant-numeric: tabular-nums;
  }

  .list-toggle {
    font-size: var(--font-size-lg);
    color: var(--color-text-muted);
    width: 1.5em;
    text-align: center;
  }

  /* List Items */
  .list-items {
    list-style: none;
    padding: var(--space-sm) var(--space-md) var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    border-top: 1px solid var(--border-color);
  }

  .list-item {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    padding: var(--space-xs) 0;
    font-size: var(--font-size-sm);
    animation: slideIn 0.2s ease-out backwards;
    animation-delay: var(--item-delay);
  }

  .item-bullet {
    color: var(--color-text-subtle);
    flex-shrink: 0;
  }

  .item-text {
    color: var(--color-text);
    flex: 1;
  }

  .item-year {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    font-variant-numeric: tabular-nums;
    background: var(--color-surface);
    padding: 0 var(--space-xs);
    border-radius: var(--radius-sm);
  }

  .item-note {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    font-style: italic;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Footer */
  .minor-footer {
    margin-top: var(--space-2xl);
    padding-top: var(--space-lg);
    border-top: 1px dashed var(--border-color);
  }

  .footer-note {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    text-align: center;
    font-style: italic;
  }

  /* Mobile */
  @media (max-width: 600px) {
    .header-main {
      flex-direction: column;
      gap: var(--space-xs);
    }

    .list-header-content {
      gap: var(--space-sm);
    }

    .list-item {
      flex-wrap: wrap;
    }

    .item-note {
      width: 100%;
      padding-left: calc(var(--space-sm) + 1.5em);
    }
  }
</style>
