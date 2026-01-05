<script lang="ts">
  import { onMount } from 'svelte';

  // Scratchpad content - persisted to localStorage
  let scratchpadContent = '';
  let lastSaved = '';
  let isSaving = false;

  // Fun random generators
  let randomColor = '#8877ff';
  let diceRoll = 0;
  let coinFlip = '';
  let magicBall = '';
  let wordCount = 0;

  const magic8Ball = [
    'It is certain.',
    'Without a doubt.',
    'You may rely on it.',
    'Yes definitely.',
    'It is decidedly so.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
    'Absolutely not.',
  ];

  onMount(() => {
    // Load from localStorage
    const saved = localStorage.getItem('scratchpad-content');
    if (saved) {
      scratchpadContent = saved;
      updateWordCount();
    }
    const savedTime = localStorage.getItem('scratchpad-saved');
    if (savedTime) {
      lastSaved = new Date(savedTime).toLocaleString();
    }
  });

  function updateWordCount() {
    const text = scratchpadContent.trim();
    wordCount = text ? text.split(/\s+/).length : 0;
  }

  function saveScratchpad() {
    isSaving = true;
    localStorage.setItem('scratchpad-content', scratchpadContent);
    const now = new Date();
    localStorage.setItem('scratchpad-saved', now.toISOString());
    lastSaved = now.toLocaleString();
    updateWordCount();
    setTimeout(() => (isSaving = false), 500);
  }

  function clearScratchpad() {
    if (confirm('Clear everything? This cannot be undone.')) {
      scratchpadContent = '';
      localStorage.removeItem('scratchpad-content');
      localStorage.removeItem('scratchpad-saved');
      lastSaved = '';
      wordCount = 0;
    }
  }

  function rollDice() {
    diceRoll = Math.floor(Math.random() * 6) + 1;
  }

  function flipCoin() {
    coinFlip = Math.random() < 0.5 ? 'HEADS' : 'TAILS';
  }

  function askMagicBall() {
    magicBall = magic8Ball[Math.floor(Math.random() * magic8Ball.length)];
  }

  function generateColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.floor(Math.random() * 30);
    const l = 50 + Math.floor(Math.random() * 20);
    randomColor = `hsl(${h}, ${s}%, ${l}%)`;
  }

  // Auto-save on typing (debounced)
  let saveTimeout: ReturnType<typeof setTimeout>;
  function handleInput() {
    clearTimeout(saveTimeout);
    updateWordCount();
    saveTimeout = setTimeout(saveScratchpad, 1000);
  }
</script>

<svelte:head>
  <title>Scratchpad | Creative Chaos</title>
  <meta name="description" content="A digital scratchpad for thoughts, doodles, and random shenanigans" />
</svelte:head>

