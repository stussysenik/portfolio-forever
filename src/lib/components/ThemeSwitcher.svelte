<script lang="ts">
  import { onMount } from 'svelte';

  type Theme = 'minimal' | 'studio' | 'terminal' | 'bw';

  const themes: { id: Theme; label: string; icon: string; description: string }[] = [
    { id: 'minimal',  label: 'Minimal',  icon: '○', description: 'Warm & colorful' },
    { id: 'studio',   label: 'Studio',   icon: '◇', description: 'Achromatic precision' },
    { id: 'terminal', label: 'Terminal', icon: '▸', description: 'Hacker dark' },
    { id: 'bw',       label: 'B&W',      icon: '⋎', description: 'Ink & craft' },
  ];

  let currentTheme: Theme = 'minimal';
  let isOpen = false;
  let switcherEl: HTMLElement;
  
  onMount(() => {
    const saved = localStorage.getItem('theme');

    if (saved === 'paper') {
      currentTheme = 'minimal';
      applyTheme('minimal', false);
    } else if (saved === 'accessible' || saved === 'sumi') {
      currentTheme = 'bw';
      applyTheme('bw', false);
    } else if (saved && themes.some(t => t.id === saved)) {
      currentTheme = saved as Theme;
      applyTheme(saved as Theme, false);
    } else {
      applyTheme('minimal', false);
    }
    
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 't' && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
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
  
  function applyTheme(theme: Theme, announce: boolean = true) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    currentTheme = theme;

    if (announce) {
      announceThemeChange(theme);
    }
  }

  function announceThemeChange(theme: Theme) {
    const themeName = themes.find(t => t.id === theme)?.label || theme;
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Theme changed to ${themeName}`;
    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => announcement.remove(), 1000);
  }
  
  function selectTheme(theme: Theme) {
    applyTheme(theme);
    isOpen = false;
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      isOpen = false;
    }
  }

  function handleClickOutside(e: MouseEvent) {
    if (isOpen && switcherEl && !switcherEl.contains(e.target as Node)) {
      isOpen = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} on:click={handleClickOutside} />

<div class="theme-switcher" bind:this={switcherEl}>
  <button 
    class="theme-toggle"
    on:click={() => isOpen = !isOpen}
    aria-label="Change theme"
    aria-expanded={isOpen}
    title="Theme (T)"
  >
    <span class="theme-icon">{themes.find(t => t.id === currentTheme)?.icon}</span>
  </button>
  
  {#if isOpen}
    <div class="theme-dropdown" role="menu">
      {#each themes as theme}
        <button
          class="theme-option"
          class:active={currentTheme === theme.id}
          on:click={() => selectTheme(theme.id)}
          role="menuitem"
          data-theme-option={theme.id}
        >
          <span class="option-icon">{theme.icon}</span>
          <span class="option-label">{theme.label}</span>
          {#if currentTheme === theme.id}
            <span class="option-check">✓</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .theme-switcher {
    position: relative;
  }
  
  .theme-toggle {
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
    -webkit-tap-highlight-color: transparent;
  }

  .theme-icon {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
  
  .theme-dropdown {
    position: absolute;
    bottom: calc(100% + var(--space-xs));
    right: 0;
    min-width: 140px;
    background: var(--color-surface);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    padding: var(--space-xs);
    z-index: 100;
    animation: dropdown-in 120ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  @keyframes dropdown-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-family: inherit;
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    text-align: left;
    -webkit-tap-highlight-color: transparent;
  }

  .theme-option:hover {
    background: var(--color-bg-alt);
  }

  .theme-option:active {
    transform: scale(0.98);
  }

  .theme-option.active {
    color: var(--color-text);
  }
  
  .option-icon {
    font-size: var(--font-size-sm);
    opacity: 0.7;
  }
  
  .option-label {
    flex: 1;
  }
  
  .option-check {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
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
