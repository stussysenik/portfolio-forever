<script lang="ts">
  import { onMount } from 'svelte';

  type Font = 'inter' | 'crimson' | 'jetbrains' | 'fira' | 'space';

  const fonts: { id: Font; name: string; category: string; preview: string }[] = [
    { id: 'inter', name: 'Inter', category: 'Sans-serif', preview: 'The quick brown fox' },
    { id: 'crimson', name: 'Crimson Pro', category: 'Serif', preview: 'The quick brown fox' },
    { id: 'jetbrains', name: 'JetBrains Mono', category: 'Monospace', preview: 'The quick brown fox' },
    { id: 'fira', name: 'Fira Code', category: 'Monospace', preview: 'The quick brown fox' },
    { id: 'space', name: 'Space Grotesk', category: 'Display', preview: 'The quick brown fox' },
  ];

  let currentFont: Font = 'inter';
  let isOpen = false;

  onMount(() => {
    // Load saved font preference
    const saved = localStorage.getItem('preferred-font') as Font | null;
    if (saved && fonts.some(f => f.id === saved)) {
      currentFont = saved;
      applyFont(saved, false); // Don't announce on initial load
    }

    // Listen for keyboard shortcut
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

    // Screen reader announcement
    if (announce) {
      announceFontChange(font);
    }
  }

  function announceFontChange(font: Font) {
    const fontName = fonts.find(f => f.id === font)?.name || font;
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Font changed to ${fontName}`;
    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => announcement.remove(), 1000);
  }

  function selectFont(font: Font) {
    applyFont(font);
    isOpen = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      isOpen = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="font-switcher">
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
      </div>
      {#each fonts as font}
        <button
          class="font-option"
          class:active={currentFont === font.id}
          on:click={() => selectFont(font.id)}
          role="menuitem"
          data-font-preview={font.id}
        >
          <div class="option-content">
            <span class="option-name">{font.name}</span>
            <span class="option-category">{font.category}</span>
          </div>
          <div class="option-preview" style="font-family: var(--font-{font.id}, {font.name});">
            {font.preview}
          </div>
          {#if currentFont === font.id}
            <span class="option-check">✓</span>
          {/if}
        </button>
      {/each}
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
    min-width: 240px;
    background: var(--color-surface);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    padding: var(--space-xs);
    z-index: 100;
    animation: dropdown-in var(--duration-fast) var(--easing-out);
  }

  @keyframes dropdown-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dropdown-header {
    padding: var(--space-sm) var(--space-md);
    border-bottom: var(--border-width) solid var(--border-color-subtle);
    margin-bottom: var(--space-xs);
  }

  .header-title {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
  }

  .font-option {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    width: 100%;
    padding: var(--space-md);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: left;
    position: relative;
    transition: background var(--duration-fast) var(--easing);
  }

  .font-option:hover {
    background: var(--color-bg-alt);
  }

  .font-option.active {
    background: var(--color-accent-subtle);
  }

  .option-content {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .option-name {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .option-category {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .option-preview {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    padding: var(--space-xs);
    background: var(--color-bg-alt);
    border-radius: var(--radius-sm);
  }

  .option-check {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
    font-size: var(--font-size-xs);
    color: var(--color-accent);
  }

  /* Screen reader only - for accessibility announcements */
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