<div class="scratchpad-container">
  <header class="scratch-header">
    <div class="scratch-title-group">
      <h1 class="scratch-title">◇ SCRATCHPAD</h1>
      <span class="scratch-subtitle">for random shenanigans</span>
    </div>
    <div class="scratch-meta">
      {#if lastSaved}
        <span class="save-status" class:saving={isSaving}>
          {isSaving ? '● Saving...' : `Last saved: ${lastSaved}`}
        </span>
      {:else}
        <span class="save-status unsaved">● Not saved yet</span>
      {/if}
    </div>
  </header>

  <!-- Main Scratchpad Area -->
  <section class="scratch-main">
    <div class="scratch-toolbar">
      <span class="word-count">{wordCount} words</span>
      <div class="toolbar-actions">
        <button class="toolbar-btn" on:click={saveScratchpad} title="Save now">
          ↓ save
        </button>
        <button class="toolbar-btn danger" on:click={clearScratchpad} title="Clear all">
          ✕ clear
        </button>
      </div>
    </div>
    <textarea
      class="scratch-textarea"
      bind:value={scratchpadContent}
      on:input={handleInput}
      placeholder="Type anything... thoughts, ideas, todo lists, random words, whatever comes to mind.

This is your space. No rules. No structure. Just vibes.

Pro tip: Your content auto-saves after 1 second of inactivity."
    ></textarea>
  </section>

  <!-- Fun Tools Section -->
  <section class="toys-section">
    <header class="toys-header">
      <h2 class="toys-title">◆ TOYS</h2>
      <span class="toys-subtitle">because why not</span>
    </header>

    <div class="toys-grid">
      <!-- Dice Roll -->
      <div class="toy-card">
        <span class="toy-label">🎲 Dice</span>
        <div class="toy-result dice-result" class:rolled={diceRoll > 0}>
          {diceRoll || '?'}
        </div>
        <button class="toy-btn" on:click={rollDice}>Roll d6</button>
      </div>

      <!-- Coin Flip -->
      <div class="toy-card">
        <span class="toy-label">🪙 Coin</span>
        <div class="toy-result coin-result" class:flipped={coinFlip !== ''}>
          {coinFlip || '?'}
        </div>
        <button class="toy-btn" on:click={flipCoin}>Flip it</button>
      </div>

      <!-- Magic 8 Ball -->
      <div class="toy-card magic-card">
        <span class="toy-label">🎱 Magic 8-Ball</span>
        <div class="toy-result magic-result" class:answered={magicBall !== ''}>
          "{magicBall || 'Ask me anything...'}"
        </div>
        <button class="toy-btn" on:click={askMagicBall}>Ask</button>
      </div>

      <!-- Color Generator -->
      <div class="toy-card">
        <span class="toy-label">🎨 Random Color</span>
        <div class="toy-result color-result" style="background: {randomColor};">
          {randomColor}
        </div>
        <button class="toy-btn" on:click={generateColor}>Generate</button>
      </div>
    </div>
  </section>

  <!-- Quick Notes List -->
  <section class="quick-notes">
    <header class="notes-header">
      <h2 class="notes-title">◆ QUICK IDEAS</h2>
      <span class="notes-hint">Shift+Enter in textarea to add bullet</span>
    </header>
    <div class="notes-tips">
      <p>Use this scratchpad however you want:</p>
      <ul>
        <li>→ Draft that email you've been avoiding</li>
        <li>→ Write down that song lyric stuck in your head</li>
        <li>→ Make a list of things to argue about later</li>
        <li>→ Calculate how many hours you've wasted this week</li>
        <li>→ Vent about that meeting that could've been an email</li>
        <li>→ Draw ASCII art (it's 2026, retro is cool)</li>
      </ul>
    </div>
  </section>
</div>

<style>
  .scratchpad-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    max-width: 1000px;
    margin: 0 auto;
    padding-bottom: var(--space-2xl);
  }

  /* Header */
  .scratch-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: var(--space-md);
    padding-bottom: var(--space-md);
    border-bottom: 2px solid var(--border-color);
  }

  .scratch-title-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .scratch-title {
    font-size: var(--font-size-lg);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    color: var(--color-text);
  }

  .scratch-subtitle {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    font-style: italic;
  }

  .save-status {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .save-status.saving {
    color: hsl(50, 90%, 50%);
  }

  .save-status.unsaved {
    color: var(--color-text-subtle);
  }

  /* Main Textarea Area */
  .scratch-main {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .scratch-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
  }

  .word-count {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    font-variant-numeric: tabular-nums;
  }

  .toolbar-actions {
    display: flex;
    gap: var(--space-sm);
  }

  .toolbar-btn {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    padding: var(--space-xs) var(--space-sm);
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
  }

  .toolbar-btn:hover {
    background: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-text-muted);
  }

  .toolbar-btn.danger:hover {
    color: hsl(0, 70%, 60%);
    border-color: hsl(0, 70%, 60%);
  }

  .scratch-textarea {
    width: 100%;
    min-height: 400px;
    padding: var(--space-md);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-loose);
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    resize: vertical;
    transition: border-color var(--duration-fast) var(--easing);
  }

  .scratch-textarea::placeholder {
    color: var(--color-text-subtle);
    opacity: 0.7;
  }

  .scratch-textarea:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  /* Toys Section */
  .toys-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .toys-header {
    display: flex;
    align-items: baseline;
    gap: var(--space-md);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--border-color);
  }

  .toys-title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    color: var(--color-text-subtle);
  }

  .toys-subtitle {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    font-style: italic;
  }

  .toys-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-md);
  }

  .toy-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--color-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    transition: border-color var(--duration-fast) var(--easing);
  }

  .toy-card:hover {
    border-color: var(--color-text-muted);
  }

  .magic-card {
    grid-column: span 2;
  }

  @media (max-width: 500px) {
    .magic-card {
      grid-column: span 1;
    }
  }

  .toy-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
  }

  .toy-result {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    color: var(--color-text);
    min-height: 2.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .dice-result.rolled {
    animation: pop 0.3s ease-out;
  }

  .coin-result.flipped {
    animation: flip 0.4s ease-out;
  }

  .magic-result {
    font-size: var(--font-size-sm);
    font-weight: 400;
    font-style: italic;
    color: var(--color-text-muted);
    max-width: 300px;
  }

  .magic-result.answered {
    color: var(--color-text);
  }

  .color-result {
    width: 100%;
    height: 60px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .toy-btn {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    padding: var(--space-xs) var(--space-md);
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
  }

  .toy-btn:hover {
    background: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes flip {
    0% {
      transform: rotateX(0);
    }
    50% {
      transform: rotateX(180deg);
    }
    100% {
      transform: rotateX(360deg);
    }
  }

  /* Quick Notes */
  .quick-notes {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    border: 1px dashed var(--border-color);
  }

  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .notes-title {
    font-size: var(--font-size-xs);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    color: var(--color-text-subtle);
  }

  .notes-hint {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    font-style: italic;
  }

  .notes-tips {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .notes-tips p {
    margin-bottom: var(--space-sm);
  }

  .notes-tips ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .notes-tips li {
    color: var(--color-text-subtle);
    transition: color var(--duration-fast) var(--easing);
  }

  .notes-tips li:hover {
    color: var(--color-text);
  }
</style>
