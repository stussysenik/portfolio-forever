<script lang="ts">
  import { onMount } from 'svelte';

  type Theme = 'minimal' | 'studio' | 'terminal' | 'darkroom' | 'accessible';

  const themes: { id: Theme; label: string; icon: string; description: string }[] = [
    { id: 'minimal',    label: 'Minimal',    icon: '○', description: 'Warm & colorful' },
    { id: 'studio',     label: 'Studio',     icon: '◇', description: 'Achromatic precision' },
    { id: 'terminal',   label: 'Terminal',   icon: '▸', description: 'Hacker dark' },
    { id: 'darkroom',   label: 'Darkroom',   icon: '◼', description: 'Reference dark' },
    { id: 'accessible', label: 'Accessible', icon: '◎', description: 'WCAG AAA' },
  ];

  let currentTheme: Theme = 'minimal';
  let isOpen = false;
  
  onMount(() => {
    // Load saved theme with migration for legacy themes
    const saved = localStorage.getItem('theme');

    // Migrate legacy theme names
    if (saved === 'paper') {
      currentTheme = 'minimal';
      applyTheme('minimal');
    } else if (saved && themes.some(t => t.id === saved)) {
      currentTheme = saved as Theme;
      applyTheme(saved as Theme);
    } else {
      applyTheme('minimal');
    }
    
    // Listen for keyboard shortcut
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 't' && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
        e.preventDefault();
        cycleTheme();
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
  
  function applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    currentTheme = theme;

    // Screen reader announcement
    announceThemeChange(theme);
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
  
  function cycleTheme() {
    const currentIndex = themes.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    applyTheme(themes[nextIndex].id);
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
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="theme-switcher">
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
          data-theme={theme.id}
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
    transition: 
      border-color var(--duration-fast) var(--easing),
      background var(--duration-fast) var(--easing);
  }
  
  .theme-toggle:hover {
    border-color: var(--color-text-muted);
    background: var(--color-surface);
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
    color: var(--color-text-secondary);
    text-align: left;
    transition: background var(--duration-fast) var(--easing);
  }
  
  .theme-option:hover {
    background: var(--color-bg-alt);
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
