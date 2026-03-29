<script lang="ts">
  // Minor things - little lists of life's moments
  export let id = "minor";

  interface ListItem {
    text: string;
    year?: number;
    note?: string;
  }

  interface MinorList {
    id: string;
    title: string;
    emoji: string;
    description: string;
    items: ListItem[];
  }

  const minorLists: MinorList[] = [
    {
      id: 'lost',
      title: "Things I've Lost",
      emoji: '🔍',
      description: 'Objects that slipped away',
      items: [
        { text: 'My favorite pen from 2019', year: 2019, note: 'Still mourning' },
        { text: 'A single AirPod (left)', year: 2022 },
        { text: 'That book I was almost done reading', year: 2023 },
        { text: 'My sense of direction in IKEA', note: 'Repeatedly' },
        { text: 'Several umbrellas', note: 'I stopped counting' },
        { text: 'A really good idea I had at 3am', year: 2024 },
      ],
    },
    {
      id: 'broken',
      title: "Things I've Broken",
      emoji: '💔',
      description: 'Victims of my presence',
      items: [
        { text: 'My phone screen (3 times)', note: 'Same corner each time' },
        { text: 'A vintage coffee mug', year: 2021, note: 'RIP' },
        { text: 'The office printer', year: 2023, note: 'It was already struggling' },
        { text: 'Several promises to go to bed early' },
        { text: 'The fourth wall', note: 'Right now' },
        { text: 'A personal record for procrastination', year: 2024 },
      ],
    },
    {
      id: 'learned',
      title: "Things I've Learned (The Hard Way)",
      emoji: '📚',
      description: 'Wisdom earned, not given',
      items: [
        { text: "Coffee doesn't replace sleep", note: 'Still trying though' },
        { text: 'Always read the error message first', year: 2020 },
        { text: `That backup you skipped? You'll need it`, year: 2022 },
        { text: '"5 more minutes" is always a lie' },
        { text: 'The deployment on Friday rule exists for a reason', year: 2023 },
        { text: 'Sometimes the bug IS the feature', year: 2024 },
      ],
    },
    {
      id: 'overrated',
      title: 'Things That Are Overrated',
      emoji: '😒',
      description: 'Hot takes served cold',
      items: [
        { text: 'Reply-all emails' },
        { text: '"Quick sync" meetings that last an hour' },
        { text: 'Motivational posters in open offices' },
        { text: 'The word "synergy"' },
        { text: 'Microwaved pizza', note: 'Fight me' },
        { text: 'Monday productivity', note: 'A myth' },
      ],
    },
    {
      id: 'underrated',
      title: 'Things That Are Underrated',
      emoji: '✨',
      description: 'Deserves more recognition',
      items: [
        { text: 'Silence in conversations' },
        { text: 'The undo button', note: 'Ctrl+Z supremacy' },
        { text: 'Leaving a party early' },
        { text: 'Reading documentation first', note: 'Nobody does it' },
        { text: 'A good night\'s sleep', year: 2024, note: 'Rare but real' },
        { text: 'The mute button in meetings' },
      ],
    },
    {
      id: 'confused',
      title: 'Things That Still Confuse Me',
      emoji: '🤔',
      description: 'Eternal mysteries',
      items: [
        { text: 'CSS vertical centering', note: 'Before flexbox' },
        { text: 'Time zones' },
        { text: 'Why printers sense fear' },
        { text: 'The rules of cricket' },
        { text: 'Where all my socks go' },
        { text: 'Why I have 47 browser tabs open' },
      ],
    },
  ];

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
