<script lang="ts">
  import { onMount } from 'svelte';

  type Font = 'public' | 'schibsted' | 'source-serif' | 'hybrid' | 'azeret' | 'helvetica' | 'spray' | 'inter';

  const fonts: { id: Font; name: string; category: string; family: string; sample: string }[] = [
    { id: 'inter',        name: 'Inter Global',  category: 'Modern Sans',        family: "'Inter', sans-serif", sample: 'Tight and neutral' },
    { id: 'spray',        name: 'Street Paint',  category: 'Rubik Spray',        family: "'Rubik Spray Paint', system-ui", sample: 'IMAGINE RE-THINK SHIP' },
    { id: 'public',       name: 'Public System', category: 'Familjen + Hanken', family: "'Familjen Grotesk', sans-serif", sample: 'Quiet proof' },
    { id: 'hybrid',       name: 'Editorial Mix', category: 'Literata display',   family: "'Literata', serif", sample: 'Proof with weight' },
    { id: 'source-serif', name: 'Full Serif',    category: 'Literata full text', family: "'Literata', serif", sample: 'Notes become essays' },
    { id: 'azeret',       name: 'Mono Ledger',   category: 'Azeret system',      family: "'Azeret Mono', monospace", sample: 'Route / status / signal' },
  ];

  let currentFont: Font = 'public';
  let isOpen = false;
  let switcherEl: HTMLElement;

  onMount(() => {
    const saved = localStorage.getItem('preferred-font') as Font | null;
    if (saved && fonts.some(f => f.id === saved)) {
      currentFont = saved;
      applyFont(saved, false);
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
        e.preventDefault();
        isOpen = !isOpen;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  function isInputFocused(): boolean {
    const active = document.activeElement;
    return active instanceof HTMLInputElement ||
           active instanceof HTMLTextAreaElement ||
           active?.getAttribute('contenteditable') === 'true';
  }

  function applyFont(font: Font, announce: boolean = true) {
    document.documentElement.setAttribute('data-font', font);
    localStorage.setItem('preferred-font', font);
    currentFont = font;
    if (announce) announceFontChange(font);
  }

  function announceFontChange(font: Font) {
    const fontName = fonts.find(f => f.id === font)?.name || font;
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Font changed to ${fontName}`;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }

  function selectFont(font: Font) {
    applyFont(font);
    isOpen = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') isOpen = false;
  }

  function handleClickOutside(e: MouseEvent) {
    if (isOpen && switcherEl && !switcherEl.contains(e.target as Node)) {
      isOpen = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} on:click={handleClickOutside} />

<div class="font-switcher" bind:this={switcherEl}>
  <button
    class="font-toggle"
    on:click={() => isOpen = !isOpen}
    aria-label="Change font"
    aria-expanded={isOpen}
    title="Font (F)"
  >
    <span class="font-icon">Aa</span>
  </button>

  {#if isOpen}
    <div class="font-dropdown" role="menu">
      <div class="dropdown-header">
        <span class="header-title">Choose Font</span>
        <span class="header-count">{fonts.length} typefaces</span>
      </div>
      <div class="font-grid">
        {#each fonts as font}
          <button
            class="font-cell"
            class:active={currentFont === font.id}
            on:click={() => selectFont(font.id)}
            role="menuitem"
            data-font={font.id}
          >
            <div class="cell-header">
              <span class="cell-name">{font.name}</span>
              {#if currentFont === font.id}
                <span class="cell-check">✓</span>
              {/if}
            </div>
            <span class="cell-category">{font.category}</span>
            <div class="cell-preview" style="font-family: {font.family};">
              {font.sample}
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .font-switcher {
    position: relative;
  }

  .font-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition:
      border-color var(--duration-fast) var(--easing),
      background var(--duration-fast) var(--easing);
  }

  .font-toggle:hover {
    border-color: var(--color-text-muted);
    background: var(--color-surface);
  }

  .font-icon {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-muted);
  }

  .font-dropdown {
    position: absolute;
    bottom: calc(100% + var(--space-xs));
    right: 0;
    width: 420px;
    background: var(--color-surface);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: var(--space-sm);
    z-index: 100;
    animation: dropdown-in var(--duration-fast) var(--easing-out);
  }

  @keyframes dropdown-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: var(--space-xs) var(--space-sm);
    margin-bottom: var(--space-sm);
    border-bottom: var(--border-width) solid var(--border-color-subtle);
  }

  .header-title {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
  }

  .header-count {
    font-family: var(--font-mono);
    font-size: var(--font-size-2xs);
    color: var(--color-text-subtle);
  }

  .font-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .font-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--space-sm);
    background: var(--color-bg-alt);
    border: 1.5px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: left;
    transition:
      border-color var(--duration-fast) var(--easing),
      background var(--duration-fast) var(--easing);
  }

  .font-cell:hover {
    background: var(--color-surface);
    border-color: var(--border-color);
  }

  .font-cell.active {
    border-color: var(--color-accent);
    background: var(--color-surface);
  }

  .cell-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 1.2em;
  }

  .cell-name {
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cell-check {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-accent);
    flex-shrink: 0;
  }

  .cell-category {
    font-family: var(--font-mono);
    font-size: var(--font-size-2xs, 0.75rem);
    color: var(--color-text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .cell-preview {
    font-size: 15px;
    color: var(--color-text);
    padding: var(--space-xs) 0;
    line-height: 1.2;
  }

  @media (max-width: 640px) {
    .font-dropdown {
      width: min(22rem, calc(100vw - 2rem));
      right: -0.25rem;
    }

    .font-grid {
      grid-template-columns: 1fr;
    }
  }

  :global(.sr-only) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
